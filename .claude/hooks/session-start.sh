#!/bin/bash
# SessionStart Hook - Load minimal context automatically
# stdout is added to Claude's context for SessionStart hooks

set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo '.')"

# Show active sessions (critical for Multi-Claude coordination)
if [[ -f ".claude/ACTIVE_SESSIONS.md" ]]; then
    echo "=== ACTIVE SESSIONS ==="
    head -20 .claude/ACTIVE_SESSIONS.md 2>/dev/null || true
    echo ""

    # Stale session detection (>2 hours)
    NOW=$(date +%s)
    STALE_THRESHOLD=$((2 * 60 * 60))

    while IFS= read -r line; do
        if [[ "$line" =~ ([0-9]{4}-[0-9]{2}-[0-9]{2}[[:space:]]+[0-9]{2}:[0-9]{2}) ]]; then
            TIMESTAMP="${BASH_REMATCH[1]}"
            SESSION_TIME=$(date -d "$TIMESTAMP" +%s 2>/dev/null || echo "0")
            if [[ $SESSION_TIME -gt 0 ]]; then
                AGE=$((NOW - SESSION_TIME))
                if [[ $AGE -gt $STALE_THRESHOLD ]]; then
                    HOURS=$((AGE / 3600))
                    echo "WARNING: Stale session detected (${HOURS}h old)"
                    echo "  -> Consider removing from ACTIVE_SESSIONS.md"
                    echo ""
                fi
            fi
        fi
    done < ".claude/ACTIVE_SESSIONS.md"
else
    echo "No active sessions file found."
fi

# Show current focus
if [[ -f ".claude/context.md" ]]; then
    echo "=== CURRENT FOCUS ==="
    grep -A3 "^## Current" .claude/context.md 2>/dev/null | head -5 || true
    echo ""
fi

# Branch awareness
BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [[ -n "$BRANCH" ]]; then
    echo "=== BRANCH: $BRANCH ==="
    LAST_COMMIT=$(git log -1 --format="%s" 2>/dev/null || echo "")
    if [[ -n "$LAST_COMMIT" ]]; then
        echo "Last commit: $LAST_COMMIT"
    fi
    echo ""
fi

# Uncommitted changes warning
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l)
if [[ $UNCOMMITTED -gt 0 ]]; then
    echo "=== WARNING: $UNCOMMITTED uncommitted changes ==="
fi

exit 0
