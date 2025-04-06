# mcp-godmode

## Get started

`npm i`

`npm run build`

## Config files for connecting MCP

In Cursor: `mcp.json`

In Claude Desktop app: `claude_desktop_config.json`

```
{
  "mcpServers": {
        "godmode": {
            "command": "/Users/donpark/.asdf/installs/nodejs/22.1.0/bin/node",
            "args": [
                "/Users/donpark/code/itsahedge/mcp/mcp-godmode/dist/main.js"
            ],
            "env": {
                "CODEX_API_KEY": "API_KEY_HERE",
                "PATH": "/Users/donpark/.asdf/shims:/usr/local/bin:/usr/bin:/bin",
                "NODE_PATH": "/Users/donpark/.asdf/installs/nodejs/22.1.0/lib/node_modules"
            },
            "stdio": "pipe"
        }
  }
}
```
