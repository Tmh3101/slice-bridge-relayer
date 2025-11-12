import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { envConfig } from "@/core/env";
import { lensTestnet } from "@/chains/lens";
import { wsOrHttp } from "@/lib/helpers/checkpoint";

export const lensPublicClient = createPublicClient({
  chain: lensTestnet,
  transport: wsOrHttp(envConfig.LENS_RPC_WS, envConfig.LENS_RPC_HTTP)
});

export const lensWalletClient = createWalletClient({
  chain: lensTestnet,
  account: privateKeyToAccount(envConfig.RELAYER_PK as `0x${string}`),
  transport: http(envConfig.LENS_RPC_HTTP!)
});