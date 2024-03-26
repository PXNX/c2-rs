#![allow(unused)]

use anyhow::{anyhow, Result};
use dotenvy::{dotenv, var};
use tracing_subscriber::EnvFilter;
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use c2::run;


#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    tracing_subscriber::registry()
        .with(EnvFilter::new(std::env::var("RUST_LOG").unwrap_or_else(
            |_| "axum_login=debug,tower_sessions=debug,sqlx=warn,tower_http=debug".into(),
        )))
        .with(tracing_subscriber::fmt::layer())
        .try_init()?;


    let database_url =
        var("DATABASE_URL").map_err(|e| anyhow!("Failed to get DATABASE_URL: {}", e))?;
    run(database_url).await
}
