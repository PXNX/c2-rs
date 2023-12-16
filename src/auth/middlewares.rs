use axum::{
    extract::{Request, State},
    middleware::Next,
    response::{IntoResponse, Redirect},
};
use axum::body::Body;
use axum_extra::{headers::Cookie, TypedHeader};
use chrono::Utc;
use sqlx::{PgPool, query};
use crate::auth::SESSION_TOKEN;

use crate::routes::UserData;

use super::error_handling::AppError;


pub async fn inject_user_data(
    State(db_pool): State<PgPool>,
    cookie: Option<TypedHeader<Cookie>>,
    mut request: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, AppError> {
    if let Some(cookie) = cookie {
        if let Some(session_token) = cookie.get(SESSION_TOKEN) {
            let session_token: Vec<&str> = session_token.split('_').collect();
            let query = query!(
                r#"SELECT user_id,expires_at,session_token_p2 FROM user_sessions WHERE session_token_p1=$1;"#,
            session_token[0])
                .fetch_one(&db_pool)
                .await?;

            println!("inject--{:#?}", query);

            let session_token_p2_db: &[u8; 36] = query.session_token_p2.as_bytes().try_into().unwrap();
            let session_token_p2_cookie: &[u8; 36] = session_token
                .get(1)
                .copied()
                .unwrap_or_default()
                .as_bytes().try_into().unwrap();

            if constant_time_eq::constant_time_eq_n::<36>(
                session_token_p2_cookie,
                session_token_p2_db,
            ) {
                println!("session active");

                if query.expires_at > Utc::now().timestamp() {
                    request
                        .extensions_mut()
                        .insert(Some(UserData { id: query.user_id }));
                    //todo: also add language of user, his role (admin/mod) here
                }
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
