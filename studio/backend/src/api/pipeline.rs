use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::AppState;
use crate::runtime::bridge;
use crate::state::watcher;
use std::path::Path as FilePath;

#[derive(Deserialize)]
pub struct StartPipeline {
    pub task: String,
    pub provider: Option<String>,
    pub model: Option<String>,
    pub no_docker: Option<bool>,
    pub budget_usd: Option<f64>,
    pub signer: Option<String>,
}

#[derive(Serialize)]
pub struct PipelineStatus {
    pub run_id: Option<String>,
    pub status: String,
    pub state: Option<serde_json::Value>,
}

pub async fn start(
    State(state): State<Arc<AppState>>,
    Path(project_id): Path<String>,
    Json(payload): Json<StartPipeline>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let project = state
        .db
        .get_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let provider = payload.provider.unwrap_or_else(|| "claude".to_string());
    let model = payload.model.unwrap_or_else(|| "sonnet".to_string());

    let run = state
        .db
        .create_run(&project_id, &payload.task, &provider, &model, payload.signer.as_deref())
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let run_id = run.id.clone();
    let tx = state.tx.clone();
    let project_path = project.path.clone();
    let task = payload.task.clone();
    let no_docker = payload.no_docker.unwrap_or(false);
    let budget = payload.budget_usd;

    // Spawn pipeline in background
    tokio::spawn(async move {
        // Start file watcher for state.json
        let tx_watcher = tx.clone();
        let watcher_path = project_path.clone();
        tokio::spawn(async move {
            if let Err(e) = watcher::watch_state(&watcher_path, tx_watcher).await {
                tracing::error!("State watcher error: {}", e);
            }
        });

        // Run the pipeline
        bridge::run_pipeline(&project_path, &task, &provider, &model, no_docker, budget, tx).await;
    });

    Ok(Json(serde_json::json!({
        "run_id": run_id,
        "status": "started"
    })))
}

pub async fn stop(
    State(_state): State<Arc<AppState>>,
    Path(project_id): Path<String>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // Read lock.pid and kill the process
    let project = _state
        .db
        .get_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;
    let lock_path = format!("{}/.dc/auto/lock.pid", project.path);
    if let Ok(pid_str) = std::fs::read_to_string(&lock_path) {
        if let Ok(_pid) = pid_str.trim().parse::<u32>() {
            // Use kill command to terminate the process
            let _ = std::process::Command::new("kill")
                .args(["-TERM", pid_str.trim()])
                .output();
            let _ = std::fs::remove_file(&lock_path);
        }
    }
    Ok(Json(serde_json::json!({ "status": "stopped" })))
}

pub async fn status(
    State(_state): State<Arc<AppState>>,
    Path(project_id): Path<String>,
) -> Result<Json<PipelineStatus>, StatusCode> {
    // Try to read state.json from the project
    let project = _state
        .db
        .get_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let state_path = format!("{}/.dc/auto/state.json", project.path);

    let (status, state_value) = if let Ok(content) = std::fs::read_to_string(&state_path) {
        if let Ok(value) = serde_json::from_str::<serde_json::Value>(&content) {
            let status = value
                .get("status")
                .and_then(|v| v.as_str())
                .unwrap_or("unknown")
                .to_string();
            (status, Some(value))
        } else {
            ("idle".to_string(), None)
        }
    } else {
        ("idle".to_string(), None)
    };

    Ok(Json(PipelineStatus {
        run_id: None,
        status,
        state: state_value,
    }))
}

