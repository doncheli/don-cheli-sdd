use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::Serialize;
use std::sync::Arc;

use crate::AppState;

#[derive(Serialize)]
pub struct ArtifactInfo {
    #[serde(rename = "type")]
    pub artifact_type: String,
    pub name: String,
    pub path: String,
    pub phase: String,
    pub size_bytes: u64,
}

#[derive(Serialize)]
pub struct ArtifactContent {
    pub name: String,
    pub content: String,
    #[serde(rename = "type")]
    pub artifact_type: String,
}

const ARTIFACT_DIRS: &[(&str, &str, &str)] = &[
    ("spec", ".dc/specs", "specify"),
    ("blueprint", ".dc/blueprints", "plan"),
    ("task", ".dc/tareas", "breakdown"),
    ("review", ".dc/reviews", "review"),
    ("coverage", "coverage", "implement"),
    ("test", "test", "implement"),
];

pub async fn list(
    State(state): State<Arc<AppState>>,
    Path(project_id): Path<String>,
) -> Result<Json<Vec<ArtifactInfo>>, StatusCode> {
    let project = state
        .db
        .get_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let mut artifacts = Vec::new();

    for (artifact_type, dir, phase) in ARTIFACT_DIRS {
        let full_path = format!("{}/{}", project.path, dir);
        if let Ok(entries) = std::fs::read_dir(&full_path) {
            for entry in entries.flatten() {
                if let Ok(meta) = entry.metadata() {
                    if meta.is_file() {
                        artifacts.push(ArtifactInfo {
                            artifact_type: artifact_type.to_string(),
                            name: entry.file_name().to_string_lossy().to_string(),
                            path: entry.path().to_string_lossy().to_string(),
                            phase: phase.to_string(),
                            size_bytes: meta.len(),
                        });
                    }
                }
            }
        }
    }

    Ok(Json(artifacts))
}

pub async fn get_content(
    State(state): State<Arc<AppState>>,
    Path((project_id, artifact_type, name)): Path<(String, String, String)>,
) -> Result<Json<ArtifactContent>, StatusCode> {
    let project = state
        .db
        .get_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let dir = ARTIFACT_DIRS
        .iter()
        .find(|(t, _, _)| *t == artifact_type)
        .map(|(_, d, _)| *d)
        .ok_or(StatusCode::BAD_REQUEST)?;

    let file_path = format!("{}/{}/{}", project.path, dir, name);
    let content = std::fs::read_to_string(&file_path).map_err(|_| StatusCode::NOT_FOUND)?;

    Ok(Json(ArtifactContent {
        name,
        content,
        artifact_type,
    }))
}
