create table if not exists public.commerce_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  product_type text not null check (product_type in ('book','coaching','program','workshop','assessment','digital','other')),
  fulfillment_type text not null default 'scheduling' check (fulfillment_type in ('shipping','scheduling','digital','registration','manual')),
  audience text,
  title text not null,
  subtitle text,
  description text,
  duration_label text,
  image_url text,
  price_amount integer check (price_amount is null or price_amount >= 0),
  shipping_amount integer not null default 0 check (shipping_amount >= 0),
  currency text not null default 'usd',
  pricing_mode text not null default 'fixed' check (pricing_mode in ('fixed','starting_at','custom')),
  purchase_enabled boolean not null default false,
  status text not null default 'active' check (status in ('active','draft','inactive')),
  featured boolean not null default false,
  display_order integer not null default 0,
  success_message text,
  scheduling_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid not null references public.commerce_products(id) on delete restrict,
  product_slug text not null,
  product_name text not null,
  product_type text not null,
  fulfillment_type text not null,
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
  fulfillment_status text not null default 'pending' check (fulfillment_status in ('pending','scheduled','completed','cancelled')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.commerce_products (slug,product_type,fulfillment_type,audience,title,subtitle,description,duration_label,price_amount,pricing_mode,purchase_enabled,status,featured,display_order,success_message)
values
  ('shift-left-foundations','program','scheduling','Individuals','Shift Left Foundations',null,'Build a practical personal framework around continuous awareness, continuous learning, and continuous self-care.','4-session coaching program',null,'fixed',false,'active',true,10,'Your Shift Left Foundations program is confirmed. Schedule your first session to begin.'),
  ('career-clarity-transition','coaching','scheduling','Individuals','Career Clarity & Transition',null,'Navigate career decisions, leadership transitions, job changes, setbacks, and the search for meaningful forward movement.','Single session or 4-session program',null,'fixed',false,'active',true,20,'Your Career Clarity & Transition purchase is confirmed. Schedule your session when you are ready.'),
  ('executive-wellbeing-coaching','coaching','scheduling','Leaders','Executive Wellbeing Coaching',null,'A systems-thinking approach to leadership, resilience, energy, communication, and sustainable performance.','Customized engagement',null,'custom',false,'active',false,30,'Thank you. We will coordinate the next step for your executive coaching engagement.'),
  ('stronger-family-conversations','program','scheduling','Families','Stronger Family Conversations',null,'Create safer, more meaningful conversations between parents, teens, and family members before disconnection becomes crisis.','Single session or family series',null,'fixed',false,'active',true,40,'Your Stronger Family Conversations program is confirmed. Schedule your first session to get started.'),
  ('mental-fitness-logical-minds','workshop','registration','Organizations','Mental Fitness for Logical Minds',null,'A practical workshop translating familiar engineering and technology practices into tools for reflection, resilience, and wellbeing.','60–90 minute workshop',null,'custom',false,'active',false,50,'Thank you for your workshop purchase. We will coordinate scheduling and participant details with you.'),
  ('shift-left-strategy-workshop','workshop','registration','Organizations','The Shift Left Strategy Workshop',null,'Help teams notice earlier, learn continuously, and care intentionally through a shared proactive wellbeing framework.','Half-day or full-day',null,'custom',false,'active',false,60,'Thank you for your workshop purchase. We will coordinate scheduling and participant details with you.')
on conflict (slug) do nothing;

alter table public.commerce_products enable row level security;
alter table public.commerce_orders enable row level security;

drop policy if exists "public view active commerce products" on public.commerce_products;
create policy "public view active commerce products" on public.commerce_products
for select to anon, authenticated
using (status = 'active' or public.is_admin());

drop policy if exists "admins manage commerce products" on public.commerce_products;
create policy "admins manage commerce products" on public.commerce_products
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "members view own commerce orders" on public.commerce_orders;
create policy "members view own commerce orders" on public.commerce_orders
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admins manage commerce orders" on public.commerce_orders;
create policy "admins manage commerce orders" on public.commerce_orders
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.commerce_products to anon, authenticated;
grant insert, update, delete on public.commerce_products to authenticated;
grant select, update on public.commerce_orders to authenticated;
