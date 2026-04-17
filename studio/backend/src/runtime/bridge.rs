use chrono::Utc;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;
use tokio::sync::broadcast;

use crate::ws::WsMessage;

/// Spawn the dc-run TypeScript orchestrator and stream output via broadcast channel
pub async fn run_pipeline(
    project_path: &str,
    task: &str,
    provider: &str,
    model: &str,
    no_docker: bool,
    budget: Option<f64>,
    tx: broadcast::Sender<WsMessage>,
) {
    // Ensure the project directory is a git repo (runtime needs it for worktrees)
    if !std::path::Path::new(project_path).join(".git").exists() {
        let _ = tx.send(WsMessage {
            msg_type: "log".to_string(),
            data: serde_json::json!({
                "line": "Initializing git repository...",
                "timestamp": Utc::now().to_rfc3339(),
                "stream": "stdout"
            }),
        });

        let git_init = std::process::Command::new("git")
            .args(["init"])
            .current_dir(project_path)
            .output();

        match git_init {
            Ok(output) if output.status.success() => {
                // Initial commit so worktrees can work
                let _ = std::process::Command::new("git")
                    .args(["add", "-A"])
                    .current_dir(project_path)
                    .output();
                let _ = std::process::Command::new("git")
                    .args(["commit", "-m", "Initial commit", "--allow-empty"])
                    .current_dir(project_path)
                    .output();

                let _ = tx.send(WsMessage {
                    msg_type: "log".to_string(),
                    data: serde_json::json!({
                        "line": "Git repository initialized.",
                        "timestamp": Utc::now().to_rfc3339(),
                        "stream": "stdout"
                    }),
                });
            }
            Ok(output) => {
                let stderr = String::from_utf8_lossy(&output.stderr);
                let _ = tx.send(WsMessage {
                    msg_type: "error".to_string(),
                    data: serde_json::json!({ "message": format!("git init failed: {}", stderr) }),
                });
                return;
            }
            Err(e) => {
                let _ = tx.send(WsMessage {
                    msg_type: "error".to_string(),
                    data: serde_json::json!({ "message": format!("git not found: {}", e) }),
                });
                return;
            }
        }
    }

    // Ensure .dc directory exists
    let dc_dir = std::path::Path::new(project_path).join(".dc").join("auto");
    let _ = std::fs::create_dir_all(&dc_dir);

    // Resolve the runtime entry point (MUST be absolute path)
    let runtime_path = resolve_runtime_path();

    tracing::info!("Runtime resolved to: {}", runtime_path);

    if !std::path::Path::new(&runtime_path).exists() {
        let _ = tx.send(WsMessage {
            msg_type: "error".to_string(),
            data: serde_json::json!({
                "message": format!("Runtime not found at: {}. Is Don Cheli installed?", runtime_path)
            }),
        });
        return;
    }

    let mut args = vec![
        "tsx".to_string(),
        runtime_path.clone(),
        task.to_string(),
        "--provider".to_string(),
        provider.to_string(),
        "--model".to_string(),
        model.to_string(),
        "--no-docker".to_string(), // Default to no-docker for now (simpler setup)
    ];

    if no_docker {
        // Already added above
    }
    if let Some(b) = budget {
        args.push("--budget".to_string());
        args.push(b.to_string());
    }

    let _ = tx.send(WsMessage {
        msg_type: "log".to_string(),
        data: serde_json::json!({
            "line": format!("Starting pipeline in: {}", project_path),
            "timestamp": Utc::now().to_rfc3339(),
            "stream": "stdout"
        }),
    });

    let _ = tx.send(WsMessage {
        msg_type: "log".to_string(),
        data: serde_json::json!({
            "line": format!("Runtime: {}", runtime_path),
            "timestamp": Utc::now().to_rfc3339(),
            "stream": "stdout"
        }),
    });

    let _ = tx.send(WsMessage {
        msg_type: "log".to_string(),
        data: serde_json::json!({
            "line": format!("Task: \"{}\"", task),
            "timestamp": Utc::now().to_rfc3339(),
            "stream": "stdout"
        }),
    });

    tracing::info!("Executing: npx {} in {}", args.join(" "), project_path);

    let child = Command::new("npx")
        .args(&args)
        .current_dir(project_path)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::piped())
        .spawn();

    let mut child = match child {
        Ok(c) => c,
        Err(e) => {
            let _ = tx.send(WsMessage {
                msg_type: "error".to_string(),
                data: serde_json::json!({ "message": format!("Failed to spawn runtime: {}", e) }),
            });
            return;
        }
    };

    // Log file for this run
    let log_path = format!("{}/.dc/auto/last-run.log", project_path);
    let log_path_clone = log_path.clone();
    let log_path_clone2 = log_path.clone();

    // Clear previous log
    let _ = std::fs::write(&log_path, "");

    // Stream stdout + save to log
    if let Some(stdout) = child.stdout.take() {
        let tx_stdout = tx.clone();
        tokio::spawn(async move {
            let reader = BufReader::new(stdout);
            let mut lines = reader.lines();
            while let Ok(Some(line)) = lines.next_line().await {
                let event = parse_output_line(&line);
                let _ = tx_stdout.send(event);
                // Append to log file
                let _ = tokio::fs::OpenOptions::new().append(true).create(true)
                    .open(&log_path_clone).await
                    .map(|mut f| { use tokio::io::AsyncWriteExt; let line_c = line.clone(); tokio::spawn(async move { let _ = f.write_all(format!("{}\n", strip_ansi(&line_c)).as_bytes()).await; }); });
            }
        });
    }

    // Stream stderr + save to log
    if let Some(stderr) = child.stderr.take() {
        let tx_stderr = tx.clone();
        tokio::spawn(async move {
            let reader = BufReader::new(stderr);
            let mut lines = reader.lines();
            while let Ok(Some(line)) = lines.next_line().await {
                let clean = strip_ansi(&line);
                let _ = tx_stderr.send(WsMessage {
                    msg_type: "log".to_string(),
                    data: serde_json::json!({
                        "line": clean,
                        "timestamp": Utc::now().to_rfc3339(),
                        "stream": "stderr"
                    }),
                });
                // Append to log file
                let _ = tokio::fs::OpenOptions::new().append(true).create(true)
                    .open(&log_path_clone2).await
                    .map(|mut f| { use tokio::io::AsyncWriteExt; let clean_c = clean.clone(); tokio::spawn(async move { let _ = f.write_all(format!("[STDERR] {}\n", clean_c).as_bytes()).await; }); });
            }
        });
    }

    // Wait for process to complete
    match child.wait().await {
        Ok(status) => {
            let final_status = if status.success() { "passed" } else { "failed" };
            let _ = tx.send(WsMessage {
                msg_type: "pipeline_complete".to_string(),
                data: serde_json::json!({ "status": final_status }),
            });
        }
        Err(e) => {
            let _ = tx.send(WsMessage {
                msg_type: "error".to_string(),
                data: serde_json::json!({ "message": format!("Pipeline process error: {}", e) }),
            });
        }
    }
}

