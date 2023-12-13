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
#[template(path = "training/index.html")]
struct TrainingTemplate {}

pub async fn training(
    Extension(user_data): Extension<Option<UserData>>,
) -> Result<impl IntoResponse, AppError> {
    Ok(TrainingTemplate {})
}

pub fn training_router() -> Router<AppState> {
    Router::new().route("/", get(training))
}
