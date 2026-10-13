import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (request) => {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) return new Response('잘못된 수신거부 링크입니다.', { status: 400 });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const adminClient = createClient(supabaseUrl, serviceKey);
  const { error } = await adminClient.from('profiles').update({
    marketing_consent: false,
    marketing_consent_at: null,
    marketing_consent_source: null,
    marketing_unsubscribed_at: new Date().toISOString()
  }).eq('marketing_unsubscribe_token', token);

  if (error) return new Response('수신거부 처리 중 오류가 발생했습니다.', { status: 500 });
  return new Response(`<!doctype html><html lang="ko"><meta charset="utf-8"><title>수신거부 완료</title>
    <body style="font-family:Arial,sans-serif;background:#09090b;color:#fff;text-align:center;padding:80px 20px">
      <h1 style="color:#ffd600">수신거부가 완료되었습니다.</h1>
      <p style="color:#a1a1aa">앞으로 REPOSITION의 광고성 이메일을 보내지 않습니다.</p>
    </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
});

