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
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("newspaper/settings.html")?;

    let content = tmpl.render(context!(user_id => user_data.unwrap().id))?;

    Ok(Html(content))
}

pub fn newspaper_router() -> Router<AppState> {
    Router::new()
        .route("/:id", get(newspaper))
        .route("/settings", get(newspaper_settings))
}
