# TODO - claude-code-starter

## Priority Items

- [x] **Enable as GitHub template** - Settings → Template repository checkbox
  - ✅ Completed Dec 13, 2025

- [ ] **README.md is massively out of date** - Needs comprehensive update
  - Current README doesn't reflect actual repo contents
  - Consider: Repomix integration for auto-generation?
  - `mcp__repomix__generate_skill` could feed README updates
  - Pattern: `/ship` Phase 7 already uses Repomix for skill regeneration
  - Potential: GitHub Action that regenerates README from repo state

## Backlog

- [ ] Add `.gitattributes` with `* text=auto` for line ending normalization
- [ ] Create GitHub Action for template validation (ensure placeholders work)
- [ ] Add CONTRIBUTING.md for community contributions
- [ ] Consider adding Playwright/Vitest config templates
- [ ] Add example `.env.example` with common variables

## Completed

### Dec 13, 2025 - Initial Template Creation

- [x] Create GitHub repository (Attic-Ops/claude-code-starter)
- [x] Push CLAUDE.md with placeholder convention
- [x] Push all 28 slash commands
- [x] Push 11 path-specific rules
- [x] Push 11 MCP setup guides
- [x] Create init.sh setup script (240 lines)
- [x] Push session lifecycle hooks (start, end, safety, groom)
- [x] Push optional modules (supabase, vercel, mcp-server)
- [x] Create README.md with feature overview
- [x] Create TEMPLATE_README.md with post-init guide
- [x] Push skills.md (53 skills reference)
- [x] Push core/ directory (architecture, skill-index, commands)

---

## Template Notes

This file tracks work items for the project.

### Guidelines

1. **Priority first** - Most important items at top
2. **Be specific** - "Fix auth bug" → "Fix JWT refresh on mobile Safari"
3. **Reference skills** - Link to relevant skills when applicable
4. **Move to Completed** - Don't delete, move for reference
5. **Archive monthly** - Move old completed items to `.claude/docs/`

### Integration with /ship

The `/ship` command checks this file and reminds you to update it.
