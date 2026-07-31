-- Label capture: fields the photo fills in, plus somewhere to keep the photo.
--
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).

-- 1. Identity fields the label supplies. All nullable — a tasting logged
--    without a photo, or from a label that omits them, is still valid.
alter table tastings
  add column if not exists country text,
  add column if not exists grape_variety text,
  add column if not exists alcohol numeric(4, 1),
  add column if not exists label_image_url text;

-- Indexed because these are the axes the tasting list filters on.
create index if not exists tastings_user_country_idx
  on tastings (user_id, country);
create index if not exists tastings_user_grape_idx
  on tastings (user_id, grape_variety);

-- 2. A bucket for the label photos.
--
--    Private, not public: a tasting note is personal, and a public bucket would
--    make every uploaded label readable by anyone holding the URL. The app
--    reads images through short-lived signed URLs instead.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'labels',
  'labels',
  false,
  5242880,  -- 5 MB; the client compresses to well under this
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- 3. Storage RLS. Objects are stored under '<user_id>/<filename>', so the first
--    path segment is the owner and each user reaches only their own folder.
--    Without these four policies uploads fail with a 403.
drop policy if exists "Users can upload their own labels" on storage.objects;
create policy "Users can upload their own labels"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'labels'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can read their own labels" on storage.objects;
create policy "Users can read their own labels"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'labels'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update their own labels" on storage.objects;
create policy "Users can update their own labels"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'labels'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete their own labels" on storage.objects;
create policy "Users can delete their own labels"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'labels'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
