import { fallback, http } from "viem";
import type { FallbackTransport } from "viem";
import { getLensChain, getBsc } from "@/chains";
import {
  LENS_MAINNET_RPCS,
  LENS_TESTNET_RPCS,
  BSC_MAINNET_RPCS,
  BSC_TESTNET_RPCS
} from "@/core/rpcs";
import { envConfig } from "@/core/env";

const BATCH_SIZE = 10;

const getRpcsByChainId = (chainId: number): string[] => {
    const lensChain = getLensChain();
    const bscChain = getBsc();

    switch (chainId) {
        case lensChain.id:
            return envConfig.IS_MAINNET ? LENS_MAINNET_RPCS : LENS_TESTNET_RPCS;
        case bscChain.id:
            return envConfig.IS_MAINNET ? BSC_MAINNET_RPCS : BSC_TESTNET_RPCS;
        default:
            return [];
    }
}

const getRpc = (chainId: number): FallbackTransport => {
  const rpcs = getRpcsByChainId(chainId);
  return fallback(
    rpcs.map((rpc) => http(rpc, { batch: { batchSize: BATCH_SIZE } })),
    {
      rank: true,
      retryCount: 3
    }
  );
};

export default getRpc;
