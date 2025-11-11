import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { bridgeJobs } from "./schemas/bridgeJob";

const client = postgres(
    process.env.DATABASE_URL!,
    {
        ssl: "require" as any
    }
);

export const db = drizzle(client);
export {
    bridgeJobs
};