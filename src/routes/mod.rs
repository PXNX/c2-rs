use axum::{Extension, extract::FromRef, handler::HandlerWithoutStateExt, middleware};
use axum::{ response::IntoResponse, Router, routing::get};
use axum::http::{header, Uri,StatusCode};
use axum::response::{Html, Response};
use rust_embed::RustEmbed;
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





//    let index_html = Asset::get("logo.svg").unwrap();
   // println!("{:?}", std::str::from_utf8(index_html.data.as_ref()));






    async fn handle_404() -> impl IntoResponse {
        (StatusCode::NOT_FOUND, Html(include_str!("../../templates/error/404.html").to_string())).into_response()
    }

    Ok(Router::new()

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
      //  .nest("/dist",asserts)
        .route("/styles.css", get(styles))
        .route("/manifest.webmanifest", get(manifest))
        .route("/favicon.ico", get(favicon))
        .route("/logo.svg", get(logo))
        .route("/bundle.js", get(bundle))
        .layer(Extension(user_data))


        .fallback_service(handle_404.into_service()))
}








//todo: iterate over all assets
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


async fn logo() -> impl IntoResponse {
    let headers = [
        (header::CONTENT_TYPE, "image/svg+xml"),
        /*   (
               header::CONTENT_DISPOSITION,
               "attachment; filename=\"favicon.ico\"",
           ), */
    ];
    (headers, include_bytes!("../../public/logo.svg").to_owned()).into_response()
}

//TODO: try https://github.com/pyrossh/rust-embed/blob/master/examples/axum.rs
async fn favicon() -> impl IntoResponse {
    let headers = [
        (header::CONTENT_TYPE, "image/x-icon"),
        /*   (
               header::CONTENT_DISPOSITION,
               "attachment; filename=\"favicon.ico\"",
           ), */
    ];
    (headers, include_bytes!("../../public/favicon.ico").to_owned()).into_response()
}


async fn bundle() -> impl IntoResponse {
    Response::builder()
        .status(StatusCode::OK)
        .header("Content-Type", "text/javascript")
        .body(include_str!("../../public/bundle.js").to_owned())
        .unwrap()
}


