use askama::Template;
use axum::routing::get;
use axum::Router;
use axum::{extract::Extension, response::IntoResponse};

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "meta/cookies.html")]
struct CookiesTemplate {}

pub async fn cookies() -> Result<impl IntoResponse, AppError> {
    Ok(CookiesTemplate {})
}

#[derive(Template)]
#[template(path = "meta/privacy.html")]
struct PrivacyTemplate {}

pub async fn privacy() -> Result<impl IntoResponse, AppError> {
    Ok(PrivacyTemplate {})
}

#[derive(Template)]
#[template(path = "meta/terms.html")]
struct TermsTemplate {}

pub async fn terms() -> Result<impl IntoResponse, AppError> {
    Ok(TermsTemplate {})
}

#[derive(Template)]
#[template(path = "meta/about.html")]
struct AboutTemplate {}

pub async fn about() -> Result<impl IntoResponse, AppError> {
    Ok(AboutTemplate {})
}

pub fn meta_router() -> Router {
    Router::new()
        .route("/about", get(about))
        .route("/cookies", get(cookies))
        .route("/privacy", get(privacy))
        .route("/terms", get(terms))
}
