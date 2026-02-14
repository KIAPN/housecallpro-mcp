# HouseCall Pro MCP Server - Project Context

## Project Overview

MCP (Model Context Protocol) server integration enabling Claude Desktop to query HouseCall Pro CRM data in real-time for KIAPN (Koala Insulation of Atlanta North) EOS L10 meetings.

## Quick Reference

| Item | Value |
|------|-------|
| **Location** | `C:\Users\ryann\claude\housecallpro-mcp` |
| **Base Repo** | [BuildWithBeacon/housecallpro-mcp](https://github.com/BuildWithBeacon/housecallpro-mcp) |
| **API Base** | `https://api.housecallpro.com` |
| **Auth Method** | Token-based (`Authorization: Token <key>`) |
| **Package Manager** | uv (Windows: `C:\Users\ryann\.local\bin\uv.exe`) |

## Key Files

```
housecallpro-mcp/
├── .env                          # API key (HOUSECALL_PRO_API_KEY=...)
├── pyproject.toml                # Python dependencies
├── context.md                    # This file
├── housecallpro_scorecard.py     # Custom EOS metrics (our addition)
├── housecallpro_customers.py     # Customer CRUD
├── housecallpro_jobs.py          # Job management
├── housecallpro_invoices.py      # Invoice operations
├── housecallpro_estimates.py     # Estimate handling
├── housecallpro_leads.py         # Lead management
├── housecallpro_employees.py     # Employee data
└── docs/
    └── ADR-001-housecallpro-mcp-architecture.md
```

## Custom Tools (housecallpro_scorecard.py)

| Tool | Purpose |
|------|---------|
| `get_scorecard_metrics()` | All-in-one EOS L10 metrics |
| `get_weekly_revenue(weeks_back)` | Completed job revenue by week |
| `get_pipeline_value()` | Pending estimates total value |
| `get_close_rate(days_back)` | Win rate percentage |
| `get_scheduled_jobs(days_forward)` | Upcoming scheduled work value |

## Security Notes

- **Audit Status:** Passed (2026-01-11) - No critical/high issues
- **Medium Issues:** Missing input validation, no rate limiting (accepted risks)
- **API Key:** Stored in `.env` file, loaded via python-dotenv
- **Recommendations:** Enable MFA on HCP account, rotate key quarterly

## API Limits

| Limit | Value | Source |
|-------|-------|--------|
| Max request size | 1 MB | HouseCall Pro API |
| Affected tools | `add_job_attachment()`, `add_invoice_attachment()` | File uploads only |

Note: Scorecard/metrics tools (GET requests) are not affected by this limit.

## Claude Desktop Config

Config location: `C:\Users\ryann\AppData\Roaming\Claude\claude_desktop_config.json`

7 HCP MCP servers registered:
- housecall-pro-scorecard
- housecall-pro-customers
- housecall-pro-jobs
- housecall-pro-invoices
- housecall-pro-estimates
- housecall-pro-leads
- housecall-pro-employees

## Common Tasks

### Test the MCP Server Locally
```powershell
cd C:\Users\ryann\claude\housecallpro-mcp
C:\Users\ryann\.local\bin\uv.exe run housecallpro_scorecard.py
```

### Update Dependencies
```powershell
cd C:\Users\ryann\claude\housecallpro-mcp
C:\Users\ryann\.local\bin\uv.exe sync
```

### Rotate API Key
1. Generate new key in HouseCall Pro: App Store > API Key Management
2. Update `.env` file with new key
3. Restart Claude Desktop

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tools not appearing | Restart Claude Desktop |
| 401 Unauthorized | Check API key in `.env` |
| "uv not found" | Use full path: `C:\Users\ryann\.local\bin\uv.exe` |
| Server won't start | Check `pyproject.toml` exists, run `uv sync` first |
| "not a valid Python environment" | Delete `.venv` and recreate with Windows Python (see below) |
| Server disconnected errors | Restart Claude Desktop after fixing `.venv` |

### Fix for WSL/Windows .venv Conflict

If `.venv` was created in WSL, Windows can't use it. Run in **PowerShell**:
```powershell
Remove-Item -Recurse -Force C:\Users\ryann\claude\housecallpro-mcp\.venv
C:\Users\ryann\.local\bin\uv.exe venv C:\Users\ryann\claude\housecallpro-mcp\.venv
cd C:\Users\ryann\claude\housecallpro-mcp
C:\Users\ryann\.local\bin\uv.exe sync
```
Then restart Claude Desktop.

## Related Documentation

- [ADR-001: Architecture Decision Record](docs/ADR-001-housecallpro-mcp-architecture.md)
- [HouseCall Pro API Docs](https://docs.housecallpro.com/)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)

## Session History

| Date | Action |
|------|--------|
| 2026-01-11 | Initial setup: cloned repo, added scorecard module, security audit, ADR created |
| 2026-01-11 | Fixed WSL/Windows .venv conflict, installed 86 packages, Claude Desktop connected successfully |

## Installation Status

**Status:** WORKING
**Verified:** 2026-01-11
**MCP Servers Active:** 7 (scorecard, customers, jobs, invoices, estimates, leads, employees)
