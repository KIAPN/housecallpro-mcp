const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        Header, Footer, AlignmentType, PageOrientation, LevelFormat, 
        HeadingLevel, BorderStyle, WidthType, TabStopType, 
        TabStopPosition, ShadingType, PageNumber, PageBreak } = require('docx');
const fs = require('fs');

// ============== CONFIGURATION ==============
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };
const headerShading = { fill: "1a365d", type: ShadingType.CLEAR };
const altRowShading = { fill: "f7fafc", type: ShadingType.CLEAR };

// ============== HELPER FUNCTIONS ==============
function createTableHeader(cells) {
  return new TableRow({
    tableHeader: true,
    children: cells.map(text => new TableCell({
      borders: cellBorders,
      shading: headerShading,
      children: [new Paragraph({ 
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 22 })]
      })]
    }))
  });
}

function createTableRow(cells, isAlt = false) {
  return new TableRow({
    children: cells.map(text => new TableCell({
      borders: cellBorders,
      shading: isAlt ? altRowShading : undefined,
      children: [new Paragraph({ 
        children: [new TextRun({ text, size: 22 })]
      })]
    }))
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: "1a365d" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 26, color: "2d3748" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, color: "4a5568" })]
  });
}

function para(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 22 })]
  });
}

function boldPara(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label, bold: true, size: 22 }),
      new TextRun({ text: value, size: 22 })
    ]
  });
}

function codeBlock(code) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    shading: { fill: "f7fafc", type: ShadingType.CLEAR },
    indent: { left: 360 },
    children: [new TextRun({ text: code, font: "Courier New", size: 20 })]
  });
}

