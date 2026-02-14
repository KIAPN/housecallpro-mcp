# CLAUDE CODE IMPLEMENTATION INSTRUCTIONS

## Project: HouseCall Pro MCP Server

**Document:** HCP_MCP_Technical_Specification_v1.docx  
**Version:** 1.0  
**Date:** 2026-01-12

---

## OBJECTIVE

Build and install a Model Context Protocol (MCP) server that integrates HouseCall Pro CRM data with Claude Desktop. The server enables real-time querying of sales pipeline, job revenue, and operational metrics.

---

## DELIVERABLES

1. **MCP Server** (`server.py`) - Python FastMCP server with HouseCall Pro API integration
2. **Virtual Environment** - Isolated Python environment with dependencies
3. **Claude Desktop Configuration** - Updated config to register the MCP server
4. **Validation** - Confirm tools appear and function in Claude Desktop

---

## IMPLEMENTATION STEPS

### Phase 1: Setup (5 minutes)

```bash
# Create project directory
mkdir -p ~/housecallpro-mcp
cd ~/housecallpro-mcp

# Copy server.py from attachments/server.py
# Copy requirements.txt from attachments/requirements.txt

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Phase 2: Configuration (2 minutes)

1. Locate Claude Desktop config:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. Add MCP server entry:

```json
{
  "mcpServers": {
    "housecallpro": {
      "command": "/Users/YOUR_USERNAME/housecallpro-mcp/venv/bin/python",
      "args": ["/Users/YOUR_USERNAME/housecallpro-mcp/server.py"],
      "env": {
        "HOUSECALLPRO_API_KEY": "$HOUSECALL_PRO_API_KEY"
      }
    }
  }
}
```

**IMPORTANT:** Replace `YOUR_USERNAME` with actual system username.

### Phase 3: Validation (2 minutes)

1. Quit Claude Desktop completely
2. Reopen Claude Desktop
3. Start new conversation
4. Type: "Pull my scorecard metrics"
5. Verify response includes:
   - this_week_revenue
   - pipeline_value
   - close_rate_30d
   - scheduled_value_14d

---

## API KEY

Stored in Doppler: `housecallpro-mcp/dev` as `HOUSECALL_PRO_API_KEY`

This key is already generated in HouseCall Pro. Do not regenerate.

---

## SUCCESS CRITERIA

- [ ] MCP server installed at ~/housecallpro-mcp/
- [ ] Virtual environment created with dependencies
- [ ] Claude Desktop config updated
- [ ] "housecallpro" tools visible in Claude Desktop
- [ ] `get_scorecard_metrics` returns valid data
- [ ] `get_close_rate` matches HCP dashboard (within 5%)

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Tools not appearing | Check config path, restart Claude Desktop |
| 401 Unauthorized | Verify API key in config |
| Python not found | Use absolute path to venv/bin/python |
| Import errors | Ensure venv is activated when testing |

---

## FILES PROVIDED

| File | Purpose |
|------|---------|
| `attachments/server.py` | Main MCP server code |
| `attachments/requirements.txt` | Python dependencies |
| `attachments/README.md` | Detailed installation guide |
| `HCP_MCP_Technical_Specification_v1.docx` | Full technical spec |

---

## NOTES FOR CLAUDE CODE

- This is a LOCAL installation on the user's development machine
- The MCP server runs as a subprocess of Claude Desktop
- No cloud deployment required
- API key is already provisioned and active
- User has existing Basecamp MCP installed (same pattern)

---

## ESTIMATED TIME

- Setup: 5 minutes
- Configuration: 2 minutes  
- Validation: 2 minutes
- **Total: ~10 minutes**
