-- 부트캠프 팝업광고 노출·클릭·닫기·6시간 숨김 이벤트 수집 허용

drop policy if exists analytics_event_insert on public.analytics_events;
create policy analytics_event_insert
on public.analytics_events
for insert
to anon, authenticated
with check (
  event_name = any (array[
    'page_view'::text,
    'bootcamp_click'::text,
    'bootcamp_detail_view'::text,
    'inquiry_click'::text,
    'consulting_report_example'::text,
    'bootcamp_popup_view'::text,
    'bootcamp_popup_click'::text,
    'bootcamp_popup_close'::text,
    'bootcamp_popup_snooze'::text
  ])
);
