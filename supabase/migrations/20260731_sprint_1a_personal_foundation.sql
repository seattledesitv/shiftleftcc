create table if not exists public.life_areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.member_missions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  statement text not null,
  why_it_matters text,
  updated_at timestamptz not null default now()
);

create table if not exists public.annual_visions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  year integer not null check (year between 2000 and 2200),
  title text,
  vision_statement text not null,
  success_definition text,
  why_it_matters text,
  status text not null default 'active' check (status in ('draft','active','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, year)
);

alter table public.member_goals add column if not exists life_area_id uuid references public.life_areas(id);
alter table public.member_goals add column if not exists vision_id uuid references public.annual_visions(id) on delete set null;
alter table public.member_goals add column if not exists why_it_matters text;
alter table public.member_goals add column if not exists success_definition text;
alter table public.member_goals add column if not exists priority integer not null default 3 check (priority between 1 and 5);

create table if not exists public.goal_checkpoints (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.member_goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  planned_date date,
  completed_at timestamptz,
  status text not null default 'planned' check (status in ('planned','in_progress','completed','skipped')),
  confidence integer check (confidence between 1 and 10),
  reflection text,
  next_step text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  source_id uuid,
  event_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.life_areas enable row level security;
alter table public.member_missions enable row level security;
alter table public.annual_visions enable row level security;
alter table public.goal_checkpoints enable row level security;
alter table public.timeline_events enable row level security;

create policy "members read life areas" on public.life_areas for select to authenticated using (is_active or public.is_admin());
create policy "admins manage life areas" on public.life_areas for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "members manage own mission" on public.member_missions for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "members manage own visions" on public.annual_visions for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "members manage own checkpoints" on public.goal_checkpoints for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "members view own timeline" on public.timeline_events for select to authenticated using (user_id=auth.uid());
create policy "members add own timeline" on public.timeline_events for insert to authenticated with check (user_id=auth.uid());

insert into public.life_areas(name,slug,description,icon,display_order) values
('Health & Wellbeing','health-wellbeing','Physical health, energy, rest, and sustainable wellbeing.','❤️',1),
('Mental Fitness','mental-fitness','Awareness, resilience, emotional balance, and proactive self-care.','🧠',2),
('Family & Relationships','family-relationships','Presence, communication, connection, and belonging.','👨‍👩‍👧',3),
('Career','career','Professional growth, contribution, leadership, and transitions.','💼',4),
('Business & Entrepreneurship','business','Building, creating, serving customers, and sustainable growth.','🚀',5),
('Financial','financial','Security, freedom, planning, and responsible stewardship.','💰',6),
('Learning & Education','learning','Skills, curiosity, study, and continuous development.','📚',7),
('Community & Service','community','Service, volunteering, mentorship, and positive impact.','🌍',8),
('Creativity & Experiences','creativity-experiences','Creative expression, travel, joy, and meaningful experiences.','✨',9),
('Spirituality & Purpose','spirituality-purpose','Meaning, values, faith, reflection, and purpose.','🙏',10)
on conflict (slug) do update set name=excluded.name,description=excluded.description,icon=excluded.icon,display_order=excluded.display_order;

grant select on public.life_areas to authenticated;
grant select,insert,update,delete on public.member_missions,public.annual_visions,public.goal_checkpoints,public.timeline_events to authenticated;