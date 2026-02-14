#!/bin/bash
# Stop hook - Quick quality feedback when Claude stops
# Non-blocking - provides info but doesn't prevent stopping

echo "=== QUICK QUALITY CHECK ==="

# TypeScript compilation check (fast, no emit)
if [ -f "tsconfig.json" ]; then
  echo "Checking TypeScript..."
  TSC_OUTPUT=$(npx tsc --noEmit 2>&1 | head -20)
  TSC_ERRORS=$(echo "$TSC_OUTPUT" | grep -c "error TS" || echo "0")

  if [ "$TSC_ERRORS" -gt 0 ]; then
    echo "⚠️  TypeScript: $TSC_ERRORS errors found"
    echo "$TSC_OUTPUT" | head -10
  else
    echo "✓ TypeScript: No errors"
  fi
fi

# ESLint check (if configured)
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.cjs" ] || [ -f "eslint.config.js" ]; then
  echo "Checking ESLint..."
  LINT_ERRORS=$(npx eslint . --max-warnings 0 2>&1 | grep -c "error" || echo "0")

  if [ "$LINT_ERRORS" -gt 0 ]; then
    echo "⚠️  ESLint: $LINT_ERRORS errors"
  else
    echo "✓ ESLint: No errors"
  fi
fi

echo "=== END QUALITY CHECK ==="
