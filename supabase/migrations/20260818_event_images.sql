-- Event image storage for Studio-managed event artwork.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-images',
  'event-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Only Shift Left admins may create/change/delete event images.
drop policy if exists "Admins upload event images" on storage.objects;
create policy "Admins upload event images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'event-images'
  and exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  )
);

drop policy if exists "Admins update event images" on storage.objects;
create policy "Admins update event images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'event-images'
  and exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'event-images'
  and exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  )
);

drop policy if exists "Admins delete event images" on storage.objects;
create policy "Admins delete event images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'event-images'
  and exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  )
);
