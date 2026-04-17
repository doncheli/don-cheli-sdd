use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::Serialize;
use std::sync::Arc;

use crate::AppState;

#[derive(Serialize)]
pub struct CostEstimate {
    pub provider: String,
    pub model: String,
    pub phases: u32,
    pub estimated_minutes: f64,
    pub runtime_cost: f64,
    pub token_cost: f64,
    pub total: f64,
}

#[derive(Serialize)]
pub struct CostHistory {
    pub runs: Vec<RunCost>,
}

#[derive(Serialize)]
pub struct RunCost {
    pub run_id: String,
    pub task: String,
    pub total_cost: f64,
    pub provider: String,
    pub started_at: String,
}

pub async fn estimate(
    State(_state): State<Arc<AppState>>,
    Path(_project_id): Path<String>,
) -> Json<CostEstimate> {
    // Default estimate for 6 phases with Claude
    let phases = 6u32;
    let minutes_per_phase = 5.0;
    let estimated_minutes = phases as f64 * minutes_per_phase;

    // Claude Code CLI = free, Managed Agents = $0.08/hr, Ollama = free
    let runtime_cost = 0.0; // Default to Claude Code CLI (free)
    let token_cost = phases as f64 * 0.15; // ~50K tokens per phase at sonnet rates

    Json(CostEstimate {
        provider: "claude".to_string(),
        model: "sonnet".to_string(),
        phases,
        estimated_minutes,
        runtime_cost,
        token_cost,
        total: runtime_cost + token_cost,
    })
}

pub async fn history(
    State(state): State<Arc<AppState>>,
    Path(project_id): Path<String>,
) -> Result<Json<CostHistory>, StatusCode> {
    let runs = state
        .db
        .get_runs_for_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(CostHistory {
        runs: runs
            .into_iter()
            .map(|r| RunCost {
                run_id: r.id,
                task: r.task,
                total_cost: r.total_cost,
                provider: r.provider,
                started_at: r.started_at,
            })
            .collect(),
    }))
}
