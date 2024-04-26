use std::collections::HashMap;

use axum::{
    extract::{Extension, Host, Query, State},
    response::{IntoResponse, Redirect},
    Router,
    routing::get,
};
use axum::response::AppendHeaders;
use axum_extra::{headers::Cookie, TypedHeader};
use chrono::Utc;
use oauth2::{AuthorizationCode, AuthUrl, basic::BasicClient, Client, ClientId, ClientSecret, CsrfToken, EndpointNotSet, EndpointSet, PkceCodeChallenge, PkceCodeVerifier, RedirectUrl, RevocationUrl, Scope, StandardRevocableToken, TokenResponse, TokenUrl};
use oauth2::basic::{BasicErrorResponse, BasicRevocationErrorResponse, BasicTokenIntrospectionResponse, BasicTokenResponse, BasicTokenType};
use random_word::Lang;
use reqwest::ClientBuilder;
use sqlx::PgPool;
use uuid::Uuid;

use crate::auth::SESSION_TOKEN;
use crate::getenv;
use crate::routes::{AppState, UserData};

use super::error_handling::AppError;

// Extracted function for OAuth client setup
fn setup_oauth_client(hostname: &str) -> Client<BasicErrorResponse, BasicTokenResponse, BasicTokenIntrospectionResponse, StandardRevocableToken, BasicRevocationErrorResponse, EndpointSet, EndpointNotSet, EndpointNotSet, EndpointSet, EndpointSet> {
    let google_client_id = ClientId::new(getenv!("GOOGLE_CLIENT_ID"));
    let google_client_secret = ClientSecret::new(getenv!("GOOGLE_CLIENT_SECRET"));
    let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string()).expect("Auth Uri could not be set up!");
    let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v3/token".to_string()).expect("Token Uri could not be set up!");
    let revocation_url = RevocationUrl::new("https://oauth2.googleapis.com/revoke".to_string()).expect("Revocation Uri could not be set up!");
    let protocol = if hostname.starts_with("localhost") || hostname.starts_with("127.0.0.1") {
        "http"
    } else {
        "https"
    };
    let redirect_url = RedirectUrl::new(format!("{}://{}/auth/callback", protocol, hostname)).expect("Redirect Uri could not be set up!");

    BasicClient::new(google_client_id)
        .set_client_secret(google_client_secret)
        .set_auth_uri(auth_url)
        .set_token_uri(token_url)
        .set_redirect_uri(redirect_url)
     .set_revocation_url(revocation_url)


}

fn generate_session_token() -> String {
    Uuid::new_v4().to_string()
}


async fn signin(
    Extension(user_data): Extension<Option<UserData>>,
    Query(mut params): Query<HashMap<String, String>>,
    State(db_pool): State<PgPool>,
    Host(hostname): Host,
) -> Result<Redirect, AppError> {
    let return_url = params.remove("next").unwrap_or_else(|| "/".to_string());
    // TODO: check if return_url is valid

    if user_data.is_some() {
        // check if already authenticated
        return Ok(Redirect::to(&return_url));
    }


    let (pkce_code_challenge, pkce_code_verifier) = PkceCodeChallenge::new_random_sha256();

    let (authorize_url, csrf_state) = setup_oauth_client(&hostname)
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/userinfo.email".to_string(),
        ))
        .set_pkce_challenge(pkce_code_challenge)
        .url();

    sqlx::query(
        "INSERT INTO oauth2_state_storage (csrf_state, pkce_code_verifier, return_url) VALUES ($1, $2, $3);",
    )
        .bind(csrf_state.secret())
        .bind(pkce_code_verifier.secret())
        .bind(return_url)
        .execute(&db_pool)
        .await?;

    Ok(Redirect::to(authorize_url.as_str()))
}

