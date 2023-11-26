use axum::extract::Path;
use axum::response::Redirect;
use axum::routing::{get, put};
use axum::{
    extract::{Extension, State},
    response::{Html, IntoResponse},
};
use axum::{Form, Router};
use minijinja::{context, Environment};
use serde::{Deserialize, Serialize};
use sqlx::{query, Executor, PgPool};

use crate::auth::error_handling::AppError;
use crate::common::tools::format_date;

use super::{AppState, UserData};

#[derive(Debug, Clone, Serialize)]
struct ArticlePreview {
    id: i64,
    title: String,
    upvote_count: i64,
    publish_date: String,
    author_avatar: Option<String>,
    //TODO: force user to set avatar
    author_name: String,
}

async fn chats(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("inbox/index.html")?;
    /*
       let chats: Vec<ArticlePreview> = query!(
           r#"SELECT chats.id,
           chats.title,
           chats.created_at,
           COALESCE(newspapers.name, users.name)     AS author_name,
           COALESCE(newspapers.avatar, users.avatar) AS author_avatar,
           COALESCE(uv.upvote_count,0) AS upvote_count
    FROM chats
             LEFT OUTER JOIN newspapers ON (chats.newspaper_id = newspapers.id)
             INNER JOIN users ON (chats.author_id = users.id)
             LEFT JOIN (SELECT chat_id, count(*) upvote_count
                        FROM upvotes
                        GROUP BY chat_id) as uv
                       ON uv.chat_id = chats.id
    ORDER BY chats.created_at DESC
    LIMIT 30;"#,
       )
       .fetch_all(&db_pool)
       .await?
       .iter()
       .map(|a| {
           ArticlePreview {
               id: a.id,
               title: a.title.clone(),

               publish_date: format_date(a.created_at),
               upvote_count: a.upvote_count.unwrap(),
               author_avatar: a.author_avatar.clone(),
               author_name: a.author_name.clone().unwrap(), //TODO: unwrap is not necessary, after making title not null in sql
           }
       })
       .collect(); */

    let content = tmpl.render(context!(
        user_id =>  user_data.unwrap().id,
      //  chats => chats,
    ))?;
    Ok(Html(content))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct CreateArticle {
    chat_title: String,
    chat_content: String,
    publisher: Option<i64>,
}

async fn publish_chat(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Form(input): Form<CreateArticle>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;
    /*
    let query = query!(
        r#"INSERT INTO chats (author_id,title,content,newspaper_id)
    VALUES ($1,$2,$3, $4) returning id;"#,
        user_id,
        input.chat_title,
        input.chat_content,
        input.publisher
    )
    .fetch_one(&db_pool)
    .await?; */

    Ok(Redirect::to(format!("/a/{}", user_id).as_str()))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Newspaper {
    newspaper_name: String,
    newspaper_id: i64,
}

async fn create_chat(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("inbox/create.html")?;
    let user_id = user_data.unwrap().id;

    /*     let newspapers: Vec<Newspaper> = query!(
           r#"SELECT
        newspapers.name ,
       newspapers.id

    FROM
       journalists
           LEFT OUTER JOIN newspapers ON (newspaper_id =newspapers.id) where user_id = $1;"#,
           &user_id
       )
       .fetch_all(&db_pool)
       .await?
       .iter()
       .map(|n| Newspaper {
           newspaper_name: n.name.to_owned(),
           newspaper_id: n.id,
       })
       .collect();  */

    let content = tmpl.render(context!(user_id => user_id,
        // newspapers => newspapers
    ))?;
    Ok(Html(content))
}

async fn edit_chat(
    Extension(user_data): Extension<Option<UserData>>,
    Path(chat_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let tmpl = env.get_template("inbox/edit.html")?;
    let user_id = user_data.unwrap().id;

    /* let chat = query!(
           r#"SELECT content

    FROM
       chats where id = $1;"#,
           &chat_id
       )
       .fetch_one(&db_pool)
       .await?; */

    let content = tmpl.render(context!(user_id => user_id,
        // chat_content=>chat.content
    ))?;
    Ok(Html(content))
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct EditArticle {
    chat_content: String,
}

async fn save_chat(
    Extension(user_data): Extension<Option<UserData>>,
    Path(chat_id): Path<i64>,
    State(db_pool): State<PgPool>,
    Form(input): Form<EditArticle>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    //todo: check if user is editor/owner
    /*
      let query = query!(
          r#"UPDATE chats SET content = $1
    where id = $2;"#,
          input.chat_content,
          &chat_id
      )
      .execute(&db_pool)
      .await?; */

    Ok(Redirect::to(format!("/a/{}", chat_id).as_str()))
}

async fn chat(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Path(chat_id): Path<i64>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    let user_id = user_data.unwrap().id;

    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("inbox/view.html")?;

    /*  let chat = query!(r#"SELECT
       chats.id,
       chats.title,
       chats.created_at,
       chats.content,
       chats.author_id,
       chats.newspaper_id,
       CASE WHEN  newspapers.name is NULL THEN users.name ELSE  newspapers.name END AS author_name,
       CASE WHEN   newspapers.avatar  is NULL THEN   users.avatar ELSE  newspapers.avatar END AS author_avatar,
       exists(select 1 from upvotes where chat_id = chats.id and user_id = $1) as has_upvoted
    FROM
       chats
           LEFT OUTER JOIN newspapers ON (chats.newspaper_id =newspapers.id)
            INNER JOIN users ON (chats.author_id = users.id) where chats.id = $2;"#, &user_id, chat_id)
           .fetch_one(&db_pool)
           .await?;

       let author_link = match chat.newspaper_id {
           Some(newspaper_id) => format!("/n/{}", newspaper_id),
           None => format!("/u/{}", chat.author_id),
       };
    */
    let content = tmpl.render(context!(user_id => user_id,
     chat_id=>chat_id,
    /*  chat_title => chat.title,
       chat_content=>chat.content,
     publish_date => format_date(chat.created_at),
       author_name=>chat.author_name,
       author_avatar => chat.author_avatar,
       author_link =>   author_link,
       author_id => chat.author_id,
       has_upvoted => chat.has_upvoted */
     ))?;
    Ok(Html(content))
}

async fn upvote_chat(
    Extension(user_data): Extension<Option<UserData>>,
    Path(chat_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("inbox/remove_upvote.html")?;

    /*   query!(
        r#"INSERT INTO upvotes ( user_id,chat_id)
    VALUES ($1,$2)
    ON CONFLICT DO Nothing; "#,
        user_data.unwrap().id,
        chat_id,
    )
    .execute(&db_pool)
    .await?; */

    let content = tmpl.render(context!(   chat_id =>    chat_id,
    ))?;
    Ok(Html(content))
}

async fn remove_upvote(
    Extension(user_data): Extension<Option<UserData>>,
    Path(chat_id): Path<i64>,
    State(db_pool): State<PgPool>,
    State(env): State<Environment<'static>>,
) -> Result<impl IntoResponse, AppError> {
    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("inbox/upvote.html")?;

    /*  query!(
            r#"delete from upvotes
    where user_id = $1 and chat_id = $2;"#,
            user_data.unwrap().id,
            chat_id,
        )
        .execute(&db_pool)
        .await?;
     */
    let content = tmpl.render(context!( chat_id =>    chat_id,
    ))?;
    Ok(Html(content))
}

pub fn inbox_router() -> Router<AppState> {
    Router::new()
        .route("/", get(chats))
        .route("/:id", get(chat))
        .route("/ws", get(create_chat).post(publish_chat))
}
