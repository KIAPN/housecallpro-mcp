#!/bin/bash
# Context grooming script - Maintains context.md at manageable size
# Called by /ship command or manually when context grows large

CONTEXT_FILE=".claude/context.md"
ARCHIVE_DIR=".claude/docs/archived-context"
MAX_LINES=500
ARCHIVE_THRESHOLD=400

# Ensure directories exist
mkdir -p "$ARCHIVE_DIR"

if [ ! -f "$CONTEXT_FILE" ]; then
  echo "No context.md found at $CONTEXT_FILE"
  exit 0
fi

LINE_COUNT=$(wc -l < "$CONTEXT_FILE")
echo "Current context.md: $LINE_COUNT lines"

if [ "$LINE_COUNT" -lt "$MAX_LINES" ]; then
  echo "Context size OK (under $MAX_LINES lines)"
  exit 0
fi

echo "Context exceeds $MAX_LINES lines - grooming needed"

# Create dated archive
DATE=$(date +%Y-%m-%d)
ARCHIVE_FILE="$ARCHIVE_DIR/${DATE}_context_archive.md"

# Archive strategy:
# 1. Keep header (first 50 lines typically have structure)
# 2. Keep recent content (last 200 lines)
# 3. Archive middle section

echo "Archiving to: $ARCHIVE_FILE"

# Extract header
head -50 "$CONTEXT_FILE" > /tmp/context_header.md

# Extract footer (recent content)
tail -200 "$CONTEXT_FILE" > /tmp/context_footer.md

# Extract middle for archiving
MIDDLE_START=51
MIDDLE_END=$((LINE_COUNT - 200))
if [ "$MIDDLE_END" -gt "$MIDDLE_START" ]; then
  sed -n "${MIDDLE_START},${MIDDLE_END}p" "$CONTEXT_FILE" > "$ARCHIVE_FILE"
  echo "Archived lines $MIDDLE_START-$MIDDLE_END"
fi

# Rebuild context.md
{
  cat /tmp/context_header.md
  echo ""
  echo "---"
  echo "<!-- Content archived to $ARCHIVE_FILE on $DATE -->"
  echo "---"
  echo ""
  cat /tmp/context_footer.md
} > "$CONTEXT_FILE"

# Cleanup
rm -f /tmp/context_header.md /tmp/context_footer.md

NEW_COUNT=$(wc -l < "$CONTEXT_FILE")
echo "New context.md: $NEW_COUNT lines (was $LINE_COUNT)"
echo "Archived content: $ARCHIVE_FILE"
