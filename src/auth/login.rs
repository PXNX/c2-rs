use axum::extract::{Path, Query};
use axum::http::StatusCode;
use axum::response::Html;
use axum::response::Redirect;
use axum::routing::{get, post};
use axum::{
    extract::{Extension, State},
    http::Request,
    response::IntoResponse,
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

use crate::routes::UserData;

use super::error_handling::AppError;

pub async fn login<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,

    Query(mut params): Query<HashMap<String, String>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("login.html")?;
    let login_return_url =
        "?next=".to_owned() + &*params.remove("next").unwrap_or_else(|| "/".to_string());

    let content = tmpl.render(context!(
        login_return_url => login_return_url,
    ))?;
    Ok(Html(content))
}
