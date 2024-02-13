use std::collections::{BTreeMap, HashMap};

use askama::Template;
use askama_axum::Response;
use axum::{extract::{Extension, Path, State}, Form, http::StatusCode, response::{IntoResponse, Redirect}, Router, routing::get};
use axum_htmx::HX_REDIRECT;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, query};
use validator::Validate;

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
        return Ok(Redirect::to("/user").into_response());
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
    errors: BTreeMap<String, String>,
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
        user_name: user.name.unwrap_or("".to_string()), //todo set name from beginning onwards
        user_avatar: user.avatar.unwrap_or("".to_string()), //todo just return Default here, like svg link? what about doing the same for newspaper?

        errors: Default::default(),
    })
}

#[derive(Template)]
#[template(path = "user/partial/settings_edit.html")]
struct ProfileSettingsEditTemplate {
    user_name: String,
    user_avatar: String,

    //   error_message: String,
    errors: HashMap<String, String>,
}

#[derive(Clone, Debug, Validate, Deserialize)]
struct EditProfile {
    #[validate(length(min = 10, message = "too short"))]
    user_name: String,
    #[validate(length(min = 3, message = "Can not be empty"))]
    user_avatar: String,
}


async fn edit_profile(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Form(input): Form<EditProfile>,
) -> Result<Response, AppError> {
    let user_id = user_data.unwrap().id;

    match input.validate() {
        Ok(_) => {
            query!(
        r#"UPDATE users SET name = $1, avatar = $2 WHERE id=$3;"#,
        input.user_name,
        input.user_avatar,
        &user_id
    )
                .execute(&db_pool)
                .await.unwrap();


            Ok([
                (HX_REDIRECT, "/user/settings".to_string()),
            ].into_response())
        }
        Err(e) => {
            let mut fruits: HashMap<String, String> = HashMap::new();
            for x in e.field_errors() {
                fruits.insert(x.0.to_string(), x.1[0].message.as_ref().unwrap().to_string());
            }


            Ok(ProfileSettingsEditTemplate {
                user_name: input.user_name,

                user_avatar: input.user_avatar,
                //     error_message: "Username has to be at least 5 characters long.".to_string(),
                errors: fruits,
            }.render().unwrap().into_response())
        }
    }
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
