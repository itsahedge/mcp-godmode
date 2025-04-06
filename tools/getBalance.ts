import { z } from "zod";
import { ShogunBalancesApiClient, TokenBalanceResults } from "@0xshogun/sdk";
import "dotenv/config";

// const quoteClient = new ShogunQuoteApiClient(
//   process.env.SHOGUN_API_KEY || "", // Dextra API key
//   "https://api-staging.intensitylabs.ai" // Dextra API endpoint
// );

const balanceClient = new ShogunBalancesApiClient(
  process.env.CODEX_API_KEY || ""
);

const formatBalanceDetails = (balance: TokenBalanceResults[]) => {
  return balance
    .map((token) => {
      return [
        `Token: ${token.symbol}`,
        `  Contract Address: ${token.tokenAddress}`,
        `  Network: ${token.network}`,
        `  Market Cap: $${token.mcap}`,
        `  Price: $${token.usdPrice}`,
        `  Balance: ${token.balanceFormatted} ${token.symbol}`,
        `  USD Value: $${token.usdValue}`,
      ].join("\n");
    })
    .join("\n\n");
};

export const getBalanceTool = {
  name: "getBalance",
  description: "Get the balance of a given trader address",
  inputSchema: z.object({
    trader_address: z
      .string()
      .describe("The trader address to get the balance of"),
  }).shape,
  execute: async (args: { trader_address: string }, extra: any) => {
    try {
      const { trader_address } = args;
      const isValid = balanceClient.isValidAddress(trader_address);
      if (!isValid) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Invalid Solana address: ${trader_address}`,
            },
          ],
          isError: true,
        };
      }

      const balance = (await balanceClient.getSolanaTokenBalances(
        trader_address
      )) as TokenBalanceResults[];

      if (balance.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No balance found for ${args.trader_address}`,
            },
          ],
          isError: true,
        };
      }

      const formatted_data = formatBalanceDetails(balance);
      const detailsText = `Balance for ${args.trader_address}:\n\n${formatted_data}`;

      return {
        content: [
          {
            type: "text" as const,
            text: detailsText,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  },
};
