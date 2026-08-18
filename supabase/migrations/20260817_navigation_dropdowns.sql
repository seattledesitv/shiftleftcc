-- Seed useful dropdown children for the dynamic site navigation.
-- Safe to run more than once: each child is guarded by parent + href.

-- Coaching & Services children
insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','Coaching Programs','/programs',p.id,10,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/programs' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/programs'
  )
limit 1;

insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','Consulting','/consulting',p.id,20,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/programs' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/consulting'
  )
limit 1;

insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','Speaking & Workshops','/speaking',p.id,30,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/programs' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/speaking'
  )
limit 1;

insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','Wellbeing Assessment','/wellbeing-assessment',p.id,40,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/programs' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/wellbeing-assessment'
  )
limit 1;

-- Resources children
insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','Resource Hub','/resources',p.id,10,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/resources' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/resources'
  )
limit 1;

insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','Blog','/blog',p.id,20,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/resources' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/blog'
  )
limit 1;

insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','Assessments','/wellbeing-assessment',p.id,30,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/resources' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/wellbeing-assessment'
  )
limit 1;

-- About Bharath children
insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','My Journey','/my-story',p.id,10,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/my-story' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/my-story'
  )
limit 1;

insert into public.navigation_items (location,label,href,parent_id,display_order,is_visible,is_cta,auth_visibility,open_new_tab)
select 'header','Why Work With Me','/why-me',p.id,20,true,false,'public',false
from public.navigation_items p
where p.location='header' and p.href='/my-story' and p.parent_id is null
  and not exists (
    select 1 from public.navigation_items c
    where c.parent_id=p.id and c.href='/why-me'
  )
limit 1;
