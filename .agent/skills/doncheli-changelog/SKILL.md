---
name: doncheli-changelog
description: Auto-generate CHANGELOG.md entries from git commit history. Activate when user mentions "changelog", "release notes", "what changed", "generate changelog", "CHANGELOG", "release history".
---

# Don Cheli: Changelog Auto-Generator

## Instructions

1. Determine the commit range:
   - Default: from the last semver tag to HEAD
   - With `--from`/`--to`: use the specified refs
   - With `--version`: use that as the new version number
2. Run `git log --oneline <range>` and parse conventional commit prefixes
3. Map commit types to Keep a Changelog categories:
   - `feat` / `feat!` → Added (breaking changes go in a separate top section)
   - `fix` → Fixed
   - `refactor` / `perf` → Changed
   - `docs` → Changed
   - `security` → Security
   - `deprecated` → Deprecated
   - `remove` → Removed
   - `test` / `chore` / `ci` → omit by default (include with `--verbose`)
4. Extract the short hash and append it to each entry for traceability
5. Skip merge commits (`Merge branch`, `Merge pull request`)
6. Insert the new section at the top of `CHANGELOG.md`, below the header — never overwrite existing entries
7. If no `CHANGELOG.md` exists, create it with the standard Keep a Changelog header
8. With `--dry-run`, print to stdout only — do not write to file
9. After writing, confirm with the user and suggest `git add CHANGELOG.md`

## Quality Gate

- If fewer than 2 commits are found in the range, warn the user before generating
- If breaking changes are detected (`feat!`, `BREAKING CHANGE` footer), highlight them prominently
- Never infer a version number from non-semver tags — ask the user to provide `--version`
