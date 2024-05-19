use std::string::ToString;
use std::time::SystemTime;
use askama::Template;
use axum::response::IntoResponse;
use axum::Router;
use axum::routing::get;
use chrono::format::{DelayedFormat, StrftimeItems};
use chrono::Utc;

use lazy_static::lazy_static;
use once_cell::sync::Lazy;

use crate::auth::error_handling::AppError;
use crate::getenv;


use std::sync::LazyLock;
use std::env::var;

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


static VERSION: LazyLock<String> = LazyLock::new(|| {
    getenv!("CARGO_PKG_VERSION")
});

#[derive(Template)]
#[template(path = "meta/about.html")]
struct AboutTemplate {
  version:  &'static String
}

pub async fn about() -> Result<impl IntoResponse, AppError> {
    Ok(AboutTemplate { version: &*VERSION
    })
}

pub fn meta_router() -> Router {
    Router::new()
        .route("/about", get(about))
        .route("/cookies", get(cookies))
        .route("/privacy", get(privacy))
        .route("/terms", get(terms))
}
