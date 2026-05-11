/**
 * Database client — Neon serverless + Drizzle ORM
 *
 * Uses @neondatabase/serverless for edge-compatible connections.
 * Set DATABASE_URL in your environment to connect.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDbUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local or your Vercel environment variables."
    );
  }
  return url;
}

/**
 * Create a Drizzle instance on demand.
 *
 * In serverless environments each invocation gets its own
 * short-lived connection via Neon's HTTP driver — no pool needed.
 */
export function getDb() {
  const sql = neon(getDbUrl());
  return drizzle(sql, { schema });
}

export type Db = ReturnType<typeof getDb>;
export { schema };
