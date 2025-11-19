import { envConfig } from "./env";

export const FEE_PERCENTAGE = envConfig.IS_MAINNET ? 0.003 : 0; // 0.3% fee on mainnet, 0% on testnet
export const MIN_TOKEN_PER_TX = 10; // Minimum 10 tokens per transaction