import { fallback, webSocket } from "viem";
import type { FallbackTransport } from "viem";
import { getBsc } from "@/chains";
import {
  BSC_MAINNET_WS,
  BSC_TESTNET_WS
} from "@/core/rpcs";

const BATCH_SIZE = 10;

const getWssByChainId = (chainId: number): string[] => {
    const bscChain = getBsc();

    switch (chainId) {
        case bscChain.id:
            return BSC_MAINNET_WS;
        case bscChain.id:
            return BSC_TESTNET_WS;
        default:
            return [];
    }
}

const getWs = (chainId: number): FallbackTransport => {
  const rpcs = getWssByChainId(chainId);
  return fallback(
    rpcs.map((ws) => webSocket(ws))
  );
};

export default getWs;
