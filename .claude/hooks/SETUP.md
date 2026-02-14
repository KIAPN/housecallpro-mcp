# Hook Setup Guide

This directory contains lifecycle hooks for Claude Code sessions.

## Hook Types

| Hook | When | Purpose |
|------|------|---------|
| `session-start.sh` | Session begins | Load context, show active sessions |
| `session-end.sh` | Session ends | Checklist reminder |
| `context-groom.sh` | Called by /ship | Maintain context.md size |
| `pre-tool-safety.sh` | Before tool execution | Block dangerous operations |
| `stop-quality-check.sh` | Claude stops | Quick TypeScript/ESLint check |

## Installation

### Option 1: Claude Settings (Recommended)

Add to your Claude settings (`.claude/settings.json` or global settings):

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "bash .claude/hooks/session-start.sh",
        "timeout": 5000
      }
    ],
    "SessionEnd": [
      {
        "command": "bash .claude/hooks/session-end.sh",
        "timeout": 5000
      }
    ],
    "Stop": [
      {
        "command": "bash .claude/hooks/stop-quality-check.sh",
        "timeout": 10000
      }
    ],
    "PreToolUse": [
      {
        "matcher": {
          "tool_name": "Bash"
        },
        "command": "bash .claude/hooks/pre-tool-safety.sh",
        "timeout": 2000
      }
    ]
  }
}
```

### Option 2: Git Hooks

For pre-commit quality checks:

```bash
# .git/hooks/pre-commit
#!/bin/bash
bash .claude/hooks/stop-quality-check.sh
```

### Option 3: Husky (npm projects)

```bash
npx husky install
npx husky add .husky/pre-commit "bash .claude/hooks/stop-quality-check.sh"
```

## Customization

### Adding Project-Specific Checks

Edit `stop-quality-check.sh` to add:
- Custom linting rules
- Test runners
- Build verification

### Modifying Safety Blocks

Edit `pre-tool-safety.sh` to:
- Add project-specific dangerous patterns
- Adjust production database detection
- Add custom warnings

### Context Grooming

Edit `context-groom.sh` to adjust:
- `MAX_LINES` - When to trigger grooming (default: 500)
- `ARCHIVE_THRESHOLD` - Lines to keep (default: 400)
- Archive location and naming

## Environment Variables

The hooks expect these to be available:

| Variable | Used By | Purpose |
|----------|---------|---------|
| `CLAUDE_TOOL_INPUT` | pre-tool-safety.sh | Tool input for safety check |

## Troubleshooting

### Hooks Not Running

1. Check file permissions: `chmod +x .claude/hooks/*.sh`
2. Verify paths in settings.json are correct
3. Check timeout isn't too short

### Context Grooming Issues

1. Ensure `.claude/docs/archived-context/` exists
2. Check write permissions
3. Verify context.md format hasn't changed

### Safety Hook Blocking Valid Operations

1. Review blocked pattern in output
2. Adjust patterns in pre-tool-safety.sh
3. Add exceptions for your workflow

## Integration with /ship

The `/ship` command calls these hooks as part of its workflow:
- Phase 3: Calls `context-groom.sh` for context management
- Other phases use hook functionality indirectly

## Testing Hooks

```bash
# Test session start
bash .claude/hooks/session-start.sh

# Test safety check
CLAUDE_TOOL_INPUT="rm -rf /" bash .claude/hooks/pre-tool-safety.sh
# Should output: BLOCKED

# Test quality check
bash .claude/hooks/stop-quality-check.sh
```
