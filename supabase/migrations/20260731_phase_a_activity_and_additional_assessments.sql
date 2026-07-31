create table if not exists public.activity_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  activity_type text not null check (activity_type in ('walking','running','cycling','strength','yoga','sports','other')),
  duration_minutes integer check (duration_minutes is null or duration_minutes between 0 and 1440),
  steps integer check (steps is null or steps >= 0),
  sleep_hours numeric(4,1) check (sleep_hours is null or sleep_hours between 0 and 24),
  recovery_score integer check (recovery_score is null or recovery_score between 1 and 5),
  notes text,
  source text not null default 'manual' check (source in ('manual','apple_health','health_connect','fitbit','google_health')),
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, source, external_id)
);

create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('apple_health','health_connect','fitbit','google_health')),
  status text not null default 'planned' check (status in ('planned','connected','paused','revoked','error')),
  scopes text[] not null default '{}',
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, provider)
);

alter table public.activity_entries enable row level security;
alter table public.integration_connections enable row level security;

drop policy if exists "Users manage own activity" on public.activity_entries;
create policy "Users manage own activity" on public.activity_entries
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own integrations" on public.integration_connections;
create policy "Users manage own integrations" on public.integration_connections
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Seed additional non-clinical Shift Left assessments. These are educational self-reflection tools.
insert into public.assessment_templates (slug, title, description, version, is_active)
values
  ('stress-recovery-check-in', 'Stress & Recovery Check-In', 'Reflect on current demands, recovery habits, boundaries, and early warning signals.', 1, true),
  ('career-clarity-check-in', 'Career Clarity Check-In', 'Explore direction, strengths, values, confidence, and readiness for a next career step.', 1, true),
  ('family-communication-check-in', 'Family Communication Check-In', 'Reflect on listening, trust, emotional safety, and meaningful conversations at home.', 1, true),
  ('leadership-wellbeing-check-in', 'Leadership Wellbeing Check-In', 'Explore leadership energy, boundaries, team connection, resilience, and sustainable performance.', 1, true)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  version = excluded.version,
  is_active = excluded.is_active;
