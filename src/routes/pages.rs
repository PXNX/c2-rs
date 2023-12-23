use askama::Template;
use axum::{extract::Extension, http::Request, response::IntoResponse};

use crate::auth::error_handling::AppError;

use super::UserData;

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate {}

pub async fn index<T>(
    Extension(user_data): Extension<Option<UserData>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    Ok(IndexTemplate {})
}

