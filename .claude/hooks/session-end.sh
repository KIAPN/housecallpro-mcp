#!/bin/bash
# SessionEnd hook - Runs when Claude session ends
# Provides checklist reminder for end-of-session hygiene

echo "=== SESSION END CHECKLIST ==="
echo ""
echo "Before ending this session, ensure:"
echo ""
echo "1. CONTEXT UPDATED"
echo "   - [ ] .claude/context.md reflects current state"
echo "   - [ ] Any decisions documented"
echo "   - [ ] Blockers noted if work incomplete"
echo ""
echo "2. TODO UPDATED"
echo "   - [ ] .claude/TODO.md has next steps"
echo "   - [ ] Completed items marked done"
echo "   - [ ] Priority items at top"
echo ""
echo "3. GIT STATUS"

# Show current git status
if command -v git &> /dev/null; then
  BRANCH=$(git branch --show-current 2>/dev/null)
  UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l)

  if [ -n "$BRANCH" ]; then
    echo "   Branch: $BRANCH"
    if [ "$UNCOMMITTED" -gt 0 ]; then
      echo "   ⚠️  $UNCOMMITTED uncommitted changes"
      echo "   Consider: commit, stash, or document why leaving uncommitted"
    else
      echo "   ✓ Working tree clean"
    fi
  fi
fi

echo ""
echo "4. SESSION REGISTRATION"
echo "   - [ ] Remove entry from .claude/ACTIVE_SESSIONS.md if registered"
echo ""
echo "5. RECOMMENDED: Run /ship for full end-of-session hygiene"
echo ""
echo "=== END CHECKLIST ==="
