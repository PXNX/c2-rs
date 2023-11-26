use askama::Template;
use axum::{
    extract::{Extension, State},
    http::Request,
    response::{Html, IntoResponse},
};

use crate::auth::error_handling::AppError;

use super::UserData;

#[derive(Template)]
#[template(path = "index.html")]
struct IndexTemplate {
    user_id: i64,

    login_return_url: String,
}

pub async fn index<T>(
    Extension(user_data): Extension<Option<UserData>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    Ok(IndexTemplate {
        user_id: user_data.unwrap().id,

        login_return_url: "?next=".to_owned() + &*request.uri().to_string(),
    })
}

#[derive(Template)]
#[template(path = "about.html")]
struct AboutTemplate {
    user_id: i64,
    login_return_url: String,
}

pub async fn about<T>(
    Extension(user_data): Extension<Option<UserData>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    Ok(AboutTemplate {
        user_id: user_data.unwrap().id,
        login_return_url: "?next=".to_owned() + &*request.uri().to_string(),
    })
}
