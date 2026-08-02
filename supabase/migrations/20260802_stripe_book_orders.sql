create table if not exists public.book_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_slug text not null,
  product_name text not null,
  customer_email text,
  customer_name text,
  customer_phone text,
  quantity integer not null default 1 check (quantity between 1 and 20),
  unit_amount integer not null,
  shipping_amount integer not null default 0,
  tax_amount integer not null default 0,
  total_amount integer not null,
  currency text not null default 'usd',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  payment_status text not null default 'pending' check (payment_status in ('pending','processing','paid','failed','refunded','cancelled')),
  fulfillment_status text not null default 'unfulfilled' check (fulfillment_status in ('unfulfilled','preparing','shipped','delivered','cancelled')),
  shipping_name text,
  shipping_address jsonb,
  tracking_number text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null unique,
  event_type text not null,
  payload jsonb,
  processed_at timestamptz not null default now()
);

alter table public.book_orders enable row level security;
alter table public.payment_webhook_events enable row level security;

drop policy if exists "members view own book orders" on public.book_orders;
create policy "members view own book orders" on public.book_orders
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admins manage book orders" on public.book_orders;
create policy "admins manage book orders" on public.book_orders
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins view webhook events" on public.payment_webhook_events;
create policy "admins view webhook events" on public.payment_webhook_events
for select to authenticated
using (public.is_admin());

grant select on public.book_orders to authenticated;
grant select, update on public.book_orders to authenticated;
grant select on public.payment_webhook_events to authenticated;
