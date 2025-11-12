import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { envConfig } from "@/core/env";
import { bscTestnet } from "../chains/bsc";
import { wsOrHttp } from "@/lib/helpers/checkpoint";

export const bscPublicClient = createPublicClient({
  chain: bscTestnet,
  transport: wsOrHttp(envConfig.BSC_RPC_WS, envConfig.BSC_RPC_HTTP)
});

export const bscWalletClient = createWalletClient({
  chain: bscTestnet,
  account: privateKeyToAccount(envConfig.RELAYER_PK as `0x${string}`),
  transport: http(envConfig.BSC_RPC_HTTP!)
});