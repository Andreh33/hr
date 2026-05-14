import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Optional DB. When TURSO_* env vars are absent (e.g. the user hasn't rotated
// the leaked token yet) we return null and the API handlers fall back to a
// soft-success path that logs server-side. The moment env vars exist, the
// same code paths begin writing to Turso with zero code change.
let _client: Client | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;
  const url = process.env.TURSO_DATABASE_URL;
  const token = process.env.TURSO_AUTH_TOKEN;
  if (!url || !token) return null;
  _client = createClient({ url, authToken: token });
  _db = drizzle(_client, { schema });
  return _db;
}

export { schema };
