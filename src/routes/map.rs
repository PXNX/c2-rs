use askama::Template;
use axum::{
    extract::{Extension, State},
    response::IntoResponse,
};
use axum::extract::Path;
use axum::Router;
use axum::routing::get;
use sqlx::PgPool;

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "map.html")]
struct MapTemplate {
    map: String
}

async fn map(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    Ok(MapTemplate {
        map: include_str!("../../templates/map.svg").parse().unwrap()
    })
}

#[derive(Template)]
#[template(path = "preview.html")]
struct RegionPreviewTemplate {
    name: String,
    id:u32,
}
async fn region_preview(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Path(region_id):Path<u32>
) -> Result<impl IntoResponse, AppError> {
Ok(RegionPreviewTemplate{
    name: "".to_string(),
    id: region_id,
})
}

pub fn map_router() -> Router<AppState> {
    Router::new().route("/", get(map)).route("/region/:region_id", get(region_preview))
}
