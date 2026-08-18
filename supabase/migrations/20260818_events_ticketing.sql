create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text,
  image_url text,
  event_type text not null default 'in_person' check (event_type in ('in_person','online','hybrid')),
  venue_name text,
  venue_address text,
  online_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'America/Los_Angeles',
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  capacity integer check (capacity is null or capacity >= 0),
  status text not null default 'draft' check (status in ('draft','published','completed','cancelled')),
  organizer_name text default 'Shift Left Coaching & Consulting',
  organizer_email text default 'info@shiftleftcc.com',
  confirmation_message text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_ticket_types (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  description text,
  price_amount integer not null default 0 check (price_amount >= 0),
  currency text not null default 'usd',
  quantity_available integer check (quantity_available is null or quantity_available >= 0),
  max_per_order integer not null default 10 check (max_per_order > 0),
  sale_starts_at timestamptz,
  sale_ends_at timestamptz,
  is_active boolean not null default true,
  display_order integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_orders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  purchaser_user_id uuid references auth.users(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  subtotal_amount integer not null default 0,
  tax_amount integer not null default 0,
  total_amount integer not null default 0,
  currency text not null default 'usd',
  payment_status text not null default 'not_required' check (payment_status in ('not_required','pending','processing','paid','failed','cancelled','refunded')),
  order_status text not null default 'pending' check (order_status in ('pending','confirmed','cancelled','refunded')),
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.event_orders(id) on delete cascade,
  ticket_type_id uuid not null references public.event_ticket_types(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price integer not null default 0,
  line_total integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.event_tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete restrict,
  order_id uuid not null references public.event_orders(id) on delete cascade,
  ticket_type_id uuid not null references public.event_ticket_types(id) on delete restrict,
  ticket_code text not null unique default encode(gen_random_bytes(12), 'hex'),
  attendee_name text not null,
  attendee_email text not null,
  status text not null default 'valid' check (status in ('valid','cancelled','refunded','used')),
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.event_email_log (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  order_id uuid references public.event_orders(id) on delete cascade,
  recipient_email text not null,
  email_type text not null,
  provider_message_id text,
  status text not null default 'sent',
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_status_starts on public.events(status, starts_at);
create index if not exists idx_event_ticket_types_event on public.event_ticket_types(event_id, display_order);
create index if not exists idx_event_orders_event on public.event_orders(event_id, created_at desc);
create index if not exists idx_event_tickets_event on public.event_tickets(event_id, created_at desc);
create index if not exists idx_event_tickets_order on public.event_tickets(order_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at before update on public.events for each row execute function public.set_updated_at();
drop trigger if exists trg_event_ticket_types_updated_at on public.event_ticket_types;
create trigger trg_event_ticket_types_updated_at before update on public.event_ticket_types for each row execute function public.set_updated_at();
drop trigger if exists trg_event_orders_updated_at on public.event_orders;
create trigger trg_event_orders_updated_at before update on public.event_orders for each row execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.event_ticket_types enable row level security;
alter table public.event_orders enable row level security;
alter table public.event_order_items enable row level security;
alter table public.event_tickets enable row level security;
alter table public.event_email_log enable row level security;

create policy "published events are public" on public.events for select using (status = 'published' or exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "admins manage events" on public.events for all using (exists (select 1 from public.admins a where a.user_id = auth.uid())) with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "public ticket types for published events" on public.event_ticket_types for select using (exists (select 1 from public.events e where e.id = event_id and e.status = 'published') or exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "admins manage ticket types" on public.event_ticket_types for all using (exists (select 1 from public.admins a where a.user_id = auth.uid())) with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "users view own event orders" on public.event_orders for select using (purchaser_user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "admins manage event orders" on public.event_orders for all using (exists (select 1 from public.admins a where a.user_id = auth.uid())) with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "users view own event order items" on public.event_order_items for select using (exists (select 1 from public.event_orders o where o.id = order_id and (o.purchaser_user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid()))));
create policy "admins manage event order items" on public.event_order_items for all using (exists (select 1 from public.admins a where a.user_id = auth.uid())) with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "users view own event tickets" on public.event_tickets for select using (exists (select 1 from public.event_orders o where o.id = order_id and (o.purchaser_user_id = auth.uid() or exists (select 1 from public.admins a where a.user_id = auth.uid()))));
create policy "admins manage event tickets" on public.event_tickets for all using (exists (select 1 from public.admins a where a.user_id = auth.uid())) with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "admins view email log" on public.event_email_log for select using (exists (select 1 from public.admins a where a.user_id = auth.uid()));
create policy "admins manage email log" on public.event_email_log for all using (exists (select 1 from public.admins a where a.user_id = auth.uid())) with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
