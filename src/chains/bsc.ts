import { defineChain } from "viem";
import { BSC_TESTNET_RPCS, BSC_MAINNET_RPCS } from "@/core/rpcs";

export const bscTestnet = defineChain({
  id: 97,
  name: "BSC Testnet",
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: BSC_TESTNET_RPCS
    }
  },
});

export const bscMainnet = defineChain({
  id: 56,
  name: "BSC Mainnet",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: BSC_MAINNET_RPCS
    }
  },
});
