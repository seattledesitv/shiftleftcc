create table if not exists public.seo_pages (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  page_name text not null,
  seo_title text not null,
  meta_description text not null,
  keywords text[] not null default '{}',
  canonical_url text,
  og_image text default '/shift-left-logo.svg',
  schema_type text not null default 'WebPage',
  index_page boolean not null default true,
  sitemap_enabled boolean not null default true,
  sitemap_priority numeric(2,1) not null default 0.7,
  change_frequency text not null default 'monthly',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.seo_pages enable row level security;

drop policy if exists "public read seo pages" on public.seo_pages;
create policy "public read seo pages" on public.seo_pages for select to anon, authenticated using (true);

drop policy if exists "admins manage seo pages" on public.seo_pages;
create policy "admins manage seo pages" on public.seo_pages for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.seo_pages to anon, authenticated;
grant insert, update, delete on public.seo_pages to authenticated;

insert into public.seo_pages (path,page_name,seo_title,meta_description,keywords,canonical_url,schema_type,sitemap_priority,change_frequency,notes)
values
('/', 'Home', 'Online Career, Leadership & Mental Fitness Coaching | Shift Left', 'Online coaching and consulting for career transitions, leadership, mental fitness, family wellbeing and proactive personal growth using the Shift Left approach.', array['online coach','career coach','leadership coach','mental fitness coach','life coaching','executive coaching','Shift Left coaching'], 'https://www.shiftleftcc.com/', 'WebPage', 1.0, 'weekly', 'Primary brand and broad service landing page.'),
('/programs', 'Programs', 'Online Coaching Programs | Career, Leadership, Family & Mental Fitness', 'Explore online coaching programs for career clarity, leadership wellbeing, family communication and mental fitness. Purchase fixed-price programs directly or request a customized engagement.', array['online coaching programs','career coaching','leadership coaching','family coaching','mental fitness coaching','executive wellbeing coaching'], 'https://www.shiftleftcc.com/programs', 'CollectionPage', 0.9, 'weekly', 'Emphasize that programs are delivered virtually and can be purchased online.'),
('/book', 'Discovery Call', 'Book an Online Coaching Discovery Call | Shift Left', 'Book a complimentary 30-minute online discovery call for customized coaching, consulting, workshops, family support or organizational wellbeing programs.', array['online coaching consultation','career coach consultation','leadership coach consultation','mental health coaching consultation','virtual coaching call'], 'https://www.shiftleftcc.com/book', 'Service', 0.8, 'monthly', 'Discovery call is for customized needs; fixed-price programs should purchase directly.'),
('/organizations', 'Organizations', 'Online Workplace Wellbeing & Leadership Programs | Shift Left', 'Virtual and customized wellbeing, leadership, mental fitness and proactive culture programs for teams, schools, universities, nonprofits and organizations.', array['workplace wellbeing','leadership development','employee wellbeing','mental fitness workshop','online corporate workshop','psychological safety'], 'https://www.shiftleftcc.com/organizations', 'Service', 0.8, 'monthly', null),
('/consulting', 'Consulting', 'Online Strategy, Product & Community Consulting | Shift Left', 'Online consulting for product strategy, technology, websites, marketing, community placement and practical execution using a proactive Shift Left approach.', array['online consultant','technology consultant','product strategy consultant','website consulting','marketing consultant'], 'https://www.shiftleftcc.com/consulting', 'Service', 0.8, 'monthly', null),
('/speaking', 'Speaking', 'Virtual Speaker on Mental Fitness, Leadership & Shift Left Strategy', 'Book Bharath Kumar Arekapudi for virtual or in-person speaking on mental fitness, leadership, proactive wellbeing, technology-inspired thinking and the Shift Left Strategy.', array['mental fitness speaker','leadership speaker','virtual keynote speaker','wellbeing speaker','technology leadership speaker'], 'https://www.shiftleftcc.com/speaking', 'Service', 0.8, 'monthly', null),
('/books', 'Books', 'Books on Mental Fitness, Ego & Empathy | Bharath Kumar Arekapudi', 'Explore books by Bharath Kumar Arekapudi on mental fitness, wellbeing, ego, empathy, self-awareness and practical personal growth. Purchase securely online.', array['mental fitness book','ego and empathy book','wellbeing books','Bharath Kumar Arekapudi books'], 'https://www.shiftleftcc.com/books', 'CollectionPage', 0.8, 'monthly', null),
('/books/mind-fitness', 'Mind Fitness Book', 'Mind Fitness: Through IT Strategies | Bharath Kumar Arekapudi', 'Mind Fitness: Through IT Strategies translates familiar technology and systems concepts into practical strategies for resilience, awareness and everyday wellbeing.', array['Mind Fitness Through IT Strategies','mental fitness book','IT wellbeing','technology mental fitness'], 'https://www.shiftleftcc.com/books/mind-fitness', 'Book', 0.8, 'monthly', null),
('/books/ego-and-empathy', 'Ego & Empathy Book', 'Ego & Empathy | Bharath Kumar Arekapudi', 'Ego & Empathy explores self-awareness, confidence, compassion, relationships and leadership while helping readers find a healthier balance between ego and empathy.', array['Ego and Empathy','empathy book','self awareness book','leadership empathy'], 'https://www.shiftleftcc.com/books/ego-and-empathy', 'Book', 0.8, 'monthly', null),
('/wellbeing-assessment', 'Wellbeing Assessment', 'Online Wellbeing Assessment | Shift Left Coaching', 'Take the Shift Left online wellbeing assessment to reflect on awareness, habits, stress, growth and areas where earlier action may support greater wellbeing.', array['online wellbeing assessment','mental fitness assessment','wellness self assessment','life wellbeing assessment'], 'https://www.shiftleftcc.com/wellbeing-assessment', 'WebPage', 0.8, 'monthly', null),
('/my-story', 'About Bharath', 'Bharath Kumar Arekapudi | Coach, Consultant & Shift Left Founder', 'Meet Bharath Kumar Arekapudi, technology leader, coach, consultant, author and founder of the Shift Left Strategy for proactive wellbeing and growth.', array['Bharath Kumar Arekapudi','Shift Left founder','technology leadership coach','career coach for IT professionals'], 'https://www.shiftleftcc.com/my-story', 'AboutPage', 0.8, 'monthly', null),
('/blog', 'Journal', 'Career, Leadership & Mental Fitness Journal | Shift Left', 'Articles on career transitions, leadership, mental fitness, burnout prevention, family wellbeing, systems thinking and proactive personal growth.', array['career coaching articles','leadership wellbeing','mental fitness articles','burnout prevention','systems thinking wellbeing'], 'https://www.shiftleftcc.com/blog', 'Blog', 0.8, 'weekly', null)
on conflict (path) do nothing;
