import { defineChain } from "viem";
import { LENS_TESTNET_RPCS, LENS_MAINNET_RPCS } from "@/core/rpcs";

export const lensTestnet = defineChain({
  id: 37111,
  name: "Lens Testnet",
  nativeCurrency: {
    name: "GRASS",
    symbol: "GRASS",
    decimals: 18
  },
  rpcUrls: {
    default: {
        http: LENS_TESTNET_RPCS
    }
  },
});

export const lensMainnet = defineChain({
  id: 232,
  name: "Lens",
  nativeCurrency: {
    name: "GHO",
    symbol: "GHO",
    decimals: 18
  },
  rpcUrls: {
    default: {
        http: LENS_MAINNET_RPCS
    }
  },
});
