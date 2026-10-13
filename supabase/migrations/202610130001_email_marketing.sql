-- 자료 다운로드 이력, 선택적 마케팅 수신 동의, 관리자 이메일 발송 이력

create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists marketing_consent_at timestamptz,
  add column if not exists marketing_consent_source text,
  add column if not exists marketing_unsubscribed_at timestamptz,
  add column if not exists marketing_unsubscribe_token uuid not null default gen_random_uuid();

create unique index if not exists profiles_marketing_unsubscribe_token_idx
  on public.profiles (marketing_unsubscribe_token);

create table if not exists public.practical_resource_downloads (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.practical_resources(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  user_name text,
  downloaded_at timestamptz not null default now()
);

create index if not exists practical_resource_downloads_recent_idx
  on public.practical_resource_downloads (downloaded_at desc);
create index if not exists practical_resource_downloads_user_idx
  on public.practical_resource_downloads (user_id, downloaded_at desc);

alter table public.practical_resource_downloads enable row level security;
grant select on table public.practical_resource_downloads to authenticated;

drop policy if exists "download history own read" on public.practical_resource_downloads;
create policy "download history own read"
on public.practical_resource_downloads for select
to authenticated
using (user_id = auth.uid() or public.is_reposition_admin());

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
    where pr.id = resource_id
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

  select p.email, p.full_name
    into viewer_email, viewer_name
  from public.profiles p
  where p.id = viewer_id;

  if viewer_email is null then
    select u.email into viewer_email from auth.users u where u.id = viewer_id;
  end if;

  update public.practical_resources pr
  set download_count = pr.download_count + 1
  where pr.id = resource_id;

  insert into public.practical_resource_downloads (
    resource_id, user_id, user_email, user_name
  ) values (
    resource_id, viewer_id, coalesce(viewer_email, ''), viewer_name
  ) returning id into download_id;

  return download_id;
end;
$$;

revoke all on function public.increment_practical_resource_download(uuid) from public;
grant execute on function public.increment_practical_resource_download(uuid) to authenticated;

create or replace function public.get_my_marketing_consent()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select marketing_consent from public.profiles where id = auth.uid()
  ), false);
$$;

revoke all on function public.get_my_marketing_consent() from public;
grant execute on function public.get_my_marketing_consent() to authenticated;

create or replace function public.set_my_marketing_consent(
  consented boolean,
  consent_source text default 'resource_download'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception '로그인이 필요합니다.';
  end if;

  update public.profiles
  set marketing_consent = consented,
      marketing_consent_at = case when consented then now() else null end,
      marketing_consent_source = case when consented then left(coalesce(consent_source, 'resource_download'), 80) else null end,
      marketing_unsubscribed_at = case when consented then null else now() end
  where id = auth.uid();
end;
$$;

revoke all on function public.set_my_marketing_consent(boolean, text) from public;
grant execute on function public.set_my_marketing_consent(boolean, text) to authenticated;

create or replace function public.get_marketing_consented_member_count()
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_reposition_admin() then
    raise exception '관리자 권한이 필요합니다.';
  end if;

  return (select count(*)::integer from public.profiles where marketing_consent = true and email is not null);
end;
$$;

revoke all on function public.get_marketing_consented_member_count() from public;
grant execute on function public.get_marketing_consented_member_count() to authenticated;

create table if not exists public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null check (char_length(subject) between 1 and 180),
  content text not null check (char_length(content) between 1 and 20000),
  audience text not null default 'marketing_consented_members',
  recipient_count integer not null default 0,
  success_count integer not null default 0,
  failure_count integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'sending', 'sent', 'partial', 'failed')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  error_message text
);

create table if not exists public.email_campaign_recipients (
  id bigint generated by default as identity primary key,
  campaign_id uuid not null references public.email_campaigns(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'skipped')),
  provider_message_id text,
  error_message text,
  sent_at timestamptz
);

alter table public.email_campaigns enable row level security;
alter table public.email_campaign_recipients enable row level security;
grant select on table public.email_campaigns, public.email_campaign_recipients to authenticated;

drop policy if exists "email campaigns admin read" on public.email_campaigns;
create policy "email campaigns admin read"
on public.email_campaigns for select to authenticated
using (public.is_reposition_admin());

drop policy if exists "email recipients admin read" on public.email_campaign_recipients;
create policy "email recipients admin read"
on public.email_campaign_recipients for select to authenticated
using (public.is_reposition_admin());

