create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  title text not null,
  description text,
  category text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_videos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  thumbnail_path text,
  title text not null,
  description text,
  category text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;
alter table public.gallery_videos enable row level security;

create policy "Public can view gallery photos" on public.gallery_photos for select to anon, authenticated using (true);
create policy "Public can view gallery videos" on public.gallery_videos for select to anon, authenticated using (true);

-- Replace this predicate with the project's existing admin authorization function/claim.
create policy "Admins manage gallery photos" on public.gallery_photos for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins manage gallery videos" on public.gallery_videos for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public)
values ('photography', 'photography', true), ('videos', 'videos', true)
on conflict (id) do nothing;

create policy "Public gallery images are readable" on storage.objects for select to anon, authenticated
  using (bucket_id in ('photography', 'videos'));
create policy "Admins upload gallery media" on storage.objects for insert to authenticated
  with check (bucket_id in ('photography', 'videos') and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins update gallery media" on storage.objects for update to authenticated
  using (bucket_id in ('photography', 'videos') and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id in ('photography', 'videos') and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "Admins delete gallery media" on storage.objects for delete to authenticated
  using (bucket_id in ('photography', 'videos') and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create or replace function public.set_gallery_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists gallery_photos_updated_at on public.gallery_photos;
create trigger gallery_photos_updated_at before update on public.gallery_photos for each row execute function public.set_gallery_updated_at();
drop trigger if exists gallery_videos_updated_at on public.gallery_videos;
create trigger gallery_videos_updated_at before update on public.gallery_videos for each row execute function public.set_gallery_updated_at();
