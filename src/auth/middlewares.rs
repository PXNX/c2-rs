use axum::{
    extract::{Request, State},
    middleware::Next,
    response::{IntoResponse, Redirect},
};
use axum::body::Body;
use axum_extra::{headers::Cookie, TypedHeader};
use chrono::Utc;
use sqlx::{PgPool, query};

use crate::routes::UserData;

use super::error_handling::AppError;

pub async fn inject_user_data(
    State(db_pool): State<PgPool>,
    cookie: Option<TypedHeader<Cookie>>,
    mut request: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, AppError> {
    if let Some(cookie) = cookie {
        if let Some(session_token) = cookie.get("session_token") {
            let session_token: Vec<&str> = session_token.split('_').collect();
            let query = query!(
                r#"SELECT user_id,expires_at,session_token_p2 FROM user_sessions WHERE session_token_p1=$1;"#,
            session_token[0])
                .fetch_one(&db_pool)
                .await?;

            println!("inject--{:#?}", query);

            let session_token_p2_db = query.session_token_p2.as_bytes();
            let session_token_p2_cookie = session_token
                .get(1)
                .copied()
                .unwrap_or_default()
                .as_bytes();

            if (session_token_p2_db == session_token_p2_cookie
            ) && query.expires_at > Utc::now().timestamp() {
                println!("session active");
                request
                    .extensions_mut()
                    .insert(Some(UserData { id: query.user_id }));
            }
        }
    }

    Ok(next.run(request).await)
}

pub async fn check_auth(request: Request, next: Next) -> Result<impl IntoResponse, AppError> {
    println!("check auth");

    if request
        .extensions()
        .get::<Option<UserData>>()
        .ok_or("check_auth: extensions have no UserData")?
        .is_some()
    {
        Ok(next.run(request).await)
    } else {
        let login_url = "/login?next=".to_owned() + &*request.uri().to_string();
        Ok(Redirect::to(login_url.as_str()).into_response())
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use axum::{
        http::{Request, StatusCode},
        routing::get,
        Router,
    };
    use tower::ServiceExt;
    // to call the service
    use sqlx::{PgPool, Connection, Executor, PgConnection};
    use std::net::SocketAddr;
    use std::sync::Arc;
    use chrono::{Duration, TimeZone};

    // Helper function to create a mock database pool
    async fn setup_database() -> PgPool {
        let pool = PgPool::connect("postgres://postgres:password@localhost/test_db").await.unwrap();
        pool.execute(include_str!("../migrations/001_create_user_sessions.up.sql")).await.unwrap();
        pool
    }

    // Helper function to insert a user session into the database
    async fn insert_user_session(pool: &PgPool, user_id: i32, session_token_p1: &str, session_token_p2: &str, expires_at: i64) {
        let full_token = format!("{}_{}", session_token_p1, session_token_p2);
        sqlx::query!(
            r#"INSERT INTO user_sessions (user_id, session_token_p1, session_token_p2, expires_at) VALUES ($1, $2, $3, $4)"#,
            user_id,
            session_token_p1,
            session_token_p2,
            expires_at
        )
            .execute(pool)
            .await
            .unwrap();
    }

    // Helper function to create a request with a cookie
    fn create_request_with_cookie(session_token: &str) -> Request<Body> {
        let cookie_header_value = format!("session_token={}", session_token);
        Request::builder()
            .header("cookie", cookie_header_value)
            .body(Body::empty())
            .unwrap()
    }

    #[tokio::test]
    async fn test_inject_user_data_happy_path() {
        // Arrange
        let db_pool = setup_database().await;
        let user_id = 1;
        let session_token_p1 = "token_part1";
        let session_token_p2 = "token_part2";
        let expires_at = Utc::now().timestamp() + 3600; // 1 hour in the future
        insert_user_session(&db_pool, user_id, session_token_p1, session_token_p2, expires_at).await;
        let request = create_request_with_cookie(&format!("{}_{}", session_token_p1, session_token_p2));
        let next = Next::new(&[], |req| async move { Ok(req) });

        // Act
        let response = inject_user_data(State(db_pool.clone()), Some(TypedHeader(Cookie::from(request.headers().get("cookie").unwrap().to_str().unwrap().to_string()))), request, next).await;

        // Assert
        assert!(response.is_ok());
        let (parts, _) = response.unwrap().into_response().into_parts();
        assert_eq!(parts.status, StatusCode::OK);
    }

    #[tokio::test]
    async fn test_inject_user_data_expired_session() {
        // Arrange
        let db_pool = setup_database().await;
        let user_id = 1;
        let session_token_p1 = "expired_token_part1";
        let session_token_p2 = "expired_token_part2";
        let expires_at = Utc::now().timestamp() - 3600; // 1 hour in the past
        insert_user_session(&db_pool, user_id, session_token_p1, session_token_p2, expires_at).await;
        let request = create_request_with_cookie(&format!("{}_{}", session_token_p1, session_token_p2));
        let next = Next::new(&[], |req| async move { Ok(req) });

        // Act
        let response = inject_user_data(State(db_pool.clone()), Some(TypedHeader(Cookie::from(request.headers().get("cookie").unwrap().to_str().unwrap().to_string()))), request, next).await;

        // Assert
        assert!(response.is_ok());
        let (parts, _) = response.unwrap().into_response().into_parts();
        assert_eq!(parts.status, StatusCode::OK);
        assert!(request.extensions().get::<Option<UserData>>().is_none());
    }

    #[tokio::test]
    async fn test_inject_user_data_invalid_session_token() {
        // Arrange
        let db_pool = setup_database().await;
        let request = create_request_with_cookie("invalid_token_format");
        let next = Next::new(&[], |req| async move { Ok(req) });

        // Act
        let response = inject_user_data(State(db_pool.clone()), Some(TypedHeader(Cookie::from(request.headers().get("cookie").unwrap().to_str().unwrap().to_string()))), request, next).await;

        // Assert
        assert!(response.is_err());
    }

    #[tokio::test]
    async fn test_check_auth_user_authenticated() {
        // Arrange
        let db_pool = setup_database().await;
        let user_id = 1;
        let session_token_p1 = "token_part1";
        let session_token_p2 = "token_part2";
        let expires_at = Utc::now().timestamp() + 3600; // 1 hour in the future
        insert_user_session(&db_pool, user_id, session_token_p1, session_token_p2, expires_at).await;
        let mut request = create_request_with_cookie(&format!("{}_{}", session_token_p1, session_token_p2));
        request.extensions_mut().insert(Some(UserData { id: user_id as i64 }));
        let next = Next::new(&[], |req| async move { Ok(req) });

        // Act
        let response = check_auth(request, next).await;

        // Assert
        assert!(response.is_ok());
        let (parts, _) = response.unwrap().into_response().into_parts();
        assert_eq!(parts.status, StatusCode::OK);
    }

    #[tokio::test]
    async fn test_check_auth_user_not_authenticated() {
        // Arrange
        let request = Request::new(Body::empty());
        let next = Next::new(&[], |req| async move { Ok(req) });

        // Act
        let response = check_auth(request, next).await;

        // Assert
        assert!(response.is_ok());
        let (parts, body) = response.unwrap().into_response().into_parts();
        assert_eq!(parts.status, StatusCode::FOUND);
        assert!(body.is_some());
    }
}
