use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::response::Redirect;
use axum::routing::{get, post};
use axum::{
    extract::{Extension, State},
    http::Request,
    response::{Html, IntoResponse},
};
use axum::{Form, Router};

use minijinja::{context, Environment, Error, Template};
use serde::{Deserialize, Serialize};
use serde_with::rust::unwrap_or_skip;
use time::formatting::Formattable;
use std::collections::HashMap;

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
use time::{format_description, PrimitiveDateTime};
use super::{AppError, AppState, UserData};

#[derive(Debug, Clone, Serialize)]
struct ArticlePreview {
    id: i64,
    title: String,
    upvotes: i32,
    publish_date: String,
    author_avatar: Option<String>, //TODO: force user to set avatar
    author_name: String,
}

fn format_date(date:Option<PrimitiveDateTime>)-> String{
   date.unwrap().format( &format_description::parse("[day].[month].[year], [hour]:[minute]").unwrap()).unwrap()
}

async fn articles(
    Extension(user_data): Extension<Option<UserData>>,

    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("articles/index.html")?;

    /*  let articles: Vec<ArticlePreview> = stream::iter(
        query!(r#"SELECT * FROM articles order by created_at limit 30;"#,)
            .fetch_all(&db_pool)
            .await?
            .iter()
            .map(|a| {
                async {
                    let image_url;
                    let author_name;

                    if a.newspaper_id.is_some() {
                        let newspaper = query!(
                            r#"SELECT  avatar, name FROM newspapers where id = $1;"#,
                            a.newspaper_id
                        )
                        .fetch_one(&db_pool)
                        .await
                        .unwrap();

                        image_url = Some(newspaper.avatar);
                        author_name = newspaper.name;
                    } else {
                        let user = query!(
                            r#"SELECT avatar, name FROM users where id = $1;"#,
                            a.author_id
                        )
                        .fetch_one(&db_pool)
                        .await
                        .unwrap();

                        image_url = user.avatar;
                        author_name = user.name;
                    }

                    return ArticlePreview {
                        id: a.id,
                        title: a.title,
                        upvotes: 100,
                        publish_date: a.created_at.unwrap().to_string(),
                        image_url: image_url,
                        author_name: author_name.unwrap(), //TODO: unwrap is not necessary, after making title not null in sql
                    };
                }
            }),
    )
    .collect(); */

    let articles: Vec<ArticlePreview> = query!(
        r#"SELECT
        articles.id,
        articles.title,
        articles.created_at,
          CASE WHEN  newspapers.name is NULL THEN users.name ELSE  newspapers.name END AS author_name,
         CASE WHEN   newspapers.avatar  is NULL THEN   users.avatar ELSE  newspapers.avatar END AS author_avatar
     FROM
        articles
            LEFT OUTER JOIN newspapers ON (articles.newspaper_id =newspapers.id)
             INNER JOIN users ON (articles.author_id =users.id)
     ORDER BY
        articles DESC
     LIMIT 30;"#,
    )
    .fetch_all(&db_pool)
    .await?
    .iter()
    .map( |a| {
        ArticlePreview {
            id: a.id,
            title: a.title.clone(),
            upvotes: 100,
            publish_date: format_date(a.created_at),
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
    article_content:String
}

async fn publish_article(
    Extension(user_data): Extension<Option<UserData>>,

    State(db_pool): State<PgPool>,
    Form(input): Form<Createarticle>,
) -> Result<impl IntoResponse, AppError> {
    let query = query!(
        r#"INSERT INTO articles (author_id,title,content)
        VALUES ($1,$2,$3) returning id;"#,
        user_data.unwrap().id,
        input.article_title,
        input.article_content,
    )
    .fetch_one(&db_pool)
    .await?;

    Ok(Redirect::to(format!("/a/{}", query.id).as_str()))
}

async fn create_article(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("articles/edit.html")?;

    let content = tmpl.render(context!(user_id => user_data.unwrap().id,
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
    let tmpl = env.get_template("articles/view.html")?;



    let article = query!(r#"SELECT
    articles.id,
    articles.title,
    articles.created_at,
    articles.content,
    CASE WHEN  newspapers.name is NULL THEN users.name ELSE  newspapers.name END AS author_name,
    CASE WHEN   newspapers.avatar  is NULL THEN   users.avatar ELSE  newspapers.avatar END AS author_avatar,
    CASE WHEN  articles.newspaper_id is NULL THEN  articles.author_id ELSE  articles.newspaper_id END AS author_id
 FROM
    articles
        LEFT OUTER JOIN newspapers ON (articles.newspaper_id =newspapers.id)
         INNER JOIN users ON (articles.author_id =users.id) where articles.id = $1;"#, article_id)
        .fetch_one(&db_pool)
        .await?;

    let author_link = if article.author_id.unwrap() == user_id {
        format!("/u/{}", user_id)
    } else {
        format!("/n/{}", article.author_id.unwrap())
    };

    let content = tmpl.render(context!(user_id => user_id,
    article_id=>article_id,
     article_title => article.title,
      article_content=>article.content,
    publish_date => format_date(article.created_at),
      author_name=>article.author_name,
      author_avatar => article.author_avatar,
      author_link =>   author_link
    ))?;
    Ok(Html(content))
}

pub fn article_router() -> Router<AppState> {
    Router::new()
        .route("/", get(articles))
        .route("/:id", get(article))
        .route("/edit", get(create_article).post(publish_article))
}
