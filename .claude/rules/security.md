---
paths:
  - supabase/functions/**/*
  - api/**/*
  - "**/auth*"
  - "**/middleware*"
  - "**/AuthContext*"
---
# Security Requirements

**Source Skills**: Skill 3 (RLS Validation), Skill 39 (API Development), Skill 40 (Security Review)

## Edge Functions Security

### Rate Limiting (MANDATORY)
```typescript
import { withRateLimit, rateLimiters } from '../utils/rateLimiter';

// Default: 30 requests/minute
export default withRateLimit(handler);

// Sensitive: 5 requests/minute
export default withRateLimit(handler, rateLimiters.email);
```

### Input Validation with Zod
```typescript
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  // ... strict validation
}).strict();  // Strips unknown fields

const validatedData = requestSchema.parse(req.body);
```

### No Hardcoded Secrets
```typescript
// ❌ BANNED
const API_KEY = 'sk_live_xxx';

// ✅ REQUIRED
const API_KEY = Deno.env.get('STRIPE_SECRET_KEY');
```

### Secrets Management (Doppler)
- **Never** store secrets in `.env` files, `.mcp.json`, or source code
- All secrets live in Doppler and are injected at runtime via `doppler run --`
- MCP server configs use `$ENV_VAR` references, resolved by the shell environment
- Launch Claude with: `doppler run -p <project> -c <config> -- claude`
- The `Read(.env*)` deny rule in settings.json blocks Claude from reading secret files

## API Security (Vercel Endpoints)

### Ownership Validation (P0_CRITICAL)
```typescript
// ALWAYS validate ownership before accessing user data
const { user } = await auth.requireAuth(req);
await auth.requireOwnership(user.id, 'business', businessId);
```

### Standard Error Responses
```typescript
// Don't leak internal details
return res.status(500).json({
  error: 'Internal server error',
  details: process.env.NODE_ENV === 'development' ? error.message : undefined
});
```

## RLS Policy Security

### FK vs PK Rule (Critical)
```sql
-- ✅ CORRECT: auth.uid() compared to user_id FK
USING (auth.uid() = user_id)

-- ❌ WRONG: auth.uid() compared to table PK (always false!)
USING (auth.uid() = id)
```

### Admin Separation Principle
> "Regular users are NOT admins and cannot accidentally become admins."

- Admin status ONLY via `admin_users` table
- Use `is_user_admin()` RPC function
- Complete separation enforced

## Security Checklist

Before committing security-sensitive code:
- [ ] Rate limiting applied
- [ ] Input validation with Zod
- [ ] No hardcoded secrets
- [ ] Ownership validation for user data
- [ ] RLS policies use FK (not PK)
- [ ] Error responses don't leak internals

## Reference

- Full procedures: `.claude/skills/rls-policy-validation.md`
- API patterns: `.claude/skills/39-api-development.md`
- Emergency fixes: `.claude/emergency/rls-fix.md`
