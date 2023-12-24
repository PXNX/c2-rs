use askama::Template;
use askama_axum::Response;
use axum::{extract::{Extension, Path, State}, http::StatusCode, response::{IntoResponse, Redirect}, routing::get, Form, Router, async_trait};
use axum_extra::headers;
use axum_htmx::{HX_REDIRECT, HX_RESWAP, HX_RETARGET, HX_TRIGGER};
use http::HeaderMap;
use oauth2::HttpResponse;
use reqwest::Client;
use reqwest::header::CONTENT_TYPE;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, query};
use validator::{Validate, ValidationError};
use crate::auth::error_handling::AppError;
use crate::auth::middlewares::ValidatedForm;

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

#[derive(Template)]
#[template(path = "user/settings_wrong_input.html")]
struct ProfileSettingsInputWrongTemplate {
    user_name: String,
    user_avatar: String,

    error_message: String,
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
        user_name: user.name.unwrap_or("".to_string()),
        user_avatar: user.avatar.unwrap_or("".to_string()),
    })
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
    ValidatedForm(input): ValidatedForm<EditProfile>,
) -> Response {
    let user_id = user_data.unwrap().id;

    if input.user_name.len() < 5 {
        let mut headers = HeaderMap::new();
        //   headers.insert(HX_TRIGGER, "close".parse().unwrap());

        //  headers.insert(StatusCode::CREATED)
        return ProfileSettingsInputWrongTemplate {
            user_name: input.user_name,

            user_avatar: input.user_avatar,
            error_message: "Username has to be at least 5 characters long.".to_string(),
        }.render().unwrap().into_response();
    }

    if !input.user_avatar.is_empty() && !vec![".png", ".jpg", ".jpeg"].iter().any(|e| input.user_avatar.ends_with(e)) {
        /*   return ProfileSettingsInputWrongTemplate {
               user_name: input.user_name,

               user_avatar: input.user_avatar,
               error_message: "Avatar is not a valid image url.".to_string(),
           }.render().unwrap().into_response();

         */
        ///     ([(HX_RETARGET, "#my_modal_4")], "testT").into_response();
        //  return (StatusCode::BAD_REQUEST, "Test").into_response();

        let line = stringify!(input.user_avatar);

        let start_bytes = line.find(".").unwrap_or(0) + 1; //index where "pattern" starts
        // or beginning of line if
        // "pattern" not found
        let end_bytes = line.find(":").unwrap_or(line.len()); //index where "<" is found
        // or end of line

        let result = &line[start_bytes..end_bytes];


        //   let elem: &str = stringify!(input.user_avatar).split_once(':').unwrap().rsplit_once(".").unwrap();

        let mut headers = HeaderMap::new();
        //   headers.insert(HX_TRIGGER, "close".parse().unwrap());
        headers.insert(HX_RETARGET, format!(r#"input[name="{}"]"#, result).to_string().parse().unwrap());
        headers.insert(HX_RESWAP, "afterend".to_string().parse().unwrap());
        //  headers.insert(StatusCode::CREATED)


        return
            (headers, r#"
    <span class="label label-text-alt text-error">Bottom Left label</span>"#.to_string())
                .into_response();
    }


    query!(
        r#"UPDATE users SET name = $1, avatar = $2 WHERE id=$3;"#,
        input.user_name,
        input.user_avatar,
        &user_id
    )
        .execute(&db_pool)
        .await.unwrap();

    let mut headers = HeaderMap::new();
    //   headers.insert(HX_TRIGGER, "close".parse().unwrap());
    headers.insert(HX_REDIRECT, "/user/settings".to_string().parse().unwrap());
    //  headers.insert(StatusCode::CREATED)


    [
        (HX_REDIRECT, "/user/settings".to_string()),
    ].into_response()
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