/// Get detailed diagnosis of what failed and why, with suggestions
pub async fn diagnosis(
    State(state): State<Arc<AppState>>,
    Path(project_id): Path<String>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let project = state.db.get_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    let state_path = format!("{}/.dc/auto/state.json", project.path);

    // Read state.json for phase details
    let state_data = std::fs::read_to_string(&state_path)
        .ok()
        .and_then(|c| serde_json::from_str::<serde_json::Value>(&c).ok());

    // Find failed phases
    let mut failed_phases = Vec::new();
    if let Some(ref data) = state_data {
        if let Some(phases) = data.get("phases").and_then(|p| p.as_array()) {
            for phase in phases {
                if phase.get("status").and_then(|s| s.as_str()) == Some("failed") {
                    let name = phase.get("name").and_then(|n| n.as_str()).unwrap_or("unknown");
                    failed_phases.push(name.to_string());
                }
            }
        }
    }

    // Read the actual run log
    let mut error_logs = Vec::new();
    let log_path = format!("{}/.dc/auto/last-run.log", project.path);
    if let Ok(content) = std::fs::read_to_string(&log_path) {
        // Get lines with errors, failures, and important info
        for line in content.lines() {
            let lower = line.to_lowercase();
            if lower.contains("error") || lower.contains("fail") || lower.contains("❌") ||
               lower.contains("todo") || lower.contains("gate") || lower.contains("[stderr]") ||
               lower.contains("test") || lower.contains("assert") || lower.contains("not found") ||
               lower.contains("missing") || lower.contains("cannot") {
                error_logs.push(line.to_string());
            }
        }
        // If no error-specific lines found, take the last 30 lines
        if error_logs.is_empty() {
            error_logs = content.lines().rev().take(30).map(|s| s.to_string()).collect();
            error_logs.reverse();
        }
    }

    // Check common failure reasons
    let mut error_details = Vec::new();
    let mut suggestions = Vec::new();

    for phase in &failed_phases {
        match phase.as_str() {
            "specify" => {
                error_details.push("The specification phase failed to create Gherkin scenarios.".to_string());
                suggestions.push("Make your requirements more specific — include concrete features, user roles, and expected behaviors.".to_string());
                suggestions.push("Try breaking your idea into smaller, more focused features.".to_string());
            }
            "clarify" => {
                error_details.push("The clarification phase found issues it couldn't resolve.".to_string());
                suggestions.push("Review your requirements for contradictions or ambiguous terms.".to_string());
            }
            "plan" => {
                error_details.push("The architecture planning phase failed.".to_string());
                suggestions.push("Specify the tech stack you want (React, Node, Python, etc.) in your requirements.".to_string());
                suggestions.push("Reduce the scope — plan for an MVP first.".to_string());
            }
            "design" => {
                error_details.push("The UI design phase failed to generate mockups.".to_string());
                suggestions.push("Add more details about the screens and user flows you need.".to_string());
            }
            "breakdown" => {
                error_details.push("Failed to break the plan into tasks.".to_string());
                suggestions.push("The technical plan may be too vague. Try adding specific features.".to_string());
            }
            "implement" => {
                // Check common implementation failures
                let proj_path = &project.path;

                // Check if package.json exists
                if !FilePath::new(&format!("{}/package.json", proj_path)).exists() {
                    error_details.push("No package.json found — the code has no project setup.".to_string());
                    suggestions.push("Add 'use Node.js/TypeScript' to your requirements so the implement phase creates a proper project.".to_string());
                }

                // Check for test files
                let has_tests = std::process::Command::new("find")
                    .args([".", "-name", "*.test.*", "-o", "-name", "*.spec.*"])
                    .current_dir(proj_path)
                    .output()
                    .map(|o| !o.stdout.is_empty())
                    .unwrap_or(false);

                if !has_tests {
                    error_details.push("No test files were created — TDD gate requires tests.".to_string());
                    suggestions.push("The TDD gate requires test files. Make sure your requirements mention specific testable behaviors.".to_string());
                } else {
                    // Check if tests pass
                    let test_result = std::process::Command::new("npm")
                        .args(["test", "--", "--passWithNoTests"])
                        .current_dir(proj_path)
                        .output();
                    if let Ok(output) = test_result {
                        if !output.status.success() {
                            let stderr = String::from_utf8_lossy(&output.stderr);
                            let last_lines: Vec<&str> = stderr.lines().rev().take(10).collect();
                            error_details.push("Tests exist but are FAILING:".to_string());
                            for line in last_lines.iter().rev() {
                                let clean = line.trim();
                                if !clean.is_empty() {
                                    error_details.push(format!("  {}", clean));
                                }
                            }
                            suggestions.push("The implementation has bugs. Retry — the AI will try to fix the failing tests.".to_string());
                            suggestions.push("If it keeps failing, simplify your requirements or specify the exact technology stack.".to_string());
                        }
                    }
                }

                // Check for TODO stubs
                let stubs = std::process::Command::new("grep")
                    .args(["-rn", "// TODO\\|// FIXME", "--include=*.ts", "--include=*.js", "."])
                    .current_dir(proj_path)
                    .output();
                if let Ok(output) = stubs {
                    let count = String::from_utf8_lossy(&output.stdout).lines().count();
                    if count > 0 {
                        error_details.push(format!("{} TODO/FIXME stubs found in code — TDD gate rejects placeholders.", count));
                        suggestions.push("The AI left placeholder code. Retry and it will try to implement the actual logic.".to_string());
                    }
                }

                if error_details.is_empty() {
                    error_details.push("Implementation phase failed — check the logs for details.".to_string());
                }
                suggestions.push("Try clicking Retry — the AI often fixes issues on the second attempt.".to_string());
            }
            "review" => {
                error_details.push("The code review found critical issues.".to_string());
                suggestions.push("The review found security or quality problems. Retry — the AI will try to address the review feedback.".to_string());
            }
            _ => {
                error_details.push(format!("Phase '{}' failed.", phase));
                suggestions.push("Try retrying the failed phase.".to_string());
            }
        }
    }

    if suggestions.is_empty() {
        suggestions.push("Try clicking Retry on the failed phase.".to_string());
        suggestions.push("If it keeps failing, try simplifying your requirements.".to_string());
    }

    Ok(Json(serde_json::json!({
        "failed_phases": failed_phases,
        "error_details": error_details,
        "suggestions": suggestions,
        "error_logs": error_logs,
        "state": state_data,
    })))
}

