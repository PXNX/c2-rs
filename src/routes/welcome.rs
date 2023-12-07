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
struct WelcomeTemplate {
    login_return_url: String,
}

pub async fn welcome<T>(
    Extension(user_data): Extension<Option<UserData>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    Ok(WelcomeTemplate {
        login_return_url: "?next=".to_owned() + &*request.uri().to_string(),
    })
}

#[derive(Template)]
#[template(path = "welcome/signup.html")]
struct SignupTemplate {
    login_return_url: String,
}

pub async fn signup<T>(
    Extension(user_data): Extension<Option<UserData>>,
    request: Request<T>,
) -> Result<impl IntoResponse, AppError> {
    Ok(SignupTemplate {
        login_return_url: "?next=".to_owned() + &*request.uri().to_string(),
    })
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
