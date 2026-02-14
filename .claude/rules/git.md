---
paths: []
description: Universal git workflow rules (always active)
---
# Git Operations (WSL2 Environment)

**Source Skills**: Skill 2 (Git Operations), Skill 8 (Deployment Risk Scoring)

## WSL2 Push Command (REQUIRED)

**Network Restriction**: WSL2 cannot directly reach GitHub via native git push

```bash
# ✅ CORRECT: Use Windows CMD wrapper
/mnt/c/Windows/System32/cmd.exe /c "cd /d __PROJECT_PATH__ && git push"

# ❌ WRONG: Direct push fails
git push origin main  # Network timeout in WSL2
```

## Branch Naming Convention

```bash
# Feature work
git checkout -b feat/description

# Bug fixes
git checkout -b fix/description

# Database changes
git checkout -b db/description

# Documentation
git checkout -b docs/description
```

## Risk Classification

| Risk | Files | Branch Required? |
|------|-------|------------------|
| **HIGH** | migrations, edge functions, auth, payments | YES + PR |
| **MEDIUM** | pages, components, hooks, services | YES + PR |
| **LOW** | *.md, config files, .gitignore | No (direct OK) |

## Commit Message Format

```bash
# Format: type(scope): description
git commit -m "$(cat <<'EOF'
feat(payments): add commission calculation fallback

- Add fallback for edge function errors
- Implement retry logic with exponential backoff
- Add telemetry for fallback tracking

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code change (no feature/fix)
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `db`: Database migrations

## Pre-Commit Checklist

Before committing HIGH/MEDIUM risk changes:
- [ ] Tests pass: `npm run test:critical`
- [ ] Types valid: `npm run typecheck`
- [ ] Lint clean: `npm run lint:fix`
- [ ] Schema synced: `npm run generate:types` (if DB changes)

## PR Workflow

```bash
# 1. Create feature branch
git checkout -b feat/my-feature

# 2. Make changes and commit

# 3. Push branch (WSL2)
/mnt/c/Windows/System32/cmd.exe /c "cd /d __PROJECT_PATH__ && git push -u origin feat/my-feature"

# 4. Create PR
gh pr create --title "feat: description" --body "..."

# 5. After approval, merge
gh pr merge --squash
```

## E2E Testing Branches

**Deployment Topology**:
| Branch | Deploys To | URL |
|--------|-----------|-----|
| `main` | Production | __PRODUCTION_DOMAIN__ |
| `staging` | Preview | __PREVIEW_DOMAIN__ |
| PR branches | Ephemeral | *.vercel.app |

### E2E Fix Workflow (Use staging, not main)

For E2E test fixes, **always work on `staging` branch**:

```bash
# 1. Start on staging
git checkout staging

# 2. Make fixes
# ... edit code ...

# 3. Commit and push to staging
git add .
git commit -m "fix(e2e): description"
/mnt/c/Windows/System32/cmd.exe /c "cd /d __PROJECT_PATH__ && git push origin staging"

# 4. Wait for Vercel deploy (~60s), run E2E tests against preview

# 5. Only after tests PASS, merge to main
git checkout main
git merge staging --ff-only
/mnt/c/Windows/System32/cmd.exe /c "cd /d __PROJECT_PATH__ && git push origin main"
```

### Why This Matters

Testing code on `main` against preview URL will always test **stale code** because preview tracks `staging`, not `main`.

## Reference

- Full procedures: `.claude/skills/git-operations.md`
- Risk patterns: `.claude/config/risk-patterns.json`
