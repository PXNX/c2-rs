use crate::auth::error_handling::AppError;
use crate::common::tools::format_date;
use askama::Template;
use axum::extract::Path;
use axum::response::Redirect;
use axum::routing::{get, put};
use axum::{
    extract::{Extension, State},
    response::IntoResponse,
};
use axum::{Form, Router};
use serde::{Deserialize, Serialize};
use sqlx::{query, Executor, PgPool};

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "military/index.html")]
struct MilitaryTemplate {
    user_id: i64,
}

pub async fn military(
    Extension(user_data): Extension<Option<UserData>>,
) -> Result<impl IntoResponse, AppError> {
    Ok(MilitaryTemplate {
        user_id: user_data.unwrap().id,
    })
}

pub fn military_router() -> Router<AppState> {
    Router::new().route("/", get(military))
}
