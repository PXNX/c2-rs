use axum::{body, Extension, extract::FromRef, handler::HandlerWithoutStateExt, middleware};
use axum::{response::IntoResponse, Router, routing::get};
use axum::http::{header, Uri, StatusCode, HeaderValue};
use axum::response::{Html, Response};
use serde::de::DeserializeOwned;
use serde::Deserialize;
use sqlx::PgPool;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use rust_embed::RustEmbed;
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

    async fn handle_404() -> impl IntoResponse {
        //TODO: utilize StaticAssets for that
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
        .layer(Extension(user_data))
        .route("/dist/*file", get(static_handler))
        .fallback_service(handle_404.into_service()))
}


async fn static_handler(uri: Uri) -> impl IntoResponse {
    let mut path = uri.path().trim_start_matches('/').to_string();

    if path.starts_with("dist/") {
        path = path.replace("dist/", "");
    }

    StaticFile(path)
}


#[derive(RustEmbed)]
#[folder = "public/"]
struct Asset;

pub struct StaticFile<T>(pub T);

impl<T> IntoResponse for StaticFile<T>
    where
        T: Into<String>,
{
    fn into_response(self) -> Response {
        let path = self.0.into();

        match Asset::get(path.as_str()) {
            Some(content) => {
                let mime = mime_guess::from_path(path).first_or_octet_stream();
                ([(header::CONTENT_TYPE, mime.as_ref())], content.data).into_response()
            }
            None => (StatusCode::NOT_FOUND, "404 Not Found").into_response(),
        }
    }
}