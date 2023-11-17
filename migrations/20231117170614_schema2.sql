-- Add migration script here
-- Add migration script here
CREATE TABLE
    users (
        id BIGSERIAL PRIMARY KEY,
        email text NOT NULL UNIQUE,
        avatar text,
        name varchar(40),
        skill_0 smallint default 0,
        skill_1 smallint default 0,
        skill_2 smallint default 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    newspapers (
        id BIGSERIAL PRIMARY KEY,
        avatar text NOT NULL,
        name varchar(40) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    articles (
        id BIGSERIAL PRIMARY KEY,
        title varchar(40) not null,
        content text NOT NULL,
        author_id bigint NOT NULL,
        newspaper_id bigint,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES users (id),
        CONSTRAINT fk_newspaper_id FOREIGN KEY (newspaper_id) REFERENCES newspapers (id)
    );

CREATE TABLE
    user_sessions (
        id BIGSERIAL PRIMARY KEY,
        user_id bigint NOT NULL,
        session_token_p1 text NOT NULL,
        session_token_p2 text NOT NULL,
        created_at bigint NOT NULL,
        expires_at bigint NOT NULL,
        CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
    );

CREATE TABLE
    oauth2_state_storage (
        id bigSERIAL PRIMARY KEY,
        csrf_state text NOT NULL,
        pkce_code_verifier text NOT NULL,
        return_url text NOT NULL
    );