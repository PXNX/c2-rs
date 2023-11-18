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

use super::{AppState, UserData};

pub async fn signup<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("welcome/signup.html")?;
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();

    let content = tmpl.render(context!(
        user_id => user_data.unwrap().id,
        login_return_url => login_return_url,
    ))?;
    Ok(Html(content))
}

pub async fn welcome<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("welcome/index.html")?;
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();

    let content = tmpl.render(context!(
        user_id => user_data.unwrap().id,
        login_return_url => login_return_url,
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

    query!(
        r#"UPDATE users SET name = $1 WHERE id=$2;"#,
        input.user_name,
        user_data.id
    )
    .execute(&db_pool)
    .await?;

    Ok(Redirect::to("/"))
}

pub fn welcome_router() -> Router<AppState> {
    Router::new()
        .route("/", get(welcome))
        .route("/signup", get(signup).post(create_profile))
}
