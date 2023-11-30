use axum::{Extension, extract::FromRef, handler::HandlerWithoutStateExt, middleware};
use axum::{http::StatusCode, response::IntoResponse, Router, routing::get};
use axum::http::Response;
use serde::de::DeserializeOwned;
use serde::Deserialize;
use sqlx::PgPool;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use pages::{about, index};

use crate::{
    auth::{
        login::login,
        middlewares::{check_auth, inject_user_data},
        oauth::auth_router,
    },
    routes::{
        article::article_router, map::map_router, newspaper::newspaper_router,
        profile::profile_router, welcome::welcome_router,
    },
};
use crate::routes::inbox::inbox_router;
//use crate::routes::inbox::inbox_router;
use crate::routes::military::military_router;

mod article;
//mod inbox;
mod map;
mod military;
mod newspaper;
mod pages;
mod profile;
mod welcome;
mod inbox;

#[derive(Clone, FromRef)]
pub struct AppState {
    pub db_pool: PgPool,
}

#[derive(Clone, Debug)]
pub struct UserData {
    pub id: i64,
}

pub async fn create_routes(db_pool: PgPool) -> Result<Router, Box<dyn std::error::Error>> {
    let app_state = AppState { db_pool };

    let user_data: Option<UserData> = None;

    async fn handle_404() -> (StatusCode, String) {
        (StatusCode::NOT_FOUND, "Not found".to_owned())
    }

    Ok(Router::new()
        .route("/styles.css", get(styles))
        .route("/manifest.webmanifest", get(manifest))
    //    .route("/favicon.ico", get(favicon))
        .route("/bundle.js", get(bundle))
        .route("/", get(index))
        .route("/about", get(about))
        .nest("/u", profile_router())
        .nest("/m", military_router())
        .nest("/map", map_router())
        .nest("/n", newspaper_router())
        .nest("/a", article_router())
        .nest("/inbox", inbox_router())
        .route_layer(middleware::from_fn_with_state(
            app_state.clone(),
            check_auth,
        ))
        .nest("/welcome", welcome_router())
        .nest("/auth", auth_router())
        .route_layer(middleware::from_fn_with_state(
            app_state.clone(),
            inject_user_data,
        ))
        .route("/login", get(login))
        .with_state(app_state)
        .layer(Extension(user_data))
        .fallback_service(handle_404.into_service()))
}

async fn styles() -> impl IntoResponse {
    Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "text/css")
        .body(include_str!("../../public/styles.css").to_owned())
        .unwrap()
}

async fn manifest() -> impl IntoResponse {
    Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "application/manifest+json")
        .body(include_str!("../../public/manifest.webmanifest").to_owned())
        .unwrap()
}
/*
//TODO: try https://github.com/pyrossh/rust-embed/blob/master/examples/axum.rs
async fn favicon() -> impl IntoResponse {
    Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "image/x-icon")
        .body(include_str!("../../public/favicon.ico").to_owned())
        .unwrap()
}*/



async fn bundle() -> impl IntoResponse {
    Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "text/javascript")
        .body(include_str!("../../public/bundle.js").to_owned())
        .unwrap()
}
