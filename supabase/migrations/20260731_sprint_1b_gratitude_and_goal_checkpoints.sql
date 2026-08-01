create table if not exists public.gratitude_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  gratitude_one text not null,
  gratitude_two text,
  gratitude_three text,
  highlight text,
  appreciated_person text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, entry_date)
);

create table if not exists public.goal_reviews (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.member_goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  review_type text not null default 'checkpoint' check (review_type in ('checkpoint','quarterly','year_end','final')),
  progress integer not null default 0 check (progress between 0 and 100),
  wins text,
  challenges text,
  lessons text,
  next_actions text,
  achievement_summary text,
  reviewed_at timestamptz not null default now()
);

alter table public.gratitude_entries enable row level security;
alter table public.goal_reviews enable row level security;

drop policy if exists "members manage own gratitude" on public.gratitude_entries;
create policy "members manage own gratitude" on public.gratitude_entries
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "members manage own goal reviews" on public.goal_reviews;
create policy "members manage own goal reviews" on public.goal_reviews
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select,insert,update,delete on public.gratitude_entries, public.goal_reviews to authenticated;
