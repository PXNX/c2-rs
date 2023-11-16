mod error_handling;
mod middlewares;
mod oauth;
mod pages;
mod profile;
use axum::{
    extract::{rejection::FormRejection, Form, FromRequest},
    http::StatusCode,
    response::{Html, IntoResponse, Response},
    routing::get,
    Router,
};
use error_handling::AppError;
use middlewares::{check_auth, inject_user_data};
use pages::{about, index, login, settings, signup, welcome};
use serde::de::DeserializeOwned;
use serde::Deserialize;

use tower::ServiceExt;
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::routes::{
    oauth::auth_router,
    pages::{article, articles, military},
    profile::profile_router,
};
use axum::{
    async_trait, extract::FromRef, handler::HandlerWithoutStateExt, http::Request, middleware,
    Extension,
};
use minijinja::Environment;
use sqlx::PgPool;
use std::fs::read_dir;
use std::path::{Path, PathBuf};
use std::{fs, io};

#[derive(Clone, FromRef)]
pub struct AppState {
    pub db_pool: PgPool,
    pub env: Environment<'static>,
}

#[derive(Clone, Debug)]
pub struct UserData {
    pub user_id: i64,
    pub user_email: String,
    pub user_name: Option<String>,
}

pub async fn create_routes(db_pool: PgPool) -> Result<Router, Box<dyn std::error::Error>> {
    let mut env = Environment::new();
    let mut files = Vec::new();
    visit(Path::new("templates"), &mut |e| files.push(e)).unwrap();
    println!("files {:?}", &files);
    for path in files {
        let source = fs::read_to_string(&path)?;
        let path = path.to_str().ok_or("Failed to convert path to str")?;
        let path = &path[10..].replace(r"\", "/");
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

    let serve_dir = ServeDir::new("public").not_found_service(service);

    Ok(Router::new()
        .route("/", get(index))
        .route("/about", get(about))
        .route("/settings", get(settings))
        .nest("/u", profile_router())
        .route("/m", get(military))
        .nest("/a", article_router())
        .route_layer(middleware::from_fn_with_state(
            app_state.clone(),
            check_auth,
        ))
        .nest(
            "/welcome",
            Router::new()
                .route("/", get(welcome))
                .route("/signup", get(signup)),
        )
        .nest("/auth", auth_router())
        .route_layer(middleware::from_fn_with_state(
            app_state.clone(),
            inject_user_data,
        ))
        .route("/login", get(login))
        .with_state(app_state)
        .layer(Extension(user_data))
        .fallback_service(serve_dir))
}

fn article_router() -> Router<AppState> {
    Router::new()
        .route("/", get(articles))
        .route("/:id", get(article))
}

fn visit(path: &Path, cb: &mut dyn FnMut(PathBuf)) -> io::Result<()> {
    for e in read_dir(path)? {
        let e = e?;
        let path = e.path();
        if path.is_dir() {
            visit(&path, cb)?;
        } else if path.is_file() {
            cb(path);
        }
    }
    Ok(())
}
