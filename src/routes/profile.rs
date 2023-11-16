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

use super::{AppError, AppState, UserData};

async fn profile(
    Extension(user_data): Extension<Option<UserData>>,
    Path(user_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let user_data = user_data.unwrap();

    let tmpl = if user_data.id == user_id {
        env.get_template("u/index.html")?
    } else {
        env.get_template("u/profile.html")?
    };

    let user = query!(
        r#"SELECT name, skill_0,skill_1,skill_2,created_at FROM users WHERE id=$1;"#,
        &user_id
    )
    .fetch_one(&db_pool)
    .await
    .map_err(|e| AppError {
        code: StatusCode::NOT_FOUND,
        message: format!("GET Profile: No user with id {user_id} was found: {e}"),
        user_message: format!("No user with id {user_id} was found."),
    })?;

    let content = tmpl.render(context!(
        user_id =>  user_id,
        user_name => user.name,
        skill_0 => user.skill_0,
    ))?;
    Ok(Html(content))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct CreateProfile {
    user_name: String,
}

async fn create_profile(
    Extension(user_data): Extension<Option<UserData>>,

    State(db_pool): State<PgPool>,
    Form(input): Form<CreateProfile>,
) -> Result<impl IntoResponse, AppError> {
    let user_data = user_data.unwrap();

    sqlx::query!(
        r#"UPDATE users SET name = $1 WHERE id=$2;"#,
        input.user_name,
        user_data.id
    )
    .execute(&db_pool)
    .await?;

    Ok(Redirect::to("/"))
}

pub fn profile_router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_profile))
        .route("/:id", get(profile))
}
