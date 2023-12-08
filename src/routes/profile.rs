use askama::Template;
use axum::{
    extract::{Extension, Path, State},
    http::StatusCode,
    response::{IntoResponse, Redirect},
    routing::get,
    Form, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, query};

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
        skill_0: user.skill_0.unwrap_or(100),
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


#[cfg(test)]
mod tests {
    use super::*;
    use axum::{
        body::Body,
        http::{Request, StatusCode},
        response::Response,
        routing::Route,
    };
    use sqlx::{Pool, Postgres};
    use tower::ServiceExt; // for `app.oneshot()`

    // Utility function to create a test request
    fn test_request() -> Request<Body> {
        Request::builder().uri("/").body(Body::empty()).unwrap()
    }

    // Utility function to create a test database pool
    async fn setup_test_db() -> PgPool {
        // Setup your test database here and return the pool
        // This is a placeholder, replace with actual database setup
        Pool::<Postgres>::connect("postgres://test_user:test_pass@localhost/test_db").await.unwrap()
    }

    // Utility function to create a test user and return its UserData
    async fn create_test_user(db_pool: &PgPool) -> UserData {
        // Insert a test user into the database and return its UserData
        // This is a placeholder, replace with actual user creation
        UserData { id: 1 }
    }

    #[tokio::test]
    async fn test_own_profile_happy_path() {
        // Arrange
        let db_pool = setup_test_db().await;
        let user_data = create_test_user(&db_pool).await;
        let app = Router::new().route("/", get(own_profile)).layer(Extension(Some(user_data))).layer(Extension(db_pool));

        // Act
        let response = app.oneshot(test_request()).await.unwrap();

        // Assert
        assert_eq!(response.status(), StatusCode::OK);
        // Further assertions to check the response body
    }

    #[tokio::test]
    async fn test_own_profile_user_not_found() {
        // Arrange
        let db_pool = setup_test_db().await;
        let user_data = UserData { id: 999 }; // Nonexistent user ID
        let app = Router::new().route("/", get(own_profile)).layer(Extension(Some(user_data))).layer(Extension(db_pool));

        // Act
        let response = app.oneshot(test_request()).await.unwrap();

        // Assert
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
        // Further assertions to check the error message
    }

    #[tokio::test]
    async fn test_profile_redirect_to_own_profile() {
        // Arrange
        let db_pool = setup_test_db().await;
        let user_data = create_test_user(&db_pool).await;
        let app = Router::new().route("/:id", get(profile)).layer(Extension(Some(user_data.clone()))).layer(Extension(db_pool));

        // Act
        let request = Request::builder().uri(format!("/{}", user_data.id)).body(Body::empty()).unwrap();
        let response = app.oneshot(request).await.unwrap();

        // Assert
        assert_eq!(response.status(), StatusCode::SEE_OTHER);
        // Further assertions to check the redirect location
    }

    // Additional tests should be created following the same pattern to cover:
    // - profile with a different user ID (happy path)
    // - profile with a non-existent user ID (error case)
    // - profile_settings (happy path and error cases)
    // - edit_profile (happy path, error cases, and edge cases like empty name or avatar)
    // - check_voucher (happy path, error cases, and edge cases like invalid voucher code)
}