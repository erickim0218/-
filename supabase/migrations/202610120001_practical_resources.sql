-- REPOSITION 실전활용 자료실
-- 파일 원본은 private Storage bucket에, 자료 정보와 공개 권한은 DB에 저장합니다.

create extension if not exists pgcrypto;

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

create table if not exists public.practical_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  category text not null default 'career'
    check (category in ('career', 'resume', 'cover_letter', 'portfolio', 'interview', 'job_change')),
  access_level text not null default 'free'
    check (access_level in ('free', 'pro')),
  file_path text unique,
  external_url text,
  file_name text,
  file_size bigint,
  mime_type text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  download_count integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint practical_resource_target_check check (file_path is not null or external_url is not null),
  constraint practical_resource_pro_file_check check (access_level = 'free' or external_url is null)
);

create index if not exists practical_resources_listing_idx
  on public.practical_resources (is_published, access_level, sort_order, created_at desc);

alter table public.practical_resources enable row level security;

grant select on table public.practical_resources to anon, authenticated;
grant insert, update, delete on table public.practical_resources to authenticated;

drop policy if exists "practical resources public read" on public.practical_resources;
create policy "practical resources public read"
on public.practical_resources for select
to anon, authenticated
using (
  is_published = true
);

drop policy if exists "practical resources admin select" on public.practical_resources;
create policy "practical resources admin select"
on public.practical_resources for select
to authenticated
using (public.is_reposition_admin());

drop policy if exists "practical resources admin insert" on public.practical_resources;
create policy "practical resources admin insert"
on public.practical_resources for insert
to authenticated
with check (public.is_reposition_admin());

drop policy if exists "practical resources admin update" on public.practical_resources;
create policy "practical resources admin update"
on public.practical_resources for update
to authenticated
using (public.is_reposition_admin())
with check (public.is_reposition_admin());

drop policy if exists "practical resources admin delete" on public.practical_resources;
create policy "practical resources admin delete"
on public.practical_resources for delete
to authenticated
using (public.is_reposition_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'practical-resources',
  'practical-resources',
  false,
  52428800,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'text/plain'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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
        or exists (
          select 1
          from public.user_access ua
          where ua.user_id = auth.uid()
            and lower(coalesce(ua.membership_tier, 'free')) in ('pro', 'bootcamp')
            and (ua.membership_expires_at is null or ua.membership_expires_at > now())
        )
      )
  )
);

drop policy if exists "practical storage admin insert" on storage.objects;
create policy "practical storage admin insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'practical-resources' and public.is_reposition_admin());

drop policy if exists "practical storage admin update" on storage.objects;
create policy "practical storage admin update"
on storage.objects for update
to authenticated
using (bucket_id = 'practical-resources' and public.is_reposition_admin())
with check (bucket_id = 'practical-resources' and public.is_reposition_admin());

drop policy if exists "practical storage admin delete" on storage.objects;
create policy "practical storage admin delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'practical-resources' and public.is_reposition_admin());

create or replace function public.increment_practical_resource_download(resource_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.practical_resources pr
  set download_count = pr.download_count + 1
  where pr.id = resource_id
    and pr.is_published = true
    and (
      pr.access_level = 'free'
      or public.is_reposition_admin()
      or exists (
        select 1
        from public.user_access ua
        where ua.user_id = auth.uid()
          and lower(coalesce(ua.membership_tier, 'free')) in ('pro', 'bootcamp')
          and (ua.membership_expires_at is null or ua.membership_expires_at > now())
      )
    );
end;
$$;

revoke all on function public.increment_practical_resource_download(uuid) from public;
grant execute on function public.increment_practical_resource_download(uuid) to anon, authenticated;

insert into public.site_features (feature_key, display_name, is_enabled, updated_at)
values ('practical_tools', '리포지셔닝 실전활용', true, now())
on conflict (feature_key) do update set
  display_name = excluded.display_name,
  is_enabled = true,
  updated_at = now();
