use anyhow::Result;
use notify::{Event, EventKind, RecursiveMode, Watcher};
use std::path::Path;
use tokio::sync::broadcast;

use crate::ws::WsMessage;

/// Watch .dc/auto/state.json for changes and broadcast updates via WebSocket
pub async fn watch_state(
    project_path: &str,
    tx: broadcast::Sender<WsMessage>,
) -> Result<()> {
    let state_dir = format!("{}/.dc/auto", project_path);
    let state_file = format!("{}/state.json", state_dir);

    // Ensure directory exists
    std::fs::create_dir_all(&state_dir)?;

    let (notify_tx, mut notify_rx) = tokio::sync::mpsc::channel::<()>(16);

    let mut watcher = notify::recommended_watcher(move |res: Result<Event, notify::Error>| {
        if let Ok(event) = res {
            if matches!(event.kind, EventKind::Modify(_) | EventKind::Create(_)) {
                let _ = notify_tx.blocking_send(());
            }
        }
    })?;

    watcher.watch(Path::new(&state_dir), RecursiveMode::NonRecursive)?;

    tracing::info!("Watching state at: {}", state_file);

    // Keep watcher alive and forward events
    while notify_rx.recv().await.is_some() {
        if let Ok(content) = tokio::fs::read_to_string(&state_file).await {
            if let Ok(value) = serde_json::from_str::<serde_json::Value>(&content) {
                let _ = tx.send(WsMessage {
                    msg_type: "state_update".to_string(),
                    data: value,
                });
            }
        }
    }

    Ok(())
}
