use std::fs;
use std::ops::Deref;

use askama::Template;
use askama_axum::axum_core::response::IntoResponse;
use axum::{Extension, Router};
use axum::routing::get;
use crate::auth::error_handling::AppError;

use axum::extract::{Path, State};
use axum_extra::response::Html;
use comrak::{markdown_to_html, Options};
use http::StatusCode;
use sqlx::{PgPool, query};
use tracing::error;
use crate::routes::{AppState, UserData};

#[derive(Template,Clone)]
#[template(path = "docs/index.html")]
struct DocsTemplate {

    title: String,
    content:  String,
   changed_at: i64,
    changed_id: i64,
    changed_name: String


}



pub async fn docs(  Extension(user_data): Extension<Option<UserData>>,
                    Path(blob): Path<String>,
                     State(db_pool): State<PgPool>) -> Result<impl IntoResponse, AppError> {

    println!("{}", &blob);


    let docs_result = query!(
        r#"SELECT title,content, changed_at, changed_by FROM docs WHERE id=$1;"#,
        &blob
    )
        .fetch_one(&db_pool)
        .await
        .map_err(|e| AppError {
            code: StatusCode::NOT_FOUND,
            message: format!("GET Docs: No documentation entry with id {blob} was found: {e}"),
            user_message: format!("No user with id {blob} was found."),
        })?;











    Ok(DocsTemplate {
        title: docs_result.title,
        content: markdown_to_html(&*docs_result.content, &Options::default()) ,
        changed_at: docs_result.changed_at,
        changed_id: docs_result.changed_by,
        changed_name: "Author".to_string(),
    })
}

pub fn docs_router() -> Router<AppState> {
    Router::new()
        .route("/:blob", get(docs))

}