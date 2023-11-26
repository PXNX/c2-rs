use crate::auth::error_handling::AppError;
use askama::Template;
use axum::routing::get;
use axum::Router;
use axum::{
    extract::{Extension, State},
    response::{Html, IntoResponse},
};
use sqlx::PgPool;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "map.html")]
struct MapTemplate {}

async fn map(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    Ok(MapTemplate {})
}

pub fn map_router() -> Router<AppState> {
    Router::new().route("/", get(map))
}
