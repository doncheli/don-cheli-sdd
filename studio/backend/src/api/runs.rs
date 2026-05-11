use axum::{Json, extract::{Path, Query, State}, http::StatusCode};
use serde::Deserialize;
use std::sync::Arc;
use crate::AppState;
use crate::db::{PipelineRun, PhaseRecord};

#[derive(Deserialize)]
pub struct RunsQuery {
    pub status: Option<String>,
}

pub async fn list_active(State(state): State<Arc<AppState>>) -> Result<Json<Vec<PipelineRun>>, StatusCode> {
    state.db.list_active_runs().map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn list_today(State(state): State<Arc<AppState>>) -> Result<Json<Vec<PipelineRun>>, StatusCode> {
    state.db.list_today_runs().map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn get_run(State(state): State<Arc<AppState>>, Path(run_id): Path<String>) -> Result<Json<PipelineRun>, StatusCode> {
    state.db.get_run(&run_id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?.map(Json).ok_or(StatusCode::NOT_FOUND)
}

pub async fn get_run_phases(State(state): State<Arc<AppState>>, Path(run_id): Path<String>) -> Result<Json<Vec<PhaseRecord>>, StatusCode> {
    state.db.get_phases_for_run(&run_id).map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn retry_phase(State(state): State<Arc<AppState>>, Path((run_id, phase_id)): Path<(String, i64)>) -> Result<Json<serde_json::Value>, StatusCode> {
    // Reset the phase to pending and increment attempt
    state.db.retry_phase(phase_id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    // Reset run status to running
    state.db.update_run(&run_id, "running", None, None).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // Re-trigger pipeline from this phase
    let run = state.db.get_run(&run_id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?.ok_or(StatusCode::NOT_FOUND)?;
    let project = state.db.get_project(&run.project_id).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?.ok_or(StatusCode::NOT_FOUND)?;

    let tx = state.tx.clone();
    let task = run.task.clone();
    let provider = run.provider.clone();
    let model = run.model.clone();
    let path = project.path.clone();

    tokio::spawn(async move {
        crate::runtime::bridge::run_pipeline(&path, &task, &provider, &model, true, None, tx).await;
    });

    Ok(Json(serde_json::json!({ "status": "retrying", "phase_id": phase_id })))
}

pub async fn list_project_runs(State(state): State<Arc<AppState>>, Path(project_id): Path<String>) -> Result<Json<Vec<PipelineRun>>, StatusCode> {
    state.db.get_runs_for_project(&project_id).map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