/// Strip ANSI escape codes from a string
fn strip_ansi(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut chars = s.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '\x1b' {
            // Skip until we find a letter (end of escape sequence)
            while let Some(&next) = chars.peek() {
                chars.next();
                if next.is_ascii_alphabetic() {
                    break;
                }
            }
        } else {
            result.push(c);
        }
    }
    result
}

/// Parse dc-run output lines into structured WebSocket events
fn parse_output_line(line: &str) -> WsMessage {
    let clean = strip_ansi(line);
    let trimmed = clean.trim();

    // Detect phase transitions
    if trimmed.contains("Phase:") || trimmed.contains("fase:") || trimmed.contains("phase:") {
        if let Some(phase_name) = extract_phase_name(trimmed) {
            if trimmed.contains("PASSED") || trimmed.contains("passed") || trimmed.contains("✅") {
                return WsMessage {
                    msg_type: "phase_complete".to_string(),
                    data: serde_json::json!({ "phase": phase_name, "status": "passed" }),
                };
            } else if trimmed.contains("FAILED") || trimmed.contains("failed") || trimmed.contains("❌") {
                return WsMessage {
                    msg_type: "phase_complete".to_string(),
                    data: serde_json::json!({ "phase": phase_name, "status": "failed" }),
                };
            } else {
                return WsMessage {
                    msg_type: "phase_start".to_string(),
                    data: serde_json::json!({ "phase": phase_name }),
                };
            }
        }
    }

    // Detect gate results
    if trimmed.contains("Gate:") || trimmed.contains("gate:") || trimmed.contains("Quality Gate") {
        return WsMessage {
            msg_type: "gate_result".to_string(),
            data: serde_json::json!({
                "line": trimmed,
                "timestamp": Utc::now().to_rfc3339(),
                "passed": !trimmed.contains("FAIL") && !trimmed.contains("❌")
            }),
        };
    }

    // Default: log line
    WsMessage {
        msg_type: "log".to_string(),
        data: serde_json::json!({
            "line": clean,
            "timestamp": Utc::now().to_rfc3339(),
            "stream": "stdout"
        }),
    }
}

fn extract_phase_name(line: &str) -> Option<String> {
    let phases = [
        "specify", "clarify", "plan", "breakdown", "implement", "review",
        "especificar", "clarificar", "planificar", "desglosar", "implementar", "revisar",
    ];
    let lower = line.to_lowercase();
    phases.iter().find(|p| lower.contains(*p)).map(|p| p.to_string())
}

/// Resolve the ABSOLUTE path to runtime/src/index.ts.
/// The binary lives at studio/backend/target/{debug|release}/don-cheli-studio
/// and the runtime is at runtime/src/index.ts (framework root).
fn resolve_runtime_path() -> String {
    // Method 1: Relative to the binary location
    if let Ok(exe) = std::env::current_exe() {
        if let Ok(canonical_exe) = exe.canonicalize() {
            // exe = .../studio/backend/target/release/don-cheli-studio
            // We need to go up to the framework root
            let mut root = canonical_exe.clone();
            for _ in 0..5 {
                if let Some(parent) = root.parent() {
                    root = parent.to_path_buf();
                }
            }
            let candidate = root.join("runtime").join("src").join("index.ts");
            if candidate.exists() {
                tracing::info!("Runtime found via exe path: {}", candidate.display());
                return candidate.to_string_lossy().to_string();
            }
        }
    }

    // Method 2: Relative to CWD
    if let Ok(cwd) = std::env::current_dir() {
        let candidates = [
            cwd.join("../../runtime/src/index.ts"),
            cwd.join("../runtime/src/index.ts"),
            cwd.join("runtime/src/index.ts"),
        ];
        for c in &candidates {
            if c.exists() {
                if let Ok(abs) = c.canonicalize() {
                    tracing::info!("Runtime found via CWD: {}", abs.display());
                    return abs.to_string_lossy().to_string();
                }
            }
        }
    }

    // Method 3: Check FRAMEWORK_HOME env var
    if let Ok(home) = std::env::var("FRAMEWORK_HOME") {
        let candidate = std::path::PathBuf::from(&home)
            .join("../../runtime/src/index.ts");
        if candidate.exists() {
            if let Ok(abs) = candidate.canonicalize() {
                return abs.to_string_lossy().to_string();
            }
        }
    }

    // Fallback
    tracing::warn!("Could not resolve runtime path, using fallback");
    "runtime/src/index.ts".to_string()
}
