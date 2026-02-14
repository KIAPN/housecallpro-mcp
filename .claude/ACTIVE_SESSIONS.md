# Active Claude Sessions

*(No active sessions)*

---

## Session Registration Protocol

1. Add entry when starting multi-step work
2. Update heartbeat every 30-60 minutes
3. Remove entry when done (/ship handles this)
4. Stale sessions (>2 hours) can be considered abandoned

## Entry Format

```markdown
### [Your Work Title]
- **Started**: YYYY-MM-DD HH:MM
- **Focus**: What you're working on
- **Files**: Key files being modified
- **Heartbeat**: Last update time
```

## Why This Matters

Multiple Claude instances may work on the same codebase. This file prevents:
- Conflicting edits to same files
- Duplicate work
- Lost context when sessions overlap

See **Skill 29** for full multi-Claude coordination protocol.
