-- Fix private Storage access for public previews.
-- The previous policy queried user_access directly. Anonymous requests could
-- fail with "permission denied for table user_access" before the free-resource
-- branch was accepted. Keep the membership lookup behind SECURITY DEFINER.

create or replace function public.has_active_reposition_paid_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_access ua
    where ua.user_id = auth.uid()
      and lower(coalesce(ua.membership_tier, 'free')) in ('pro', 'bootcamp')
      and (ua.membership_expires_at is null or ua.membership_expires_at > now())
  );
$$;

revoke all on function public.has_active_reposition_paid_access() from public;
grant execute on function public.has_active_reposition_paid_access() to anon, authenticated;

drop policy if exists "practical storage accessible read" on storage.objects;
create policy "practical storage accessible read"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'practical-resources'
  and exists (
    select 1
    from public.practical_resources pr
    where pr.file_path = name
      and pr.is_published = true
      and (
        pr.access_level = 'free'
        or public.is_reposition_admin()
        or public.has_active_reposition_paid_access()
      )
  )
);
