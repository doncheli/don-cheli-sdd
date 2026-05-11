use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::Serialize;
use std::sync::Arc;

use crate::AppState;

#[derive(Serialize)]
pub struct PhaseInfo {
    pub name: String,
    pub command: String,
    pub status: String,
    pub duration_ms: Option<u64>,
    pub cost_usd: Option<f64>,
    pub retries: u32,
}

pub async fn list(
    State(state): State<Arc<AppState>>,
    Path(project_id): Path<String>,
) -> Result<Json<Vec<PhaseInfo>>, StatusCode> {
    let project = state
        .db
        .get_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let state_path = format!("{}/.dc/auto/state.json", project.path);

    if let Ok(content) = std::fs::read_to_string(&state_path) {
        if let Ok(value) = serde_json::from_str::<serde_json::Value>(&content) {
            if let Some(phases) = value.get("phases").and_then(|p| p.as_array()) {
                let result: Vec<PhaseInfo> = phases
                    .iter()
                    .map(|p| PhaseInfo {
                        name: p.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                        command: p.get("command").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                        status: p.get("status").and_then(|v| v.as_str()).unwrap_or("pending").to_string(),
                        duration_ms: p.get("durationMs").and_then(|v| v.as_u64()),
                        cost_usd: p.get("costUsd").and_then(|v| v.as_f64()),
                        retries: p.get("retries").and_then(|v| v.as_u64()).unwrap_or(0) as u32,
                    })
                    .collect();
                return Ok(Json(result));
            }
        }
    }

    // Default phases if no state exists
    let defaults = vec![
        ("specify", "/dc:especificar"),
        ("clarify", "/dc:clarificar"),
        ("plan", "/dc:planificar-tecnico"),
        ("design", "/dc:diseñar-ui"),
        ("breakdown", "/dc:desglosar"),
        ("implement", "/dc:implementar"),
        ("review", "/dc:revisar"),
    ];

    Ok(Json(
        defaults
            .into_iter()
            .map(|(name, cmd)| PhaseInfo {
                name: name.to_string(),
                command: cmd.to_string(),
                status: "pending".to_string(),
                duration_ms: None,
                cost_usd: None,
                retries: 0,
            })
            .collect(),
    ))
}