/// Retry from the failed phase — injects error context so the AI knows what went wrong
pub async fn retry_failed(
    State(state): State<Arc<AppState>>,
    Path(project_id): Path<String>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let project = state.db.get_project(&project_id)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .ok_or(StatusCode::NOT_FOUND)?;

    // Clear the lock file so pipeline can restart
    let lock_path = format!("{}/.dc/auto/lock.pid", project.path);
    let _ = std::fs::remove_file(&lock_path);

    // Read the last task from state.json
    let state_path = format!("{}/.dc/auto/state.json", project.path);
    let state_data = std::fs::read_to_string(&state_path)
        .ok()
        .and_then(|c| serde_json::from_str::<serde_json::Value>(&c).ok());

    let original_task = state_data.as_ref()
        .and_then(|v| v.get("task").and_then(|t| t.as_str()).map(|s| s.to_string()))
        .unwrap_or_default();

    if original_task.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    // Find which phases failed
    let mut failed_phases = Vec::new();
    if let Some(ref data) = state_data {
        if let Some(phases) = data.get("phases").and_then(|p| p.as_array()) {
            for phase in phases {
                if phase.get("status").and_then(|s| s.as_str()) == Some("failed") {
                    let name = phase.get("name").and_then(|n| n.as_str()).unwrap_or("unknown");
                    failed_phases.push(name.to_string());
                }
            }
        }
    }

    // Read the last run log for error context
    let log_path = format!("{}/.dc/auto/last-run.log", project.path);
    let error_context = std::fs::read_to_string(&log_path)
        .unwrap_or_default();

    // Extract the last 30 lines that contain errors, failures, or important info
    let error_lines: Vec<&str> = error_context.lines()
        .filter(|l| {
            let lower = l.to_lowercase();
            lower.contains("error") || lower.contains("fail") || lower.contains("❌") ||
            lower.contains("todo") || lower.contains("fixme") || lower.contains("gate") ||
            lower.contains("test") || lower.contains("assert") || lower.contains("[stderr]")
        })
        .collect();
    let relevant_errors: Vec<&str> = error_lines.iter().rev().take(30).rev().cloned().collect();

    // Check for specific failure patterns to give precise instructions
    let mut fix_instructions = Vec::new();

    let lower_errors = relevant_errors.join("\n").to_lowercase();

    if lower_errors.contains("no test files found") || lower_errors.contains("tdd") {
        fix_instructions.push("CREATE TEST FILES FIRST — write *.test.ts files with real describe/it/expect blocks BEFORE writing implementation code.".to_string());
        fix_instructions.push("Make sure package.json has a test script: { \"scripts\": { \"test\": \"vitest run\" } }".to_string());
    }
    if lower_errors.contains("todo") || lower_errors.contains("fixme") {
        fix_instructions.push("DO NOT use // TODO or // FIXME — implement the actual logic. Every function must have a real implementation.".to_string());
    }
    if lower_errors.contains("tests fail") || lower_errors.contains("test fail") {
        fix_instructions.push("Tests are failing — read the test error output, fix the implementation to make ALL tests pass before finishing.".to_string());
    }
    if lower_errors.contains("no .feature") || lower_errors.contains("spec") {
        fix_instructions.push("Create .dc/specs/spec.feature with Gherkin scenarios (Given/When/Then).".to_string());
    }
    if lower_errors.contains("npm error") || lower_errors.contains("module not found") {
        fix_instructions.push("Run npm install before running tests. Make sure all imports resolve.".to_string());
    }

    if fix_instructions.is_empty() {
        fix_instructions.push("Review the error log below and fix the root cause.".to_string());
    }

    // Build enhanced task with error context
    let enhanced_task = format!(
        "{}\n\n\
        --- RETRY: PREVIOUS ATTEMPT FAILED ---\n\n\
        The previous attempt failed at phase(s): {}\n\n\
        FIX INSTRUCTIONS (CRITICAL — follow these EXACTLY):\n{}\n\n\
        ERROR LOG FROM PREVIOUS RUN:\n{}\n\n\
        IMPORTANT: Do NOT repeat the same mistakes. Follow the fix instructions above.\n\
        --- END RETRY CONTEXT ---",
        original_task,
        failed_phases.join(", "),
        fix_instructions.iter().enumerate().map(|(i, f)| format!("{}. {}", i + 1, f)).collect::<Vec<_>>().join("\n"),
        relevant_errors.join("\n"),
    );

    let tx = state.tx.clone();
    let path = project.path.clone();

    // Send diagnosis info to frontend
    let _ = tx.send(crate::ws::WsMessage {
        msg_type: "log".to_string(),
        data: serde_json::json!({
            "line": format!("Retrying — previous failure at: {}", failed_phases.join(", ")),
            "timestamp": chrono::Utc::now().to_rfc3339(),
            "stream": "stdout"
        }),
    });
    for instr in &fix_instructions {
        let _ = tx.send(crate::ws::WsMessage {
            msg_type: "log".to_string(),
            data: serde_json::json!({
                "line": format!("Fix: {}", instr),
                "timestamp": chrono::Utc::now().to_rfc3339(),
                "stream": "stdout"
            }),
        });
    }

    tokio::spawn(async move {
        bridge::run_pipeline(&path, &enhanced_task, "claude", "sonnet", true, None, tx).await;
    });

    Ok(Json(serde_json::json!({
        "status": "retrying",
        "failed_phases": failed_phases,
        "fix_instructions": fix_instructions,
        "error_lines_count": relevant_errors.len(),
    })))
}
