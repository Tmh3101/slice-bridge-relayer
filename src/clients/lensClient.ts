import { createPublicClient, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { envConfig } from "@/core/env";
import { getLensChain } from "@/chains";
import getRpc from "@/lib/helpers/getRpc";

const lensChain = getLensChain();

export const lensPublicClient = createPublicClient({
  chain: lensChain,
  transport: getRpc(lensChain.id),
});

export const lensWalletClient = createWalletClient({
  chain: lensChain,
  account: privateKeyToAccount(envConfig.RELAYER_PK as `0x${string}`),
  transport: getRpc(lensChain.id)
});