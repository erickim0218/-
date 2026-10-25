-- 실전활용 자료 정책 변경
-- 1) 자기설득서와 완벽통제면접만 무료 공개
-- 2) 나머지는 PRO·BOOTCAMP 전용
-- 3) 자료별 선착순 100명 제한 제거

update public.practical_resources
set
  access_level = case
    when coalesce(title, '') ilike '%자기설득서%'
      or coalesce(title, '') ilike '%완벽통제면접%'
      then 'free'
    else 'pro'
  end,
  updated_at = now();

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
begin
  if viewer_id is null then
    raise exception '로그인 후 자료를 다운로드할 수 있습니다.';
  end if;

  if not exists (
    select 1
    from public.practical_resources pr
    where pr.id = $1
      and pr.is_published = true
      and (
        pr.access_level = 'free'
        or public.is_reposition_admin()
        or exists (
          select 1
          from public.user_access ua
          where ua.user_id = viewer_id
            and lower(coalesce(ua.membership_tier, 'free')) in ('pro', 'bootcamp')
            and (ua.membership_expires_at is null or ua.membership_expires_at > now())
        )
      )
  ) then
    raise exception 'RESOURCE_ACCESS_DENIED';
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
    select u.email into viewer_email
    from auth.users u
    where u.id = viewer_id;
  end if;

  insert into public.practical_resource_downloads (
    resource_id, user_id, user_email, user_name
  ) values (
    $1, viewer_id, coalesce(viewer_email, ''), viewer_name
  ) returning id into download_id;

  return download_id;
end;
$$;

revoke all on function public.increment_practical_resource_download(uuid) from public;
grant execute on function public.increment_practical_resource_download(uuid) to authenticated;

notify pgrst, 'reload schema';
