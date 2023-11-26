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
use serde::{Deserialize, Serialize};
use sqlx::{query, PgPool};

use crate::auth::error_handling::AppError;
use crate::common::tools::format_date;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "newspaper/view.html")]
struct NewspaperTemplate {
    user_id: i64,
    newspaper_name: String,
    newspaper_avatar: String,
    newspaper_created_at: String,
    //todo: add article feed of a newspaper
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

    Ok(NewspaperTemplate {
        user_id: user_id,
        newspaper_name: newspaper.name,
        newspaper_avatar: newspaper.avatar,
        newspaper_created_at: format_date(newspaper.created_at),
    })
}

#[derive(Template)]
#[template(path = "newspaper/settings.html")]
struct NewspaperSettingsTemplate {
    user_id: i64,
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
        user_id: user_id,
        newspaper_name: newspaper.name,
        newspaper_avatar: newspaper.avatar,
        newspaper_background: newspaper.background.unwrap(),
        newspaper_created_at: format_date(newspaper.created_at),
        newspaper_id: newspaper_id,
    })
}

#[derive(Template)]
#[template(path = "newspaper/create.html")]
struct CreateNewspaperTemplate {
    user_id: i64,
}

async fn create_newspaper(
    Extension(user_data): Extension<Option<UserData>>,
) -> Result<impl IntoResponse, AppError> {
    Ok(CreateNewspaperTemplate {
        user_id: user_data.unwrap().id,
    })
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

    Ok(Redirect::to(format!("/n/{}", newspaper.id).as_str()))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Newspaper {
    newspaper_id: i64,
    newspaper_name: String,
    newspaper_avatar: String,
}

#[derive(Template)]
#[template(path = "newspaper/index.html")]
struct NewspapersTemplate {
    user_id: i64,
    newspapers: Vec<Newspaper>,
}

async fn newspapers(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let newspapers: Vec<Newspaper> = query!(
        r#"SELECT newspapers.id,
     newspapers.name ,
    
     newspapers.avatar
 FROM
    journalists
        LEFT OUTER JOIN newspapers ON (newspaper_id =newspapers.id) where user_id = $1;"#,
        &user_id
    )
    .fetch_all(&db_pool)
    .await?
    .iter()
    .map(|n| Newspaper {
        newspaper_id: n.id,
        newspaper_name: n.name.to_owned(),
        newspaper_avatar: n.avatar.to_owned(),
    })
    .collect();

    Ok(NewspapersTemplate {
        user_id: user_id,
        newspapers: newspapers,
    })
}

pub fn newspaper_router() -> Router<AppState> {
    Router::new()
        .route("/", get(newspapers))
        .route("/create", get(create_newspaper).post(publish_newspaper))
        .route("/:id", get(newspaper))
        .route("/:id/settings", get(newspaper_settings))
}
