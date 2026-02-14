#!/bin/bash
# PreToolUse Hook - Block dangerous operations
# Exit 2 = block the tool call, Exit 0 = allow

set -euo pipefail

PAYLOAD="${CLAUDE_TOOL_INPUT:-}"

# Catastrophic patterns to block
BLOCKED_PATTERNS=(
    "rm -rf /"
    "rm -rf ~"
    "rm -rf \$HOME"
    "DROP DATABASE"
    "DROP TABLE"
    "DROP SCHEMA"
    "TRUNCATE TABLE"
    "TRUNCATE.*CASCADE"
    "DELETE FROM.*WHERE 1=1"
    "sudo rm -rf"
    ":(){ :|:& };:"
    "mkfs."
    "> /dev/sda"
    "dd if=/dev/zero of=/dev"
    "chmod -R 777 /"
    "chown -R"
)

for pattern in "${BLOCKED_PATTERNS[@]}"; do
    if [[ "$PAYLOAD" == *"$pattern"* ]]; then
        echo "BLOCKED: Dangerous operation detected: $pattern"
        echo "This operation is not allowed by safety hooks."
        echo "If this is intentional, modify .claude/hooks/pre-tool-safety.sh"
        exit 2
    fi
done

# Production database warning (non-blocking)
if echo "$PAYLOAD" | grep -qiE "(prod|production)" && \
   echo "$PAYLOAD" | grep -qiE "(DELETE|UPDATE|DROP|TRUNCATE)"; then
    echo "WARNING: Production database modification detected"
    echo "Ensure this is intentional and properly reviewed."
fi

# Migration file reminder (non-blocking)
if [[ "${CLAUDE_FILE_PATH:-}" == *"migration"* ]]; then
    echo "NOTE: Working with migration file. Remember: npm run generate:types"
fi

exit 0
