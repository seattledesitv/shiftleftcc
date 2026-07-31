create table if not exists public.member_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'Wellbeing',
  target_date date,
  status text not null default 'active' check (status in ('active','completed','paused')),
  progress integer not null default 0 check (progress between 0 and 100),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.discovery_call_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  audience text,
  organization text,
  interest text,
  message text not null,
  availability text,
  status text not null default 'new' check (status in ('new','contacted','scheduled','converted','closed')),
  email_status text not null default 'pending' check (email_status in ('pending','sent','failed')),
  email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_goals enable row level security;
alter table public.discovery_call_leads enable row level security;

drop policy if exists "members manage own goals" on public.member_goals;
create policy "members manage own goals" on public.member_goals
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "admins manage discovery leads" on public.discovery_call_leads;
create policy "admins manage discovery leads" on public.discovery_call_leads
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select, insert, update, delete on public.member_goals to authenticated;
grant select, update, delete on public.discovery_call_leads to authenticated;
