---
applyTo: "**"
---

# Penpot MCP — Setup & Usage

Penpot's official MCP server enables LLMs to query, transform, and create elements
in a Penpot design file via the Model Context Protocol. It communicates with Penpot
through a dedicated **Penpot MCP Plugin** that runs inside the Penpot editor.

---

## Architecture

```
AI Client (LLM)
    │  MCP (HTTP/SSE or stdio-proxy)
    ▼
Penpot MCP Server  ←──WebSocket──→  Penpot MCP Plugin (inside Penpot editor)
```

Both the MCP server and the plugin web server must be running, **and** the plugin
must be loaded and connected inside Penpot before the LLM can send requests.

---

## Prerequisites

- Node.js ≥ 20 (tested with v22.x)
- A running Penpot instance (cloud: `design.penpot.app` or self-hosted)
- A Chromium-based browser or Firefox (see connectivity note below)

---

## Step 1 — Start the MCP Server and Plugin Server

### Option A — Released version via npx (recommended)

```bash
# Latest Penpot release (design.penpot.app)
npx -y @penpot/mcp@">=0"

# MCP beta-test (test-mcp.penpot.dev)
npx -y @penpot/mcp@"*"
```

### Option B — From source

```bash
# Clone the branch that matches your Penpot version
# Current release 2.14:
git clone https://github.com/penpot/penpot.git --branch mcp-prod-2.14.0 --depth 1
# Development / beta:
git clone https://github.com/penpot/penpot.git --branch develop --depth 1

cd penpot/mcp

# First run: install dependencies (skip inside Penpot devenv)
./scripts/setup       # use Git Bash on Windows

# Build & start all components
pnpm run bootstrap
```

Both options start:

| Service | Default address |
|---------|----------------|
| MCP HTTP server (Streamable HTTP) | `http://localhost:4401/mcp` |
| MCP HTTP server (Legacy SSE) | `http://localhost:4401/sse` |
| WebSocket server (plugin connection) | `ws://localhost:4402` |
| Plugin web server | `http://localhost:4400` |

---

## Step 2 — Load the Plugin in Penpot

> **Browser connectivity note:** Chromium ≥ 142 enforces Private Network Access
> restrictions. Allow the popup when prompted, or use Firefox if your browser blocks
> the connection. In Brave, disable the Shield for the Penpot site.

1. Open Penpot in your browser and navigate to a design file.
2. Open the **Plugins** menu.
3. Load the plugin using the development URL:
   ```
   http://localhost:4400/manifest.json
   ```
4. Open the plugin UI.
5. Click **"Connect to MCP server"** — the status should change to **"Connected to MCP server"**.

> Do **not** close the plugin UI while using the MCP server; closing it drops the
> WebSocket connection.

---

## Step 3 — Connect an AI Client

### Clients with native HTTP/SSE support

Point the client directly at one of these endpoints:

| Transport | URL |
|-----------|-----|
| Streamable HTTP | `http://localhost:4401/mcp` |
| Legacy SSE | `http://localhost:4401/sse` |

**Claude Code:**

```bash
claude mcp add penpot -t http http://localhost:4401/mcp
```

### Clients with stdio transport only (e.g. Claude Desktop)

Install the `mcp-remote` proxy:

```bash
npm install -g mcp-remote
```

**Claude Desktop** — add to `claude_desktop_config.json`:

| OS | Path |
|----|------|
| Windows | `%APPDATA%/Claude/claude_desktop_config.json` |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

```json
{
  "mcpServers": {
    "penpot": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "http://localhost:4401/sse", "--allow-http"]
    }
  }
}
```

Fully quit and restart Claude Desktop for the change to take effect.

**VS Code / GitHub Copilot** — add to `.vscode/mcp.json` (or user `settings.json`
under `"mcp.servers"`):

```json
{
  "servers": {
    "penpot": {
      "type": "sse",
      "url": "http://localhost:4401/sse"
    }
  }
}
```

---

## Environment Variables

### MCP Server

| Variable | Description | Default |
|----------|-------------|---------|
| `PENPOT_MCP_SERVER_HOST` | Bind address for the MCP server | `localhost` |
| `PENPOT_MCP_SERVER_PORT` | HTTP/SSE server port | `4401` |
| `PENPOT_MCP_WEBSOCKET_PORT` | WebSocket server port (plugin connection) | `4402` |
| `PENPOT_MCP_SERVER_ADDRESS` | Hostname clients use to reach the server | `localhost` |
| `PENPOT_MCP_REMOTE_MODE` | Disable local file system access (`true`/`false`) | `false` |

### Logging

| Variable | Description | Default |
|----------|-------------|---------|
| `PENPOT_MCP_LOG_LEVEL` | `trace` \| `debug` \| `info` \| `warn` \| `error` | `info` |
| `PENPOT_MCP_LOG_DIR` | Directory for log files | `logs` |

### Plugin Server

| Variable | Description | Default |
|----------|-------------|---------|
| `PENPOT_MCP_PLUGIN_SERVER_HOST` | Bind address for the plugin web server | local only |

---

## Remote / Multi-user Deployment

Set these additional variables when hosting the MCP server remotely:

```bash
PENPOT_MCP_REMOTE_MODE=true
PENPOT_MCP_SERVER_LISTEN_ADDRESS=0.0.0.0   # bind all interfaces (caution in untrusted networks)
PENPOT_MCP_PLUGIN_SERVER_LISTEN_ADDRESS=0.0.0.0
PENPOT_MCP_SERVER_ADDRESS=<your-public-hostname-or-ip>
```

See the [multi-user mode docs](https://github.com/penpot/penpot/blob/develop/mcp/docs/multi-user-mode.md)
for full details.

---

## Reference

- [Penpot MCP source](https://github.com/penpot/penpot/tree/develop/mcp)
- [npm package `@penpot/mcp`](https://www.npmjs.com/package/@penpot/mcp)
- [Video playlist](https://www.youtube.com/playlist?list=PLgcCPfOv5v57SKMuw1NmS0-lkAXevpn10)
