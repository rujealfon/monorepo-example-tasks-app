import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import type { AppEnv } from "../lib/types";

import * as schema from "./schema";

export function createDb(env: AppEnv["Bindings"]) {
  const databaseUrl = env.DATABASE_URL;

  // Use neon for remote databases (Neon, Vercel, Supabase)
  if (databaseUrl.includes("neon.tech") || databaseUrl.includes("vercel") || databaseUrl.includes("supabase")) {
    const sql = neon(databaseUrl);
    return drizzle(sql, { schema });
  }

  // Use standard pg for local PostgreSQL
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  return drizzleNode(pool, { schema });
}
