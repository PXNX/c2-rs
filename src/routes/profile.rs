use axum::extract::{Path, Query};
use axum::response::Redirect;
use axum::routing::{get, post};
use axum::{
    extract::{Extension, State},
    http::Request,
    response::{Html, IntoResponse},
};
use axum::http::StatusCode;
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
use sqlx::PgPool;


use uuid::Uuid;

use super::{AppError, AppState, UserData};

async fn profile(
    Extension(user_data): Extension<Option<UserData>>,
    Path(user_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let mut user_data = user_data.unwrap();

    let tmpl;
    if user_data.user_id == user_id {
        tmpl = env.get_template("u/index.html")?;
    } else {
        tmpl = env.get_template("u/profile.html")?;
        let query: Result<(String,Option<String,>), _> =
            sqlx::query_as(r#"SELECT email,name FROM users WHERE id=$1;"#)
                .bind(user_id)
                .fetch_one(&db_pool)
                .await;
        if let Ok(query) = query {
            let user_email = query.0;
            let user_name = query.1;
            user_data = UserData {
                user_id,
                user_email,
                user_name,
            };
        }else{
            return Err(AppError::new(format!("User with Id {user_id} was not found."))
                .with_user_message(format!("User with Id {user_id} was not found. Please make sure you opened up the correct user profile.")));
        }

    };



    let content = tmpl.render(context!(
        user_id =>  user_data.user_id,
        user_name => user_data.user_name.unwrap()
    ))?;
    Ok(Html(content))
}

#[derive(Clone, Debug, Deserialize,Serialize)]
struct CreateProfile {
    user_name: String,
}

async fn create_profile(
    Extension(user_data): Extension<Option<UserData>>,

    State(db_pool): State<PgPool>,
    Form(input): Form<CreateProfile>,
) -> Result<impl IntoResponse, AppError> {
    let user_data = user_data.unwrap();

    sqlx::query(r#"UPDATE users SET name = $1 WHERE id=$2;"#)
        .bind(input.user_name)
        .bind(user_data.user_id)
        .execute(&db_pool)
        .await?;

    Ok(Redirect::to("/"))
}

pub fn profile_router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_profile))
        .route("/:id", get(profile))
}
