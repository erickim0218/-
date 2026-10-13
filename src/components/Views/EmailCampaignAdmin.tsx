import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail, RefreshCw, Send, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Campaign {
  id: string;
  subject: string;
  recipient_count: number;
  success_count: number;
  failure_count: number;
  status: 'draft' | 'sending' | 'sent' | 'partial' | 'failed';
  created_at: string;
  sent_at: string | null;
}

const statusLabel: Record<Campaign['status'], string> = {
  draft: '작성 중',
  sending: '발송 중',
  sent: '발송 완료',
  partial: '일부 실패',
  failed: '발송 실패'
};

export const EmailCampaignAdmin: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [consentedCount, setConsentedCount] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    const [countResult, campaignResult] = await Promise.all([
      supabase.rpc('get_marketing_consented_member_count'),
      supabase.from('email_campaigns').select('id,subject,recipient_count,success_count,failure_count,status,created_at,sent_at')
        .order('created_at', { ascending: false }).limit(20)
    ]);

    if (countResult.error || campaignResult.error) {
      setMessage({ type: 'error', text: '이메일 정보를 불러오지 못했습니다. 데이터베이스 설정을 확인해 주세요.' });
    } else {
      setConsentedCount(Number(countResult.data || 0));
      setCampaigns((campaignResult.data || []) as Campaign[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const sendCampaign = async () => {
    if (!subject.trim() || !content.trim()) {
      setMessage({ type: 'error', text: '제목과 이메일 내용을 모두 입력해 주세요.' });
      return;
    }
    if (consentedCount === 0) {
      setMessage({ type: 'error', text: '마케팅 수신에 동의한 회원이 없습니다.' });
      return;
    }

    const confirmed = window.confirm(
      `마케팅 수신에 동의한 ${consentedCount.toLocaleString()}명에게 이메일을 발송합니다.\n발송 후에는 취소할 수 없습니다. 계속할까요?`
    );
    if (!confirmed) return;

    setIsSending(true);
    setMessage(null);
    const { data, error } = await supabase.functions.invoke('send-marketing-email', {
      body: { subject: subject.trim(), content: content.trim() }
    });
    setIsSending(false);

    if (error || data?.error) {
      setMessage({ type: 'error', text: data?.error || error?.message || '이메일 발송에 실패했습니다.' });
      return;
    }

    setMessage({
      type: 'success',
      text: `${data.successCount.toLocaleString()}명에게 발송했습니다.${data.failureCount ? ` 실패 ${data.failureCount}건` : ''}`
    });
    setSubject('');
    setContent('');
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#FFD600]/30 bg-gradient-to-br from-[#181712] to-[#121216] p-6">
          <div className="flex items-center justify-between text-[#FFD600]">
            <span className="text-xs font-black">발송 가능 회원</span>
            <Users className="h-5 w-5" />
          </div>
          <p className="mt-4 text-3xl font-black text-white">{consentedCount.toLocaleString()}<span className="ml-1 text-sm text-zinc-500">명</span></p>
          <p className="mt-2 text-xs text-zinc-500">마케팅 정보 이메일 수신에 동의한 회원만 포함됩니다.</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-[#121216] p-6">
          <div className="flex items-center gap-2 text-zinc-300"><Mail className="h-5 w-5" /><span className="text-xs font-black">발송 원칙</span></div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            제목에는 <strong className="text-white">(광고)</strong>가 자동으로 붙고, 모든 이메일 하단에 수신거부 링크가 들어갑니다.
            발송은 오전 8시부터 오후 9시 전까지만 가능합니다.
          </p>
        </div>
      </div>

      {message ? (
        <div className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-bold ${
          message.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          {message.text}
        </div>
      ) : null}

      <section className="rounded-3xl border border-zinc-800 bg-[#121216] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-black tracking-[0.15em] text-[#FFD600]">NEW EMAIL</span>
            <h2 className="mt-2 text-xl font-black text-white">회원 이메일 작성</h2>
          </div>
          <button type="button" onClick={() => void loadData()} className="rounded-xl border border-zinc-700 p-2.5 text-zinc-400 hover:text-white">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-zinc-400">제목</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={180}
              placeholder="예: 이번 주 이직 준비에 바로 쓰는 실전자료"
              className="w-full rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3.5 text-sm text-white outline-none focus:border-[#FFD600]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-bold text-zinc-400">내용</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={20000}
              rows={11}
              placeholder={'회원에게 전달할 내용을 입력하세요.\n줄바꿈은 이메일에도 그대로 반영됩니다.'}
              className="w-full resize-y rounded-xl border border-zinc-700 bg-[#09090B] px-4 py-3.5 text-sm leading-relaxed text-white outline-none focus:border-[#FFD600]"
            />
          </label>
          <button
            type="button"
            onClick={() => void sendCampaign()}
            disabled={isSending || consentedCount === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-5 py-4 text-sm font-black text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isSending ? '발송 중...' : `${consentedCount.toLocaleString()}명에게 발송 확인`}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-[#121216]">
        <div className="border-b border-zinc-800 px-6 py-5"><h2 className="text-base font-black text-white">최근 발송 이력</h2></div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> 불러오는 중</div>
        ) : campaigns.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">아직 발송한 이메일이 없습니다.</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-white">{campaign.subject}</p>
                  <p className="mt-1 text-xs text-zinc-500">{new Date(campaign.created_at).toLocaleString('ko-KR')}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-zinc-400">대상 {campaign.recipient_count}명</span>
                  <span className="text-emerald-400">성공 {campaign.success_count}</span>
                  {campaign.failure_count ? <span className="text-rose-400">실패 {campaign.failure_count}</span> : null}
                  <span className="rounded-md bg-zinc-800 px-2 py-1 font-bold text-zinc-300">{statusLabel[campaign.status]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

