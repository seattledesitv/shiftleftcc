create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  version integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_categories (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.assessment_templates(id) on delete cascade,
  name text not null,
  slug text not null,
  display_order integer not null default 0,
  max_points integer not null default 50,
  unique(template_id, slug)
);

create table if not exists public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.assessment_templates(id) on delete cascade,
  category_id uuid not null references public.assessment_categories(id) on delete cascade,
  question_text text not null,
  display_order integer not null,
  weight numeric not null default 1,
  is_active boolean not null default true,
  unique(template_id, display_order)
);

create table if not exists public.assessment_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.assessment_templates(id),
  status text not null default 'in_progress' check (status in ('in_progress','completed','abandoned')),
  current_question integer not null default 0,
  answers jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.assessment_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid not null references public.assessment_templates(id),
  total_score integer not null,
  category_scores jsonb not null default '{}'::jsonb,
  benchmark integer not null default 80,
  interpretation text,
  created_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood integer check (mood between 1 and 5),
  title text,
  body text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.assessment_sessions enable row level security;
alter table public.assessment_results enable row level security;
alter table public.journal_entries enable row level security;
alter table public.assessment_templates enable row level security;
alter table public.assessment_categories enable row level security;
alter table public.assessment_questions enable row level security;

create policy "Public can read active templates" on public.assessment_templates for select using (is_active = true);
create policy "Public can read categories" on public.assessment_categories for select using (true);
create policy "Public can read active questions" on public.assessment_questions for select using (is_active = true);
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users manage own sessions" on public.assessment_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users view own results" on public.assessment_results for select using (auth.uid() = user_id);
create policy "Users insert own results" on public.assessment_results for insert with check (auth.uid() = user_id);
create policy "Users manage own journal" on public.journal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into public.assessment_templates (slug, title, description, version)
values ('wellbeing-foundations', 'Wellbeing Foundations Assessment', 'Mind Fitness and Physical Wellbeing self-reflection assessment.', 1)
on conflict (slug) do update set title = excluded.title, description = excluded.description;

with template as (
  select id from public.assessment_templates where slug = 'wellbeing-foundations'
)
insert into public.assessment_categories (template_id, name, slug, display_order, max_points)
select id, 'Mind Fitness', 'mind-fitness', 1, 50 from template
union all
select id, 'Physical Wellbeing', 'physical-wellbeing', 2, 50 from template
on conflict (template_id, slug) do update set name = excluded.name, display_order = excluded.display_order;

with template as (select id from public.assessment_templates where slug='wellbeing-foundations'),
categories as (select id, slug from public.assessment_categories where template_id=(select id from template))
insert into public.assessment_questions (template_id, category_id, question_text, display_order)
select (select id from template), (select id from categories where slug='mind-fitness'), q.text, q.ord
from (values
  (1,'I notice changes in my thoughts, stress, or mood before they become overwhelming.'),
  (2,'I can pause and respond thoughtfully instead of reacting automatically.'),
  (3,'I have a clear sense of purpose, priorities, or direction in my current life.'),
  (4,'I feel supported and able to talk openly with at least one trusted person.'),
  (5,'I regularly reflect, learn from feedback, and adjust when something is not working.')
) as q(ord,text)
union all
select (select id from template), (select id from categories where slug='physical-wellbeing'), q.text, q.ord
from (values
  (6,'I usually get enough sleep to function with reasonable energy and focus.'),
  (7,'I include movement or physical activity in my routine consistently.'),
  (8,'My eating and hydration habits generally support my energy and wellbeing.'),
  (9,'I make time for rest, recovery, and breaks before exhaustion builds.'),
  (10,'My current routines feel sustainable for the responsibilities I am carrying.')
) as q(ord,text)
on conflict (template_id, display_order) do update set question_text = excluded.question_text, category_id = excluded.category_id;
