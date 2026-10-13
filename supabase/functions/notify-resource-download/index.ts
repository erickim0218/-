import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;
    const emailFrom = Deno.env.get('EMAIL_FROM')!;
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL')!;
    const authorization = request.headers.get('Authorization') || '';

    if (!resendKey || !emailFrom || !adminEmail) throw new Error('이메일 발송 환경변수가 설정되지 않았습니다.');

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } }
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

    const { downloadId } = await request.json();
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: download, error } = await adminClient
      .from('practical_resource_downloads')
      .select('id,user_id,user_email,user_name,downloaded_at,practical_resources(title,file_name,access_level)')
      .eq('id', downloadId)
      .eq('user_id', user.id)
      .single();

    if (error || !download) return new Response('Download not found', { status: 404, headers: corsHeaders });

    const resource = Array.isArray(download.practical_resources)
      ? download.practical_resources[0]
      : download.practical_resources;
    const memberName = download.user_name || '이름 미입력 회원';
    const downloadedAt = new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul', dateStyle: 'long', timeStyle: 'medium'
    }).format(new Date(download.downloaded_at));

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `resource-download/${download.id}`
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [adminEmail],
        subject: `[REPOSITION] ${memberName}님이 자료를 다운로드했습니다`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.7;color:#18181b">
          <h2 style="margin:0 0 20px">실전자료 다운로드 알림</h2>
          <p><strong>회원:</strong> ${escapeHtml(memberName)} (${escapeHtml(download.user_email)})</p>
          <p><strong>자료:</strong> ${escapeHtml(resource?.title || '삭제된 자료')}</p>
          <p><strong>파일:</strong> ${escapeHtml(resource?.file_name || '외부 링크')}</p>
          <p><strong>구분:</strong> ${resource?.access_level === 'pro' ? 'PRO' : 'FREE'}</p>
          <p><strong>다운로드 시각:</strong> ${escapeHtml(downloadedAt)}</p>
        </div>`
      })
    });

    if (!response.ok) throw new Error(`Resend error: ${await response.text()}`);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

