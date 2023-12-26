use askama::Template;
use askama_axum::IntoResponse;
use axum::Router;
use axum::routing::get;
use crate::auth::error_handling::AppError;
use crate::routes::meta::{about, cookies, privacy, terms};
use ammonia::clean;
use axum_extra::response::Html;
use pulldown_cmark::{Parser, Options, html::push_html};

#[derive(Template)]
#[template(path = "docs/index.html")]
struct DocsTemplate {}

pub async fn docs() -> Result<impl IntoResponse, AppError> {
    Ok(DocsTemplate {})
}

pub async fn intro() -> Result<impl IntoResponse, AppError> {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES);

    //TODO: use database
    let md_parse = Parser::new_ext(include_str!("../../templates/docs/intro.md"), options);
    let mut unsafe_html = String::new();
    push_html(&mut unsafe_html, md_parse);

    let safe_html = clean(&*unsafe_html);

    Ok(Html(safe_html))
}

pub fn docs_router() -> Router {
    Router::new()
        .route("/", get(docs))
        .route("/intro", get(intro))
}