// ============== DOCUMENT CONTENT ==============
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "1a365d", font: "Arial" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "2d3748", font: "Arial" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "4a5568", font: "Arial" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "req-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "install-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "test-list",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        size: { orientation: PageOrientation.PORTRAIT }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "HouseCall Pro MCP Server — Technical Specification", italics: true, size: 20, color: "718096" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], size: 20 }), new TextRun({ text: " of ", size: 20 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })]
      })] })
    },
    children: [
      // ============== TITLE PAGE ==============
      new Paragraph({ spacing: { before: 2000 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "TECHNICAL SPECIFICATION", bold: true, size: 28, color: "718096" })]
      }),
      new Paragraph({ spacing: { before: 400 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "HouseCall Pro MCP Server", bold: true, size: 56, color: "1a365d" })]
      }),
      new Paragraph({ spacing: { before: 200 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Model Context Protocol Integration for Claude Desktop", size: 26, color: "4a5568" })]
      }),
      new Paragraph({ spacing: { before: 800 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Version 1.0", size: 24 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "January 12, 2026", size: 24 })]
      }),
      new Paragraph({ spacing: { before: 1200 } }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Prepared for: KIAPN (Koala Insulation of Atlanta North)", size: 22 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Classification: Internal Use", size: 22, color: "718096" })]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),

      // ============== DOCUMENT CONTROL ==============
      h1("1. Document Control"),
      
      new Table({
        columnWidths: [3000, 6360],
        rows: [
          createTableHeader(["Field", "Value"]),
          createTableRow(["Document ID", "SPEC-HCP-MCP-001"]),
          createTableRow(["Version", "1.0"], true),
          createTableRow(["Status", "Draft"]),
          createTableRow(["Author", "Claude (AI Assistant)"], true),
          createTableRow(["Owner", "RFN Ventures"]),
          createTableRow(["Created", "2026-01-12"], true),
          createTableRow(["Last Modified", "2026-01-12"]),
        ]
      }),

      new Paragraph({ spacing: { before: 300 } }),
      h2("1.1 Revision History"),
      new Table({
        columnWidths: [1500, 2000, 2500, 3360],
        rows: [
          createTableHeader(["Version", "Date", "Author", "Changes"]),
          createTableRow(["1.0", "2026-01-12", "Claude", "Initial specification"]),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== EXECUTIVE SUMMARY ==============
      h1("2. Executive Summary"),
      
      h2("2.1 Purpose"),
      para("This specification defines the technical requirements for building a Model Context Protocol (MCP) server that integrates HouseCall Pro CRM data with Claude Desktop. The integration enables real-time access to sales pipeline, job profitability, and operational metrics for EOS (Entrepreneurial Operating System) L10 meetings and business operations."),

      h2("2.2 Business Context"),
      para("KIAPN is a residential insulation retrofit franchise implementing EOS methodology. Current workflow requires manual PDF exports from HouseCall Pro to review business metrics. This integration eliminates manual data extraction by providing Claude with direct API access to CRM data."),

      h2("2.3 Success Criteria"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Claude can query HouseCall Pro data without manual exports", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "L10 Scorecard metrics available in single tool call", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Close rate, pipeline value, and revenue calculated automatically", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Integration runs locally on owner's machine (no cloud hosting required)", size: 22 })]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== SYSTEM ARCHITECTURE ==============
      h1("3. System Architecture"),

      h2("3.1 Architecture Overview"),
      para("The system consists of three components communicating via standardized protocols:"),

      new Table({
        columnWidths: [2500, 3000, 3860],
        rows: [
          createTableHeader(["Component", "Technology", "Function"]),
          createTableRow(["Claude Desktop", "Electron App", "User interface, MCP client"]),
          createTableRow(["MCP Server", "Python + FastMCP", "Protocol translation, business logic"], true),
          createTableRow(["HouseCall Pro API", "REST API", "CRM data source"]),
        ]
      }),

      new Paragraph({ spacing: { before: 200 } }),
      h2("3.2 Data Flow"),
      codeBlock("User Query → Claude Desktop → MCP Server → HouseCall Pro API → MCP Server → Claude Desktop → Response"),

      h2("3.3 Communication Protocols"),
      new Table({
        columnWidths: [3000, 3000, 3360],
        rows: [
          createTableHeader(["Interface", "Protocol", "Authentication"]),
          createTableRow(["Claude ↔ MCP Server", "stdio (JSON-RPC)", "None (local process)"]),
          createTableRow(["MCP Server ↔ HCP API", "HTTPS REST", "Bearer Token"], true),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== API SPECIFICATION ==============
      h1("4. HouseCall Pro API Specification"),

      h2("4.1 Authentication"),
      new Table({
        columnWidths: [3000, 6360],
        rows: [
          createTableHeader(["Parameter", "Value"]),
          createTableRow(["Base URL", "https://api.housecallpro.com/v1"]),
          createTableRow(["Auth Type", "Bearer Token"], true),
          createTableRow(["Header", "Authorization: Bearer {API_KEY}"]),
          createTableRow(["API Key", "a]2d48531bbf4e11aaec0b496b03b1ae"], true),
          createTableRow(["Plan Required", "MAX"]),
        ]
      }),

      new Paragraph({ spacing: { before: 200 } }),
      h2("4.2 Available Endpoints"),
      new Table({
        columnWidths: [2200, 2200, 2200, 2760],
        rows: [
          createTableHeader(["Endpoint", "Method", "Purpose", "Key Parameters"]),
          createTableRow(["/customers", "GET", "List customers", "q, page, page_size"]),
          createTableRow(["/customers/{id}", "GET", "Single customer", "customer_id"], true),
          createTableRow(["/estimates", "GET", "List estimates", "status, scheduled_start_min/max"]),
          createTableRow(["/estimates/{id}", "GET", "Single estimate", "estimate_id"], true),
          createTableRow(["/jobs", "GET", "List jobs", "work_status, completed_at_min/max"]),
          createTableRow(["/jobs/{id}", "GET", "Single job", "job_id"], true),
          createTableRow(["/employees", "GET", "List employees", "page, page_size"]),
          createTableRow(["/invoices", "GET", "List invoices", "status, created_at_min/max"], true),
        ]
      }),

      new Paragraph({ spacing: { before: 200 } }),
      h2("4.3 Status Values"),
      h3("4.3.1 Estimate Status"),
      para("pending | won | lost | expired"),
      
      h3("4.3.2 Job Work Status"),
      para("scheduled | in_progress | complete | canceled"),

      h3("4.3.3 Invoice Status"),
      para("draft | sent | paid | partial | void"),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== MCP TOOLS ==============
      h1("5. MCP Tool Specifications"),

      h2("5.1 Core Data Tools"),
      
      h3("5.1.1 get_customers"),
      new Table({
        columnWidths: [2500, 2500, 4360],
        rows: [
          createTableHeader(["Parameter", "Type", "Description"]),
          createTableRow(["page", "int", "Page number (default: 1)"]),
          createTableRow(["page_size", "int", "Results per page (default: 20, max: 200)"], true),
          createTableRow(["q", "string?", "Search query for name, email, phone"]),
        ]
      }),

      new Paragraph({ spacing: { before: 200 } }),
      h3("5.1.2 get_estimates"),
      new Table({
        columnWidths: [2500, 2500, 4360],
        rows: [
          createTableHeader(["Parameter", "Type", "Description"]),
          createTableRow(["page", "int", "Page number (default: 1)"]),
          createTableRow(["page_size", "int", "Results per page (default: 50, max: 200)"], true),
          createTableRow(["status", "string?", "Filter: pending | won | lost | expired"]),
          createTableRow(["scheduled_start_min", "ISO datetime?", "Estimates scheduled after this time"], true),
          createTableRow(["scheduled_start_max", "ISO datetime?", "Estimates scheduled before this time"]),
          createTableRow(["created_at_min", "ISO datetime?", "Estimates created after this time"], true),
          createTableRow(["created_at_max", "ISO datetime?", "Estimates created before this time"]),
        ]
      }),

      new Paragraph({ spacing: { before: 200 } }),
      h3("5.1.3 get_jobs"),
      new Table({
        columnWidths: [2500, 2500, 4360],
        rows: [
          createTableHeader(["Parameter", "Type", "Description"]),
          createTableRow(["page", "int", "Page number (default: 1)"]),
          createTableRow(["page_size", "int", "Results per page (default: 50, max: 200)"], true),
          createTableRow(["work_status", "string?", "Filter: scheduled | in_progress | complete | canceled"]),
          createTableRow(["scheduled_start_min", "ISO datetime?", "Jobs scheduled after this time"], true),
          createTableRow(["scheduled_start_max", "ISO datetime?", "Jobs scheduled before this time"]),
          createTableRow(["completed_at_min", "ISO datetime?", "Jobs completed after this time"], true),
          createTableRow(["completed_at_max", "ISO datetime?", "Jobs completed before this time"]),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      h2("5.2 Compound Reporting Tools"),

      h3("5.2.1 get_weekly_revenue"),
      para("Returns revenue from completed jobs for a specified week."),
      new Table({
        columnWidths: [2500, 2500, 4360],
        rows: [
          createTableHeader(["Parameter", "Type", "Description"]),
          createTableRow(["weeks_back", "int", "0 = current week, 1 = last week, etc."]),
        ]
      }),
      new Paragraph({ spacing: { before: 100 } }),
      boldPara("Returns: ", "{ week_start, week_end, total_revenue, job_count, jobs[] }"),

      new Paragraph({ spacing: { before: 200 } }),
      h3("5.2.2 get_pipeline_value"),
      para("Returns total value of all pending estimates."),
      boldPara("Parameters: ", "None"),
      boldPara("Returns: ", "{ total_pipeline_value, estimate_count, estimates[] }"),

      new Paragraph({ spacing: { before: 200 } }),
      h3("5.2.3 get_close_rate"),
      para("Calculates win rate for a specified period."),
      new Table({
        columnWidths: [2500, 2500, 4360],
        rows: [
          createTableHeader(["Parameter", "Type", "Description"]),
          createTableRow(["days_back", "int", "Number of days to analyze (default: 30)"]),
        ]
      }),
      new Paragraph({ spacing: { before: 100 } }),
      boldPara("Returns: ", "{ close_rate_percent, won_count, lost_count, won_value, lost_value }"),

      new Paragraph({ spacing: { before: 200 } }),
      h3("5.2.4 get_scheduled_jobs"),
      para("Returns jobs scheduled for upcoming period."),
      new Table({
        columnWidths: [2500, 2500, 4360],
        rows: [
          createTableHeader(["Parameter", "Type", "Description"]),
          createTableRow(["days_forward", "int", "Number of days ahead (default: 14)"]),
        ]
      }),
      new Paragraph({ spacing: { before: 100 } }),
      boldPara("Returns: ", "{ total_scheduled_value, job_count, jobs[] }"),

      new Paragraph({ spacing: { before: 200 } }),
      h3("5.2.5 get_scorecard_metrics"),
      para("Returns all key EOS Scorecard metrics in a single call. This is the primary tool for L10 meeting preparation."),
      boldPara("Parameters: ", "None"),
      new Paragraph({ spacing: { before: 100 } }),
      para("Returns:"),
      new Table({
        columnWidths: [3500, 5860],
        rows: [
          createTableHeader(["Field", "Description"]),
          createTableRow(["this_week_revenue", "Completed job revenue (current week)"]),
          createTableRow(["this_week_jobs", "Count of completed jobs (current week)"], true),
          createTableRow(["last_week_revenue", "Completed job revenue (previous week)"]),
          createTableRow(["last_week_jobs", "Count of completed jobs (previous week)"], true),
          createTableRow(["pipeline_value", "Total value of pending estimates"]),
          createTableRow(["pipeline_count", "Count of pending estimates"], true),
          createTableRow(["close_rate_30d", "Win rate percentage (last 30 days)"]),
          createTableRow(["won_30d", "Count of won estimates (last 30 days)"], true),
          createTableRow(["lost_30d", "Count of lost estimates (last 30 days)"]),
          createTableRow(["scheduled_value_14d", "Value of jobs scheduled (next 14 days)"], true),
          createTableRow(["scheduled_jobs_14d", "Count of scheduled jobs (next 14 days)"]),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== IMPLEMENTATION ==============
      h1("6. Implementation Requirements"),

      h2("6.1 Technology Stack"),
      new Table({
        columnWidths: [3000, 3000, 3360],
        rows: [
          createTableHeader(["Component", "Technology", "Version"]),
          createTableRow(["Runtime", "Python", "3.10+"]),
          createTableRow(["MCP Framework", "FastMCP", "≥1.0.0"], true),
          createTableRow(["HTTP Client", "httpx", "≥0.27.0"]),
          createTableRow(["Package Manager", "pip", "Latest"], true),
        ]
      }),

      new Paragraph({ spacing: { before: 200 } }),
      h2("6.2 File Structure"),
      codeBlock("housecallpro-mcp/"),
      codeBlock("├── server.py          # Main MCP server"),
      codeBlock("├── requirements.txt   # Python dependencies"),
      codeBlock("├── README.md          # Installation guide"),
      codeBlock("└── venv/              # Virtual environment"),

      h2("6.3 Configuration"),
      h3("6.3.1 Environment Variable"),
      codeBlock("HOUSECALLPRO_API_KEY=a]2d48531bbf4e11aaec0b496b03b1ae"),

      new Paragraph({ spacing: { before: 200 } }),
      h3("6.3.2 Claude Desktop Configuration"),
      para("Add to claude_desktop_config.json:"),
      codeBlock('{'),
      codeBlock('  "mcpServers": {'),
      codeBlock('    "housecallpro": {'),
      codeBlock('      "command": "/path/to/venv/bin/python",'),
      codeBlock('      "args": ["/path/to/server.py"],'),
      codeBlock('      "env": {'),
      codeBlock('        "HOUSECALLPRO_API_KEY": "a]2d48531bbf4e11aaec0b496b03b1ae"'),
      codeBlock('      }'),
      codeBlock('    }'),
      codeBlock('  }'),
      codeBlock('}'),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== INSTALLATION ==============
      h1("7. Installation Procedure"),

      h2("7.1 Prerequisites"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Python 3.10 or higher installed", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Claude Desktop installed and configured", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "HouseCall Pro MAX plan (API access required)", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Terminal/Command line access", size: 22 })]
      }),

      h2("7.2 Installation Steps"),
      
      new Paragraph({
        numbering: { reference: "install-list", level: 0 },
        spacing: { before: 200 },
        children: [new TextRun({ text: "Create project directory:", size: 22 })]
      }),
      codeBlock("mkdir ~/housecallpro-mcp && cd ~/housecallpro-mcp"),

      new Paragraph({
        numbering: { reference: "install-list", level: 0 },
        children: [new TextRun({ text: "Create server.py with content from Appendix A", size: 22 })]
      }),

      new Paragraph({
        numbering: { reference: "install-list", level: 0 },
        children: [new TextRun({ text: "Create requirements.txt with content from Appendix B", size: 22 })]
      }),

      new Paragraph({
        numbering: { reference: "install-list", level: 0 },
        children: [new TextRun({ text: "Create and activate virtual environment:", size: 22 })]
      }),
      codeBlock("python3 -m venv venv"),
      codeBlock("source venv/bin/activate  # macOS/Linux"),
      codeBlock("venv\\Scripts\\activate   # Windows"),

      new Paragraph({
        numbering: { reference: "install-list", level: 0 },
        children: [new TextRun({ text: "Install dependencies:", size: 22 })]
      }),
      codeBlock("pip install -r requirements.txt"),

      new Paragraph({
        numbering: { reference: "install-list", level: 0 },
        children: [new TextRun({ text: "Locate Claude Desktop config file:", size: 22 })]
      }),
      codeBlock("macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"),
      codeBlock("Windows: %APPDATA%\\Claude\\claude_desktop_config.json"),

      new Paragraph({
        numbering: { reference: "install-list", level: 0 },
        children: [new TextRun({ text: "Add MCP server configuration (see Section 6.3.2)", size: 22 })]
      }),

      new Paragraph({
        numbering: { reference: "install-list", level: 0 },
        children: [new TextRun({ text: "Restart Claude Desktop", size: 22 })]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== TESTING ==============
      h1("8. Testing & Validation"),

      h2("8.1 Unit Tests"),
      new Table({
        columnWidths: [1500, 4000, 3860],
        rows: [
          createTableHeader(["Test ID", "Test Case", "Expected Result"]),
          createTableRow(["T-001", "API connection with valid key", "HTTP 200, JSON response"]),
          createTableRow(["T-002", "API connection with invalid key", "HTTP 401 Unauthorized"], true),
          createTableRow(["T-003", "get_customers returns data", "Array of customer objects"]),
          createTableRow(["T-004", "get_estimates with status filter", "Only matching status returned"], true),
          createTableRow(["T-005", "get_jobs with date range", "Only jobs in range returned"]),
          createTableRow(["T-006", "get_scorecard_metrics", "All 11 metrics populated"], true),
        ]
      }),

      h2("8.2 Integration Tests"),
      new Paragraph({
        numbering: { reference: "test-list", level: 0 },
        children: [new TextRun({ text: 'In Claude Desktop, type: "Pull my scorecard metrics"', size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "test-list", level: 0 },
        children: [new TextRun({ text: "Verify all metrics are returned with realistic values", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "test-list", level: 0 },
        children: [new TextRun({ text: 'Type: "What is my close rate for the last 30 days?"', size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "test-list", level: 0 },
        children: [new TextRun({ text: "Verify percentage matches manual calculation from HCP", size: 22 })]
      }),

      h2("8.3 Acceptance Criteria"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "All unit tests pass", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Scorecard metrics match HCP dashboard within 5% tolerance", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Response time < 5 seconds for compound tools", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "No API rate limit errors during normal use", size: 22 })]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== SECURITY ==============
      h1("9. Security Considerations"),

      h2("9.1 API Key Protection"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "API key stored in Claude Desktop config, not in source code", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Config file should have restricted permissions (600)", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Never commit API key to version control", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "Rotate key if compromised", size: 22 })]
      }),

      h2("9.2 Data Access"),
      para("The API key provides full read access to all HouseCall Pro data including: customer PII (names, addresses, phone numbers, email), financial data (job amounts, invoices, payments), and employee information. Treat with appropriate sensitivity."),

      h2("9.3 Network Security"),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "All API calls use HTTPS (TLS 1.2+)", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "MCP server runs locally (no network exposure)", size: 22 })]
      }),
      new Paragraph({
        numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "No data persisted to disk by MCP server", size: 22 })]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== TROUBLESHOOTING ==============
      h1("10. Troubleshooting"),

      new Table({
        columnWidths: [3500, 5860],
        rows: [
          createTableHeader(["Symptom", "Resolution"]),
          createTableRow(["Tool not appearing in Claude", "Check config path, restart Claude Desktop"]),
          createTableRow(["401 Unauthorized", "Verify API key, check HCP MAX plan status"], true),
          createTableRow(["Connection timeout", "Check internet, verify api.housecallpro.com accessible"]),
          createTableRow(["Empty results", "Verify date ranges, check status filters"], true),
          createTableRow(["Rate limit (429)", "Reduce query frequency, implement backoff"]),
          createTableRow(["Python not found", "Use full path to venv Python in config"], true),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== APPENDIX A ==============
      h1("Appendix A: server.py"),
      para("Complete source code for the MCP server. Create this file as ~/housecallpro-mcp/server.py"),
      new Paragraph({ spacing: { before: 200 } }),
      para("[See attached file: server.py]"),
      para("File is provided as a separate attachment to this specification."),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== APPENDIX B ==============
      h1("Appendix B: requirements.txt"),
      para("Python dependencies. Create this file as ~/housecallpro-mcp/requirements.txt"),
      new Paragraph({ spacing: { before: 200 } }),
      codeBlock("mcp>=1.0.0"),
      codeBlock("httpx>=0.27.0"),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== APPENDIX C ==============
      h1("Appendix C: Claude Desktop Config Template"),
      para("Complete configuration example. Merge with existing config if present."),
      new Paragraph({ spacing: { before: 200 } }),
      codeBlock('{'),
      codeBlock('  "mcpServers": {'),
      codeBlock('    "housecallpro": {'),
      codeBlock('      "command": "/Users/YOUR_USERNAME/housecallpro-mcp/venv/bin/python",'),
      codeBlock('      "args": ["/Users/YOUR_USERNAME/housecallpro-mcp/server.py"],'),
      codeBlock('      "env": {'),
      codeBlock('        "HOUSECALLPRO_API_KEY": "a]2d48531bbf4e11aaec0b496b03b1ae"'),
      codeBlock('      }'),
      codeBlock('    }'),
      codeBlock('  }'),
      codeBlock('}'),
      new Paragraph({ spacing: { before: 200 } }),
      para("Replace YOUR_USERNAME with actual system username."),
      para("On macOS, config location: ~/Library/Application Support/Claude/claude_desktop_config.json"),
      para("On Windows, config location: %APPDATA%\\Claude\\claude_desktop_config.json"),

      new Paragraph({ children: [new PageBreak()] }),

      // ============== APPENDIX D ==============
      h1("Appendix D: Quick Reference Commands"),
      
      h2("D.1 Natural Language Queries"),
      new Table({
        columnWidths: [4500, 4860],
        rows: [
          createTableHeader(["User Says", "Tool Called"]),
          createTableRow(['"Pull my scorecard metrics"', "get_scorecard_metrics()"]),
          createTableRow(['"What\'s my close rate?"', "get_close_rate(30)"], true),
          createTableRow(['"Show me the pipeline"', "get_pipeline_value()"]),
          createTableRow(['"Revenue this week"', "get_weekly_revenue(0)"], true),
          createTableRow(['"Revenue last week"', "get_weekly_revenue(1)"]),
          createTableRow(['"What\'s scheduled next 2 weeks?"', "get_scheduled_jobs(14)"], true),
          createTableRow(['"Find customer John Smith"', 'get_customers(q="John Smith")']),
          createTableRow(['"Show pending estimates"', 'get_estimates(status="pending")'], true),
        ]
      }),

      h2("D.2 EOS Scorecard Mapping"),
      new Table({
        columnWidths: [3500, 3000, 2860],
        rows: [
          createTableHeader(["Scorecard Metric", "Tool Field", "Target"]),
          createTableRow(["Weekly Revenue", "this_week_revenue", "$25,000"]),
          createTableRow(["Pipeline Value", "pipeline_value", "$50,000+"], true),
          createTableRow(["Close Rate", "close_rate_30d", "38%+ (national avg)"]),
          createTableRow(["Scheduled Revenue", "scheduled_value_14d", "$40,000+"], true),
        ]
      }),

    ]
  }]
});

// Generate document
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/hcp-mcp-spec/HCP_MCP_Technical_Specification_v1.docx", buffer);
  console.log("Specification document created successfully");
});
