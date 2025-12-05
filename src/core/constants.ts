import { envConfig } from "./env";
import {
    BSC_MAINNET_RPCS,
    BSC_TESTNET_RPCS,
    LENS_MAINNET_RPCS,
    LENS_TESTNET_RPCS
} from "./rpcs";

export const FEE_PERCENTAGE = envConfig.IS_MAINNET ? 0.3 : 0; // 0.3% fee on mainnet, 0% on testnet
export const MIN_TOKEN_PER_TX = 10; // Minimum 10 tokens per transaction

export const BSC_RPCS = envConfig.IS_MAINNET ? BSC_MAINNET_RPCS : BSC_TESTNET_RPCS;
export const LENS_RPCS = envConfig.IS_MAINNET ? LENS_MAINNET_RPCS : LENS_TESTNET_RPCS;