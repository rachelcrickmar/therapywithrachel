import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let sql: Sql | null = null;
let schemaReady: Promise<void> | null = null;

export function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export function analyticsConfigured() {
  return Boolean(getDatabaseUrl());
}

export function getSql() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("Analytics database is not configured.");
  }
  if (!sql) sql = neon(url);
  return sql;
}

async function ensureSchema(client: Sql) {
  await client`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id BIGSERIAL PRIMARY KEY,
      occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      environment TEXT NOT NULL DEFAULT 'production',
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      location TEXT,
      referrer TEXT,
      visitor_id TEXT,
      session_id TEXT,
      country TEXT,
      city TEXT
    )
  `;
  await client`
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS country TEXT
  `;
  await client`
    ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS city TEXT
  `;
  await client`
    CREATE INDEX IF NOT EXISTS analytics_events_lookup_idx
      ON analytics_events (environment, name, occurred_at DESC)
  `;
  await client`
    CREATE INDEX IF NOT EXISTS analytics_events_path_idx
      ON analytics_events (environment, path, occurred_at DESC)
  `;
  await client`
    CREATE TABLE IF NOT EXISTS analytics_daily (
      day DATE NOT NULL,
      environment TEXT NOT NULL,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (day, environment, name, path, location)
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS analytics_presence (
      visitor_id TEXT NOT NULL,
      environment TEXT NOT NULL,
      path TEXT,
      country TEXT,
      city TEXT,
      last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (visitor_id, environment)
    )
  `;
  await client`
    ALTER TABLE analytics_presence ADD COLUMN IF NOT EXISTS country TEXT
  `;
  await client`
    ALTER TABLE analytics_presence ADD COLUMN IF NOT EXISTS city TEXT
  `;
  await client`
    CREATE INDEX IF NOT EXISTS analytics_presence_live_idx
      ON analytics_presence (environment, last_seen DESC)
  `;
}

export async function withAnalyticsDb() {
  const client = getSql();
  if (!schemaReady) {
    schemaReady = ensureSchema(client).catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
  return client;
}
