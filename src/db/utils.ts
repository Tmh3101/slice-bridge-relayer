import { pgSchema } from "drizzle-orm/pg-core";

export const bridgeDB = pgSchema("bridge_db");

export const checkConnection = async (client: any) => {
    await client`SELECT 1`;
};