# housecallpro-mcp - CLAUDE.md v1.0
<!-- Session Startup: Check ACTIVE_SESSIONS.md → TODO.md → context.md -->

## Mission

**Product**: __PRODUCT_DESCRIPTION__
**Status**: __STATUS__ at __PRODUCTION_URL__

## Critical Safety Rules (NON-NEGOTIABLE)

1. **Database schema IS the truth** - `npm run generate:types` after ANY schema change
2. **Branch for code, PR for review** - HIGH/MEDIUM risk requires feature branch
3. **Never break production** - DEV → PREVIEW → PROD
4. **Single source of truth or death** - No duplicate transformations
5. **Permanent solutions over hacks** - Fix root causes
6. **Secrets in Doppler only** - Never hardcode API keys; launch via `doppler run --`

## Quick Reference

| Need | Location |
|------|----------|
| Architecture & Stack | `.claude/core/architecture.md` |
| Commands | `.claude/core/commands.md` |
| Skills Index | `.claude/core/skill-index.md` |
| Full Skills | `.claude/skills.md` |
| Current Context | `.claude/context.md` |

## MCP Toolchain

### Primary Tools

| Need | MCP Tool | When |
|------|----------|------|
| Debugging | `mcp__zen__debug` | After 3+ failed attempts (auto-escalate) |
| Security | `mcp__zen__secaudit` | Editing auth/payment/edge functions |
| Deep thinking | `mcp__zen__thinkdeep` | Architecture decisions |
| Pre-commit | `mcp__zen__precommit` | HIGH-risk changes (score >20) |
| Library docs | `mcp__context7__get-library-docs` | Unfamiliar APIs |
| Prod issues | `mcp__sentry__search_issues` | Before deploy, during debugging |
| Codebase pack | `mcp__repomix__generate_skill` | After /ship (keeps docs fresh) |

### Model Selection (Guardrails)

| Situation | Model | Rationale |
|-----------|-------|-----------|
| Default work | Claude (session) | Primary - handles 90% |
| Quick lookups | gemini-2.5-flash | Fast docs, simple queries |
| Stuck 1st time | o3-mini | Medium complexity |
| Stuck 2nd time | o3 | Hard problems |
| Stuck 3rd time | o3-pro | Escalate! |
| Architecture | gemini-2.5-pro | Deep reasoning |

See `.claude/rules/zen-tools.md` for auto-invoke triggers.

## Lifecycle Automation

### Session Start (via hook)
- Checks ACTIVE_SESSIONS.md for conflicts
- Warns about stale sessions (>2hr)
- Shows current branch and focus

### During Work
- **Zen auto-invoke** per `.claude/rules/zen-tools.md`
- **Sentry check** before major deploys
- **Context7** for library documentation

### Session End (/ship)
- Phase 3: Auto-groom context.md (tiered, ~500 lines)
- Phase 6: Sentry check for prod issues
- Phase 7: Repomix skill regeneration
- Updates ACTIVE_SESSIONS.md

## Path-Specific Rules (Auto-Loaded)

Rules in `.claude/rules/` auto-activate based on file patterns:

| Rule | Activates When Editing |
|------|------------------------|
| `database.md` | `supabase/migrations/**`, `types/database*.ts` |
| `testing.md` | `tests/**`, `**/*.test.ts` |
| `security.md` | `supabase/functions/**`, `**/auth*` |
| `api.md` | `api/**/*.ts`, `services/**/*.ts` |
| `zen-tools.md` | Complex tasks (auto-invoke triggers) |
| `git.md` | Always active (universal) |

## Key Commands

| Command | Purpose |
|---------|---------|
| `/ship [1\|2\|3]` | End-of-work shipping (1=quick, 2=standard, 3=full) |
| `/status` | Project status check (git, sessions, focus, TODOs) |
| `/a_debug` | Systematic debugging with Zen |
| `/a_security-review` | Security audit with Zen secaudit |

## Behavioral Checkpoints

| When | Action |
|------|--------|
| Session start | Check `.claude/ACTIVE_SESSIONS.md` - register if multi-step work |
| After major milestone | Update `.claude/ACTIVE_SESSIONS.md` with progress |
| Before commit (HIGH-risk) | Run `mcp__zen__precommit` |
| Session end | Run `/ship` - handles everything |

## Emergency

| Issue | Solution |
|-------|----------|
| RLS Recursion | `.claude/emergency/rls-fix.md` + Skill 3 |
| Git Push (WSL2) | Use Windows CMD wrapper (see `rules/git.md`) |
| Production Incident | Skill 9 Emergency Response |
| Complex Bug | `/a_debug` (auto-escalates models) |

## Multi-Claude Coordination

**Assume another Claude is always working in the same codebase.**
- Register in `.claude/ACTIVE_SESSIONS.md` on session start
- `/ship` removes your session on completion
- Stale detection warns at next session start (>2hr)
- See Skill 29 for conflict prevention

---

*v1.0 - Template from claude-code-starter*
*When lost: context.md → core/skill-index.md → /validate-skills*
