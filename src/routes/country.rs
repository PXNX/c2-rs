use askama::Template;
use axum::extract::Path;
use axum::routing::get;
use axum::Router;
use axum::{extract::Extension, response::IntoResponse};

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "country/view.html")]
struct CountryTemplate {
    country_id: i64,
}

pub async fn country(Path(country_id): Path<i64>) -> Result<impl IntoResponse, AppError> {
    Ok(CountryTemplate {
        country_id: country_id,
    })
}

pub fn country_router() -> Router<AppState> {
    Router::new().route("/:id", get(country))
}
