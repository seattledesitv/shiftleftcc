-- Studio access for approved admins. Journal content remains private to each member.

drop policy if exists "admins can read profiles" on public.profiles;
create policy "admins can read profiles" on public.profiles
for select to authenticated
using (public.is_admin());

drop policy if exists "admins can read assessment sessions" on public.assessment_sessions;
create policy "admins can read assessment sessions" on public.assessment_sessions
for select to authenticated
using (public.is_admin());

drop policy if exists "admins can read assessment results" on public.assessment_results;
create policy "admins can read assessment results" on public.assessment_results
for select to authenticated
using (public.is_admin());

drop policy if exists "admins can manage assessment templates" on public.assessment_templates;
create policy "admins can manage assessment templates" on public.assessment_templates
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can manage assessment categories" on public.assessment_categories;
create policy "admins can manage assessment categories" on public.assessment_categories
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can manage assessment questions" on public.assessment_questions;
create policy "admins can manage assessment questions" on public.assessment_questions
for all to authenticated
using (public.is_admin())
with check (public.is_admin());
