use std::{collections::HashMap, sync::Arc};

use askama::Template;
use askama_axum::Response;
use axum::{extract::{Extension, Path, State}, Form, http::StatusCode, response::{IntoResponse, Redirect}, Router, routing::get};
use axum::extract::WebSocketUpgrade;
use axum::extract::ws::{Message, WebSocket};
use futures::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, query};
use tokio::sync::{
    mpsc::{self, UnboundedReceiver, UnboundedSender},
    RwLock,
};

use crate::auth::error_handling::AppError;

use super::{AppState, UserData};

#[derive(Debug, Clone, Serialize)]
struct ChatPreview {
    id: i64,
    user_name: String,
    sent_date: String,
    user_avatar: String,
    //TODO: force user to set avatar
    message_preview: String,
}

#[derive(Template)]
#[template(path = "chat/index.html")]
struct ChatsTemplate {
    chats: Vec<ChatPreview>,
}

async fn chats(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    /*    let chats: Vec<ChatPreview> = query!(
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

    Ok(ChatsTemplate {
        chats: vec![ChatPreview {
            id: 0,
            user_name: "Johnny!".to_string(),
            sent_date: "20.12.2023".to_string(),
            user_avatar: "Johnndwy!".to_string(),
            message_preview: "Can we order pizza?".to_string(),
        }]
    })
}

#[derive(Template)]
#[template(path = "chat/user.html")]
struct UserChatTemplate {
    user_name:String
}

async fn chat_user(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
    Path(user_id): Path<i64>,
) -> Result<impl IntoResponse, AppError> {
    let user_data = user_data.unwrap();

    if user_data.id == user_id {
        return Ok(Redirect::to("/chat").into_response());
    }

    let user = query!(
        r#"SELECT name, avatar FROM users WHERE id=$1;"#,
        &user_id
    )
        .fetch_one(&db_pool)
        .await
        .map_err(|e| AppError {
            code: StatusCode::NOT_FOUND,
            message: format!("GET Profile: No user with id {user_id} was found: {e}"),
            user_message: format!("No user with id {user_id} was found."),
        })?;


    /*    let chats: Vec<ChatPreview> = query!(
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

    Ok(UserChatTemplate {
        user_name: user.name.unwrap_or("USERNAME".to_string()),
    }.into_response())
}


#[derive(Template)]
#[template(path = "chat/team.html")]
struct TeamChatTemplate {}

async fn chat_team(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    /*    let chats: Vec<ChatPreview> = query!(
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

    Ok(TeamChatTemplate {})
}


#[derive(Template)]
#[template(path = "chat/region.html")]
struct RegionChatTemplate {}

async fn chat_region(
    Extension(user_data): Extension<Option<UserData>>,
    State(db_pool): State<PgPool>,
) -> Result<impl IntoResponse, AppError> {
    /*    let chats: Vec<ChatPreview> = query!(
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

    Ok(RegionChatTemplate {})
}


/*
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
    let tmpl = env.get_template("chat/create.html")?;
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
    let tmpl = env.get_template("chat/edit.html")?;
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
    let tmpl = env.get_template("chat/region.html")?;

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
) -> Result<impl IntoResponse, AppError> {
    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("chat/remove_upvote.html")?;

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
) -> Result<impl IntoResponse, AppError> {
    //TODO instead of view, just go with ifs in template?
    let tmpl = env.get_template("chat/upvote.html")?;

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
*/


// The list of users needs to be a hashmap that can be shared safely across threads, hence an Arc with RwLock
type Users = Arc<RwLock<HashMap<usize, UnboundedSender<Message>>>>;

static NEXT_USERID: std::sync::atomic::AtomicUsize = std::sync::atomic::AtomicUsize::new(1);

#[derive(Serialize, Deserialize)]
struct Msg {
    name: String,
    uid: Option<usize>,
    message: String,
}


async fn ws_handler(ws: WebSocketUpgrade,
                    Extension(state): Extension<Users>,
                    Path(receiver_id): Path<i64>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state,
                                         //     receiver_id
    ))
}

async fn handle_socket(stream: WebSocket, state: Users,
                       //   receiver_id: i64
) {
    println!("WS");
    // When a new user enters the chat (opens the websocket connection), assign them a user ID
    let my_id = NEXT_USERID.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
    // By splitting the websocket into a receiver and sender, we can send and receive at the same time.
    let (mut sender, mut receiver) = stream.split();

    // Create a new channel for async task management
    let (tx, mut rx): (UnboundedSender<Message>, UnboundedReceiver<Message>) =
        mpsc::unbounded_channel();

    // If a message has been received, send the message (expect on error)
    tokio::spawn(async move {
        // If a message has been received, send a message
        while let Some(msg) = rx.recv().await {
            sender.send(msg).await.expect("Error while sending message");
        }
        sender.close().await.unwrap();
    });

    // insert the message into the HashMap - locks the Arc value to allow writing
    state.write().await.insert(my_id, tx);

    // if there's a message and the message is OK, broadcast it along all available open websocket connections
    while let Some(Ok(result)) = receiver.next().await {
        println!("{:?}", result);
        if let Ok(result) = enrich_result(result, my_id) {
            println!("ress");
            broadcast_msg(result, &state).await;
        }
    }

    // This client disconnected
    disconnect(my_id, &state).await;
}

// If the message is a websocket message and no errors, return it - else, return Ok(result)
// which is required by the server to be able to broadcast the message
fn enrich_result(result: Message, id: usize) -> Result<Message, serde_json::Error> {
    match result {
        Message::Text(msg) => {
            println!("match msg");
            let mut msg: Msg = serde_json::from_str(&msg)?;
            println!("match id");
            msg.uid = Some(id);
            println!("match id2");
            let msg = serde_json::to_string(&msg)?;
            println!("match id3");
            Ok(Message::Text(msg))
        }
        _ => Ok(result),
    }
}

// Send received websocket message out to all open available WS connections
async fn broadcast_msg(msg: Message, users: &Users) {
    println!("broadcast msg");
    if let Message::Text(msg) = msg {
        for (&uid, tx) in users.read().await.iter() {

            tx.send(Message::Text(format!("<div hx-swap-oob='beforeend:#chat_messages'><p><b>{:?}</b>{:?}: {:?}</p></div>", &msg,uid, msg).to_owned()
            )
            )
                .expect("Failed to send Message")
        }
    }
}

// Disconnect a user manually - this is for admin purposes, eg if someone is being offensive in the chat
// you will want to be able to kick them out
async fn disconnect_user(
    Path(user_id): Path<usize>,
    Extension(users): Extension<Users>,
) -> impl IntoResponse {
    disconnect(user_id, &users).await;
    "Done"
}

// triggered when any user disconnects
async fn disconnect(my_id: usize, users: &Users) {
    println!("Good bye user {}", my_id);
    users.write().await.remove(&my_id);
    println!("Disconnected {my_id}");
}

// handle internal server errors
async fn handle_error(err: std::io::Error) -> impl IntoResponse {
    (StatusCode::INTERNAL_SERVER_ERROR, format!("{:?}", err))
}


pub fn chat_router() -> Router<AppState> {
    let users = Users::default();

    Router::new()
        .route("/", get(chats))
        .route("/team", get(chat_team))
        .route("/en", get(chat_region))
        .route("/:id/ws", get(ws_handler))
        .route("/:id", get(chat_user))

        .layer(Extension(users))
    /*    .route("/ws", get(create_chat).post(publish_chat))

     */
}


