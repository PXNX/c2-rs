use askama::Template;
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::Redirect;
use axum::routing::get;
use axum::{
    extract::{Extension, State},
    response::IntoResponse,
};
use axum::{Form, Router};
use axum_htmx::HX_REDIRECT;
use http::HeaderMap;
use serde::{Deserialize, Serialize};
use sqlx::{query, PgPool};

use crate::auth::error_handling::AppError;
use crate::common::tools::format_date;

use super::{AppState, UserData};

#[derive(Clone, Debug, Deserialize, Serialize)]
struct ArticlePreview {
    id: i64,
    title: String,
    upvote_count: i64,
    publish_date: String,
}

#[derive(Template)]
#[template(path = "newspaper/view.html")]
struct NewspaperTemplate {
    newspaper_id:i64,
    newspaper_name: String,
    newspaper_avatar: String,
    newspaper_created_at: String,
    articles: Vec<ArticlePreview>,
    owner_id: i64,
    owner_name: String,
    owner_avatar: String,
}

async fn newspaper(
    Extension(user_data): Extension<Option<UserData>>,
    Path(newspaper_id): Path<i64>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let newspaper = query!(
        r#"SELECT name, avatar,created_at FROM newspapers WHERE id=$1;"#,
        &newspaper_id
    )
    .fetch_one(&db_pool)
    .await
    .map_err(|e| AppError {
        code: StatusCode::NOT_FOUND,
        message: format!("GET Newspaper: No newspaper with id {newspaper_id} was found: {e}"),
        user_message: format!("No newspaper with id {newspaper_id} was found."),
    })?;

    let articles: Vec<ArticlePreview> = query!(
        r#"SELECT articles.id,
        articles.title,
        articles.created_at,
        COALESCE(uv.upvote_count,0) AS upvote_count
 FROM articles

          LEFT JOIN (SELECT article_id, count(*) upvote_count
                     FROM upvotes 
                     GROUP BY article_id) as uv
                    ON uv.article_id = articles.id
                    where articles.newspaper_id = $1
 ORDER BY articles.created_at DESC
 LIMIT 30;"#,
        &newspaper_id
    )
    .fetch_all(&db_pool)
    .await?
    .iter()
    .map(|a| ArticlePreview {
        id: a.id,
        title: a.title.clone(),
        publish_date: format_date(a.created_at),
        upvote_count: a.upvote_count.unwrap(),
    })
    .collect();

    let newspaper_owner = query!(
        r#"SELECT id, name, avatar FROM users WHERE id in (select user_id from journalists where rank = 'owner' and newspaper_id = $1 )"#,
        newspaper_id
    )
        .fetch_one(&db_pool)
        .await?;

    Ok(NewspaperTemplate {
        newspaper_id: newspaper_id,
        newspaper_name: newspaper.name,
        newspaper_avatar: newspaper.avatar,
        newspaper_created_at: format_date(newspaper.created_at),
        articles: articles,
        owner_id: newspaper_owner.id,
        owner_name: newspaper_owner.name.unwrap_or("OWNER".to_string()),
        owner_avatar: newspaper_owner.avatar.unwrap_or("".to_owned()),
    })
}

#[derive(Template)]
#[template(path = "newspaper/settings.html")]
struct NewspaperSettingsTemplate {
    newspaper_name: String,
    newspaper_avatar: String,
    newspaper_background: String,
    newspaper_created_at: String,
    newspaper_id: i64,
}

async fn newspaper_settings(
    Extension(user_data): Extension<Option<UserData>>,
    Path(newspaper_id): Path<i64>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let newspaper = query!(
        r#"SELECT name, avatar, background, created_at FROM newspapers WHERE id=$1;"#,
        &newspaper_id
    )
    .fetch_one(&db_pool)
    .await?;

    Ok(NewspaperSettingsTemplate {
        newspaper_name: newspaper.name,
        newspaper_avatar: newspaper.avatar,
        newspaper_background: newspaper.background.unwrap_or("https://media.istockphoto.com/id/1345527119/de/video/graphical-modern-digital-world-news-studio-loop-hintergrund.jpg?s=640x640&k=20&c=F-svW0LO45RBQ9rP7S5_qkncm2fvYNmId2Zzgpk0XM0=".to_string()),
        newspaper_created_at: format_date(newspaper.created_at),
        newspaper_id: newspaper_id,
    })
}

#[derive(Template)]
#[template(path = "newspaper/create.html")]
struct CreateNewspaperTemplate {}

async fn create_newspaper(
    Extension(user_data): Extension<Option<UserData>>,
) -> Result<impl IntoResponse, AppError> {
    Ok(CreateNewspaperTemplate {})
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct CreateNewspaper {
    newspaper_name: String,
    newspaper_avatar: String,
}

async fn publish_newspaper(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Form(input): Form<CreateNewspaper>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let newspaper = query!(
        r#"INSERT INTO newspapers (name,avatar)
    VALUES ($1,$2) returning id;
"#,
        input.newspaper_name,
        input.newspaper_avatar,
    )
    .fetch_one(&db_pool)
    .await?;

    query!(
        r#"INSERT INTO journalists (newspaper_id,user_id,rank)
    VALUES ($1,$2,'owner');
"#,
        &newspaper.id,
        user_id,
    )
    .execute(&db_pool)
    .await?;



    let mut headers = HeaderMap::new();
    headers.insert(HX_REDIRECT, format!("/newspaper/{}", newspaper.id).parse().unwrap());
    Ok(headers.into_response())
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct NewspaperPreview {
    id: i64,
    name: String,
    avatar: String,
    created_at: String,
    rank: String,
}

#[derive(Template)]
#[template(path = "newspaper/index.html",print = "all")]
struct NewspapersTemplate {
    newspapers: Vec<NewspaperPreview>,
}

async fn newspapers(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let newspapers: Vec<NewspaperPreview> = query!(
        r#"SELECT newspapers.id,
     newspapers.name ,
    newspapers.created_at,
     newspapers.avatar
    
 FROM
    journalists
        LEFT OUTER JOIN newspapers ON (newspaper_id =newspapers.id) where user_id = $1;"#,
        &user_id
    )
    .fetch_all(&db_pool)
    .await?
    .iter()
    .map(|n| NewspaperPreview {
        id: n.id,
        name: n.name.to_owned(),
        avatar: n.avatar.to_owned(),
        created_at: format_date(n.created_at).to_owned(),
        rank: "Owner".to_string(),
    })
    .collect();

    Ok(NewspapersTemplate {
        newspapers: newspapers,
    })
}

pub fn newspaper_router() -> Router<AppState> {
    Router::new()
        .route("/", get(newspapers))
        .route("/create", get(create_newspaper).post(publish_newspaper))
        .route("/:id/settings", get(newspaper_settings))
        .route("/:id", get(newspaper))

}
