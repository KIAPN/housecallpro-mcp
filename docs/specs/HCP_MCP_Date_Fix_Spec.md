# HCP MCP Server Bug Fix Specification
## Date Filter Parameter Issue

**Document Version:** 1.0  
**Created:** 2026-01-11  
**Priority:** High  
**Estimated Effort:** 1-2 hours

---

## Problem Statement

The HouseCall Pro MCP server returns HTTP 400 Bad Request errors when using date filter parameters on the `/jobs` endpoint. This prevents automated weekly revenue calculation and scheduled job queries.

### Failing Endpoints

```
GET /jobs?work_status=scheduled&scheduled_start_min=2026-01-11T22:47:40.316033&scheduled_start_max=2026-01-25T22:47:40.316033
→ 400 Bad Request

GET /jobs?work_status=complete&completed_at_min=2026-01-05T22:48:13.315915&completed_at_max=2026-01-12T22:48:12.315915
→ 400 Bad Request
```

### Working Endpoints

```
GET /jobs?page_size=50
→ 200 OK (returns jobs without date filtering)

GET /invoices?page_size=20
→ 200 OK
```

---

## Root Cause Analysis

The issue appears to be one or more of:

1. **Date format incompatibility**: HCP API may not accept microseconds or may require a specific timezone format
2. **Parameter naming mismatch**: The API may use different parameter names than what the server sends
3. **work_status value format**: The `work_status` filter value may need different casing or format

### HCP API Documentation Reference

Per HCP API docs, the jobs endpoint accepts:
- `scheduled_start_min` / `scheduled_start_max` - ISO 8601 format
- `completed_at_min` / `completed_at_max` - ISO 8601 format
- `work_status` - String enum

---

## Required Investigation

1. **Check HCP API documentation** for exact date format requirements
2. **Test date formats** via curl to isolate the issue:
   ```bash
   # Test 1: Full ISO with microseconds
   curl -H "Authorization: Bearer TOKEN" \
     "https://api.housecallpro.com/jobs?scheduled_start_min=2026-01-11T22:47:40.316033"
   
   # Test 2: ISO without microseconds  
   curl -H "Authorization: Bearer TOKEN" \
     "https://api.housecallpro.com/jobs?scheduled_start_min=2026-01-11T22:47:40"
   
   # Test 3: ISO with Z suffix
   curl -H "Authorization: Bearer TOKEN" \
     "https://api.housecallpro.com/jobs?scheduled_start_min=2026-01-11T22:47:40Z"
   
   # Test 4: Date only (no time)
   curl -H "Authorization: Bearer TOKEN" \
     "https://api.housecallpro.com/jobs?scheduled_start_min=2026-01-11"
   ```

3. **Check work_status values** - may need to be URL-encoded differently or use underscore/camelCase

---

## Fix Implementation

### File to Modify
`/mnt/user-data/outputs/housecallpro-mcp/server.py`

### Changes Required

#### 1. Date Format Helper Function

Add a function to format dates correctly for HCP API:

```python
def format_hcp_date(dt: datetime) -> str:
    """
    Format datetime for HouseCall Pro API.
    HCP expects: YYYY-MM-DDTHH:MM:SSZ (no microseconds, UTC)
    """
    # Remove microseconds, ensure UTC, add Z suffix
    return dt.replace(microsecond=0).strftime('%Y-%m-%dT%H:%M:%SZ')
```

#### 2. Update get_weekly_revenue Tool

```python
@mcp.tool()
async def get_weekly_revenue(weeks_back: int = 1) -> str:
    """Get revenue from completed jobs for the specified week."""
    today = datetime.now(timezone.utc)
    
    # Calculate week boundaries
    week_start = today - timedelta(days=today.weekday() + (7 * weeks_back))
    week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)
    week_end = week_start + timedelta(days=6, hours=23, minutes=59, seconds=59)
    
    # Format for HCP API
    start_str = format_hcp_date(week_start)
    end_str = format_hcp_date(week_end)
    
    params = {
        "page_size": 200,
        "completed_at_min": start_str,
        "completed_at_max": end_str
    }
    # ... rest of implementation
```

#### 3. Update get_scheduled_jobs Tool

Apply same date formatting pattern.

#### 4. Test work_status Parameter

If work_status filter fails independently:
```python
# Try different formats
params["work_status"] = "scheduled"      # lowercase
params["work_status"] = "Scheduled"      # capitalized  
params["work_status"] = "SCHEDULED"      # uppercase
```

---

## Testing Protocol

### Unit Tests

```python
def test_date_formatting():
    dt = datetime(2026, 1, 11, 22, 47, 40, 316033)
    result = format_hcp_date(dt)
    assert result == "2026-01-11T22:47:40Z"
    assert "." not in result  # No microseconds
```

### Integration Tests

```bash
# Test 1: Get scheduled jobs for next 14 days
claude-code run "test get_scheduled_jobs(14)"

# Test 2: Get this week's revenue  
claude-code run "test get_weekly_revenue(0)"

# Test 3: Get last week's revenue
claude-code run "test get_weekly_revenue(1)"
```

### Expected Results

| Test | Current | Expected |
|------|---------|----------|
| get_scheduled_jobs(14) | 400 Error | JSON with scheduled jobs |
| get_weekly_revenue(0) | 400 Error | JSON with revenue total |
| get_weekly_revenue(1) | 400 Error | JSON with revenue total |

---

## Fallback Strategy

If date filters cannot be made to work with HCP API, implement client-side filtering:

```python
@mcp.tool()
async def get_weekly_revenue(weeks_back: int = 1) -> str:
    """Get revenue from completed jobs - uses client-side date filtering."""
    
    # Pull all recent jobs (no date filter)
    all_jobs = await fetch_jobs(page_size=200)
    
    # Calculate week boundaries
    today = datetime.now(timezone.utc)
    week_start = today - timedelta(days=today.weekday() + (7 * weeks_back))
    week_end = week_start + timedelta(days=7)
    
    # Filter client-side
    week_jobs = [
        job for job in all_jobs 
        if job.get('work_timestamps', {}).get('completed_at')
        and week_start <= parse_date(job['work_timestamps']['completed_at']) < week_end
    ]
    
    # Calculate totals
    total = sum(job.get('total_amount', 0) for job in week_jobs)
    
    return json.dumps({
        "week_start": week_start.isoformat(),
        "total_revenue": total / 100,
        "job_count": len(week_jobs)
    })
```

---

## Definition of Done

- [ ] Date filter parameters work with HCP API (no 400 errors)
- [ ] `get_weekly_revenue(0)` returns current week revenue
- [ ] `get_weekly_revenue(1)` returns last week revenue  
- [ ] `get_scheduled_jobs(14)` returns upcoming scheduled jobs
- [ ] All existing tools continue to function
- [ ] README updated with any format requirements discovered

---

## Files Attached

- Current server.py location: `/mnt/user-data/outputs/housecallpro-mcp/server.py`
- Original spec: `/mnt/user-data/outputs/HCP_MCP_Technical_Specification_v1.docx`

---

## API Credentials (for testing)

```
Base URL: https://api.housecallpro.com
Authorization: Bearer $HOUSECALL_PRO_API_KEY  # Stored in Doppler: housecallpro-mcp/dev
```
