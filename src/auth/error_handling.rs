use askama::Template;
use axum::{
    http::StatusCode,
    response::{Html, IntoResponse},
};
use http::Uri;

pub struct AppError {
    pub code: StatusCode,
    pub message: String,
    pub user_message: String,
}

impl AppError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            user_message: "".to_owned(),
            code: StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
    pub fn with_user_message(self, user_message: impl Into<String>) -> Self {
        Self {
            user_message: user_message.into(),
            ..self
        }
    }
    // pub fn with_code(self, code: StatusCode) -> Self {
    //     Self {
    //         code,
    //         ..self
    //     }
    // }
}

#[derive(Template)]
#[template(path = "error/500.html")]
struct InternalErrorTemplate {
    error_message: String,
}

#[derive(Template)]
#[template(path = "error/404.html")]
struct NotFoundTemplate {
    uri:String
}

pub async fn handle_404() -> axum::response::Response {
    (StatusCode::NOT_FOUND,
     Html(NotFoundTemplate {uri: "Test".parse().unwrap() }.render().unwrap()))
        .into_response()
}

pub async fn fallback(uri: Uri) -> axum::response::Response {
        (StatusCode::NOT_FOUND,
         Html(NotFoundTemplate {uri:uri.to_string()}.render().unwrap()))
        .into_response()
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        println!("AppError: {}", self.message);

        (self.code,
         Html(InternalErrorTemplate { error_message: self.message }.render().unwrap()))
            .into_response()
    }
}
macro_rules! from_error {
    ($err_type:ty, $err_msg:expr) => {
        impl From<$err_type> for AppError {
            fn from(err: $err_type) -> Self {
                AppError::new(format!($err_msg, err))
            }
        }
    };
    }
from_error!(askama::Error, "Template error: {:#}");
from_error!(dotenvy::Error, "Dotenv error: {:#}");
from_error!(sqlx::Error, "Database query error: {:#}");
from_error!(String, "{}");
from_error!(&str, "{}");
