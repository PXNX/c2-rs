CREATE TABLE
    users
(
    id    BIGSERIAL PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name varchar(40)
);

CREATE TABLE
    user_sessions
(
    id               BIGSERIAL PRIMARY KEY,
    user_id          bigint NOT NULL,
    session_token_p1 text   NOT NULL,
    session_token_p2 text   NOT NULL,
    created_at       bigint NOT NULL,
    expires_at       bigint NOT NULL
);

CREATE TABLE
    oauth2_state_storage
(
    id                 bigSERIAL PRIMARY KEY,
    csrf_state         text NOT NULL,
    pkce_code_verifier text NOT NULL,
    return_url         text NOT NULL
);