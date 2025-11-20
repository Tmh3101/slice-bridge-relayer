import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
}

export const envConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_MAINNET: process.env.NODE_ENV === "production",

  LENS_CHAIN_ID: process.env.NODE_ENV === "production" ? 232 : 37111,
  LENS_START_BLOCK: Number(process.env.LENS_START_BLOCK || 0),

  LENS_MINTER_ADDRESS: process.env.LENS_MINTER_ADDRESS!,
  LENS_WRAPPED_ADDRESS: process.env.LENS_WRAPPED_ADDRESS!,

  BSC_CHAIN_ID: process.env.NODE_ENV === "production" ? 56 : 97,
  BSC_START_BLOCK: Number(process.env.BSC_START_BLOCK || 0),

  BSC_TOKEN_ADDRESS: process.env.BSC_TOKEN_ADDRESS!,
  BSC_POOL_ADDRESS: process.env.BSC_POOL_ADDRESS!,

  RELAYER_PK: process.env.RELAYER_PK!,
  DATABASE_URL: process.env.DATABASE_URL!,

  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  QUEUE_PREFIX: process.env.QUEUE_PREFIX || 'slice-bridge',
};