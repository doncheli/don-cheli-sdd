/**
 * Don Cheli Runtime — Logger with Progress Bar
 */

export const COLORS = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  reset: "\x1b[0m",
} as const;

export function progressBar(current: number, total: number, label: string): void {
  const pct = Math.min(100, Math.round((current / total) * 100));
  const filled = Math.floor(pct / 5);
  const empty = 20 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  process.stdout.write(
    `\r  ${COLORS.cyan}[${bar}]${COLORS.reset} ${COLORS.bold}${pct.toString().padStart(3)}%${COLORS.reset}  ${label.padEnd(40)}`
  );
  if (pct >= 100) console.log();
}

export function header(text: string): void {
  console.log(`\n${COLORS.bold}${"═".repeat(60)}${COLORS.reset}`);
  console.log(`${COLORS.bold}  ${text}${COLORS.reset}`);
  console.log(`${COLORS.bold}${"═".repeat(60)}${COLORS.reset}\n`);
}

export function phaseHeader(name: string, attempt: number, maxRetries: number): void {
  console.log(`\n${COLORS.bold}${"─".repeat(50)}${COLORS.reset}`);
  console.log(`  ${COLORS.cyan}Phase: ${name.toUpperCase()}${COLORS.reset} ${COLORS.dim}(attempt ${attempt}/${maxRetries})${COLORS.reset}`);
  console.log(`${COLORS.bold}${"─".repeat(50)}${COLORS.reset}\n`);
}

export function success(msg: string): void {
  console.log(`  ${COLORS.green}✅${COLORS.reset} ${msg}`);
}

export function fail(msg: string): void {
  console.log(`  ${COLORS.red}❌${COLORS.reset} ${msg}`);
}

export function warn(msg: string): void {
  console.log(`  ${COLORS.yellow}⚠️${COLORS.reset} ${msg}`);
}

export function info(msg: string): void {
  console.log(`  ${COLORS.dim}${msg}${COLORS.reset}`);
}

export function gateResult(name: string, passed: boolean, message: string): void {
  const icon = passed ? `${COLORS.green}✅` : `${COLORS.red}❌`;
  console.log(`  ${icon}${COLORS.reset} Gate: ${name} — ${message}`);
}

export function summary(results: { phase: string; passed: boolean; commits: number }[]): void {
  header("PIPELINE SUMMARY");
  let totalCommits = 0;
  for (const r of results) {
    const icon = r.passed ? `${COLORS.green}✅` : `${COLORS.red}❌`;
    console.log(`  ${icon}${COLORS.reset} ${r.phase.padEnd(12)} — ${r.commits} commits`);
    totalCommits += r.commits;
  }
  const allPassed = results.every((r) => r.passed);
  console.log(`\n  Total commits: ${totalCommits}`);
  console.log(`  Result: ${allPassed ? `${COLORS.green}ALL PHASES PASSED` : `${COLORS.red}PIPELINE FAILED`}${COLORS.reset}\n`);
}
