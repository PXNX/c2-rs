use axum::{
    Extension,
    extract::FromRef,
    handler::HandlerWithoutStateExt,
    http::{header, StatusCode, Uri},
    middleware,
    response::{IntoResponse, Response},
    Router, routing::get,
};
use rust_embed::RustEmbed;
use serde::{de::DeserializeOwned, Deserialize};
use sqlx::PgPool;
use tower_http::LatencyUnit;
use tower_http::trace::{
    DefaultMakeSpan, DefaultOnFailure, DefaultOnRequest, DefaultOnResponse, TraceLayer,
};
use tracing::Level;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use pages::index;

use crate::{
    auth::{
        error_handling::handle_404,
        login::login,
        middlewares::{check_auth, inject_user_data},
        oauth::auth_router,
    },
    routes::{
        article::article_router, chat::chat_router, country::country_router, docs::docs_router,
        map::map_router, meta::meta_router, newspaper::newspaper_router,
        production::production_router, profile::profile_router, region::region_router,
        team::team_router, training::training_router, welcome::welcome_router,
    },
};

//use crate::ws::{handle_stream, TodoUpdate};

mod article;
//mod chat;
mod chat;
mod map;
mod meta;
mod training;
mod newspaper;
mod pages;
mod profile;
mod region;
mod welcome;
mod country;
mod team;
mod docs;
mod production;

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

    //  let (tx, _rx) = channel::<TodoUpdate>(10);

    Ok(Router::new()
        .route("/", get(index))
        .nest("/user", profile_router())
        .nest("/region", region_router())
        .nest("/country", country_router())
        .nest("/production", production_router())
        .nest("/training", training_router())
        .nest("/map", map_router())
        .nest("/newspaper", newspaper_router())
        .nest("/article", article_router())
        .nest("/team", team_router())
        .nest("/chat", chat_router())
        //  .route("/stream", get(crate::ws::handle_stream))
        .route_layer(middleware::from_fn_with_state(
            app_state.clone(),
            check_auth,
        ))
        .nest("/auth", auth_router())
        .route_layer(middleware::from_fn_with_state(
            app_state.clone(),
            inject_user_data,
        ))
        .route("/login", get(login))
        .nest("/welcome", welcome_router())

        /*  .route("/stream", get(crate::ws::stream))
        .route("/todos", get(crate::ws::fetch_todos).post(crate::ws::create_todo))
        .route("/todos/:id", delete(crate::ws::delete_todo))
        .route("/todos/stream", get(handle_stream)) */
        .with_state(app_state)
        .layer(Extension(user_data))
        .nest("/docs", docs_router())
        .nest("/", meta_router())
        //   .layer(Extension(tx))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::new().include_headers(true))
                .on_request(DefaultOnRequest::new().level(Level::INFO))
                .on_response(
                    DefaultOnResponse::new()
                        .level(Level::INFO)
                        .latency_unit(LatencyUnit::Millis),
                )
                .on_failure(DefaultOnFailure::new().level(Level::ERROR)),
        )
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

                let encoding = if mime.to_string().contains(".min") {
                    "br"
                } else {
                    "utf-8" //TODO: just don't have any encoding here?
                };

                (
                    [
                        (header::CONTENT_TYPE, mime.as_ref()),
                        (header::CONTENT_ENCODING, encoding),
                        (header::CACHE_CONTROL, "36000")
                    ],
                    content.data,
                )
                    .into_response()
            }
            None => (StatusCode::NOT_FOUND, "404 Not Found").into_response(),
        }
    }
}
