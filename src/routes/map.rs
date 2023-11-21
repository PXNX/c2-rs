use axum::{
    extract::{Extension, State},
    response::{Html, IntoResponse},
};
use axum::Router;
use axum::routing::get;
use minijinja::{context, Environment};
use sqlx::PgPool;

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

async fn map(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("map.html")?;

    let content = tmpl.render(context!(
        user_id =>  user_data.unwrap().id,

    ))?;
    Ok(Html(content))
}

pub fn map_router() -> Router<AppState> {
    Router::new().route("/", get(map))
}
