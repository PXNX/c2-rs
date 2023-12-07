use askama::Template;
use askama_axum::IntoResponse;
use axum::Router;
use axum::routing::get;
use crate::auth::error_handling::AppError;
use crate::routes::meta::{about, cookies, privacy, terms};

#[derive(Template)]
#[template(path = "docs/index.html")]
struct DocsTemplate {}

pub async fn docs() -> Result<impl IntoResponse, AppError> {
    Ok(DocsTemplate {})
}

pub fn docs_router() -> Router {
    Router::new()
        .route("/", get(docs))
}