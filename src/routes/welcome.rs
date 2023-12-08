use askama::Template;
use axum::{
    extract::{Extension, State},
    http::Request,
    response::IntoResponse,
};
use axum::{Form, Router};
use axum::response::Redirect;
use axum::routing::get;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, query};

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "welcome/index.html")]
struct WelcomeTemplate {}

pub async fn welcome<T>() -> Result<impl IntoResponse, AppError> {
    Ok(WelcomeTemplate {})
}

#[derive(Template)]
#[template(path = "welcome/signup.html")]
struct SignupTemplate {}

pub async fn signup<T>() -> Result<impl IntoResponse, AppError> {
    Ok(SignupTemplate {})
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct CreateProfile {
    user_name: String,
}

async fn create_profile(
    State(db_pool): State<PgPool>,
    Form(input): Form<CreateProfile>,
) -> Result<impl IntoResponse, AppError> {


    //todo: check if mail already exists, return error to user if so

    let mail = query!(r"select mail_adress from users where mail_address = $1;"#, );

    query!(
        r#"UPDATE users SET name = $1 WHERE id=$2;"#,
        input.user_name,
        44
    )
        .execute(&db_pool)
        .await?;

    Ok(Redirect::to("/"))
}

pub fn welcome_router() -> Router<AppState> {
    Router::new()
        .route("/", get(welcome))
        .route("/signup", get(signup).post(create_profile))
}
