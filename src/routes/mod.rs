mod article;
mod map;
mod newspaper;
mod pages;
mod profile;
mod welcome;
use axum::{
    extract::{rejection::FormRejection, Form, FromRequest},
    http::StatusCode,
    response::{Html, IntoResponse, Response},
    routing::get,
    Router,
};

use pages::{about, index};
use serde::de::DeserializeOwned;
use serde::Deserialize;

use tower::ServiceExt;
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::{
    auth::{
        login::login,
        middlewares::{check_auth, inject_user_data},
        oauth::auth_router,
    },
    routes::{
        article::article_router, map::map_router, newspaper::newspaper_router, pages::military,
        profile::profile_router, welcome::welcome_router,
    },
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
    pub id: i64,
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
        .nest("/u", profile_router())
        .route("/m", get(military))
        .nest("/map", map_router())
        .nest("/n", newspaper_router())
        .nest("/a", article_router())
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
        .fallback_service(serve_dir))
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
