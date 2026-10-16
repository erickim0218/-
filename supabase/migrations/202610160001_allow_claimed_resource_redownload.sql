-- 신청 완료한 회원은 멤버십 상태가 바뀌어도 받은 자료를 다시 내려받을 수 있습니다.
-- 선착순 수량은 practical_resource_claims의 고유 회원 수로 유지됩니다.

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
        or exists (
          select 1
          from public.practical_resource_claims c
          where c.resource_id = pr.id
            and c.user_id = auth.uid()
        )
      )
  )
);

notify pgrst, 'reload schema';
