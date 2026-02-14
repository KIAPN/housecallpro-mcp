# HouseCall Pro MCP Server

MCP server for querying HouseCall Pro API data from Claude Desktop.

## Installation

### 1. Clone/Copy Files

Copy `server.py` and `requirements.txt` to a local directory:

```bash
mkdir ~/housecallpro-mcp
cd ~/housecallpro-mcp
# Copy server.py and requirements.txt here
```

### 2. Create Virtual Environment

```bash
cd ~/housecallpro-mcp
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set API Key

You can either:

**Option A: Environment variable**
```bash
export HOUSECALLPRO_API_KEY="a12d48531bbf4e11aaec0b496b03b1ae"
```

**Option B: Set in Claude Desktop config (recommended)**

### 4. Add to Claude Desktop

Edit your Claude Desktop config file:

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the HouseCall Pro server to your existing config:

```json
{
  "mcpServers": {
    "housecallpro": {
      "command": "/path/to/housecallpro-mcp/venv/bin/python",
      "args": ["/path/to/housecallpro-mcp/server.py"],
      "env": {
        "HOUSECALLPRO_API_KEY": "a12d48531bbf4e11aaec0b496b03b1ae"
      }
    }
  }
}
```

**Replace `/path/to/` with your actual path** (e.g., `/Users/yourname/housecallpro-mcp/`)

### 5. Restart Claude Desktop

Quit and reopen Claude Desktop. The HouseCall Pro tools should now be available.

## Available Tools

### Basic Data
- `get_customers` - List/search customers
- `get_customer` - Get single customer details
- `get_estimates` - List estimates with filters
- `get_estimate` - Get single estimate details
- `get_jobs` - List jobs with filters
- `get_job` - Get single job details
- `get_employees` - List employees
- `get_employee` - Get single employee details
- `get_invoices` - List invoices with filters

### Scorecard/Reporting
- `get_weekly_revenue` - Revenue from completed jobs by week
- `get_pipeline_value` - Total pending estimates value
- `get_close_rate` - Win rate calculation for a period
- `get_scheduled_jobs` - Jobs scheduled for upcoming period
- `get_scorecard_metrics` - All key metrics in one call

## Example Usage in Claude

"Pull my scorecard metrics"
→ Calls `get_scorecard_metrics()` and returns all key numbers

"What's my close rate for the last 30 days?"
→ Calls `get_close_rate(days_back=30)`

"Show me all pending estimates"
→ Calls `get_estimates(status="pending")`

"What jobs are scheduled for the next 2 weeks?"
→ Calls `get_scheduled_jobs(days_forward=14)`

## Troubleshooting

### "API key not set"
Make sure `HOUSECALLPRO_API_KEY` is set in your environment or Claude Desktop config.

### "401 Unauthorized"
Your API key may be invalid or expired. Generate a new one in HouseCall Pro:
App Store → API → Generate API Key

### Connection errors
Ensure you have internet connectivity and the HouseCall Pro API is accessible.

## Security Notes

- Never commit your API key to version control
- The API key provides full access to your HouseCall Pro data
- Consider rotating the key periodically
