-- Add migration script here
-- Add migration script here

CREATE TABLE
    users
(
    id         BIGSERIAL PRIMARY KEY,
    email      text NOT NULL UNIQUE,
    avatar     text ,
    name       varchar(40)  NOT NULL,
    skill_0    smallint  default 0,
    skill_1    smallint  default 0,
    skill_2    smallint  default 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
    newspapers
(
    id         BIGSERIAL PRIMARY KEY,
    avatar     text        NOT NULL,
    name       varchar(40) NOT NULL,
    background text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE newspaper_ranks AS ENUM (
    'author','editor', 'owner');
CREATE TABLE
    journalists
(
    user_id      bigint,
    newspaper_id bigint,
    rank         newspaper_ranks,
    primary key (user_id, newspaper_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_newspaper_id FOREIGN KEY (newspaper_id) REFERENCES newspapers (id)
);

CREATE TABLE
    articles
(
    id           BIGSERIAL PRIMARY KEY,
    title        varchar(40) not null,
    content      text        NOT NULL,
    author_id    bigint      NOT NULL,
    newspaper_id bigint,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES users (id),
    CONSTRAINT fk_newspaper_id FOREIGN KEY (newspaper_id) REFERENCES newspapers (id)
);

CREATE TABLE
    upvotes
(
    user_id    bigint,
    article_id bigint,
    primary key (user_id, article_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_article_id FOREIGN KEY (article_id) REFERENCES articles (id)
);

CREATE TABLE
    vouchers
(
    id     BIGSERIAL PRIMARY KEY,
    code   varchar(20) not null UNIQUE,
    reward smallint    not null
);

CREATE TABLE
    used_vouchers
(
    user_id    bigint,
    voucher_id bigint,
    primary key (user_id, voucher_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_voucher_id FOREIGN KEY (voucher_id) REFERENCES vouchers (id)
);

CREATE TABLE
    user_sessions
(
    id               BIGSERIAL PRIMARY KEY,
    user_id          bigint NOT NULL,
    session_token_p1 text   NOT NULL,
    session_token_p2 text   NOT NULL,
    created_at       bigint NOT NULL,
    expires_at       bigint NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE
    oauth2_state_storage
(
    id                 bigSERIAL PRIMARY KEY,
    csrf_state         text NOT NULL,
    pkce_code_verifier text NOT NULL,
    return_url         text NOT NULL
);



--CREATE TYPE user_roles AS ENUM (
--  'user','moderator',  'admin');

/*
CREATE TYPE chat_type AS ENUM (
    'personal','team',  'region');



CREATE TABLE
    chats (
                      id BIGSERIAL PRIMARY KEY,
                      user_id bigint NOT NULL,
                      session_token_p1 text NOT NULL,
                      session_token_p2 text NOT NULL,
                      created_at bigint NOT NULL,
                      expires_at bigint NOT NULL,
                      CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);
*/

--personal
create table conversations
(
    user_id bigint,
    chat_id bigint,
    primary key (user_id, chat_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_article_id FOREIGN KEY (chat_id) REFERENCES articles (id)
);



create table docs (
                      id text primary key ,

                      title text NOT NULL,
                      content text NOT NULL,
                      changed_at  bigint NOT NULL,
                      changed_by bigint NOT NULL,

                      CONSTRAINT fk_user_id FOREIGN KEY (changed_by) REFERENCES users (id)
);