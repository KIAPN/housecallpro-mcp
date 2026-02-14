---
description: Show project status - git state, active sessions, current focus, and pending tasks
---

# /status - Project Status Check

Report the following in a concise format:

## 1. Git Status
- Current branch
- Uncommitted changes count
- Last commit message and time
- Whether branch is ahead/behind remote

## 2. Active Sessions
- Read `.claude/ACTIVE_SESSIONS.md` and report any active sessions
- Flag stale sessions (>2 hours old)

## 3. Current Focus
- Read `.claude/context.md` and show the "Current Focus" section

## 4. TODO Items
- Read `.claude/TODO.md` (or `TODO.md` at root) and show top 5 pending items

## 5. MCP Server Status
- List connected MCP servers via `/mcp`

Present this as a clean, scannable summary. Flag any warnings (stale sessions, uncommitted changes, etc.) at the top.
