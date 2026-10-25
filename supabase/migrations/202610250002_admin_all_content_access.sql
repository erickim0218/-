-- 관리자 전체 콘텐츠 접근 보장
-- 관리자 다운로드는 횟수 제한과 고객 다운로드 통계에서 제외합니다.

create or replace function public.is_reposition_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_access
    where user_id = auth.uid()
      and app_role = 'admin'
  );
$$;

revoke all on function public.is_reposition_admin() from public;
grant execute on function public.is_reposition_admin() to anon, authenticated;

drop policy if exists "practical resources admin select" on public.practical_resources;
create policy "practical resources admin select"
on public.practical_resources for select
to authenticated
using (public.is_reposition_admin());

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
      and (
        public.is_reposition_admin()
        or (
          pr.is_published = true
          and (
            pr.access_level = 'free'
            or exists (
              select 1
              from public.user_access ua
              where ua.user_id = auth.uid()
                and lower(coalesce(ua.membership_tier, 'free')) in ('pro', 'bootcamp')
                and (
                  ua.membership_expires_at is null
                  or ua.membership_expires_at > now()
                )
            )
          )
        )
      )
  )
);

drop function if exists public.increment_practical_resource_download(uuid);

create function public.increment_practical_resource_download(resource_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  viewer_id uuid := auth.uid();
  viewer_email text;
  viewer_name text;
  download_id uuid;
  viewer_is_admin boolean := public.is_reposition_admin();
begin
  if viewer_id is null then
    raise exception '로그인 후 자료를 다운로드할 수 있습니다.';
  end if;

  if not exists (
    select 1
    from public.practical_resources pr
    where pr.id = $1
      and (
        viewer_is_admin
        or (
          pr.is_published = true
          and (
            pr.access_level = 'free'
            or exists (
              select 1
              from public.user_access ua
              where ua.user_id = viewer_id
                and lower(coalesce(ua.membership_tier, 'free')) in ('pro', 'bootcamp')
                and (
                  ua.membership_expires_at is null
                  or ua.membership_expires_at > now()
                )
            )
          )
        )
      )
  ) then
    raise exception 'RESOURCE_ACCESS_DENIED';
  end if;

  -- 관리자는 모든 자료를 반복 확인할 수 있고 고객 다운로드 수에는 포함하지 않습니다.
  if viewer_is_admin then
    return gen_random_uuid();
  end if;

  insert into public.practical_resource_claims (resource_id, user_id)
  values ($1, viewer_id)
  on conflict on constraint practical_resource_claims_pkey do nothing;

  if not found then
    raise exception 'RESOURCE_ALREADY_CLAIMED';
  end if;

  update public.practical_resources pr
  set download_count = pr.download_count + 1
  where pr.id = $1;

  select p.email, p.full_name
  into viewer_email, viewer_name
  from public.profiles p
  where p.id = viewer_id;

  if viewer_email is null then
    select u.email
    into viewer_email
    from auth.users u
    where u.id = viewer_id;
  end if;

  insert into public.practical_resource_downloads (
    resource_id,
    user_id,
    user_email,
    user_name
  )
  values (
    $1,
    viewer_id,
    coalesce(viewer_email, ''),
    viewer_name
  )
  returning id into download_id;

  return download_id;
end;
$$;

revoke all
on function public.increment_practical_resource_download(uuid)
from public;

grant execute
on function public.increment_practical_resource_download(uuid)
to authenticated;

notify pgrst, 'reload schema';
