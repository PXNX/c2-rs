#![allow(unused)]

use anyhow::{anyhow, Result};
use dotenvy::{dotenv, var};
use tracing_subscriber::layer::SubscriberExt;
use tracing_subscriber::util::SubscriberInitExt;

use c2::run;


#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

 /*   tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "example_validator=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

  */



    tracing_subscriber::fmt::init();

    let database_url =
        var("DATABASE_URL").map_err(|e| anyhow!("Failed to get DATABASE_URL: {}", e))?;
    run(database_url).await
}
