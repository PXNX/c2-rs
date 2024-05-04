use std::collections::BTreeMap;

use askama::Template;
use axum::{async_trait, extract::{Request, State}, Form, middleware::Next, response::{IntoResponse, Redirect}};
use axum::body::Body;
use axum::extract::FromRequest;
use axum::extract::rejection::FormRejection;
use axum::response::Response;
use axum_extra::{headers::Cookie, TypedHeader};
use axum_htmx::{HX_RESWAP, HX_RETARGET};
use chrono::Utc;
use http::{HeaderMap, StatusCode};
use serde::de::DeserializeOwned;
use sqlx::PgPool;
use thiserror::Error;
use tracing::error;
use validator::{Validate, ValidationErrors};

use crate::auth::SESSION_TOKEN;
use crate::routes::UserData;

use super::error_handling::AppError;

pub async fn inject_user_data(
    State(db_pool): State<PgPool>,
    cookie: Option<TypedHeader<Cookie>>,
    mut request: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, AppError> {
    println!("\x1b[93minject_user_data :::\x1b[0m");

    if let Some(cookie) = cookie {
        println!("\x1b[93minject_user_data : COOKIE {:?}\x1b[0m",cookie);

        if let Some(session_token) = cookie.get(SESSION_TOKEN) {
            println!("\x1b[93minject_user_data : SESSION_TOKEN {session_token}\x1b[0m");


            let session_token: Vec<&str> = session_token.split('_').collect();
            let session_query: Result<(i64, i64, String), _> = sqlx::query_as(
                r#"SELECT user_id,expires_at,session_token_p2 FROM user_sessions WHERE session_token_p1=$1;"#,
            )
                .bind(session_token[0])
                .fetch_one(&db_pool)
                .await;

            if let Ok(query) = session_query {
                println!("\x1b[93minject_user_data : SESSION QUERY\x1b[0m");


                if let Ok(session_token_p2_db) = query.2.as_bytes().try_into() {
                    println!("\x1b[93minject_user_data : session_token_p2_db\x1b[0m");


                    if let Ok(session_token_p2_cookie) = session_token
                        .get(1)
                        .copied()
                        .unwrap_or_default()
                        .as_bytes()
                        .try_into()
                    {
                        println!("\x1b[93minject_user_data : session_token_p2_cookie\x1b[0m");

                        if constant_time_eq::constant_time_eq_n::<36>(
                            session_token_p2_cookie,
                            session_token_p2_db,
                        ) {
                            println!("\x1b[93minject_user_data : constant_time_eq_n\x1b[0m");

                            let user_id = query.0;
                            let expires_at = query.1;
                            if expires_at > Utc::now().timestamp() {
                                request.extensions_mut().insert(Some(UserData {
                                    id: user_id,

                                }));


                                println!("\x1b[93minject_user_data : USER FOUND\x1b[0m");
                            }
                        }else{
                            println!("\x1b[93minject_user_data : FAIL constant_time_eq_n\x1b[0m");
                        }
                    }else{
                        println!("\x1b[93minject_user_data : FAIL session_token_p2_cookie\x1b[0m");
                    }
                }else{
                    println!("\x1b[93minject_user_data : FAIL session_token_p2_db\x1b[0m");
                }
            }else{
                println!("\x1b[93minject_user_data : FAIL SESSION QUERY\x1b[0m");
            }
        }else {
            println!("\x1b[93minject_user_data : FAIL SESSION_TOKEN\x1b[0m");

        }
    }

    Ok(next.run(request).await)
}


pub async fn check_auth(request: Request<Body>, next: Next) -> Result<impl IntoResponse, AppError> {
    if request
        .extensions()
        .get::<Option<UserData>>()
        .ok_or("check_auth: extensions have no UserData")?
        .is_some()
    {
        println!("\x1b[93mcheck_auth : YES\x1b[0m");
        Ok(next.run(request).await)
    } else {
        println!("\x1b[93mcheck_auth : REDIRECT {:#?}\x1b[0m", request.extensions() .get::<Option<UserData>>()
            .ok_or("check_auth: extensions have no UserData")?);
        let login_url = "/login?next=".to_owned() + &*request.uri().to_string();
        Ok(Redirect::to(login_url.as_str()).into_response())
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub struct ValidatedForm<T>(pub T);

#[async_trait]
impl<T, S> FromRequest<S> for ValidatedForm<T>
    where
        T: DeserializeOwned + Validate,
        S: Send + Sync,
        Form<T>: FromRequest<S, Rejection=FormRejection>,
{
    type Rejection = Response;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let Form(value) = Form::<T>::from_request(req, state).await.unwrap();
        match value.validate() {
            Ok(_) => Ok(ValidatedForm(value)),
            Err(e) => {
                let e: ValidationErrors = e;

                let line = stringify!(value);

                let start_bytes = line.find(".").unwrap_or(0) + 1; //index where "pattern" starts
                // or beginning of line if
                // "pattern" not found
                let end_bytes = line.find(":").unwrap_or(line.len()); //index where "<" is found
                // or end of line

                let result = &line[start_bytes..end_bytes];

                //  e.field_errors().keys().iterator().next(); //.join(";")

                //  ValidationErrors::new()

                //   let elem: &str = stringify!(input.user_avatar).split_once(':').unwrap().rsplit_once(".").unwrap();

                let mut headers = HeaderMap::new();
                //   headers.insert(HX_TRIGGER, "close".parse().unwrap());
                headers.insert(HX_RETARGET, format!(r#"input[name="{}"]"#, &e.field_errors().keys().map(|s| &**s).collect::<Vec<_>>().join(r#""],input[name=""#)).to_string().parse().unwrap());
                headers.insert(HX_RESWAP, "afterend".parse().unwrap());
                //  headers.insert(StatusCode::CREATED)


                let mut txt: String = "".to_string();

                for x in e.field_errors() {
                    txt += &*format!(r#" <span class="label label-text-alt text-error">{}</span>"#, x.1[0].message.as_ref().unwrap())
                }

                return Err((headers, txt).into_response())
                ;

                /*        Err(ProfileSettingsInputWrongTemplate {
                            user_name: "dd".to_string(),
                            user_avatar: "d".to_string(),
                            error_message: "ddddd".to_string(),
                        }.render().unwrap()) */
            }
        }
    }
}

#[derive(Debug, Error)]
pub enum ServerError {
    #[error(transparent)]
    ValidationError(#[from] ValidationErrors),

    #[error(transparent)]
    AxumFormRejection(#[from] FormRejection),
}

impl IntoResponse for ServerError {
    fn into_response(self) -> Response {
        match self {
            ServerError::ValidationError(_) => {
                let message = format!("Input validation error: [{self}]").replace('\n', ", ");
                (StatusCode::BAD_REQUEST, message)
            }
            ServerError::AxumFormRejection(_) => (StatusCode::BAD_REQUEST, self.to_string()),
        }
            .into_response()
    }
}

#[derive(Template)]
#[template(path = "user/partial/settings_edit.html")]
struct ProfileSettingsInputWrongTemplate<'a> {
    user_name: String,
    user_avatar: String,

    errors: &'a BTreeMap<String, String>,
}