-- ─────────────────────────────────────────────────────────────
-- Ember & Oak — Reservations table
-- Paste this entire file into the Supabase SQL Editor and click Run.
-- (Dashboard → SQL Editor → New query → paste → Run)
-- ─────────────────────────────────────────────────────────────

create table if not exists reservations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- Guest info
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  phone           text not null,

  -- Booking details
  party_size      text not null,
  reservation_date date not null,
  reservation_time text not null,
  occasion        text,
  notes           text,

  -- Funnel/marketing
  offer_code      text default 'EMBER-WELCOME',
  source          text default 'funnel',
  status          text default 'pending'  -- pending | confirmed | seated | no_show | cancelled
);

create index if not exists reservations_date_idx on reservations (reservation_date);
create index if not exists reservations_email_idx on reservations (email);

-- ─── Row Level Security ───
-- Anon role (the public website) can only INSERT new reservations.
-- They cannot read, update, or delete other people's bookings.
-- Only the service_role (used in the Supabase dashboard) can read them.

alter table reservations enable row level security;

drop policy if exists "Public can insert reservations" on reservations;
create policy "Public can insert reservations"
  on reservations
  for insert
  to anon
  with check (true);
