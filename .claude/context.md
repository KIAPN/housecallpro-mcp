# Context - claude-code-starter

## Current Focus

**Template repository complete** - All programmatic work done. Ready for users.

## Recent Decisions

### Dec 2025 - Template Creation

1. **Placeholder convention**: `__PLACEHOLDER__` format for easy find/replace
   - Rationale: Works with sed, visible in editors, grep-able

2. **init.sh self-destructs**: Setup script removes itself after completion
   - Rationale: Clean repo after initialization, no template cruft

3. **Optional modules pattern**: Supabase/Vercel/MCP-server as separate modules
   - Rationale: Not all projects need all integrations

4. **53 skills preserved**: Full skill library from attic-referral-pro
   - Rationale: Institutional knowledge is the primary value

5. **MCP setup as markdown guides**: Individual `.md` files per MCP server
   - Rationale: Easy to follow, copy-paste ready, self-documenting

## Known Issues / Blockers

- **Template enablement**: Requires manual GitHub UI action (Settings → Template repository)
- **CRLF in WSL2**: Local hook files may have Windows line endings - use `dos2unix` if needed

## Session History

### Session: Dec 13, 2025 - Template Creation Complete
- Pushed all 28 slash commands to GitHub
- Created README.md with "Use this template" badge
- Created TEMPLATE_README.md with post-init instructions
- Verified init.sh (240 lines, comprehensive)
- All 11 MCP setup guides in place
- Modules: supabase, vercel, mcp-server ready

---

## Template Notes

This file tracks session-to-session context for Claude.

### Best Practices

1. **Keep it under 500 lines** - Use `.claude/hooks/context-groom.sh` to archive old content
2. **Update "Current Focus"** at session start
3. **Document decisions** with rationale
4. **Clear completed items** regularly

### Archiving

When context.md grows large, run:
```bash
bash .claude/hooks/context-groom.sh
```

This archives older content to `.claude/docs/archived-context/`.
