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

const chunk = <T>(items: T[], size: number) => {
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
};

interface MarketingRecipient {
  id: string;
  email: string;
  full_name: string | null;
  marketing_unsubscribe_token: string;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  let campaignId: string | null = null;
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;
    const emailFrom = Deno.env.get('EMAIL_FROM')!;
    const senderContact = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || '';
    const authorization = request.headers.get('Authorization') || '';
    if (!resendKey || !emailFrom) throw new Error('이메일 발송 환경변수가 설정되지 않았습니다.');

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } }
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) return new Response('Unauthorized', { status: 401, headers: corsHeaders });

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: access } = await adminClient
      .from('user_access').select('app_role').eq('user_id', user.id).single();
    if (access?.app_role !== 'admin') return new Response('Forbidden', { status: 403, headers: corsHeaders });

    const kstHour = Number(new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul', hour: '2-digit', hour12: false
    }).format(new Date()));
    if (kstHour < 8 || kstHour >= 21) {
      return new Response(JSON.stringify({ error: '광고성 이메일은 오전 8시부터 오후 9시 전에만 발송할 수 있습니다.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const payload = await request.json();
    const subject = String(payload.subject || '').trim();
    const content = String(payload.content || '').trim();
    if (!subject || !content) throw new Error('제목과 내용을 입력해 주세요.');
    if (subject.length > 180 || content.length > 20000) throw new Error('이메일 내용이 허용 길이를 초과했습니다.');

    const { data: recipients, error: recipientError } = await adminClient
      .from('profiles')
      .select('id,email,full_name,marketing_unsubscribe_token')
      .eq('marketing_consent', true)
      .not('email', 'is', null);
    if (recipientError) throw recipientError;
    const marketingRecipients = (recipients || []) as MarketingRecipient[];
    if (!marketingRecipients.length) throw new Error('마케팅 수신에 동의한 회원이 없습니다.');

    const adSubject = /^\s*[\[(]광고[\])]/.test(subject) ? subject : `(광고) ${subject}`;
    const { data: campaign, error: campaignError } = await adminClient.from('email_campaigns').insert({
      subject: adSubject,
      content,
      recipient_count: marketingRecipients.length,
      status: 'sending',
      created_by: user.id
    }).select('id').single();
    if (campaignError) throw campaignError;
    campaignId = campaign.id;

    await adminClient.from('email_campaign_recipients').insert(marketingRecipients.map((recipient) => ({
      campaign_id: campaignId,
      user_id: recipient.id,
      email: recipient.email,
      status: 'pending'
    })));

    let successCount = 0;
    let failureCount = 0;
    for (const group of chunk(marketingRecipients, 100)) {
      const emails = group.map((recipient) => {
        const unsubscribeUrl = `${supabaseUrl}/functions/v1/unsubscribe-marketing?token=${recipient.marketing_unsubscribe_token}`;
        const body = escapeHtml(content).replaceAll('\n', '<br>');
        return {
          from: emailFrom,
          to: [recipient.email],
          subject: adSubject,
          html: `<div style="font-family:Arial,sans-serif;line-height:1.75;color:#18181b;max-width:640px;margin:auto">
            <p>${escapeHtml(recipient.full_name || '회원')}님, 안녕하세요.</p>
            <div>${body}</div>
            <hr style="border:0;border-top:1px solid #e4e4e7;margin:32px 0 16px">
            <p style="font-size:12px;color:#71717a">보낸 사람: REPOSITION 기획자 J<br>
            연락처: ${escapeHtml(senderContact)}<br>
            더 이상 광고성 이메일을 원하지 않으시면 <a href="${unsubscribeUrl}">수신거부</a>를 눌러주세요.</p>
          </div>`
        };
      });

      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(emails)
      });

      if (response.ok) {
        successCount += group.length;
        await adminClient.from('email_campaign_recipients')
          .update({ status: 'sent', sent_at: new Date().toISOString() })
          .eq('campaign_id', campaignId)
          .in('email', group.map((recipient) => recipient.email));
      } else {
        const message = await response.text();
        failureCount += group.length;
        await adminClient.from('email_campaign_recipients')
          .update({ status: 'failed', error_message: message.slice(0, 1000) })
          .eq('campaign_id', campaignId)
          .in('email', group.map((recipient) => recipient.email));
      }
    }

    await adminClient.from('email_campaigns').update({
      success_count: successCount,
      failure_count: failureCount,
      status: failureCount === 0 ? 'sent' : successCount > 0 ? 'partial' : 'failed',
      sent_at: new Date().toISOString()
    }).eq('id', campaignId);

    return new Response(JSON.stringify({ ok: true, recipientCount: marketingRecipients.length, successCount, failureCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (campaignId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      await createClient(supabaseUrl, serviceKey).from('email_campaigns')
        .update({ status: 'failed', error_message: message.slice(0, 1000) }).eq('id', campaignId);
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

