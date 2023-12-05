use askama::Template;
use axum::extract::Path;
use axum::routing::get;
use axum::Router;
use axum::{extract::Extension, response::IntoResponse};

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "region/view.html")]
struct RegionTemplate {
    region_id: i64,
}

pub async fn region(Path(region_id): Path<i64>) -> Result<impl IntoResponse, AppError> {
    Ok(RegionTemplate {
        region_id: region_id,
    })
}

pub fn region_router() -> Router<AppState> {
    Router::new().route("/:id", get(region))
}
