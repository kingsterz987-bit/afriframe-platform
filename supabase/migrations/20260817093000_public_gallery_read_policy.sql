-- Allow the public Explore page to read only visible photography records.
-- Admin write policies remain unchanged.
create policy if not exists "Public can view visible photography"
on public.photography_gallery
for select
to anon, authenticated
using (is_hidden = false);
