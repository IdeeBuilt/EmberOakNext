-- ─────────────────────────────────────────────────────────────
-- Ember & Oak — Admin policies (run AFTER supabase-schema.sql)
-- This adds permissions for the restaurant owner (logged-in users)
-- to read and update reservations from the admin dashboard.
-- ─────────────────────────────────────────────────────────────

-- Allow logged-in users (the owner) to read all reservations
drop policy if exists "Authenticated can read reservations" on reservations;
create policy "Authenticated can read reservations"
  on reservations
  for select
  to authenticated
  using (true);

-- Allow logged-in users (the owner) to update reservation status,
-- EXCEPT the read-only demo user used for portfolio showcase.
drop policy if exists "Authenticated can update reservations" on reservations;
create policy "Authenticated can update reservations"
  on reservations
  for update
  to authenticated
  using (auth.jwt() ->> 'email' != 'demo@gmail.com')
  with check (auth.jwt() ->> 'email' != 'demo@gmail.com');

-- Note: We deliberately do NOT add a delete policy — keeps audit trail intact.
-- If a booking is cancelled, mark its status as 'cancelled' instead of deleting.
