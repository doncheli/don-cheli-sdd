mod api;
mod db;
mod runtime;
mod state;
mod ws;

use axum::{Router, routing::get, routing::post};
use std::sync::Arc;
use tokio::sync::broadcast;
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;
use tracing_subscriber::EnvFilter;

pub struct AppState {
    pub db: db::Database,
    pub tx: broadcast::Sender<ws::WsMessage>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let db = db::Database::new("studio.db")?;
    db.migrate()?;

    let (tx, _rx) = broadcast::channel::<ws::WsMessage>(256);

    let shared_state = Arc::new(AppState { db, tx });

    let api_routes = Router::new()
        .route("/projects", get(api::projects::list).post(api::projects::create))
        .route("/projects/{id}", get(api::projects::get_one).delete(api::projects::delete))
        .route("/pipeline/{project_id}/start", post(api::pipeline::start))
        .route("/pipeline/{project_id}/stop", post(api::pipeline::stop))
        .route("/pipeline/{project_id}/status", get(api::pipeline::status))
        .route("/pipeline/{project_id}/phases", get(api::phases::list))
        .route("/pipeline/{project_id}/artifacts", get(api::artifacts::list))
        .route("/pipeline/{project_id}/artifacts/{artifact_type}/{name}", get(api::artifacts::get_content))
        .route("/pipeline/{project_id}/costs", get(api::costs::estimate))
        .route("/pipeline/{project_id}/costs/history", get(api::costs::history))
        .route("/pipeline/{project_id}/diagnosis", get(api::pipeline::diagnosis))
        .route("/pipeline/{project_id}/retry", post(api::pipeline::retry_failed))
        .route("/runs/active", get(api::runs::list_active))
        .route("/runs/today", get(api::runs::list_today))
        .route("/runs/{run_id}", get(api::runs::get_run))
        .route("/runs/{run_id}/phases", get(api::runs::get_run_phases))
        .route("/runs/{run_id}/phases/{phase_id}/retry", post(api::runs::retry_phase))
        .route("/runs/project/{project_id}", get(api::runs::list_project_runs))
        .route("/filesystem/browse", get(api::filesystem::browse))
        .route("/filesystem/browse-files", get(api::filesystem::browse_files))
        .route("/filesystem/read-file", get(api::filesystem::read_file))
        .route("/filesystem/mkdir", post(api::filesystem::create_dir));

    let app = Router::new()
        .nest("/api", api_routes)
        .route("/ws/{project_id}", get(ws::stream::ws_handler))
        .fallback_service(ServeDir::new("../frontend/dist"))
        .layer(CorsLayer::permissive())
        .with_state(shared_state);

    let port = std::env::var("DC_STUDIO_PORT")
        .unwrap_or_else(|_| "3847".to_string())
        .parse::<u16>()
        .unwrap_or(3847);

    let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{}", port)).await?;
    tracing::info!("Don Cheli Studio running at http://localhost:{}", port);

    // Auto-open browser
    if std::env::var("DC_NO_OPEN").is_err() {
        let _ = open::that(format!("http://localhost:{}", port));
    }

    axum::serve(listener, app).await?;
    Ok(())
}
