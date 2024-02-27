use std::env;

use anyhow::{anyhow, Context, Result};
use sqlx::postgres::PgPoolOptions;
use tokio::net::TcpListener;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::routes::create_routes;

mod routes;

mod auth;
mod common;
mod ws;

pub async fn run(database_url: String) -> Result<()> {
    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url.as_str())
        .await

        .map_err(|e| anyhow!("DB connection failed: {}", e))?;

    /*     sqlx::migrate!("./migrations")
      .run(&db_pool)
      .await
      .expect("Error running DB migrations");

     */

    let app = create_routes(db_pool).await?;

    let listener = TcpListener::bind(format!("0.0.0.0:{}", env::var("PORT").unwrap_or("3011".to_string())))
        .await
        .map_err(|e| anyhow!("Failed to bind address: {}", e))?;
    axum::serve(listener, app)
        .await
        .map_err(|e| anyhow!("Server error: {}", e))?;

    Ok(())
}
