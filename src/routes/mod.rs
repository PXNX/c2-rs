use std::fs::read_dir;
use std::path::{Path, PathBuf};
use std::{fs, io};

use axum::{extract::FromRef, handler::HandlerWithoutStateExt, middleware, Extension};
use axum::{extract::FromRequest, http::StatusCode, response::IntoResponse, routing::get, Router};
use glob::glob;
use serde::de::DeserializeOwned;
use serde::Deserialize;
use sqlx::PgPool;

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};

use pages::{about, index};

use crate::auth::error_handling::AppError;
//use crate::routes::inbox::inbox_router;
use crate::routes::military::military_router;
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

mod article;
//mod inbox;
mod map;
mod military;
mod newspaper;
mod pages;
mod profile;
mod welcome;

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
        let paths = read_dir("./").unwrap();

        let mut text:Vec<String>=Vec::new();
        for path in paths {
            text.push(path.unwrap().path().display().to_string());
          //  println!("Name: {}", path.unwrap().path().display())

        }

        text.push("--------------\n..".to_string());

        let paths = read_dir("../").unwrap();

        for path in paths {
            text.push(path.unwrap().path().display().to_string());
         //   println!("Name: {}", path.unwrap().path().display())
        }



/*        let  paths = fs::read_dir("../../").unwrap();

        for path in paths {
            println!("Name: {}", path.unwrap().path().display())
            text.push(path);
        }

 */




        text.push("--------------\n../../".to_string());

        let paths = read_dir("../../").unwrap();

        for path in paths {
            text.push(path.unwrap().path().display().to_string());
            //   println!("Name: {}", path.unwrap().path().display())
        }

        //let tx = format!("Assets not found {}", text.join("&&&  "));

        (StatusCode::NOT_FOUND, text.join("\n\n"))
    }

    // you can convert handler function to service
    let service = handle_404.into_service();

    let serve_dir = ServeDir::new("../../assets").not_found_service(service);

    Ok(Router::new()
        .route("/", get(index))
        .route("/about", get(about))
        .nest("/u", profile_router())
        .nest("/m", military_router())
        .nest("/map", map_router())
        .nest("/n", newspaper_router())
        .nest("/a", article_router())
        //   .nest("/inbox", inbox_router())
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
