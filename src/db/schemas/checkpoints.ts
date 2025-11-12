import { varchar, bigint } from "drizzle-orm/pg-core";
import { bridgeDB } from "../utils"

export const checkpoints = bridgeDB.table("checkpoints", {
  key: varchar("key", { length: 64 }).primaryKey(), // e.g. "locked-bsc", "burned-lens"
  lastBlock: bigint("last_block", { mode: "number" }).notNull(), // last processed
});