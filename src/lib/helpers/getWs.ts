import { fallback, webSocket } from "viem";
import type { FallbackTransport } from "viem";
import { getBsc } from "@/chains";
import {
  BSC_MAINNET_WS,
  BSC_TESTNET_WS
} from "@/core/rpcs";
import { envConfig } from "@/core/env";

const getWssByChainId = (chainId: number): string[] => {
    const bscChain = getBsc();

    if (chainId === bscChain.id) {
        return envConfig.IS_MAINNET ? BSC_MAINNET_WS : BSC_TESTNET_WS;
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
