use askama::Template;
use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::Redirect;
use axum::routing::get;
use axum::{
    extract::{Extension, State},
    response::IntoResponse,
};
use axum::{Form, Router};
use serde::{Deserialize, Serialize};
use sqlx::{query, PgPool};

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

#[derive(Template)]
#[template(path = "user/index.html")]
struct OwnProfileTemplate {
    user_id: i64,
    user_name: String,
    skill_0: i16,
}

async fn own_profile(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let user = query!(
        r#"SELECT name, skill_0,skill_1,skill_2,created_at FROM users WHERE id=$1;"#,
        &user_id
    )
    .fetch_one(&db_pool)
    .await
    .map_err(|e| AppError {
        code: StatusCode::NOT_FOUND,
        message: format!("GET Profile: No user with id {user_id} was found: {e}"),
        user_message: format!("No user with id {user_id} was found."),
    })?;

    Ok(OwnProfileTemplate {
        user_id: user_id,
        user_name: user.name.unwrap_or("Empty".to_owned()),
        skill_0: user.skill_0.unwrap_or(100.to_owned()),
    })
}

#[derive(Template)]
#[template(path = "user/profile.html")]
struct OtherProfileTemplate {
    user_name: String,
    skill_0: i16,
}

async fn profile(
    Extension(user_data): Extension<Option<UserData>>,
    Path(user_id): Path<i64>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    let user_data = user_data.unwrap();

    if user_data.id == user_id {
        return Ok(Redirect::to("/u").into_response());
    }

    let user = query!(
        r#"SELECT name, skill_0,skill_1,skill_2,created_at FROM users WHERE id=$1;"#,
        &user_id
    )
    .fetch_one(&db_pool)
    .await
    .map_err(|e| AppError {
        code: StatusCode::NOT_FOUND,
        message: format!("GET Profile: No user with id {user_id} was found: {e}"),
        user_message: format!("No user with id {user_id} was found."),
    })?;

    Ok(OtherProfileTemplate {
        user_name: user.name.unwrap(),
        skill_0: user.skill_0.unwrap(),
    }
    .into_response())
}

#[derive(Template)]
#[template(path = "user/settings.html")]
struct ProfileSettingsTemplate {
    user_name: String,
    user_avatar: String,
}

async fn profile_settings(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    let user = query!(r#"SELECT name, avatar FROM users WHERE id=$1;"#, &user_id)
        .fetch_one(&db_pool)
        .await?;

    //todo: check unwraps nd use if in template to not display if None
    Ok(ProfileSettingsTemplate {
        user_name: user.name.unwrap(),
        user_avatar: user.avatar.unwrap_or("".to_string()),
    })
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct EditProfile {
    user_name: String,
    user_avatar: String,
}

async fn edit_profile(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Form(input): Form<EditProfile>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    query!(
        r#"UPDATE users SET name = $1, avatar = $2 WHERE id=$3;"#,
        input.user_name,
        input.user_avatar,
        &user_id
    )
    .execute(&db_pool)
    .await?;

    Ok(Redirect::to("/")) //format!("/u/{user_id}")
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct VoucherCode {
    voucher_code: String,
}

async fn check_voucher(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Form(input): Form<VoucherCode>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    query!(
        r#"UPDATE users SET name = $1 WHERE id=$2;"#,
        input.voucher_code,
        &user_id
    )
    .execute(&db_pool)
    .await?;

    Ok(Redirect::to("/")) //format!("/u/{user_id}")
}

pub fn profile_router() -> Router<AppState> {
    Router::new()
        .route("/", get(own_profile))
        .route("/:id", get(profile))
        .route(
            "/settings",
            get(profile_settings).put(edit_profile).post(check_voucher),
        )
}
