use axum::extract::{Path, Query};
use axum::{
    extract::{Extension, State},
    http::Request,
    response::{Html, IntoResponse},
};
use std::collections::HashMap;

use minijinja::{context, Environment};

use crate::auth::error_handling::AppError;

use super::UserData;

pub async fn index<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("index.html")?;
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();
    let content = tmpl.render(context!(
        user_id => user_data.unwrap().id,
        login_return_url => login_return_url,
    ))?;
    Ok(Html(content))
}

pub async fn about<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("about.html")?;

    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();
    let content = tmpl.render(context!(
        user_id => user_data.unwrap().id,
        login_return_url => login_return_url,
    ))?;
    Ok(Html(content))
}

pub async fn military(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("military/index.html")?;

    let content = tmpl.render(context!(user_id => user_data.unwrap().id))?;

    Ok(Html(content))
}
