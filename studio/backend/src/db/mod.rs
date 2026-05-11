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
    pub status: String, // pending, running, passed, failed, cancelled
    pub current_phase: Option<String>,
    pub total_cost: f64,
    pub started_at: String,
    pub completed_at: Option<String>,
    pub error: Option<String>,
    pub signer: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PhaseRecord {
    pub id: i64,
    pub run_id: String,
    pub name: String,
    pub command: String,
    pub status: String, // pending, running, passed, failed, skipped
    pub attempt: i32,
    pub started_at: Option<String>,
    pub completed_at: Option<String>,
    pub duration_ms: Option<i64>,
    pub cost_usd: f64,
    pub error: Option<String>,
    pub layer: Option<String>, // backend, frontend, infra, design
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
                current_phase TEXT,
                total_cost REAL NOT NULL DEFAULT 0.0,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                error TEXT,
                signer TEXT
            );
            CREATE TABLE IF NOT EXISTS phase_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                run_id TEXT NOT NULL REFERENCES pipeline_runs(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                command TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'pending',
                attempt INTEGER NOT NULL DEFAULT 1,
                started_at TEXT,
                completed_at TEXT,
                duration_ms INTEGER,
                cost_usd REAL NOT NULL DEFAULT 0.0,
                error TEXT,
                layer TEXT
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

    // ── Projects ──

    pub fn list_projects(&self) -> Result<Vec<Project>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, path, created_at FROM projects ORDER BY created_at DESC")?;
        let rows = stmt.query_map([], |row| Ok(Project { id: row.get(0)?, name: row.get(1)?, path: row.get(2)?, created_at: row.get(3)? }))?;
        Ok(rows.filter_map(|r| r.ok()).collect())
    }

    pub fn get_project(&self, id: &str) -> Result<Option<Project>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, path, created_at FROM projects WHERE id = ?1")?;
        let mut rows = stmt.query_map(params![id], |row| Ok(Project { id: row.get(0)?, name: row.get(1)?, path: row.get(2)?, created_at: row.get(3)? }))?;
        Ok(rows.next().and_then(|r| r.ok()))
    }

    pub fn create_project(&self, name: &str, path: &str) -> Result<Project> {
        let conn = self.conn.lock().unwrap();
        let project = Project { id: uuid::Uuid::new_v4().to_string(), name: name.to_string(), path: path.to_string(), created_at: Utc::now().to_rfc3339() };
        conn.execute("INSERT INTO projects (id, name, path, created_at) VALUES (?1, ?2, ?3, ?4)", params![project.id, project.name, project.path, project.created_at])?;
        Ok(project)
    }

    pub fn delete_project(&self, id: &str) -> Result<bool> {
        let conn = self.conn.lock().unwrap();
        Ok(conn.execute("DELETE FROM projects WHERE id = ?1", params![id])? > 0)
    }

    // ── Runs ──

    pub fn create_run(&self, project_id: &str, task: &str, provider: &str, model: &str, signer: Option<&str>) -> Result<PipelineRun> {
        let conn = self.conn.lock().unwrap();
        let run = PipelineRun {
            id: uuid::Uuid::new_v4().to_string(), project_id: project_id.to_string(),
            task: task.to_string(), provider: provider.to_string(), model: model.to_string(),
            status: "running".to_string(), current_phase: None, total_cost: 0.0,
            started_at: Utc::now().to_rfc3339(), completed_at: None, error: None,
            signer: signer.map(|s| s.to_string()),
        };
        conn.execute(
            "INSERT INTO pipeline_runs (id, project_id, task, provider, model, status, total_cost, started_at, signer) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)",
            params![run.id, run.project_id, run.task, run.provider, run.model, run.status, run.total_cost, run.started_at, run.signer],
        )?;

        // Create phase records
        let phases = [
            ("specify", "/dc:especificar"), ("clarify", "/dc:clarificar"),
            ("plan", "/dc:planificar-tecnico"), ("design", "/dc:diseñar-ui"),
            ("breakdown", "/dc:desglosar"), ("implement", "/dc:implementar"),
            ("review", "/dc:revisar"),
        ];
        for (name, cmd) in &phases {
            conn.execute(
                "INSERT INTO phase_records (run_id, name, command, status) VALUES (?1,?2,?3,'pending')",
                params![run.id, name, cmd],
            )?;
        }
        Ok(run)
    }

    pub fn get_run(&self, run_id: &str) -> Result<Option<PipelineRun>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id,project_id,task,provider,model,status,current_phase,total_cost,started_at,completed_at,error,signer FROM pipeline_runs WHERE id=?1")?;
        let mut rows = stmt.query_map(params![run_id], |r| Ok(PipelineRun {
            id: r.get(0)?, project_id: r.get(1)?, task: r.get(2)?, provider: r.get(3)?,
            model: r.get(4)?, status: r.get(5)?, current_phase: r.get(6)?, total_cost: r.get(7)?,
            started_at: r.get(8)?, completed_at: r.get(9)?, error: r.get(10)?, signer: r.get(11)?,
        }))?;
        Ok(rows.next().and_then(|r| r.ok()))
    }

    pub fn list_runs(&self, project_id: Option<&str>, status_filter: Option<&str>) -> Result<Vec<PipelineRun>> {
        let conn = self.conn.lock().unwrap();
        let sql = match (project_id, status_filter) {
            (Some(pid), Some(sf)) => format!("SELECT id,project_id,task,provider,model,status,current_phase,total_cost,started_at,completed_at,error,signer FROM pipeline_runs WHERE project_id='{}' AND status='{}' ORDER BY started_at DESC LIMIT 50", pid, sf),
            (Some(pid), None) => format!("SELECT id,project_id,task,provider,model,status,current_phase,total_cost,started_at,completed_at,error,signer FROM pipeline_runs WHERE project_id='{}' ORDER BY started_at DESC LIMIT 50", pid),
            (None, Some(sf)) => format!("SELECT id,project_id,task,provider,model,status,current_phase,total_cost,started_at,completed_at,error,signer FROM pipeline_runs WHERE status='{}' ORDER BY started_at DESC LIMIT 50", sf),
            (None, None) => "SELECT id,project_id,task,provider,model,status,current_phase,total_cost,started_at,completed_at,error,signer FROM pipeline_runs ORDER BY started_at DESC LIMIT 50".to_string(),
        };
        let mut stmt = conn.prepare(&sql)?;
        let rows = stmt.query_map([], |r| Ok(PipelineRun {
            id: r.get(0)?, project_id: r.get(1)?, task: r.get(2)?, provider: r.get(3)?,
            model: r.get(4)?, status: r.get(5)?, current_phase: r.get(6)?, total_cost: r.get(7)?,
            started_at: r.get(8)?, completed_at: r.get(9)?, error: r.get(10)?, signer: r.get(11)?,
        }))?;
        Ok(rows.filter_map(|r| r.ok()).collect())
    }

    pub fn list_active_runs(&self) -> Result<Vec<PipelineRun>> {
        self.list_runs(None, Some("running"))
    }

    pub fn list_today_runs(&self) -> Result<Vec<PipelineRun>> {
        let conn = self.conn.lock().unwrap();
        let today = Utc::now().format("%Y-%m-%d").to_string();
        let mut stmt = conn.prepare("SELECT id,project_id,task,provider,model,status,current_phase,total_cost,started_at,completed_at,error,signer FROM pipeline_runs WHERE started_at >= ?1 ORDER BY started_at DESC")?;
        let rows = stmt.query_map(params![today], |r| Ok(PipelineRun {
            id: r.get(0)?, project_id: r.get(1)?, task: r.get(2)?, provider: r.get(3)?,
            model: r.get(4)?, status: r.get(5)?, current_phase: r.get(6)?, total_cost: r.get(7)?,
            started_at: r.get(8)?, completed_at: r.get(9)?, error: r.get(10)?, signer: r.get(11)?,
        }))?;
        Ok(rows.filter_map(|r| r.ok()).collect())
    }

    pub fn update_run(&self, run_id: &str, status: &str, current_phase: Option<&str>, error: Option<&str>) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        let completed = if status == "passed" || status == "failed" || status == "cancelled" { Some(Utc::now().to_rfc3339()) } else { None };
        conn.execute(
            "UPDATE pipeline_runs SET status=?1, current_phase=?2, completed_at=?3, error=?4 WHERE id=?5",
            params![status, current_phase, completed, error, run_id],
        )?;
        Ok(())
    }

    // ── Phase Records ──

    pub fn get_phases_for_run(&self, run_id: &str) -> Result<Vec<PhaseRecord>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id,run_id,name,command,status,attempt,started_at,completed_at,duration_ms,cost_usd,error,layer FROM phase_records WHERE run_id=?1 ORDER BY id")?;
        let rows = stmt.query_map(params![run_id], |r| Ok(PhaseRecord {
            id: r.get(0)?, run_id: r.get(1)?, name: r.get(2)?, command: r.get(3)?,
            status: r.get(4)?, attempt: r.get(5)?, started_at: r.get(6)?, completed_at: r.get(7)?,
            duration_ms: r.get(8)?, cost_usd: r.get(9)?, error: r.get(10)?, layer: r.get(11)?,
        }))?;
        Ok(rows.filter_map(|r| r.ok()).collect())
    }

    pub fn update_phase(&self, record_id: i64, status: &str, error: Option<&str>, duration_ms: Option<i64>, layer: Option<&str>) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        let now = Utc::now().to_rfc3339();
        let completed = if status == "passed" || status == "failed" { Some(now.as_str()) } else { None };
        conn.execute(
            "UPDATE phase_records SET status=?1, error=?2, duration_ms=?3, completed_at=?4, layer=?5 WHERE id=?6",
            params![status, error, duration_ms, completed, layer, record_id],
        )?;
        Ok(())
    }

    pub fn start_phase(&self, record_id: i64) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("UPDATE phase_records SET status='running', started_at=?1 WHERE id=?2", params![Utc::now().to_rfc3339(), record_id])?;
        Ok(())
    }

    pub fn retry_phase(&self, record_id: i64) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("UPDATE phase_records SET status='pending', error=NULL, attempt=attempt+1 WHERE id=?1", params![record_id])?;
        Ok(())
    }

    pub fn add_cost_entry(&self, run_id: &str, phase: &str, cost_usd: f64, tokens: i64) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("INSERT INTO cost_entries (run_id, phase, cost_usd, tokens_used, created_at) VALUES (?1,?2,?3,?4,?5)", params![run_id, phase, cost_usd, tokens, Utc::now().to_rfc3339()])?;
        conn.execute("UPDATE pipeline_runs SET total_cost = (SELECT COALESCE(SUM(cost_usd),0) FROM cost_entries WHERE run_id=?1) WHERE id=?1", params![run_id])?;
        Ok(())
    }

    pub fn get_runs_for_project(&self, project_id: &str) -> Result<Vec<PipelineRun>> {
        self.list_runs(Some(project_id), None)
    }

    pub fn update_run_status(&self, run_id: &str, status: &str, error: Option<&str>) -> Result<()> {
        self.update_run(run_id, status, None, error)
    }
}
