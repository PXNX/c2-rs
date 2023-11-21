use std::collections::HashMap;

use axum::{
    extract::{Extension, State},
    http::Request,
    response::IntoResponse,
};
use axum::extract::Query;
use axum::response::Html;
use minijinja::{context, Environment};

use crate::routes::UserData;

use super::error_handling::AppError;

pub async fn login<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    Query(mut params): Query<HashMap<String, String>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("login.html")?;
    let login_return_url =
        "?next=".to_owned() + &*params.remove("next").unwrap_or_else(|| "/".to_string());

    let content = tmpl.render(context!(
        login_return_url => login_return_url,
    ))?;
    Ok(Html(content))
}
