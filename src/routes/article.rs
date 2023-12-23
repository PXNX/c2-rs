use askama::Template;
use axum::{
    extract::{Extension, State},
    response::IntoResponse,
};
use axum::{Form, Router};
use axum::extract::Path;
use axum::response::Redirect;
use axum::routing::{get, put};
use axum_htmx::HX_REDIRECT;
use http::HeaderMap;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, query};

use crate::auth::error_handling::AppError;
use crate::common::tools::{clean_html, format_date};

use super::{AppState, UserData};

#[derive(Debug, Clone, Serialize)]
struct ArticlePreview {
    id: i64,
    title: String,
    upvote_count: i64,
    publish_date: String,
    author_avatar: String,
    //TODO: force user to set avatar
    author_name: String,
}

#[derive(Template)]
#[template(path = "article/index.html")]
struct ArticlesTemplate {
    user_id: i64,
    articles: Vec<ArticlePreview>,
}

async fn articles(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    //todo: improve performance using "exists"
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
                author_avatar: a.author_avatar.clone().unwrap_or("".to_owned()),
                author_name: a.author_name.clone().unwrap(),
                //TODO: unwrap is not necessary, after making title not null in sql
            }
        })
        .collect();

    Ok(ArticlesTemplate {
        user_id: user_data.unwrap().id,
        articles: articles,
    })
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct CreateArticle {
    article_title: String,
    article_content: String,
    publisher: Option<i64>,
}

async fn publish_article(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Form(input): Form<CreateArticle>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;


    let query = query!(
        r#"INSERT INTO articles (author_id,title,content,newspaper_id)
    VALUES ($1,$2,$3, $4) returning id;"#,
        user_id,
        input.article_title,
           clean_html( input.article_content.as_str()),
        input.publisher
    )
        .fetch_one(&db_pool)
        .await?;


    let mut headers = HeaderMap::new();
    headers.insert(HX_REDIRECT, format!("/article/{}", query.id).parse().unwrap());

    Ok((headers, ))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Newspaper {
    newspaper_name: String,
    newspaper_id: i64,
}

#[derive(Template)]
#[template(path = "article/create.html")]
struct CreateArticleTemplate {
    newspapers: Vec<Newspaper>,
}

async fn create_article(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
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

    Ok(CreateArticleTemplate {
        newspapers: newspapers,
    })
}

#[derive(Template)]
#[template(path = "article/edit.html")]
struct EditArticleTemplate {
    user_id: i64,
    article_content: String,
}

async fn edit_article(
    Extension(user_data): Extension<Option<UserData>>,
    Path(article_id): Path<i64>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    //todo: also check that you're the author
    let user_id = user_data.unwrap().id;

    let article = query!(
        r#"SELECT content 
    
 FROM
    articles where id = $1;"#,
        &article_id
    )
        .fetch_one(&db_pool)
        .await?;

    Ok(EditArticleTemplate {
        user_id: user_id,
        article_content: article.content,
    })
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct EditArticle {
    article_content: String,
}

async fn save_article(
    Extension(user_data): Extension<Option<UserData>>,
    Path(article_id): Path<i64>,
    State(db_pool): State<PgPool>,
    Form(input): Form<EditArticle>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    //todo: check if user is editor/owner

    let query = query!(
        r#"UPDATE articles SET content = $1
  where id = $2;"#,
        input.article_content,
        &article_id
    )
        .execute(&db_pool)
        .await?;

    Ok(Redirect::to(format!("/article/{}", article_id).as_str()))
}

#[derive(Template)]
#[template(path = "article/view.html")]
struct ViewArticleTemplate {
    user_id: i64,
    article_id: i64,
    article_title: String,
    article_content: String,
    publish_date: String,
    author_name: String,
    author_avatar: String,
    author_link: String,
    author_id: i64,
    has_upvoted: bool,
}

async fn view_article(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Path(article_id): Path<i64>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

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
        Some(newspaper_id) => format!("/newspaper/{}", newspaper_id),
        None => format!("/user/{}", article.author_id),
    };

    Ok(ViewArticleTemplate {
        user_id: user_id,
        article_id: article_id,
        article_title: article.title,
        article_content: article.content,
        publish_date: format_date(article.created_at),
        author_name: article.author_name.unwrap(),
        author_avatar: article.author_avatar.unwrap_or("".to_string()),
        author_link: author_link,
        author_id: article.author_id,
        has_upvoted: article.has_upvoted.unwrap_or(false),
    })
}

#[derive(Template)]
#[template(path = "article/remove_upvote.html")]
struct UpvoteArticleTemplate {
    article_id: i64,
}

async fn upvote_article(
    Extension(user_data): Extension<Option<UserData>>,
    Path(article_id): Path<i64>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    query!(
        r#"INSERT INTO upvotes ( user_id,article_id)
    VALUES ($1,$2)
    ON CONFLICT DO Nothing; "#,
        user_data.unwrap().id,
        article_id,
    )
        .execute(&db_pool)
        .await?;

    Ok(UpvoteArticleTemplate {
        article_id: article_id,
    })
}

#[derive(Template)]
#[template(path = "article/upvote.html")]
struct RemoveUpvoteTemplate {
    article_id: i64,
}

async fn remove_upvote(
    Extension(user_data): Extension<Option<UserData>>,
    Path(article_id): Path<i64>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    query!(
        r#"delete from upvotes
where user_id = $1 and article_id = $2;"#,
        user_data.unwrap().id,
        article_id,
    )
        .execute(&db_pool)
        .await?;

    Ok(RemoveUpvoteTemplate {
        article_id: article_id,
    })
}

pub fn article_router() -> Router<AppState> {
    Router::new()
        .route("/", get(articles))
        .route("/:id", get(view_article))
        .route("/create", get(create_article).post(publish_article))
        .route("/:id/edit", get(edit_article).post(save_article))
        .route("/:id/upvote", put(upvote_article).delete(remove_upvote))
}
