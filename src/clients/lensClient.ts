import { createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createSmartPublicClient } from "@/clients/factory/smartClient";
import { envConfig } from "@/core/env";
import { getLensChain } from "@/chains";
import getRpc from "@/lib/helpers/getRpc";

const lensChain = getLensChain();

export const lensPublicClient = createSmartPublicClient(lensChain);
export const lensWalletClient = createWalletClient({
  chain: lensChain,
  account: privateKeyToAccount(envConfig.RELAYER_PK as `0x${string}`),
  transport: getRpc(lensChain.id)
});