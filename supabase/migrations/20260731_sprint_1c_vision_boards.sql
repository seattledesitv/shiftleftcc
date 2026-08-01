create table if not exists public.vision_board_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vision_id uuid references public.annual_visions(id) on delete set null,
  life_area_id uuid references public.life_areas(id) on delete set null,
  title text not null,
  affirmation text,
  image_url text,
  image_prompt text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vision_boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vision_id uuid references public.annual_visions(id) on delete set null,
  title text not null,
  theme text not null default 'calm' check (theme in ('calm','bold','elegant','nature','modern','celebration')),
  layout text not null default 'mosaic' check (layout in ('mosaic','magazine','polaroid','focus')),
  snapshot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vision_board_items enable row level security;
alter table public.vision_boards enable row level security;

drop policy if exists "members manage own vision board items" on public.vision_board_items;
create policy "members manage own vision board items" on public.vision_board_items
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "members manage own vision boards" on public.vision_boards;
create policy "members manage own vision boards" on public.vision_boards
for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select, insert, update, delete on public.vision_board_items, public.vision_boards to authenticated;
