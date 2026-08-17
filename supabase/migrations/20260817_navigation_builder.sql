create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  location text not null default 'header' check (location in ('header','footer_discover','footer_explore')),
  label text not null,
  href text not null,
  parent_id uuid references public.navigation_items(id) on delete cascade,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  is_cta boolean not null default false,
  auth_visibility text not null default 'public' check (auth_visibility in ('public','authenticated','admin')),
  open_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists navigation_items_location_order_idx on public.navigation_items(location, display_order);
create index if not exists navigation_items_parent_idx on public.navigation_items(parent_id);

alter table public.navigation_items enable row level security;

drop policy if exists "public view visible navigation" on public.navigation_items;
create policy "public view visible navigation" on public.navigation_items
for select to anon, authenticated
using (is_visible = true or public.is_admin());

drop policy if exists "admins manage navigation" on public.navigation_items;
create policy "admins manage navigation" on public.navigation_items
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.navigation_items to anon, authenticated;
grant insert, update, delete on public.navigation_items to authenticated;

insert into public.navigation_items (location,label,href,display_order,is_visible,is_cta,auth_visibility)
select * from (values
  ('header','Home','/',10,true,false,'public'),
  ('header','The Shift Left Method','/why-shift-left',20,true,false,'public'),
  ('header','Coaching & Services','/programs',30,true,false,'public'),
  ('header','Organizations','/organizations',40,true,false,'public'),
  ('header','Books','/books',50,true,false,'public'),
  ('header','Resources','/resources',60,true,false,'public'),
  ('header','About Bharath','/my-story',70,true,false,'public'),
  ('header','My Journey','/my-journey',80,true,false,'authenticated'),
  ('header','Studio','/studio',90,true,false,'admin'),
  ('header','Start Your Journey','/book',100,true,true,'public'),

  ('footer_discover','Home','/',10,true,false,'public'),
  ('footer_discover','The Shift Left Method','/why-shift-left',20,true,false,'public'),
  ('footer_discover','About Bharath','/my-story',30,true,false,'public'),
  ('footer_discover','How It Works','/how-it-works',40,true,false,'public'),
  ('footer_discover','Who It Is For','/for-who',50,true,false,'public'),

  ('footer_explore','Coaching & Services','/programs',10,true,false,'public'),
  ('footer_explore','Organizations','/organizations',20,true,false,'public'),
  ('footer_explore','Consulting','/consulting',30,true,false,'public'),
  ('footer_explore','Speaking','/speaking',40,true,false,'public'),
  ('footer_explore','Books','/books',50,true,false,'public'),
  ('footer_explore','Resources','/resources',60,true,false,'public'),
  ('footer_explore','Blog','/blog',70,true,false,'public'),
  ('footer_explore','Wellbeing Assessment','/wellbeing-assessment',80,true,false,'public')
) as seed(location,label,href,display_order,is_visible,is_cta,auth_visibility)
where not exists (select 1 from public.navigation_items);
