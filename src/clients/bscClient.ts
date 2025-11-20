import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { createSmartPublicClient } from "@/clients/factory/smartClient";
import { envConfig } from "@/core/env";
import { getBsc } from "@/chains";
import getRpc from "@/lib/helpers/getRpc";

const bscChain = getBsc();

export const bscPublicClient = createSmartPublicClient(bscChain);
export const bscWalletClient = createWalletClient({
  chain: bscChain,
  account: privateKeyToAccount(envConfig.RELAYER_PK as `0x${string}`),
  transport: getRpc(bscChain.id)
});