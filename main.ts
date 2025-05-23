import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import "dotenv/config";
import { getBalanceTool } from "./tools/getBalance.js";
import { getTokenUsdPriceTool } from "./tools/getTokenUsdPrice.js";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-coingecko",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

const paramSchema = z.object({
  trader_address: z
    .string()
    .describe("The trader address to get the balance of"),
  token_address: z
    .string()
    .describe("The token address to get the usd price of"),
});

server.tool("getBalance", paramSchema.shape, getBalanceTool.execute);
server.tool(
  "getTokenUsdPrice",
  paramSchema.shape,
  getTokenUsdPriceTool.execute
);

const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
