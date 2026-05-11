use chrono::Utc;
use serde::Serialize;
use tauri::{AppHandle, Emitter};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

#[derive(Clone, Serialize)]
pub struct PipelineEvent {
    #[serde(rename = "type")]
    pub event_type: String,
    pub data: serde_json::Value,
}

pub async fn run_pipeline(
    app: AppHandle,
    project_path: String,
    task: String,
    provider: String,
    model: String,
) {
    let emit = |t: &str, d: serde_json::Value| {
        let _ = app.emit("pipeline-event", PipelineEvent {
            event_type: t.to_string(),
            data: d,
        });
    };

    // Ensure git repo
    if !std::path::Path::new(&project_path).join(".git").exists() {
        emit("log", serde_json::json!({ "line": "Initializing git repository...", "timestamp": Utc::now().to_rfc3339() }));
        let _ = std::process::Command::new("git").args(["init"]).current_dir(&project_path).output();
        let _ = std::process::Command::new("git").args(["add", "-A"]).current_dir(&project_path).output();
        let _ = std::process::Command::new("git").args(["commit", "-m", "Initial commit", "--allow-empty"]).current_dir(&project_path).output();
        emit("log", serde_json::json!({ "line": "Git repository initialized.", "timestamp": Utc::now().to_rfc3339() }));
    }

    // Ensure .dc dir
    let _ = std::fs::create_dir_all(format!("{}/.dc/auto", project_path));

    // Resolve runtime path
    let runtime_path = resolve_runtime_path();
    if !std::path::Path::new(&runtime_path).exists() {
        emit("error", serde_json::json!({ "message": format!("Runtime not found: {}", runtime_path) }));
        return;
    }

    let args = vec![
        "tsx".to_string(), runtime_path.clone(), task.clone(),
        "--provider".to_string(), provider.clone(),
        "--model".to_string(), model.clone(),
        "--no-docker".to_string(),
    ];

    emit("log", serde_json::json!({ "line": format!("Starting pipeline: {}", task), "timestamp": Utc::now().to_rfc3339() }));

    let child = Command::new("npx")
        .args(&args)
        .current_dir(&project_path)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn();

    let mut child = match child {
        Ok(c) => c,
        Err(e) => {
            emit("error", serde_json::json!({ "message": format!("Failed to spawn: {}", e) }));
            return;
        }
    };

    if let Some(stdout) = child.stdout.take() {
        let app_clone = app.clone();
        tokio::spawn(async move {
            let reader = BufReader::new(stdout);
            let mut lines = reader.lines();
            while let Ok(Some(line)) = lines.next_line().await {
                let clean = strip_ansi(&line);
                let event_type = classify_line(&clean);
                let _ = app_clone.emit("pipeline-event", PipelineEvent {
                    event_type,
                    data: serde_json::json!({ "line": clean, "timestamp": Utc::now().to_rfc3339(), "stream": "stdout" }),
                });
            }
        });
    }

    if let Some(stderr) = child.stderr.take() {
        let app_clone = app.clone();
        tokio::spawn(async move {
            let reader = BufReader::new(stderr);
            let mut lines = reader.lines();
            while let Ok(Some(line)) = lines.next_line().await {
                let _ = app_clone.emit("pipeline-event", PipelineEvent {
                    event_type: "log".to_string(),
                    data: serde_json::json!({ "line": strip_ansi(&line), "timestamp": Utc::now().to_rfc3339(), "stream": "stderr" }),
                });
            }
        });
    }

    match child.wait().await {
        Ok(status) => {
            let s = if status.success() { "passed" } else { "failed" };
            emit("pipeline_complete", serde_json::json!({ "status": s }));
        }
        Err(e) => emit("error", serde_json::json!({ "message": format!("{}", e) })),
    }
}

fn classify_line(line: &str) -> String {
    let lower = line.to_lowercase();
    if lower.contains("phase:") || lower.contains("fase:") {
        if lower.contains("passed") || lower.contains("✅") { return "phase_complete".into(); }
        if lower.contains("failed") || lower.contains("❌") { return "phase_failed".into(); }
        return "phase_start".into();
    }
    if lower.contains("gate:") || lower.contains("quality gate") { return "gate_result".into(); }
    "log".into()
}

fn strip_ansi(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut chars = s.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '\x1b' {
            while let Some(&next) = chars.peek() {
                chars.next();
                if next.is_ascii_alphabetic() { break; }
            }
        } else {
            result.push(c);
        }
    }
    result
}

fn resolve_runtime_path() -> String {
    if let Ok(exe) = std::env::current_exe() {
        if let Ok(canon) = exe.canonicalize() {
            let mut root = canon.clone();
            // Navigate up from src-tauri/target/debug|release/don-cheli-studio
            for _ in 0..5 { if let Some(p) = root.parent() { root = p.to_path_buf(); } }
            let candidate = root.join("runtime").join("src").join("index.ts");
            if candidate.exists() { return candidate.to_string_lossy().to_string(); }
        }
    }
    if let Ok(cwd) = std::env::current_dir() {
        for rel in ["../../runtime/src/index.ts", "../runtime/src/index.ts", "runtime/src/index.ts"] {
            let c = cwd.join(rel);
            if c.exists() { if let Ok(abs) = c.canonicalize() { return abs.to_string_lossy().to_string(); } }
        }
    }
    "runtime/src/index.ts".to_string()
}
