import { z } from "zod";
import {
  ShogunBalancesApiClient,
  SOLANA_CHAIN_ID,
  TokenPrice,
} from "@0xshogun/sdk";
import "dotenv/config";

const balanceClient = new ShogunBalancesApiClient(
  process.env.CODEX_API_KEY || ""
);

const formatTokenUsdPriceDetails = (token_price: TokenPrice) => {
  return [
    `Token: ${token_price.address}`,
    `  Price: $${token_price.priceUsd}`,
    `  Timestamp: $${token_price.timestamp}`,
  ].join("\n");
};

export const getTokenUsdPriceTool = {
  name: "getTokenUsdPrice",
  description: "Get the token usd price of a given token address",
  inputSchema: z.object({
    token_address: z
      .string()
      .describe("The token address to get the usd price of"),
  }).shape,
  execute: async (args: { token_address: string }, extra: any) => {
    try {
      const { token_address } = args;
      const isValid = balanceClient.isValidAddress(token_address);
      if (!isValid) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Invalid Token address: ${token_address}`,
            },
          ],
          isError: true,
        };
      }

      const token_price = (await balanceClient.getTokenUSDPrice(
        token_address,
        SOLANA_CHAIN_ID
      )) as TokenPrice;

      if (!token_price) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No token usd price found for ${args.token_address}`,
            },
          ],
          isError: true,
        };
      }

      const formatted_data = formatTokenUsdPriceDetails(token_price);
      const detailsText = `Token USD Price for ${token_address}:\n\n${formatted_data}`;

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
