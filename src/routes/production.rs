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
#[template(path = "production/index.html")]
struct ProductionTemplate {}

pub async fn production(
    Extension(user_data): Extension<Option<UserData>>,
) -> Result<impl IntoResponse, AppError> {
    Ok(ProductionTemplate {})
}

#[derive(Template)]
#[template(path = "production/new.html")]
struct NewProductionTemplate {}

pub async fn new_production(
    Extension(user_data): Extension<Option<UserData>>,
) -> Result<impl IntoResponse, AppError> {
    Ok(NewProductionTemplate {})
}

pub fn production_router() -> Router<AppState> {
    Router::new().route("/", get(production)).route("/:id", get(new_production),
    )
}
