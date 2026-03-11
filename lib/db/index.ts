import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let _db: NodePgDatabase<typeof schema> | null = null;

function getDb() {
  if (_db) return _db;

  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.STORAGE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL, POSTGRES_URL, or STORAGE_URL must be set"
    );
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  _db = drizzle(pool, { schema });
  return _db;
}

export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop) {
    return (getDb() as Record<string | symbol, unknown>)[prop];
  },
});
