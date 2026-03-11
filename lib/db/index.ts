import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type DbInstance = ReturnType<typeof drizzle<typeof schema>>;

let _db: DbInstance | undefined;

export function getDb(): DbInstance {
  if (!_db) {
    const connectionString =
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
  }
  return _db;
}

export const db = new Proxy({} as DbInstance, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
