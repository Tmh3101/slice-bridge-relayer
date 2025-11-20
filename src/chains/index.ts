import { lensTestnet, lensMainnet } from "./lens";
import { bscTestnet, bscMainnet } from "./bsc";
import { envConfig } from "@/core/env";

export const getLensChain = () => {
  return envConfig.IS_MAINNET ? lensMainnet : lensTestnet;
};

export const getBsc = () => {
  return envConfig.IS_MAINNET ? bscMainnet : bscTestnet
};