import { pgSchema } from "drizzle-orm/pg-core";
import { envConfig } from "@/core/env";

export const bridgeDB = pgSchema(envConfig.DB_SCHEMA);

export const checkConnection = async (client: any) => {
    await client`SELECT 1`;
};