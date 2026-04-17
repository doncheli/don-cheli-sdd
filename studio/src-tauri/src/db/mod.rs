use anyhow::Result;
use chrono::Utc;
use rusqlite::{Connection, params};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub path: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PipelineRun {
    pub id: String,
    pub project_id: String,
    pub task: String,
    pub provider: String,
    pub model: String,
    pub status: String,
    pub total_cost: f64,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub error: Option<String>,
}

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new(path: &str) -> Result<Self> {
        let conn = Connection::open(path)?;
        conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
        Ok(Self { conn: Mutex::new(conn) })
    }

    pub fn migrate(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                path TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS pipeline_runs (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                task TEXT NOT NULL,
                provider TEXT NOT NULL DEFAULT 'claude',
                model TEXT NOT NULL DEFAULT 'sonnet',
                status TEXT NOT NULL DEFAULT 'pending',
                total_cost REAL NOT NULL DEFAULT 0.0,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                error TEXT
            );
            CREATE TABLE IF NOT EXISTS cost_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                run_id TEXT NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
                phase TEXT NOT NULL,
                cost_usd REAL NOT NULL,
                tokens_used INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            );",
        )?;
        Ok(())
    }

    // -- Projects --

    pub fn list_projects(&self) -> Result<Vec<Project>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, path, created_at FROM projects ORDER BY created_at DESC")?;
        let rows = stmt.query_map([], |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                path: row.get(2)?,
                created_at: row.get(3)?,
            })
        })?;
        Ok(rows.filter_map(|r| r.ok()).collect())
    }

    pub fn get_project(&self, id: &str) -> Result<Option<Project>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, path, created_at FROM projects WHERE id = ?1")?;
        let mut rows = stmt.query_map(params![id], |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                path: row.get(2)?,
                created_at: row.get(3)?,
            })
        })?;
        Ok(rows.next().and_then(|r| r.ok()))
    }

    pub fn create_project(&self, name: &str, path: &str) -> Result<Project> {
        let conn = self.conn.lock().unwrap();
        let project = Project {
            id: uuid::Uuid::new_v4().to_string(),
            name: name.to_string(),
            path: path.to_string(),
            created_at: Utc::now().to_rfc3339(),
        };
        conn.execute(
            "INSERT INTO projects (id, name, path, created_at) VALUES (?1, ?2, ?3, ?4)",
            params![project.id, project.name, project.path, project.created_at],
        )?;
        Ok(project)
    }

    pub fn delete_project(&self, id: &str) -> Result<bool> {
        let conn = self.conn.lock().unwrap();
        let rows = conn.execute("DELETE FROM projects WHERE id = ?1", params![id])?;
        Ok(rows > 0)
    }

    // -- Pipeline Runs --

    pub fn create_run(&self, project_id: &str, task: &str, provider: &str, model: &str) -> Result<PipelineRun> {
        let conn = self.conn.lock().unwrap();
        let run = PipelineRun {
            id: uuid::Uuid::new_v4().to_string(),
            project_id: project_id.to_string(),
            task: task.to_string(),
            provider: provider.to_string(),
            model: model.to_string(),
            status: "running".to_string(),
            total_cost: 0.0,
            started_at: Utc::now().to_rfc3339(),
            completed_at: None,
            error: None,
        };
        conn.execute(
            "INSERT INTO pipeline_runs (id, project_id, task, provider, model, status, total_cost, started_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            params![run.id, run.project_id, run.task, run.provider, run.model, run.status, run.total_cost, run.started_at],
        )?;
        Ok(run)
    }

    pub fn update_run_status(&self, run_id: &str, status: &str, error: Option<&str>) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        let completed = if status == "passed" || status == "failed" || status == "cancelled" {
            Some(Utc::now().to_rfc3339())
        } else {
            None
        };
        conn.execute(
            "UPDATE pipeline_runs SET status = ?1, completed_at = ?2, error = ?3 WHERE id = ?4",
            params![status, completed, error, run_id],
        )?;
        Ok(())
    }

    pub fn get_runs_for_project(&self, project_id: &str) -> Result<Vec<PipelineRun>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, project_id, task, provider, model, status, total_cost, started_at, completed_at, error FROM pipeline_runs WHERE project_id = ?1 ORDER BY started_at DESC"
        )?;
        let rows = stmt.query_map(params![project_id], |row| {
            Ok(PipelineRun {
                id: row.get(0)?,
                project_id: row.get(1)?,
                task: row.get(2)?,
                provider: row.get(3)?,
                model: row.get(4)?,
                status: row.get(5)?,
                total_cost: row.get(6)?,
                started_at: row.get(7)?,
                completed_at: row.get(8)?,
                error: row.get(9)?,
            })
        })?;
        Ok(rows.filter_map(|r| r.ok()).collect())
    }

    pub fn add_cost_entry(&self, run_id: &str, phase: &str, cost_usd: f64, tokens: i64) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO cost_entries (run_id, phase, cost_usd, tokens_used, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
            params![run_id, phase, cost_usd, tokens, Utc::now().to_rfc3339()],
        )?;
        conn.execute(
            "UPDATE pipeline_runs SET total_cost = (SELECT COALESCE(SUM(cost_usd), 0) FROM cost_entries WHERE run_id = ?1) WHERE id = ?1",
            params![run_id],
        )?;
        Ok(())
    }
}
