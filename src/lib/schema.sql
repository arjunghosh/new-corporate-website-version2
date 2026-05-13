-- Flexilytics Corporate v2 — NeonDB schema
-- Run once: psql $DATABASE_URL -f src/lib/schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id          SERIAL PRIMARY KEY,
  kind        TEXT        NOT NULL,
  name        TEXT,
  email       TEXT        NOT NULL,
  company     TEXT,
  role        TEXT,
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (email);
CREATE INDEX IF NOT EXISTS leads_kind_idx  ON leads (kind);

CREATE TABLE IF NOT EXISTS newsletter_subs (
  id          SERIAL PRIMARY KEY,
  email       TEXT        UNIQUE NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS waitlist (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        UNIQUE NOT NULL,
  company     TEXT,
  role        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
