import { fallback, webSocket } from "viem";
import type { FallbackTransport } from "viem";
import { getBsc, getLensChain } from "@/chains";
import {
  BSC_MAINNET_WS,
  BSC_TESTNET_WS,
  LENS_MAINNET_WS,
  LENS_TESTNET_WS
} from "@/core/rpcs";
import { envConfig } from "@/core/env";

const getWssByChainId = (chainId: number): string[] => {
    const bscChain = getBsc();
    const lensChain = getLensChain();

    if (chainId === bscChain.id) {
      return envConfig.IS_MAINNET ? BSC_MAINNET_WS : BSC_TESTNET_WS;
    }

    if (chainId === lensChain.id) {
      return envConfig.IS_MAINNET ? LENS_MAINNET_WS : LENS_TESTNET_WS;
    }

    return [];
}

const getWs = (chainId: number): FallbackTransport => {
  const rpcs = getWssByChainId(chainId);
  return fallback(
    rpcs.map((ws) => webSocket(ws))
  );
};

export default getWs;
