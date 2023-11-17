use axum::extract::{Path, Query};
use axum::{
    extract::{Extension, State},
    http::Request,
    response::{Html, IntoResponse},
};
use std::collections::HashMap;

use minijinja::{context, Environment};

use super::{AppError, UserData};

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
    let tmpl = env.get_template("m/index.html")?;

    let content = tmpl.render(context!(user_id => user_data.unwrap().id))?;

    Ok(Html(content))
}

pub async fn settings(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("u/settings.html")?;

    let content = tmpl.render(context!(user_id => user_data.unwrap().id))?;

    Ok(Html(content))
}

pub async fn signup<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("welcome/signup.html")?;
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();

    let content = tmpl.render(context!(
        user_id => user_data.unwrap().id,
        login_return_url => login_return_url,
    ))?;
    Ok(Html(content))
}

pub async fn welcome<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("welcome/index.html")?;
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();

    let content = tmpl.render(context!(
        user_id => user_data.unwrap().id,
        login_return_url => login_return_url,
    ))?;
    Ok(Html(content))
}

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
