create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  author text not null default 'Bharath Kumar Arekapudi',
  description text,
  cover_image_url text,
  price_amount integer not null default 1999 check (price_amount >= 0),
  shipping_amount integer not null default 500 check (shipping_amount >= 0),
  currency text not null default 'usd',
  status text not null default 'active' check (status in ('active','draft','inactive')),
  featured boolean not null default false,
  inventory_mode text not null default 'unlimited' check (inventory_mode in ('unlimited','tracked')),
  inventory_count integer,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.book_orders add column if not exists book_id uuid references public.books(id) on delete set null;

insert into public.books (slug,title,subtitle,description,cover_image_url,price_amount,shipping_amount,status,featured,display_order)
values
  ('mind-fitness','Mind Fitness: Through IT Strategies','Ready to level up your well-being?','A practical wellbeing book that uses familiar IT and technology concepts as a lens for strengthening mind fitness, awareness, resilience, and everyday wellbeing.','/books/mind-fitness-cover.svg',1999,500,'active',true,1),
  ('ego-and-empathy','Ego & Empathy','What You Think Isn''t Always What Your Thinks. So Think It First.','A practical exploration of ego, empathy, self-awareness, relationships, leadership, and finding a healthier balance between confidence and compassion.','/books/ego-empathy-cover.svg',1999,500,'active',true,2)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  cover_image_url = excluded.cover_image_url,
  updated_at = now();

alter table public.books enable row level security;

drop policy if exists "public view active books" on public.books;
create policy "public view active books" on public.books
for select to anon, authenticated
using (status = 'active' or public.is_admin());

drop policy if exists "admins manage books" on public.books;
create policy "admins manage books" on public.books
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.books to anon, authenticated;
grant insert, update, delete on public.books to authenticated;
