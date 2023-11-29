use sqlx::postgres::PgPoolOptions;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod routes;

mod auth;
mod common;

pub async fn run(database_url: String) -> Result<(), Box<dyn std::error::Error>> {
    /*  tracing_subscriber::registry()
            .with(
                tracing_subscriber::EnvFilter::try_from_default_env()
                    .unwrap_or_else(|_| "example_validator=debug".into()),
            )
            .with(tracing_subscriber::fmt::layer())
            .init();
    */
    tracing_subscriber::fmt::init();

    let db_pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(database_url.as_str())
        .await
        .map_err(|e| format!("DB connection failed: {}", e))?;

    /*     sqlx::migrate!("./migrations")
      .run(&db_pool)
      .await
      .expect("Error running DB migrations");

     */

      let app = routes::create_routes(db_pool).await?;

      let listener = tokio::net::TcpListener::bind("0.0.0.0:3011")
          .await
          .map_err(|e| format!("Failed to bind address: {}", e))?;
      axum::serve(listener, app)
          .await
          .map_err(|e| format!("Server error: {}", e))?;

      Ok(())
  }
