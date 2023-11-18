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

async fn map(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("map.html")?;

    let content = tmpl.render(context!(
        user_id =>  user_data.unwrap().id,

    ))?;
    Ok(Html(content))
}

pub fn map_router() -> Router<AppState> {
    Router::new().route("/", get(map))
}
