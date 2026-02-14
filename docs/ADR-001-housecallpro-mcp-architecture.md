# ADR-001: HouseCall Pro MCP Server Architecture

**Status:** Accepted
**Date:** 2026-01-11
**Decision Makers:** Ryan (KIAPN)
**Technical Context:** Claude Code + Claude Desktop MCP Integration

---

## Context

KIAPN (Koala Insulation of Atlanta North) operates using the EOS (Entrepreneurial Operating System) methodology, which requires weekly L10 meetings with scorecard metrics. These metrics currently require manual extraction from HouseCall Pro (HCP), the company's CRM platform.

The goal is to enable Claude Desktop to query HouseCall Pro data in real-time via the Model Context Protocol (MCP), providing automated access to:
- Weekly revenue from completed jobs
- Sales pipeline value (pending estimates)
- Close rate (won/lost estimates over 30 days)
- Scheduled job value (next 14 days)
- Consolidated EOS Scorecard metrics

---

## Decision

### Chosen Approach: Hybrid Implementation

We adopted the **BuildWithBeacon/housecallpro-mcp** open-source repository as the foundation, with custom extensions for EOS Scorecard metrics.

**Base Repository:** https://github.com/BuildWithBeacon/housecallpro-mcp
- 50+ tools across 20 specialized modules
- Production-tested codebase (5 GitHub stars, active maintenance)
- Comprehensive HCP API coverage

**Custom Extension:** `housecallpro_scorecard.py`
- EOS-specific reporting tools
- Compound metrics for L10 meetings

### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: Custom from Scratch** | Full control, minimal code | Time-consuming, reinventing wheel |
| **B: BuildWithBeacon Only** | Production-ready, comprehensive | Missing EOS-specific metrics |
| **C: Hybrid (Chosen)** | Best of both worlds | Slight complexity in maintaining fork |

---

## Technical Architecture

```
┌─────────────────────┐     MCP Protocol     ┌──────────────────────┐
│   Claude Desktop    │◄───────────────────►│  HCP MCP Server(s)   │
│                     │     (stdio/JSON)     │  (Python + FastMCP)  │
└─────────────────────┘                      └──────────┬───────────┘
                                                        │
                                                        │ HTTPS + Bearer Token
                                                        ▼
                                             ┌──────────────────────┐
                                             │  HouseCall Pro API   │
                                             │  api.housecallpro.com│
                                             └──────────────────────┘
```

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Python | 3.10+ |
| MCP Framework | FastMCP | ≥0.2.0 |
| HTTP Client | httpx | ≥0.25.0 |
| Config Management | python-dotenv | ≥1.0.0 |
| Package Manager | uv | Latest |

### Module Structure

```
housecallpro-mcp/
├── .env                           # API key (gitignored)
├── pyproject.toml                 # Dependencies
├── housecallpro_scorecard.py      # Custom EOS metrics (NEW)
├── housecallpro_customers.py      # Customer CRUD
├── housecallpro_jobs.py           # Job management
├── housecallpro_invoices.py       # Invoice operations
├── housecallpro_estimates.py      # Estimate handling
├── housecallpro_leads.py          # Lead management
├── housecallpro_employees.py      # Employee data
├── housecallpro_appointments.py   # Scheduling
├── housecallpro_materials.py      # Inventory
└── ... (15+ more modules)
```

---

## Security Assessment

### Security Audit Results

**Overall Risk Level:** Medium (acceptable for local deployment)
**Audit Date:** 2026-01-11
**Auditor:** zen/secaudit (Gemini 2.5 Flash)

#### Vulnerability Summary

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | N/A |
| High | 0 | N/A |
| Medium | 2 | Accepted Risk |
| Low | 3 | Accepted Risk |

#### Medium Severity Issues

1. **Missing Input Validation on ID Parameters**
   - **Risk:** Path injection if HCP API is vulnerable
   - **Mitigation:** HCP API performs server-side validation
   - **Decision:** Accept risk; HCP is a trusted first-party API

2. **No Client-Side Rate Limiting**
   - **Risk:** API quota exhaustion under heavy use
   - **Mitigation:** Normal usage patterns unlikely to trigger limits
   - **Decision:** Accept risk; add throttling if issues arise

#### Low Severity Issues

1. Verbose error messages (minor info leak)
2. No file size validation on uploads (memory exhaustion possible)
3. Inconsistent sync/async HTTP client usage

#### Positive Security Findings

- API key stored in `.env` file (not hardcoded)
- Fail-fast validation if API key missing
- TLS verification enabled by default
- 30-second request timeouts configured
- No dangerous functions (eval, exec, subprocess)
- No arbitrary file system writes

### Security Recommendations

1. Enable MFA on HouseCall Pro account
2. Rotate API key quarterly
3. Restrict `.env` file permissions to owner-only

---

## Implementation Details

### Installation Path

```
C:\Users\ryann\claude\housecallpro-mcp\
```

### API Authentication

- **Method:** Token-based authentication
- **Header:** `Authorization: Token <API_KEY>`
- **Storage:** `.env` file loaded via python-dotenv

### Claude Desktop Configuration

Added to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "housecall-pro-scorecard": {
      "command": "C:\\Users\\ryann\\.local\\bin\\uv.exe",
      "args": [
        "--directory",
        "C:\\Users\\ryann\\claude\\housecallpro-mcp",
        "run",
        "housecallpro_scorecard.py"
      ]
    }
  }
}
```

### EOS Scorecard Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| `get_scorecard_metrics()` | All-in-one L10 metrics | Weekly scorecard review |
| `get_weekly_revenue(weeks_back)` | Completed job revenue | Revenue tracking |
| `get_pipeline_value()` | Pending estimate totals | Sales pipeline |
| `get_close_rate(days_back)` | Win rate percentage | Conversion analysis |
| `get_scheduled_jobs(days_forward)` | Upcoming work value | Capacity planning |

---

## Consequences

### Positive

- Real-time CRM data access via natural language
- Automated EOS Scorecard generation for L10 meetings
- Reduced manual data extraction (estimated 30+ min/week saved)
- Extensible architecture for future HCP integrations
- Leverages maintained open-source codebase

### Negative

- Dependency on third-party repository for core modules
- Need to track upstream changes for security updates
- API key stored locally (acceptable for single-user deployment)

### Risks Accepted

- Medium-severity security findings deemed acceptable for local MCP server
- No SLA on HouseCall Pro API availability

---

## Verification

### Success Criteria

- [ ] MCP server installed at designated path
- [ ] `.env` configured with valid API key
- [ ] Claude Desktop config updated
- [ ] MCP tools visible in Claude Desktop (hammer icon)
- [ ] `get_scorecard_metrics` returns valid data
- [ ] Close rate matches HCP dashboard (within 5% tolerance)

### Test Commands

```
# In Claude Desktop:
"Pull my EOS scorecard metrics"
"What's my pipeline value?"
"Show me last week's revenue"
"What's my close rate for the past 30 days?"
```

---

## References

- [BuildWithBeacon/housecallpro-mcp](https://github.com/BuildWithBeacon/housecallpro-mcp)
- [HouseCall Pro API Documentation](https://docs.housecallpro.com/)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [EOS Worldwide - Scorecard](https://www.eosworldwide.com/scorecard)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-11 | Ryan | Initial ADR |
