create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  key text not null,
  value jsonb not null default 'null'::jsonb,
  value_type text not null default 'text' check (value_type in ('text','textarea','url','email','number','boolean','color','select','json')),
  label text not null,
  description text,
  is_public boolean not null default false,
  display_order integer not null default 0,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(category, key)
);

create table if not exists public.platform_setting_history (
  id uuid primary key default gen_random_uuid(),
  setting_id uuid references public.platform_settings(id) on delete cascade,
  category text not null,
  key text not null,
  old_value jsonb,
  new_value jsonb,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

alter table public.platform_settings enable row level security;
alter table public.platform_setting_history enable row level security;

drop policy if exists "public read public settings" on public.platform_settings;
create policy "public read public settings" on public.platform_settings for select to anon, authenticated using (is_public or public.is_admin());

drop policy if exists "admins manage platform settings" on public.platform_settings;
create policy "admins manage platform settings" on public.platform_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read setting history" on public.platform_setting_history;
create policy "admins read setting history" on public.platform_setting_history for select to authenticated using (public.is_admin());

grant select on public.platform_settings to anon, authenticated;
grant insert, update, delete on public.platform_settings to authenticated;
grant select on public.platform_setting_history to authenticated;

create or replace function public.audit_platform_setting_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and old.value is distinct from new.value then
    insert into public.platform_setting_history(setting_id, category, key, old_value, new_value, changed_by)
    values(new.id, new.category, new.key, old.value, new.value, new.updated_by);
  end if;
  return new;
end;
$$;

drop trigger if exists platform_setting_audit on public.platform_settings;
create trigger platform_setting_audit after update on public.platform_settings for each row execute function public.audit_platform_setting_change();

insert into public.platform_settings(category,key,value,value_type,label,description,is_public,display_order) values
('general','site_name','"Shift Left Coaching & Consulting"','text','Site name','Primary public brand name.',true,10),
('general','tagline','"Notice earlier. Learn continuously. Care intentionally."','text','Tagline','Primary brand tagline.',true,20),
('general','site_url','"https://www.shiftleftcc.com"','url','Website URL','Canonical production website URL.',true,30),
('general','timezone','"America/Los_Angeles"','text','Timezone','Default operating timezone.',false,40),
('general','language','"en-US"','text','Default language','Default site language and locale.',false,50),
('general','maintenance_mode','false','boolean','Maintenance mode','Reserved for a future maintenance screen.',false,60),
('general','announcement_banner','""','textarea','Announcement banner','Optional global announcement text.',true,70),

('contact','primary_email','"info@shiftleftcc.com"','email','Primary email','Public contact and reply address.',true,10),
('contact','support_email','"info@shiftleftcc.com"','email','Support email','Support and customer-service address.',true,20),
('contact','phone','""','text','Phone','Optional public phone number.',true,30),
('contact','business_hours','"By appointment · Online worldwide"','text','Business hours','Public availability note.',true,40),
('contact','service_delivery','"100% Online · Available across the U.S. and worldwide via Zoom or Microsoft Teams"','textarea','Online service message','Shown near coaching and booking calls to action.',true,50),

('branding','primary_logo','"/shift-left-logo.svg"','text','Primary logo','Default logo asset path.',true,10),
('branding','default_social_image','"/shift-left-logo.svg"','text','Default social image','Fallback Open Graph/social sharing image.',true,20),
('branding','primary_color','"#163546"','color','Primary color','Primary brand color.',true,30),
('branding','secondary_color','"#2f7f72"','color','Secondary color','Secondary brand color.',true,40),
('branding','accent_color','"#188fd0"','color','Accent color','Accent and action color.',true,50),

('seo','default_title','"Shift Left Coaching & Consulting | Online Career, Leadership & Mental Fitness Coaching"','text','Default SEO title','Fallback title for pages without page-specific SEO.',true,10),
('seo','default_description','"Online coaching and consulting for career transitions, leadership, mental fitness, family wellbeing and proactive personal growth using the Shift Left approach."','textarea','Default meta description','Fallback search description.',true,20),
('seo','default_keywords','"online coaching, career coach, leadership coach, executive coaching, mental fitness coach, wellbeing coaching, career transition, burnout prevention"','textarea','Default keywords','Planning guidance for site-wide topical focus.',false,30),
('seo','author','"Bharath Kumar Arekapudi"','text','Author','Default author/entity name.',true,40),

('commerce','currency','"usd"','text','Currency','Default commerce currency.',false,10),
('commerce','default_shipping_amount','500','number','Default shipping (cents)','Default physical-product shipping amount.',false,20),
('commerce','store_notice','"Secure payments are processed by Stripe."','text','Store notice','Public checkout reassurance.',true,30),

('email','from_name','"Shift Left Coaching & Consulting"','text','From name','Default transactional email sender name.',false,10),
('email','reply_to','"info@shiftleftcc.com"','email','Reply-to email','Default reply-to address.',false,20),
('email','footer','"Shift Left Coaching & Consulting · Notice. Learn. Care."','text','Email footer','Default transactional email footer.',false,30),

('scheduling','delivery_mode','"online"','select','Delivery mode','Default delivery mode for coaching and discovery calls.',true,10),
('scheduling','meeting_platforms','"Zoom or Microsoft Teams"','text','Meeting platforms','Platforms offered for online sessions.',true,20),
('scheduling','default_timezone','"Pacific Time"','text','Displayed timezone','Timezone shown in scheduling guidance.',true,30),
('scheduling','scheduling_url','""','url','Scheduling URL','Optional Calendly or scheduling link.',true,40),

('social','linkedin','""','url','LinkedIn','Public LinkedIn URL.',true,10),
('social','instagram','""','url','Instagram','Public Instagram URL.',true,20),
('social','facebook','""','url','Facebook','Public Facebook URL.',true,30),
('social','youtube','""','url','YouTube','Public YouTube URL.',true,40),

('analytics','ga4_measurement_id','""','text','GA4 Measurement ID','Google Analytics 4 measurement identifier.',false,10),
('analytics','search_console_verification','""','text','Search Console verification','Google Search Console verification token.',false,20),
('analytics','bing_verification','""','text','Bing verification','Bing Webmaster Tools verification token.',false,30),

('features','books','true','boolean','Books','Enable public books experience.',false,10),
('features','programs','true','boolean','Coaching & Services','Enable coaching and services catalog.',false,20),
('features','assessments','true','boolean','Assessments','Enable assessments.',false,30),
('features','journal','true','boolean','Journal','Enable member journal.',false,40),
('features','vision_board','true','boolean','Vision Board','Enable vision board.',false,50),
('features','organizations','true','boolean','Organizations','Enable organizational offerings.',false,60),
('features','crm','true','boolean','CRM','Enable client/lead management capabilities.',false,70),
('features','ai','false','boolean','AI features','Enable future AI-assisted features.',false,80)
on conflict(category,key) do nothing;
