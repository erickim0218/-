-- 부트캠프 실제 성과 증빙 자료
-- 공개 동의 전 원본 이미지는 private bucket에서 관리자만 확인합니다.

create table if not exists public.bootcamp_result_evidence (
  case_key text primary key,
  category text not null,
  profile text not null default '',
  headline text not null,
  quote text not null default '',
  quote2 text,
  summary text not null default '',
  source text not null default '',
  evidence_type text not null default '',
  image_paths text[] not null default '{}',
  image_alt text not null default '',
  is_featured boolean not null default false,
  display_order integer not null default 0,
  publication_consent_confirmed boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bootcamp_result_publish_requires_consent
    check (not is_published or publication_consent_confirmed)
);

create index if not exists bootcamp_result_public_listing_idx
  on public.bootcamp_result_evidence
  (is_published, publication_consent_confirmed, is_featured desc, display_order, created_at);

alter table public.bootcamp_result_evidence enable row level security;

grant select on table public.bootcamp_result_evidence to anon, authenticated;
grant insert, update, delete on table public.bootcamp_result_evidence to authenticated;

drop policy if exists "bootcamp result public read" on public.bootcamp_result_evidence;
create policy "bootcamp result public read"
on public.bootcamp_result_evidence for select
to anon, authenticated
using (is_published = true and publication_consent_confirmed = true);

drop policy if exists "bootcamp result admin select" on public.bootcamp_result_evidence;
create policy "bootcamp result admin select"
on public.bootcamp_result_evidence for select
to authenticated
using (public.is_reposition_admin());

drop policy if exists "bootcamp result admin insert" on public.bootcamp_result_evidence;
create policy "bootcamp result admin insert"
on public.bootcamp_result_evidence for insert
to authenticated
with check (public.is_reposition_admin());

drop policy if exists "bootcamp result admin update" on public.bootcamp_result_evidence;
create policy "bootcamp result admin update"
on public.bootcamp_result_evidence for update
to authenticated
using (public.is_reposition_admin())
with check (public.is_reposition_admin());

drop policy if exists "bootcamp result admin delete" on public.bootcamp_result_evidence;
create policy "bootcamp result admin delete"
on public.bootcamp_result_evidence for delete
to authenticated
using (public.is_reposition_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bootcamp-result-evidence',
  'bootcamp-result-evidence',
  false,
  10485760,
  array['image/webp', 'image/png', 'image/jpeg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "bootcamp evidence controlled read" on storage.objects;
create policy "bootcamp evidence controlled read"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'bootcamp-result-evidence'
  and (
    public.is_reposition_admin()
    or exists (
      select 1
      from public.bootcamp_result_evidence bre
      where bre.is_published = true
        and bre.publication_consent_confirmed = true
        and name = any(bre.image_paths)
    )
  )
);

drop policy if exists "bootcamp evidence admin insert" on storage.objects;
create policy "bootcamp evidence admin insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'bootcamp-result-evidence' and public.is_reposition_admin());

drop policy if exists "bootcamp evidence admin update" on storage.objects;
create policy "bootcamp evidence admin update"
on storage.objects for update
to authenticated
using (bucket_id = 'bootcamp-result-evidence' and public.is_reposition_admin())
with check (bucket_id = 'bootcamp-result-evidence' and public.is_reposition_admin());

drop policy if exists "bootcamp evidence admin delete" on storage.objects;
create policy "bootcamp evidence admin delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'bootcamp-result-evidence' and public.is_reposition_admin());
