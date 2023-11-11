use std::collections::HashMap;
use axum::{
    extract::{Extension, State},
    http::Request,
    response::{Html, IntoResponse},
};
use axum::extract::{Path, Query};

use minijinja::{context, Environment};

use super::{AppError, UserData};

pub async fn index<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("index.html")?;
    let user_email = user_data.map(|s| s.user_email);
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();
    let content = tmpl.render(context!(
        user_email => user_email,
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
    let user_email = user_data.map(|s| s.user_email);
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();
    let content = tmpl.render(context!(
        user_email => user_email,
        login_return_url => login_return_url,
    ))?;
    Ok(Html(content))
}

pub async fn profile(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("profile.html")?;
    let user_email = user_data.map(|s| s.user_email);
    let content = tmpl.render(context!(user_email => user_email))?;
    Ok(Html(content))
}


pub async fn settings(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("settings.html")?;
    let user_email = user_data.map(|s| s.user_email);
    let content = tmpl.render(context!(user_email => user_email))?;
    Ok(Html(content))
}

pub async fn articles(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("articles/index.html")?;
    let user_email = user_data.map(|s| s.user_email);
    let content = tmpl.render(context!(user_email => user_email))?;
    Ok(Html(content))
}

pub async fn article(
    Extension(user_data): Extension<Option<UserData>>,

    Path(article_id): Path<i64>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("articles/view.html")?;
    let user_email = user_data.map(|s| s.user_email);
    let content = tmpl.render(context!(user_email => article_id))?;
    Ok(Html(content))
}

pub async fn signup<T>(
    Extension(user_data): Extension<Option<UserData>>,
    State(env): State<Environment<'static>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("welcome/signup.html")?;
    let user_email = user_data.map(|s| s.user_email);
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();
    let content = tmpl.render(context!(
        user_email => user_email,
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
    let user_email = user_data.map(|s| s.user_email);
    let login_return_url = "?next=".to_owned() + &*request.uri().to_string();
    let content = tmpl.render(context!(
        user_email => user_email,
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
    let user_email = user_data.map(|s| s.user_email);

   let login_return_url = "?next=".to_owned() + &*params
       .remove("next")
       .unwrap_or_else(|| "/".to_string());

    let content = tmpl.render(context!(
        user_email => user_email,
        login_return_url => login_return_url,
    ))?;;
    Ok(Html(content))
}