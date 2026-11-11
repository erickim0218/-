-- 자료실 무료 공개 범위를 3종으로 고정합니다.
-- 무료: 자기설득서, 완벽통제면접, 취업 STP 전략
-- 그 외 모든 자료: 클래스(PRO)·부트캠프·관리자 전용

create or replace function public.is_complimentary_practical_resource(
  resource_title text,
  resource_file_name text,
  resource_file_path text
)
returns boolean
language sql
immutable
set search_path = public
as $$
  select
    regexp_replace(
      lower(coalesce(resource_title, '') || ' ' || coalesce(resource_file_name, '') || ' ' || coalesce(resource_file_path, '')),
      '[[:space:]_-]+',
      '',
      'g'
    ) like '%자기설득서%'
    or regexp_replace(
      lower(coalesce(resource_title, '') || ' ' || coalesce(resource_file_name, '') || ' ' || coalesce(resource_file_path, '')),
      '[[:space:]_-]+',
      '',
      'g'
    ) like '%완벽통제면접%'
    or regexp_replace(
      lower(coalesce(resource_title, '') || ' ' || coalesce(resource_file_name, '') || ' ' || coalesce(resource_file_path, '')),
      '[[:space:]_-]+',
      '',
      'g'
    ) like '%취업stp%'
    or regexp_replace(
      lower(coalesce(resource_title, '') || ' ' || coalesce(resource_file_name, '') || ' ' || coalesce(resource_file_path, '')),
      '[[:space:]_-]+',
      '',
      'g'
    ) like '%stp전략%';
$$;

update public.practical_resources
set
  access_level = case
    when public.is_complimentary_practical_resource(title, file_name, file_path) then 'free'
    else 'pro'
  end,
  external_url = case
    when public.is_complimentary_practical_resource(title, file_name, file_path) then external_url
    else null
  end,
  updated_at = now();

create or replace function public.enforce_practical_resource_access()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if public.is_complimentary_practical_resource(new.title, new.file_name, new.file_path) then
    new.access_level := 'free';
  else
    new.access_level := 'pro';
    new.external_url := null;
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_practical_resource_access_trigger on public.practical_resources;
create trigger enforce_practical_resource_access_trigger
before insert or update of title, file_name, file_path, access_level, external_url
on public.practical_resources
for each row
execute function public.enforce_practical_resource_access();

-- 이미 다운로드 이력이 있더라도 현재 클래스·부트캠프 권한이 없으면
-- 잠금 자료의 Storage 원본에 접근할 수 없습니다.
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

notify pgrst, 'reload schema';