async fn oauth_return(
    Query(mut params): Query<HashMap<String, String>>,
    State(db_pool): State<PgPool>,
    Host(hostname): Host,
) -> Result<impl IntoResponse, AppError> {
    let state = CsrfToken::new(params.remove("state").ok_or("OAuth: without state")?);
    let code = AuthorizationCode::new(params.remove("code").ok_or("OAuth: without code")?);

    let query: (String, String) = sqlx::query_as(
        r#"DELETE FROM oauth2_state_storage WHERE csrf_state = $1 RETURNING pkce_code_verifier,return_url;"#,
    )
        .bind(state.secret())
        .fetch_one(&db_pool)
        .await?;

    println!("oauth_return");

    let pkce_code_verifier = query.0;
    let return_url = query.1;
    let pkce_code_verifier = PkceCodeVerifier::new(pkce_code_verifier);


    let http_client = ClientBuilder::new()
        // Following redirects opens the client up to SSRF vulnerabilities.
        .redirect(reqwest::redirect::Policy::none())
        .build()
        .expect("Client should build");

    let token_response = setup_oauth_client(&hostname)
        .exchange_code(code)
        .set_pkce_verifier(pkce_code_verifier)
        .request_async(&http_client)
        .await.unwrap();

    println!("pkce_verifier");

    // Get user info from Google
    let url =
        "https://www.googleapis.com/oauth2/v2/userinfo?oauth_token=".to_owned() + token_response.access_token().secret();
    let body = reqwest::get(url)
        .await
        .map_err(|_| "OAuth: reqwest failed to query userinfo")?
        .text()
        .await
        .map_err(|_| "OAuth: reqwest received invalid userinfo")?;
    let mut body: serde_json::Value =
        serde_json::from_str(body.as_str()).map_err(|_| "OAuth: Serde failed to parse userinfo")?;
    let email = body["email"]
        .take()
        .as_str()
        .ok_or("OAuth: Serde failed to parse email address")?
        .to_owned();
    let verified_email = body["verified_email"]
        .take()
        .as_bool()
        .ok_or("OAuth: Serde failed to parse verified_email")?;
    if !verified_email {
        return Err(AppError::new("OAuth: email address is not verified".to_owned())
            .with_user_message("Your email address is not verified. Please verify your email address with Google and try again.".to_owned()));
    }

    println!("google_verifier");

    // Check if user exists in database
    // If not, create a new user
    let user_query: Result<(i64, ), _> = sqlx::query_as(r#"SELECT id FROM users WHERE email=$1;"#)
        .bind(email.as_str())
        .fetch_one(&db_pool)
        .await;
    let user_id = if let Ok(user_query) = user_query {
        user_query.0
    } else {
        let query: (i64, ) =
            sqlx::query_as(r#"INSERT INTO users (email,name) VALUES ($1,$2) RETURNING id;"#)
                .bind(email)
                .bind(random_word::gen(Lang::En))
                .fetch_one(&db_pool)
                .await?;
        query.0
    };

    println!("create_user {user_id}");

    // Create a session for the user
    let session_token_p1 = generate_session_token();
    let session_token_p2 = generate_session_token();
    let session_token = [session_token_p1.as_str(), "_", session_token_p2.as_str()].concat();
    let headers = AppendHeaders([(
        http::header::SET_COOKIE,
        format!("{SESSION_TOKEN}={session_token}; path=/; httponly; secure; samesite=strict")
    )]);
    let now = Utc::now().timestamp();

    sqlx::query(
        r#"INSERT INTO user_sessions
        (session_token_p1, session_token_p2, user_id, created_at, expires_at)
        VALUES ($1, $2, $3, $4, $5);"#,
    )
        .bind(session_token_p1)
        .bind(session_token_p2)
        .bind(user_id)
        .bind(now)
        .bind(now + 60 * 60 * 24)
        .execute(&db_pool)
        .await?;

    println!("set cookie");

    println!("-------- {return_url}");

    match user_query {
        Ok(_) => Ok((headers, Redirect::to(return_url.as_str()))),
        Err(_) => Ok((headers, Redirect::to("/welcome"))),
    }
}

async fn logout(
    cookie: Option<TypedHeader<Cookie>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    if let Some(cookie) = cookie {
        if let Some(session_token) = cookie.get(SESSION_TOKEN) {
            let session_token: Vec<&str> = session_token.split('_').collect();
            let _ = sqlx::query("DELETE FROM user_sessions WHERE session_token_1 = $1;")
                .bind(session_token[0])
                .execute(&db_pool)
                .await;
        }
    }
    let headers = AppendHeaders([
        (
            http::header::SET_COOKIE,
            "session_token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        ),
        (http::header::REFERER, "/"),
    ]);
    Ok((headers, Redirect::to("/")))
}

pub fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/signin", get(signin))
        .route("/callback", get(oauth_return))
        .route("/logout", get(logout))
}