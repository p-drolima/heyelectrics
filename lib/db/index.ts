import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL must be set");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

export const db = drizzle(pool, { schema });
