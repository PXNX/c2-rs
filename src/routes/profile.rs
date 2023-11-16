use axum::extract::{Path, Query};
use axum::response::Redirect;
use axum::routing::{get, post};
use axum::{
    extract::{Extension, State},
    http::Request,
    response::{Html, IntoResponse},
};
use axum::{Form, Router};
use std::collections::HashMap;
use validator::Validate;

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
use sqlx::PgPool;

use uuid::Uuid;

use super::{AppError, AppState, UserData};

async fn profile(
    Extension(user_data): Extension<Option<UserData>>,
    Path(user_id): Path<i64>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let user_data = user_data.unwrap();

    let tmpl;
    if user_data.user_id == user_id {
        tmpl = env.get_template("u/index.html")?;
    } else {
        tmpl = env.get_template("u/profile.html")?;
    };

    let content = tmpl.render(context!(
        user_id =>  user_data.user_id,
        user_name => user_data.user_name
    ))?;
    Ok(Html(content))
}

#[derive(Clone, Debug, Validate)]
struct CreateProfile {
    #[validate(length(min = 1, max = 30, message = "Has to be between 1 and 30 characters"))]
    user_name: String,
}

async fn create_profile(
    State(db_pool): State<PgPool>,
    Extension(user_data): Extension<Option<UserData>>,
    ValidatedForm(input): ValidatedForm<CreateProfile>, //   Form(form): Form<CreateProfile>, // Form(form): Form<TodoNew>,
) -> Result<impl IntoResponse, AppError> {
    let user_data = user_data.unwrap();

    sqlx::query(r#"UPDATE users SET name = $1 WHERE id=$2;"#)
        //   .bind(form.user_name)
        .bind(user_data.user_id)
        .execute(&db_pool)
        .await
        .unwrap();

    Ok(Redirect::to("/"))
}

pub fn profile_router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_profile))
        .route("/:id", get(profile))
}
