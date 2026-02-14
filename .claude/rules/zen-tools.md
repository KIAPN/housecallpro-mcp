---
paths: []
description: Universal MCP tool selection (always active)
---
# Zen MCP Tool Selection

**Purpose**: Auto-activate when Claude should escalate to specialized Zen tools
**Principle**: Claude handles 90% of work; Zen tools for hard problems

## Auto-Invoke Triggers

These patterns should trigger automatic tool invocation:

| Trigger Pattern | Tool | Thinking Mode |
|-----------------|------|---------------|
| 3+ failed fix attempts | `mcp__zen__debug` | high |
| File >500 LOC being modified | `mcp__zen__analyze` first | medium |
| Editing `auth*`, `payment*`, Edge Functions | `mcp__zen__secaudit` | high |
| Architecture decision (new feature, refactor) | `mcp__zen__thinkdeep` | max |
| Creating tests for existing code | `mcp__zen__testgen` | medium |
| Code review requested | `mcp__zen__codereview` | medium |
| HIGH-risk commit (Skill 8 score >20) | `mcp__zen__precommit` | medium |
| Complex planning (multi-file, multi-step) | `mcp__zen__planner` | high |

## Model Selection

**Primary**: Claude (current session) - handles 90% of work
**Escalation**: When Claude gets stuck = hard problem

| Complexity | Model | Use When |
|------------|-------|----------|
| Default | Claude (session) | All normal work - primary |
| Quick lookup | gemini-2.5-flash | Fast docs, simple queries |
| Claude stuck (1st) | o3-pro | Hard debugging, complex root cause |
| Claude stuck (2nd) | gemini-2.5-pro | Architecture, multi-model consensus |
| Universe-scale | o3-pro + gemini-2.5-pro | Consensus between best models |

**Escalation Trigger**: 3+ failed attempts by Claude = auto-suggest escalation

## Tool Quick Reference

### Debugging & Analysis
| Tool | When | Thinking | Typical Model |
|------|------|----------|---------------|
| `mcp__zen__debug` | Bug investigation | low→high | flash2.5→o3-pro |
| `mcp__zen__analyze` | Code analysis | medium | flash2.5 |
| `mcp__zen__tracer` | Execution flow | medium | flash2.5 |

### Quality & Security
| Tool | When | Thinking | Typical Model |
|------|------|----------|---------------|
| `mcp__zen__codereview` | PR review, quality check | medium | o3-mini |
| `mcp__zen__secaudit` | Security-sensitive code | high | o3 |
| `mcp__zen__precommit` | Before HIGH-risk commits | medium | flash2.5 |

### Generation & Planning
| Tool | When | Thinking | Typical Model |
|------|------|----------|---------------|
| `mcp__zen__testgen` | Create test suites | medium | flash2.5 |
| `mcp__zen__docgen` | Generate documentation | low | flash2.5 |
| `mcp__zen__refactor` | Refactoring analysis | medium | o3-mini |
| `mcp__zen__planner` | Complex planning | high | gemini-2.5-pro |

### Reasoning & Collaboration
| Tool | When | Thinking | Typical Model |
|------|------|----------|---------------|
| `mcp__zen__thinkdeep` | Architecture decisions | max | gemini-2.5-pro |
| `mcp__zen__consensus` | Multi-model validation | N/A | Multiple |
| `mcp__zen__chat` | Quick questions | low | flash2.5 |
| `mcp__zen__challenge` | When user disagrees | N/A | Current |

## Avoid Over-Using

- Don't use `thinkdeep` for simple questions → use `chat`
- Don't use `secaudit` for non-security code
- Don't use `codereview` for trivial 1-line changes
- Don't use `consensus` unless decision is truly critical
- Don't escalate to o3-pro unless actually stuck

## Integration with Other MCPs

| Need | Primary MCP | Zen Complement |
|------|-------------|----------------|
| Library docs | `mcp__context7__get-library-docs` | `chat` for questions |
| Production errors | `mcp__sentry__search_issues` | `debug` for root cause |
| Deployment issues | `mcp__vercel__get_deployment_build_logs` | `debug` for investigation |
| Database problems | `mcp__supabase-dev__execute_sql` | `analyze` for optimization |
| Code understanding | `mcp__repomix__pack_codebase` | `analyze` for deep dive |

## Example Invocations

### Simple Debug (Claude stuck once)
```
No Zen needed yet - keep trying
```

### Complex Debug (Claude stuck 3+ times)
```
mcp__zen__debug with:
- step: "Investigation description"
- step_number: 1
- total_steps: 3
- model: "o3-pro"
- thinking_mode: "high"
```

### Security Review (editing auth code)
```
mcp__zen__secaudit with:
- step: "Security review of auth changes"
- relevant_files: ["path/to/auth/files"]
- threat_level: "high"
- model: "o3"
```

### Architecture Decision
```
mcp__zen__thinkdeep with:
- step: "Evaluate architectural approach"
- problem_context: "Detailed context"
- thinking_mode: "max"
- model: "gemini-2.5-pro"
```
