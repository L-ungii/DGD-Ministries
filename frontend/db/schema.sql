-- =============================================================
-- Divine Grace & Deliverance Ministries — database schema
-- Plain PostgreSQL. Run once against your database, e.g.:
--   psql "$DATABASE_URL" -f db/schema.sql
-- or paste it into pgAdmin's Query Tool.
--
-- Authorization is enforced by the Next.js API routes (checking the
-- admin session cookie), not by Postgres roles/RLS — a bare Postgres
-- instance has no "authenticated"/"anon" roles to hang policies off.
-- =============================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ---------- ADMIN USERS ----------
-- Created via `node scripts/create-admin.mjs`, not through the website.
create table if not exists admin_users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- ---------- MEDIA ----------
-- Uploaded image bytes, served back out by GET /api/media/:id.
-- Everything else (events, gallery) references a row here instead of
-- pointing at an external file host — no separate storage service to run.
create table if not exists media (
  id           uuid primary key default gen_random_uuid(),
  data         bytea not null,
  content_type text  not null,
  created_at   timestamptz not null default now()
);

-- ---------- EVENTS ----------
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  description text,
  location    text,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  media_id    uuid references media(id) on delete set null,
  image_url   text generated always as ('/api/media/' || media_id::text) stored,
  published   boolean     not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- GALLERY ----------
create table if not exists gallery (
  id         uuid primary key default gen_random_uuid(),
  media_id   uuid not null references media(id) on delete cascade,
  image_url  text generated always as ('/api/media/' || media_id::text) stored,
  caption    text,
  album      text not null default 'General',
  sort_order int  not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- ANNOUNCEMENTS ----------
create table if not exists announcements (
  id         uuid primary key default gen_random_uuid(),
  message    text not null,
  link_url   text,
  active     boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Reverts an announcement image experiment — image_url must go first
-- since it's a generated column derived from media_id.
alter table announcements drop column if exists image_url;
alter table announcements drop column if exists media_id;

-- ---------- POSTER ----------
-- A single "poster of the day" the admin swaps out — never more than one
-- row. Uploading a new poster deletes the old row (and its media) first.
create table if not exists poster (
  id         uuid primary key default gen_random_uuid(),
  media_id   uuid not null references media(id) on delete cascade,
  image_url  text generated always as ('/api/media/' || media_id::text) stored,
  caption    text,
  created_at timestamptz not null default now()
);

-- ---------- PRAYER REQUESTS ----------
create table if not exists prayer_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  request    text not null,
  is_private boolean not null default true,
  answered   boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- QUIZ SCORES ----------
create table if not exists quiz_scores (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  score      int  not null,
  max_score  int  not null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists events_starts_at_idx  on events (starts_at);
create index if not exists gallery_album_idx     on gallery (album, sort_order);
create index if not exists quiz_scores_score_idx on quiz_scores (score desc, created_at asc);
create index if not exists announcements_active_idx on announcements (active);
create index if not exists prayer_requests_answered_idx on prayer_requests (answered);
