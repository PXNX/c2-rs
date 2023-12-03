use askama::Template;
use axum::{
    extract::Extension,
    response::IntoResponse,
};
use axum::Router;
use axum::routing::get;

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "military/index.html")]
struct MilitaryTemplate {}

pub async fn military(
    Extension(user_data): Extension<Option<UserData>>,
) -> Result<impl IntoResponse, AppError> {
    Ok(MilitaryTemplate {})
}

pub fn military_router() -> Router<AppState> {
    Router::new().route("/", get(military))
}
