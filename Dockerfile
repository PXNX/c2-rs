# Leveraging the pre-built Docker images with 
# cargo-chef and the Rust toolchain
FROM lukemathwalker/cargo-chef:latest-rust-1.74.0 AS chef
WORKDIR /app
COPY ./assets ./media

FROM chef AS planner
COPY . .

RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --recipe-path recipe.json

COPY . .

#RUN cargo install sqlx-cli && cargo sqlx prepare
RUN cargo build #--release --locked

FROM rust:1.74-slim AS template-rust
COPY --from=builder /app/target/debug/c2 /usr/local/bin
COPY --from=builder app/assets /usr/local/assets
ENTRYPOINT ["/usr/local/bin/c2"]