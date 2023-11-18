use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::response::Redirect;
use axum::routing::{get, post, put};
use axum::{
    extract::{Extension, State},
    http::Request,
    response::{Html, IntoResponse},
};
use axum::{Form, Router};

use minijinja::{context, Environment, Error, Template};
use serde::{Deserialize, Serialize};
use serde_with::rust::unwrap_or_skip;
use std::collections::HashMap;
use time::formatting::Formattable;

use axum::{
    extract::{Host, TypedHeader},
    headers::Cookie,
};
use dotenvy::var;
use oauth2::{
    basic::BasicClient, reqwest::http_client, AuthUrl, AuthorizationCode, ClientId, ClientSecret,
    CsrfToken, PkceCodeChallenge, PkceCodeVerifier, RedirectUrl, RevocationUrl, Scope,
    TokenResponse, TokenUrl,
};

use chrono::Utc;
use sqlx::{query, query_as, Executor, PgPool};

use uuid::Uuid;

use crate::auth::error_handling::AppError;
use crate::common::tools::format_date;

use super::{newspaper, AppState, UserData};

#[derive(Debug, Clone, Serialize)]
struct ArticlePreview {
    id: i64,
    title: String,
    upvote_count: i64,
    publish_date: String,
    author_avatar: Option<String>, //TODO: force user to set avatar
    author_name: String,
}

async fn articles(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("article/index.html")?;

    let articles: Vec<ArticlePreview> = query!(
        r#"SELECT articles.id,
        articles.title,
        articles.created_at,
        COALESCE(newspapers.name, users.name)     AS author_name,
        COALESCE(newspapers.avatar, users.avatar) AS author_avatar,
        COALESCE(uv.upvote_count,0) AS upvote_count
 FROM articles
          LEFT OUTER JOIN newspapers ON (articles.newspaper_id = newspapers.id)
          INNER JOIN users ON (articles.author_id = users.id)
          LEFT JOIN (SELECT article_id, count(*) upvote_count
                     FROM upvotes
                     GROUP BY article_id) as uv
                    ON uv.article_id = articles.id
 ORDER BY articles.created_at DESC
 LIMIT 30;"#,
    )
    .fetch_all(&db_pool)
    .await?
    .iter()
    .map(|a| {
        ArticlePreview {
            id: a.id,
            title: a.title.clone(),

            publish_date: format_date(a.created_at),
            upvote_count: a.upvote_count.unwrap(),
            author_avatar: a.author_avatar.clone(),
            author_name: a.author_name.clone().unwrap(), //TODO: unwrap is not necessary, after making title not null in sql
        }
    })
    .collect();

    let content = tmpl.render(context!(
        user_id =>  user_data.unwrap().id,
        articles => articles,
    ))?;
    Ok(Html(content))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Createarticle {
    article_title: String,
    article_content: String,
    publisher: Option<i64>,
}

async fn publish_article(
    Extension(user_data): Extension<Option<UserData>>,

    State(db_pool): State<PgPool>,
    Form(input): Form<Createarticle>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let query = query!(
        r#"INSERT INTO articles (author_id,title,content,newspaper_id)
    VALUES ($1,$2,$3, $4) returning id;"#,
        user_id,
        input.article_title,
        input.article_content,
        input.publisher
    )
    .fetch_one(&db_pool)
    .await?;

    Ok(Redirect::to(format!("/a/{}", query.id).as_str()))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Newspaper {
    newspaper_name: String,
    newspaper_id: i64,
}

async fn create_article(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("article/create.html")?;
    let user_id = user_data.unwrap().id;

    let newspapers: Vec<Newspaper> = query!(
        r#"SELECT
     newspapers.name ,
    newspapers.id
    
 FROM
    journalists
        LEFT OUTER JOIN newspapers ON (newspaper_id =newspapers.id) where user_id = $1;"#,
        &user_id
    )
    .fetch_all(&db_pool)
    .await?
    .iter()
    .map(|n| Newspaper {
        newspaper_name: n.name.to_owned(),
        newspaper_id: n.id,
    })
    .collect();

    let content = tmpl.render(context!(user_id => user_id, newspapers => newspapers
    ))?;
    Ok(Html(content))
}

async fn article(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Path(article_id): Path<i64>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("article/view.html")?;

    let article = query!(r#"SELECT
    articles.id,
    articles.title,
    articles.created_at,
    articles.content,
    articles.author_id,
    articles.newspaper_id,
    CASE WHEN  newspapers.name is NULL THEN users.name ELSE  newspapers.name END AS author_name,
    CASE WHEN   newspapers.avatar  is NULL THEN   users.avatar ELSE  newspapers.avatar END AS author_avatar,
    exists(select 1 from upvotes where article_id = articles.id and user_id = $1) as has_upvoted
 FROM
    articles
        LEFT OUTER JOIN newspapers ON (articles.newspaper_id =newspapers.id)
         INNER JOIN users ON (articles.author_id = users.id) where articles.id = $2;"#, &user_id, article_id)
        .fetch_one(&db_pool)
        .await?;

    let author_link = match article.newspaper_id {
        Some(newspaper_id) => format!("/n/{}", newspaper_id),
        None => format!("/u/{}", article.author_id),
    };

    let content = tmpl.render(context!(user_id => user_id,
    article_id=>article_id,
     article_title => article.title,
      article_content=>article.content,
    publish_date => format_date(article.created_at),
      author_name=>article.author_name,
      author_avatar => article.author_avatar,
      author_link =>   author_link,
      author_id => article.author_id,
      has_upvoted => article.has_upvoted
    ))?;
    Ok(Html(content))
}

async fn upvote_article(
    Extension(user_data): Extension<Option<UserData>>,
    Path(article_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("article/remove_upvote.html")?;

    query!(
        r#"INSERT INTO upvotes ( user_id,article_id)
    VALUES ($1,$2)
    ON CONFLICT DO Nothing; "#,
        user_data.unwrap().id,
        article_id,
    )
    .execute(&db_pool)
    .await?;

    let content = tmpl.render(context!(   article_id =>    article_id,
    ))?;
    Ok(Html(content))
}

async fn remove_upvote(
    Extension(user_data): Extension<Option<UserData>>,
    Path(article_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("article/upvote.html")?;

    query!(
        r#"delete from upvotes
where user_id = $1 and article_id = $2;"#,
        user_data.unwrap().id,
        article_id,
    )
    .execute(&db_pool)
    .await?;

    let content = tmpl.render(context!( article_id =>    article_id,
    ))?;
    Ok(Html(content))
}

pub fn article_router() -> Router<AppState> {
    Router::new()
        .route("/", get(articles))
        .route("/:id", get(article))
        .route("/edit", get(create_article).post(publish_article))
        .route("/upvote/:id", put(upvote_article).delete(remove_upvote))
}
