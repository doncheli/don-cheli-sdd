/**
 * Don Cheli Runtime — Git Worktree Manager
 * Forked and adapted from Sandcastle (mattpocock/sandcastle, Apache 2.0)
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface WorktreeInfo {
  path: string;
  branch: string;
  baseBranch: string;
}

function git(args: string, cwd?: string): string {
  return execSync(`git ${args}`, {
    encoding: "utf-8",
    cwd,
    timeout: 30_000,
  }).trim();
}

export function getCurrentBranch(cwd?: string): string {
  return git("branch --show-current", cwd);
}

export function isGitRepo(cwd?: string): boolean {
  try {
    git("rev-parse --is-inside-work-tree", cwd);
    return true;
  } catch {
    return false;
  }
}

export function hasUncommittedChanges(cwd?: string): boolean {
  const status = git("status --porcelain", cwd);
  return status.length > 0;
}

export function createWorktree(
  repoDir: string,
  phaseName: string,
  baseBranch?: string
): WorktreeInfo {
  const branch = `dc-${phaseName}-${Date.now()}`;
  const worktreeDir = join(repoDir, ".dc", "worktrees");
  const worktreePath = join(worktreeDir, branch);

  mkdirSync(worktreeDir, { recursive: true });

  const base = baseBranch ?? getCurrentBranch(repoDir);
  git(`worktree add -b ${branch} ${worktreePath}`, repoDir);

  return { path: worktreePath, branch, baseBranch: base };
}

export function commitWorktree(worktreePath: string, message: string): string | null {
  try {
    git("add -A", worktreePath);
    const status = git("status --porcelain", worktreePath);
    if (!status) return null;

    git(`commit -m "${message}"`, worktreePath);
    const sha = git("rev-parse HEAD", worktreePath);
    return sha;
  } catch {
    return null;
  }
}

export function mergeWorktree(repoDir: string, info: WorktreeInfo): boolean {
  try {
    git(`checkout ${info.baseBranch}`, repoDir);
    git(`merge ${info.branch} --no-edit`, repoDir);
    return true;
  } catch {
    return false;
  }
}

export function cleanupWorktree(repoDir: string, info: WorktreeInfo): void {
  try {
    git(`worktree remove ${info.path} --force`, repoDir);
  } catch {}
  try {
    git(`branch -D ${info.branch}`, repoDir);
  } catch {}
}

export function listWorktrees(repoDir: string): string[] {
  const output = git("worktree list --porcelain", repoDir);
  return output
    .split("\n")
    .filter((line) => line.startsWith("worktree "))
    .map((line) => line.replace("worktree ", ""));
}
