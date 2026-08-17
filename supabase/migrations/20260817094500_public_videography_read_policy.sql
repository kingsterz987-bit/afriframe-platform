-- Allow the public site to read only visible videography records.
-- Run this migration against the existing Afriframe Supabase project.

alter table if exists public.videography_gallery enable row level security;

drop policy if exists "Public can view visible videography" on public.videography_gallery;
create policy "Public can view visible videography"
  on public.videography_gallery
  for select
  to anon, authenticated
  using (is_hidden = false);

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do update set public = true;

select pg_notify('pgrst', 'reload schema');
select pg_notify('storage', 'reload');
