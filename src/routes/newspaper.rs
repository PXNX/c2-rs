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
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use minijinja::{context, Environment, Error, Template};

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

use super::{AppState, UserData};

async fn newspaper(
    Extension(user_data): Extension<Option<UserData>>,
    Path(newspaper_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let tmpl = env.get_template("newspaper/index.html")?;

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

    let content = tmpl.render(context!(
        user_id =>  user_id,
        newspaper_name => newspaper.name,
        newspaper_avatar => newspaper.avatar,
        newspaper_created_at => format_date(newspaper.created_at)
    ))?;
    Ok(Html(content))
}

async fn newspaper_settings(
    Extension(user_data): Extension<Option<UserData>>,
    Path(newspaper_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("newspaper/settings.html")?;

    let user_id = user_data.unwrap().id;

    let newspaper = query!(
        r#"SELECT name, avatar, background FROM newspapers WHERE id=$1;"#,
        &newspaper_id
    )
    .fetch_one(&db_pool)
    .await?;

    let content = tmpl.render(context!(user_id => user_id,
    newspaper_name => newspaper.name,
    newspaper_avatar =>newspaper.avatar,
    newspaper_background =>newspaper.background,
    newspaper_id => newspaper_id
    ))?;

    Ok(Html(content))
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
    newspaper_name: String,
    newspaper_id: i64,
}

async fn create_newspaper(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("newspaper/create.html")?;
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

pub fn newspaper_router() -> Router<AppState> {
    Router::new()
        // .route("/", get(newspapers))
        .route("/create", get(create_newspaper).post(publish_newspaper))
        .route("/:id", get(newspaper))
        .route("/:id/settings", get(newspaper_settings))
}
