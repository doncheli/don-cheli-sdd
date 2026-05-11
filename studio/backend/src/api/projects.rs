use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::Deserialize;
use std::sync::Arc;

use crate::AppState;
use crate::db::Project;

#[derive(Deserialize)]
pub struct CreateProject {
    pub name: String,
    pub path: String,
}

pub async fn list(State(state): State<Arc<AppState>>) -> Result<Json<Vec<Project>>, StatusCode> {
    state.db.list_projects().map(Json).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn get_one(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<Json<Project>, StatusCode> {
    state
        .db
        .get_project(&id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

pub async fn create(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateProject>,
) -> Result<(StatusCode, Json<Project>), StatusCode> {
    // Validate path exists
    if !std::path::Path::new(&payload.path).is_dir() {
        return Err(StatusCode::BAD_REQUEST);
    }
    state
        .db
        .create_project(&payload.name, &payload.path)
        .map(|p| (StatusCode::CREATED, Json(p)))
        .map_err(|_| StatusCode::CONFLICT)
}

pub async fn delete(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> StatusCode {
    match state.db.delete_project(&id) {
        Ok(true) => StatusCode::NO_CONTENT,
        Ok(false) => StatusCode::NOT_FOUND,
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
}
