/*use askama::Template;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{sse::Event, IntoResponse, Sse, Response},
    routing::{delete, get},
    Extension, Form, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;
use std::convert::Infallible;
use std::time::Duration;
use tokio::sync::broadcast::{channel, Sender};
use tokio_stream::wrappers::BroadcastStream;
use tokio_stream::{Stream, StreamExt as _};
use crate::routes::AppState;

pub type TodosStream = Sender<TodoUpdate>;

#[derive(Clone, Serialize, Debug)]
pub enum MutationKind {
    Create,
    Delete,
}

#[derive(Clone, Serialize, Debug)]
pub struct TodoUpdate {
    mutation_kind: MutationKind,
    id: i32,
}

#[derive(sqlx::FromRow, Serialize, Deserialize)]
struct Todo {
    id: i32,
    description: String,
}

#[derive(sqlx::FromRow, Serialize, Deserialize)]
struct TodoNew {
    description: String,
}


pub(crate) async fn stream() -> impl IntoResponse {
    StreamTemplate
}

pub(crate) async fn fetch_todos(State(db_pool): State<PgPool>) -> impl IntoResponse {
    let todos = sqlx::query_as::<_, Todo>("SELECT * FROM TODOS")
        .fetch_all(&db_pool)
        .await
        .unwrap();

    Records { todos }
}


pub(crate) async fn create_todo(
    State(db_pool): State<PgPool>,
    Extension(tx): Extension<TodosStream>,
    Form(form): Form<TodoNew>,
) -> impl IntoResponse {
    let todo = sqlx::query_as::<_, Todo>(
        "INSERT INTO TODOS (description) VALUES ($1) RETURNING id, description",
    )
        .bind(form.description)
        .fetch_one(&db_pool)
        .await
        .unwrap();

    if tx.send(TodoUpdate {
        mutation_kind: MutationKind::Create,
        id: todo.id,
    }).is_err() {
        eprintln!("Record with ID {} was created but nobody's listening to the stream!", todo.id);
    }

    TodoNewTemplate { todo }
}

pub(crate) async fn delete_todo(
    State(db_pool): State<PgPool>,
    Path(id): Path<i32>,
    Extension(tx): Extension<TodosStream>,
) -> impl IntoResponse {
    sqlx::query("DELETE FROM TODOS WHERE ID = $1")
        .bind(id)
        .execute(&db_pool)
        .await
        .unwrap();

    if tx.send(TodoUpdate {
        mutation_kind: MutationKind::Delete,
        id,
    }).is_err() {
        eprintln!("Record with ID {} was deleted but nobody's listening to the stream!", id);
    }

    StatusCode::OK
}


#[derive(Template)]
#[template(path = "/todo/stream.html")]
struct StreamTemplate;

#[derive(Template)]
#[template(path = "/todo/todos.html")]
struct Records {
    todos: Vec<Todo>,
}

#[derive(Template)]
#[template(path = "/todo/todo.html")]
struct TodoNewTemplate {
    todo: Todo,
}

pub async fn handle_stream(
    Extension(tx): Extension<TodosStream>,
) -> Sse<impl Stream<Item=Result<Event, Infallible>>> {
    let rx = tx.subscribe();

    let stream = BroadcastStream::new(rx);

    Sse::new(
        stream
            .map(|msg| {
                let msg = msg.unwrap();
                let json = format!("<div>{}</div>", json!(msg));
                Event::default().data(json)
            })
            .map(Ok),
    )
        .keep_alive(
            axum::response::sse::KeepAlive::new()
                .interval(Duration::from_secs(600))
                .text("keep-alive-text"),
        )
}*/