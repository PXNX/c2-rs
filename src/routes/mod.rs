mod error_handling;
mod middlewares;
mod oauth;
mod pages;

use error_handling::AppError;
use middlewares::{check_auth, inject_user_data};
use oauth::{logout, oauth_return};
use pages::{about, index, profile};
use tower::ServiceExt;
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use axum::{
    extract::FromRef, handler::HandlerWithoutStateExt, http::StatusCode, middleware, routing::get,
    Extension, Router,
};
use minijinja::Environment;
use sqlx::PgPool;
use std::fs;
use crate::routes::oauth::login;

use crate::routes::pages::{ settings};

#[derive(Clone, FromRef)]
pub struct AppState {
    pub db_pool: PgPool,
    pub env: Environment<'static>,
}

#[derive(Clone, Debug)]
pub struct UserData {
    pub user_id: i64,
    pub user_email: String,
}

pub async fn create_routes(db_pool: PgPool) -> Result<Router, Box<dyn std::error::Error>> {
    let mut env = Environment::new();

    let paths = fs::read_dir("src/templates").unwrap();
    for path in paths {
        let path = path.map_err(|e| format!("Error on file {e}"))?.path();
        let source = fs::read_to_string(&path)?;
        let path = path.to_str().ok_or("Failed to convert path to str")?;
        let path = &path[14..];
        env.add_template_owned(path.to_owned(), source)
            .map_err(|e| format!("Failed to add {path}: {e}"))?;
    }

    let app_state = AppState { db_pool, env };

    let user_data: Option<UserData> = None;

    async fn handle_404() -> (StatusCode, &'static str) {
        (StatusCode::NOT_FOUND, "Not found")
    }

    // you can convert handler function to service
    let service = handle_404.into_service();

    let serve_dir = ServeDir::new("assets").not_found_service(service);

    Ok(Router::new()
        .route("/", get(index))
        .route("/about", get(about))
        .route("/settings", get(settings))
        .route("/profile", get(profile))
        .route_layer(middleware::from_fn_with_state(
            app_state.clone(),
            check_auth,
        ))

        .nest("/auth", Router::new()
            .route("/login", get(login))
            .route("/signup", get(signup))

            .route("/callback", get(oauth_return))
            .route("/logout", get(logout)),
        )
        .route_layer(middleware::from_fn_with_state(
            app_state.clone(),
            inject_user_data,
        ))

        .with_state(app_state)
        .layer(Extension(user_data))
        .fallback_service(serve_dir))
}
