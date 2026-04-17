mod cmd;
mod db;
mod runtime;

use std::sync::Arc;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db = db::Database::new("studio.db").expect("Failed to open database");
    db.migrate().expect("Failed to run migrations");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(Arc::new(db) as cmd::DbState)
        .invoke_handler(tauri::generate_handler![
            // Projects
            cmd::list_projects,
            cmd::get_project,
            cmd::create_project,
            cmd::delete_project,
            // Pipeline
            cmd::start_pipeline,
            cmd::pipeline_status,
            cmd::list_phases,
            // Artifacts
            cmd::list_artifacts,
            cmd::get_artifact_content,
            // Filesystem
            cmd::browse_filesystem,
            cmd::create_directory,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
