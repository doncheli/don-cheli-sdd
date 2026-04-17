use axum::{Json, extract::Query, http::StatusCode};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Deserialize)]
pub struct BrowseQuery {
    pub path: Option<String>,
}

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

pub async fn browse(Query(q): Query<BrowseQuery>) -> Result<Json<BrowseResult>, StatusCode> {
    let base = q
        .path
        .map(PathBuf::from)
        .unwrap_or_else(|| dirs_home().unwrap_or_else(|| PathBuf::from("/")));

    if !base.is_dir() {
        return Err(StatusCode::BAD_REQUEST);
    }

    let canonical = base.canonicalize().unwrap_or(base.clone());
    let parent = canonical.parent().map(|p| p.to_string_lossy().to_string());

    let mut entries: Vec<DirEntry> = Vec::new();

    if let Ok(read) = std::fs::read_dir(&canonical) {
        for entry in read.flatten() {
            let meta = match entry.metadata() {
                Ok(m) => m,
                Err(_) => continue,
            };

            let name = entry.file_name().to_string_lossy().to_string();

            // Skip hidden files except .git
            if name.starts_with('.') && name != ".git" {
                continue;
            }

            // Only show directories
            if !meta.is_dir() {
                continue;
            }

            // Skip .git directory itself
            if name == ".git" {
                continue;
            }

            let full_path = entry.path().to_string_lossy().to_string();
            let is_git = entry.path().join(".git").exists();
            let has_package_json = entry.path().join("package.json").exists();

            entries.push(DirEntry {
                name,
                path: full_path,
                is_dir: true,
                is_git,
                has_package_json,
            });
        }
    }

    // Sort: git repos first, then alphabetical
    entries.sort_by(|a, b| {
        b.is_git.cmp(&a.is_git).then(a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });

    // Check if current directory itself is a git repo
    let current_is_git = canonical.join(".git").exists();
    let current_has_pkg = canonical.join("package.json").exists();

    // Prepend current dir info as a special entry if it's a project
    if current_is_git || current_has_pkg {
        entries.insert(
            0,
            DirEntry {
                name: ". (current directory)".to_string(),
                path: canonical.to_string_lossy().to_string(),
                is_dir: true,
                is_git: current_is_git,
                has_package_json: current_has_pkg,
            },
        );
    }

    Ok(Json(BrowseResult {
        current: canonical.to_string_lossy().to_string(),
        parent,
        entries,
    }))
}

pub async fn create_dir(Json(payload): Json<CreateDirRequest>) -> Result<Json<DirEntry>, StatusCode> {
    let path = PathBuf::from(&payload.path);

    if path.exists() {
        return Err(StatusCode::CONFLICT);
    }

    std::fs::create_dir_all(&path).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(DirEntry {
        name: path.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default(),
        path: path.to_string_lossy().to_string(),
        is_dir: true,
        is_git: false,
        has_package_json: false,
    }))
}

#[derive(Deserialize)]
pub struct CreateDirRequest {
    pub path: String,
}

fn dirs_home() -> Option<PathBuf> {
    std::env::var("HOME").ok().map(PathBuf::from)
}

// ── File browser (shows files too, for PRD/doc selection) ──

#[derive(Deserialize)]
pub struct BrowseFilesQuery {
    pub path: Option<String>,
    pub extensions: Option<String>, // comma-separated: "md,txt,pdf,docx"
}

#[derive(Serialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub extension: String,
    pub size_bytes: u64,
}

#[derive(Serialize)]
pub struct BrowseFilesResult {
    pub current: String,
    pub parent: Option<String>,
    pub entries: Vec<FileEntry>,
}

pub async fn browse_files(Query(q): Query<BrowseFilesQuery>) -> Result<Json<BrowseFilesResult>, StatusCode> {
    let base = q.path.map(PathBuf::from).unwrap_or_else(|| dirs_home().unwrap_or_else(|| PathBuf::from("/")));
    if !base.is_dir() { return Err(StatusCode::BAD_REQUEST); }

    let canonical = base.canonicalize().unwrap_or(base);
    let parent = canonical.parent().map(|p| p.to_string_lossy().to_string());

    let allowed_ext: Vec<String> = q.extensions
        .unwrap_or_else(|| "md,txt,pdf,docx,doc,feature,json,yaml,yml,html".to_string())
        .split(',')
        .map(|s| s.trim().to_lowercase())
        .collect();

    let mut entries = Vec::new();

    if let Ok(read) = std::fs::read_dir(&canonical) {
        for entry in read.flatten() {
            let meta = match entry.metadata() { Ok(m) => m, Err(_) => continue };
            let name = entry.file_name().to_string_lossy().to_string();

            // Skip hidden
            if name.starts_with('.') { continue; }

            let full_path = entry.path().to_string_lossy().to_string();

            if meta.is_dir() {
                entries.push(FileEntry {
                    name,
                    path: full_path,
                    is_dir: true,
                    extension: String::new(),
                    size_bytes: 0,
                });
            } else {
                let ext = entry.path().extension()
                    .map(|e| e.to_string_lossy().to_lowercase())
                    .unwrap_or_default();
                if allowed_ext.contains(&ext) {
                    entries.push(FileEntry {
                        name,
                        path: full_path,
                        is_dir: false,
                        extension: ext,
                        size_bytes: meta.len(),
                    });
                }
            }
        }
    }

    // Sort: dirs first, then files alphabetically
    entries.sort_by(|a, b| {
        b.is_dir.cmp(&a.is_dir).then(a.name.to_lowercase().cmp(&b.name.to_lowercase()))
    });

    Ok(Json(BrowseFilesResult {
        current: canonical.to_string_lossy().to_string(),
        parent,
        entries,
    }))
}

// ── Read file content ──

#[derive(Deserialize)]
pub struct ReadFileQuery {
    pub path: String,
}

#[derive(Serialize)]
pub struct FileContent {
    pub name: String,
    pub path: String,
    pub content: String,
    pub size_bytes: u64,
}

pub async fn read_file(Query(q): Query<ReadFileQuery>) -> Result<Json<FileContent>, StatusCode> {
    let path = PathBuf::from(&q.path);
    if !path.is_file() { return Err(StatusCode::NOT_FOUND); }

    // Limit to 2MB
    let meta = std::fs::metadata(&path).map_err(|_| StatusCode::NOT_FOUND)?;
    if meta.len() > 2 * 1024 * 1024 { return Err(StatusCode::PAYLOAD_TOO_LARGE); }

    let content = std::fs::read_to_string(&path).map_err(|_| StatusCode::UNPROCESSABLE_ENTITY)?;
    let name = path.file_name().map(|n| n.to_string_lossy().to_string()).unwrap_or_default();

    Ok(Json(FileContent { name, path: q.path, content, size_bytes: meta.len() }))
}
