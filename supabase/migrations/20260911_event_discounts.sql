create table if not exists public.event_discounts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  code text not null,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value integer not null check (discount_value > 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(event_id, code)
);

alter table public.event_orders add column if not exists discount_id uuid references public.event_discounts(id) on delete set null;
alter table public.event_orders add column if not exists discount_code text;
alter table public.event_orders add column if not exists discount_amount integer not null default 0;

create index if not exists idx_event_discounts_event on public.event_discounts(event_id, is_active);

alter table public.event_discounts enable row level security;

drop policy if exists "admins manage event discounts" on public.event_discounts;
create policy "admins manage event discounts" on public.event_discounts for all
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop trigger if exists trg_event_discounts_updated_at on public.event_discounts;
create trigger trg_event_discounts_updated_at before update on public.event_discounts
for each row execute function public.set_updated_at();
