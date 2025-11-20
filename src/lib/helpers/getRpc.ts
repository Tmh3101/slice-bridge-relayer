import { fallback, http } from "viem";
import type { FallbackTransport } from "viem";
import { getLensChain, getBsc } from "@/chains";
import {
  LENS_MAINNET_RPCS,
  LENS_TESTNET_RPCS,
  BSC_MAINNET_RPCS,
  BSC_TESTNET_RPCS
} from "@/core/rpcs";

const BATCH_SIZE = 10;

const getRpcsByChainId = (chainId: number): string[] => {
    const lensChain = getLensChain();
    const bscChain = getBsc();

    switch (chainId) {
        case lensChain.id:
            return LENS_MAINNET_RPCS;
        case bscChain.id:
            return BSC_MAINNET_RPCS;
        case lensChain.id:
            return LENS_TESTNET_RPCS;
        case bscChain.id:
            return BSC_TESTNET_RPCS;
        default:
            return [];
    }
}

const getRpc = (chainId: number): FallbackTransport => {
  const rpcs = getRpcsByChainId(chainId);
  return fallback(
    rpcs.map((rpc) => http(rpc, { batch: { batchSize: BATCH_SIZE } }))
  );
};

export default getRpc;
