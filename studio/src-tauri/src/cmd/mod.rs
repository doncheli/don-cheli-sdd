use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tauri::State;

use crate::db::{Database, Project};

pub type DbState = Arc<Database>;

// ── Projects ─────────────────────────────────────────

#[tauri::command]
pub fn list_projects(db: State<DbState>) -> Result<Vec<Project>, String> {
    db.list_projects().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_project(db: State<DbState>, id: String) -> Result<Option<Project>, String> {
    db.get_project(&id).map_err(|e| e.to_string())
}

#[derive(Deserialize)]
pub struct CreateProjectInput {
    pub name: String,
    pub path: String,
}

#[tauri::command]
pub fn create_project(db: State<DbState>, name: String, path: String) -> Result<Project, String> {
    if !std::path::Path::new(&path).is_dir() {
        return Err("Path does not exist or is not a directory".into());
    }
    db.create_project(&name, &path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_project(db: State<DbState>, id: String) -> Result<bool, String> {
    db.delete_project(&id).map_err(|e| e.to_string())
}

// ── Pipeline ─────────────────────────────────────────

#[tauri::command]
pub async fn start_pipeline(
    app: tauri::AppHandle,
    db: State<'_, DbState>,
    project_id: String,
    task: String,
    provider: Option<String>,
    model: Option<String>,
) -> Result<String, String> {
    let project = db.get_project(&project_id)
        .map_err(|e| e.to_string())?
        .ok_or("Project not found")?;

    let prov = provider.unwrap_or_else(|| "claude".into());
    let mdl = model.unwrap_or_else(|| "sonnet".into());

    let run = db.create_run(&project_id, &task, &prov, &mdl)
        .map_err(|e| e.to_string())?;

    let run_id = run.id.clone();
    let path = project.path.clone();

    tokio::spawn(async move {
        crate::runtime::run_pipeline(app, path, task, prov, mdl).await;
    });

    Ok(run_id)
}

#[tauri::command]
pub fn pipeline_status(db: State<DbState>, project_id: String) -> Result<serde_json::Value, String> {
    let project = db.get_project(&project_id)
        .map_err(|e| e.to_string())?
        .ok_or("Project not found")?;

    let state_path = format!("{}/.dc/auto/state.json", project.path);
    if let Ok(content) = std::fs::read_to_string(&state_path) {
        if let Ok(value) = serde_json::from_str::<serde_json::Value>(&content) {
            return Ok(serde_json::json!({ "status": value.get("status").and_then(|v| v.as_str()).unwrap_or("unknown"), "state": value }));
        }
    }
    Ok(serde_json::json!({ "status": "idle", "state": null }))
}

// ── Phases ───────────────────────────────────────────

#[derive(Serialize)]
pub struct PhaseInfo {
    pub name: String,
    pub command: String,
    pub status: String,
    pub duration_ms: Option<u64>,
    pub cost_usd: Option<f64>,
    pub retries: u32,
}

#[tauri::command]
pub fn list_phases(db: State<DbState>, project_id: String) -> Result<Vec<PhaseInfo>, String> {
    let project = db.get_project(&project_id)
        .map_err(|e| e.to_string())?
        .ok_or("Project not found")?;

    let state_path = format!("{}/.dc/auto/state.json", project.path);
    if let Ok(content) = std::fs::read_to_string(&state_path) {
        if let Ok(value) = serde_json::from_str::<serde_json::Value>(&content) {
            if let Some(phases) = value.get("phases").and_then(|p| p.as_array()) {
                return Ok(phases.iter().map(|p| PhaseInfo {
                    name: p.get("name").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                    command: p.get("command").and_then(|v| v.as_str()).unwrap_or("").to_string(),
                    status: p.get("status").and_then(|v| v.as_str()).unwrap_or("pending").to_string(),
                    duration_ms: p.get("durationMs").and_then(|v| v.as_u64()),
                    cost_usd: p.get("costUsd").and_then(|v| v.as_f64()),
                    retries: p.get("retries").and_then(|v| v.as_u64()).unwrap_or(0) as u32,
                }).collect());
            }
        }
    }

    // Defaults
    Ok(vec![
        PhaseInfo { name: "specify".into(), command: "/dc:especificar".into(), status: "pending".into(), duration_ms: None, cost_usd: None, retries: 0 },
        PhaseInfo { name: "clarify".into(), command: "/dc:clarificar".into(), status: "pending".into(), duration_ms: None, cost_usd: None, retries: 0 },
        PhaseInfo { name: "plan".into(), command: "/dc:planificar-tecnico".into(), status: "pending".into(), duration_ms: None, cost_usd: None, retries: 0 },
        PhaseInfo { name: "design".into(), command: "/dc:diseñar-ui".into(), status: "pending".into(), duration_ms: None, cost_usd: None, retries: 0 },
        PhaseInfo { name: "breakdown".into(), command: "/dc:desglosar".into(), status: "pending".into(), duration_ms: None, cost_usd: None, retries: 0 },
        PhaseInfo { name: "implement".into(), command: "/dc:implementar".into(), status: "pending".into(), duration_ms: None, cost_usd: None, retries: 0 },
        PhaseInfo { name: "review".into(), command: "/dc:revisar".into(), status: "pending".into(), duration_ms: None, cost_usd: None, retries: 0 },
    ])
}

// ── Artifacts ────────────────────────────────────────

#[derive(Serialize)]
pub struct ArtifactInfo {
    #[serde(rename = "type")]
    pub artifact_type: String,
    pub name: String,
    pub path: String,
    pub phase: String,
    pub size_bytes: u64,
}

const ARTIFACT_DIRS: &[(&str, &str, &str)] = &[
    ("spec", ".dc/specs", "specify"),
    ("blueprint", ".dc/blueprints", "plan"),
    ("task", ".dc/tareas", "breakdown"),
    ("review", ".dc/reviews", "review"),
    ("coverage", "coverage", "implement"),
    ("test", "test", "implement"),
];

#[tauri::command]
pub fn list_artifacts(db: State<DbState>, project_id: String) -> Result<Vec<ArtifactInfo>, String> {
    let project = db.get_project(&project_id)
        .map_err(|e| e.to_string())?
        .ok_or("Project not found")?;

    let mut artifacts = Vec::new();
    for (atype, dir, phase) in ARTIFACT_DIRS {
        let full = format!("{}/{}", project.path, dir);
        if let Ok(entries) = std::fs::read_dir(&full) {
            for entry in entries.flatten() {
                if let Ok(meta) = entry.metadata() {
                    if meta.is_file() {
                        artifacts.push(ArtifactInfo {
                            artifact_type: atype.to_string(),
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
    Ok(artifacts)
}

#[derive(Serialize)]
pub struct ArtifactContent {
    pub name: String,
    pub content: String,
    #[serde(rename = "type")]
    pub artifact_type: String,
}

#[tauri::command]
pub fn get_artifact_content(db: State<DbState>, project_id: String, artifact_type: String, name: String) -> Result<ArtifactContent, String> {
    let project = db.get_project(&project_id)
        .map_err(|e| e.to_string())?
        .ok_or("Project not found")?;

    let dir = ARTIFACT_DIRS.iter().find(|(t, _, _)| *t == artifact_type).map(|(_, d, _)| *d).ok_or("Unknown type")?;
    let file_path = format!("{}/{}/{}", project.path, dir, name);
    let content = std::fs::read_to_string(&file_path).map_err(|_| "File not found")?;
    Ok(ArtifactContent { name, content, artifact_type })
}

// ── Filesystem ───────────────────────────────────────

#[derive(Serialize)]
pub struct DirEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub is_git: bool,
    pub has_package_json: bool,
}

#[derive(Serialize)]
pub struct BrowseResult {
    pub current: String,
    pub parent: Option<String>,
    pub entries: Vec<DirEntry>,
}

#[tauri::command]
pub fn browse_filesystem(path: Option<String>) -> Result<BrowseResult, String> {
    let base = path
        .map(std::path::PathBuf::from)
        .unwrap_or_else(|| std::env::var("HOME").map(std::path::PathBuf::from).unwrap_or_else(|_| "/".into()));

    if !base.is_dir() { return Err("Not a directory".into()); }
    let canonical = base.canonicalize().unwrap_or(base);
    let parent = canonical.parent().map(|p| p.to_string_lossy().to_string());

    let mut entries = Vec::new();
    if let Ok(read) = std::fs::read_dir(&canonical) {
        for entry in read.flatten() {
            let meta = match entry.metadata() { Ok(m) => m, Err(_) => continue };
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with('.') || !meta.is_dir() { continue; }

            let ep = entry.path();
            entries.push(DirEntry {
                name,
                path: ep.to_string_lossy().to_string(),
                is_dir: true,
                is_git: ep.join(".git").exists(),
                has_package_json: ep.join("package.json").exists(),
            });
        }
    }
    entries.sort_by(|a, b| b.is_git.cmp(&a.is_git).then(a.name.to_lowercase().cmp(&b.name.to_lowercase())));

    // Check current dir
    if canonical.join(".git").exists() || canonical.join("package.json").exists() {
        entries.insert(0, DirEntry {
            name: ". (current directory)".into(),
            path: canonical.to_string_lossy().to_string(),
            is_dir: true,
            is_git: canonical.join(".git").exists(),
            has_package_json: canonical.join("package.json").exists(),
        });
    }

    Ok(BrowseResult { current: canonical.to_string_lossy().to_string(), parent, entries })
}

#[tauri::command]
pub fn create_directory(path: String) -> Result<(), String> {
    std::fs::create_dir_all(&path).map_err(|e| e.to_string())
}
