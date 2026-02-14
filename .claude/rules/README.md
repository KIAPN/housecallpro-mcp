# Path-Specific Rules

**Purpose**: Auto-activate rules based on file patterns being edited

## How It Works

Each `.md` file in this directory uses YAML frontmatter to specify glob patterns:

```yaml
---
paths:
  - supabase/migrations/**/*.sql
  - types/database*.ts
---
# Rule content here
```

When you edit a file matching these patterns, the rule automatically loads into context.

## Current Rules

| File | Patterns | Purpose |
|------|----------|---------|
| `database.md` | `supabase/migrations/**/*.sql`, `types/database*.ts` | Database-first development |
| `testing.md` | `tests/**/*`, `**/*.test.ts` | Testing standards |
| `security.md` | `supabase/functions/**/*`, `api/**/*`, `**/auth*` | Security requirements |
| `api.md` | `api/**/*.ts`, `services/**/*.ts` | API development standards |
| `casing.md` | `types/**/*.ts`, `services/**/*.ts`, `components/**/*.tsx` | snake_case everywhere |
| `git.md` | _(universal - no paths)_ | Git workflow rules |
| `zen-tools.md` | _(universal - no paths)_ | MCP tool selection |

## Universal Rules

Rules with empty `paths: []` are always active:
- `git.md` - WSL2 git commands, branch naming, PR workflow
- `zen-tools.md` - MCP tool escalation triggers

## Creating New Rules

1. Create `{name}.md` in this directory
2. Add YAML frontmatter with `paths:` array
3. Write concise, actionable rules (~50-100 lines)
4. Reference full skill files for detailed procedures

## Benefits

- **Token savings**: Load only relevant rules vs full skills.md
- **Context-aware**: Rules auto-activate when editing matching files
- **Maintainable**: Separate files for each domain
