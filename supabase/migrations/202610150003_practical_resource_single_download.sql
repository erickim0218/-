-- 회원 1명당 같은 자료는 최초 1회만 다운로드할 수 있도록 제한합니다.

create table if not exists public.practical_resource_claims (
  resource_id uuid not null references public.practical_resources(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  claimed_at timestamptz not null default now(),
  primary key (resource_id, user_id)
);

alter table public.practical_resource_claims enable row level security;

insert into public.practical_resource_claims (resource_id, user_id, claimed_at)
select d.resource_id, d.user_id, min(d.downloaded_at)
from public.practical_resource_downloads d
group by d.resource_id, d.user_id
on conflict (resource_id, user_id) do nothing;

update public.practical_resources pr
set download_count = (
  select count(*)::integer
  from public.practical_resource_claims c
  where c.resource_id = pr.id
);

revoke all on table public.practical_resource_claims from anon, authenticated;
grant select on table public.practical_resource_claims to authenticated;

drop policy if exists "resource claims own read" on public.practical_resource_claims;
create policy "resource claims own read"
on public.practical_resource_claims
for select
to authenticated
using (user_id = auth.uid());

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
  claimed_resource_id uuid;
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
    raise exception '이 자료를 다운로드할 권한이 없습니다.';
  end if;

  if exists (
    select 1
    from public.practical_resource_claims c
    where c.resource_id = $1
      and c.user_id = viewer_id
  ) then
    raise exception 'RESOURCE_ALREADY_CLAIMED';
  end if;

  insert into public.practical_resource_claims (resource_id, user_id)
  values ($1, viewer_id)
  on conflict (resource_id, user_id) do nothing
  returning resource_id into claimed_resource_id;

  if claimed_resource_id is null then
    raise exception 'RESOURCE_ALREADY_CLAIMED';
  end if;

  update public.practical_resources pr
  set download_count = pr.download_count + 1
  where pr.id = $1
    and pr.download_count < 100;

  if not found then
    raise exception 'DOWNLOAD_LIMIT_REACHED';
  end if;

  select p.email, p.full_name
    into viewer_email, viewer_name
  from public.profiles p
  where p.id = viewer_id;

  if viewer_email is null then
    select u.email into viewer_email from auth.users u where u.id = viewer_id;
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
