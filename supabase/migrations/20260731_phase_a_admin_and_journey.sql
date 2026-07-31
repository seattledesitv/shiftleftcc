create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin','owner')),
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

drop policy if exists "admins can read own role" on public.admins;
create policy "admins can read own role" on public.admins
for select to authenticated
using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to authenticated;

-- Run this after your login account exists, replacing the email if needed:
-- insert into public.admins (user_id, email, role)
-- select id, email, 'owner' from auth.users where lower(email) = lower('abharathkumar@gmail.com')
-- on conflict (user_id) do update set role = excluded.role, email = excluded.email;
