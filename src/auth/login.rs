use std::collections::HashMap;

use askama::Template;
use axum::extract::Query;

use axum::response::IntoResponse;

use super::error_handling::AppError;

#[derive(Template)]
#[template(path = "login.html")]
struct LoginTemplate {
    login_return_url: String,
}

pub async fn login(
    Query(mut params): Query<HashMap<String, String>>,
) -> Result<impl IntoResponse, AppError> {
    Ok(LoginTemplate {
        login_return_url: "?next=".to_owned()
            + &*params.remove("next").unwrap_or_else(|| "/".to_string()),
    })
}
