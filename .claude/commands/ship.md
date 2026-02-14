---
description: End-of-session shipping workflow - verify, commit, and create handoff context
argument-hint: "[1|2|3] tier level (1=quick, 2=standard, 3=full)"
---

# /ship - End of Session Workflow

Run the appropriate shipping tier based on the argument:

## Tier 1: Quick Ship (docs, tests, config-only changes)
1. Run `git status` to see changes
2. Run linter if available: `npm run lint 2>/dev/null || true`
3. Commit with appropriate message
4. Update `.claude/context.md` with what was done

## Tier 2: Standard Ship (default)
1. Run `git status` and `git diff --stat`
2. Run type check: `npx tsc --noEmit 2>/dev/null || true`
3. Run linter: `npm run lint 2>/dev/null || true`
4. Run tests: `npm test 2>/dev/null || true`
5. Review all changes and create commit
6. Update `.claude/context.md` with summary
7. Update `.claude/TODO.md` with next steps
8. Remove session from `.claude/ACTIVE_SESSIONS.md`

## Tier 3: Full Ship
1. All of Tier 2, plus:
2. Run full test suite including E2E if available
3. Check for schema drift (if DB project)
4. Security review of changed files
5. Update documentation if needed
6. Create PR if on feature branch

Default to Tier 2 if no argument provided.

**Always end by showing the user a summary of what was shipped and any next steps.**
