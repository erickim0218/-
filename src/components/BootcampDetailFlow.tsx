import React, { useEffect, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import bootcampCoverImg from '../assets/images/bootcamp-story/bootcamp-cover.webp';
import bootcampCoverMobileImg from '../assets/images/bootcamp-story/bootcamp-cover-mobile.jpeg';
import { BOOTCAMP_REVIEWS, BootcampReview } from '../data/bootcampReviews';
import { supabase } from '../lib/supabase';
import { fetchSiteFeatures } from '../lib/siteFeatures';
import { trackAnalyticsEvent, trackInquiryClickAndOpen } from '../lib/analytics';
import { BootcampReviewsShowcase } from './BootcampReviewsShowcase';
import { BootcampResultsShowcase } from './BootcampResultsShowcase';
import { BootcampCoreSections } from './BootcampCoreSections';
import { BootcampOfferSections } from './BootcampOfferSections';

interface BootcampDetailFlowProps {
  onTabChange?: (tab: string, subTab?: 'resources' | 'persuasion' | 'interview') => void;
  onApplicationSubmitted?: () => void;
  reviews?: BootcampReview[];
  onAddReview?: (review: BootcampReview) => void;
}

type PlanName = '코어' | '프로' | '퍼스트클래스';

export const BootcampDetailFlow: React.FC<BootcampDetailFlowProps> = ({ onApplicationSubmitted, reviews }) => {
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [isBootcampEnabled, setIsBootcampEnabled] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanName>('프로');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantTargetJob, setApplicantTargetJob] = useState('');
  const [applicantMotivation, setApplicantMotivation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const checkFeatures = async () => {
    const features = await fetchSiteFeatures();
    if (features && typeof features.bootcamp === 'boolean') setIsBootcampEnabled(features.bootcamp);
  };

  const fetchStats = async () => {
    try {
      const { count, error } = await supabase.from('user_access').select('user_id', { count: 'exact', head: true }).eq('membership_tier', 'bootcamp').eq('bootcamp_cohort', '9기');
      if (!error && typeof count === 'number') setConfirmedCount(count);
    } catch {
      // 조회 실패 시 임의의 모집 숫자를 만들지 않는다.
    }
  };

  useEffect(() => {
    void fetchStats();
    void checkFeatures();
    const refresh = window.setInterval(() => { void fetchStats(); void checkFeatures(); }, 10000);
    const onVisible = () => { if (document.visibilityState === 'visible') { void fetchStats(); void checkFeatures(); } };
    const onStatsUpdate = () => void fetchStats();
    const onFeatureUpdate = () => void checkFeatures();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('bootcamp_stats_updated', onStatsUpdate);
    window.addEventListener('site_features_updated', onFeatureUpdate);
    return () => {
      window.clearInterval(refresh);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('bootcamp_stats_updated', onStatsUpdate);
      window.removeEventListener('site_features_updated', onFeatureUpdate);
    };
  }, []);

  const totalCapacity = 5;
  const displayCount = Math.min(totalCapacity, Math.max(0, confirmedCount));
  const remainingSlots = Math.max(0, totalCapacity - displayCount);
  const isClosed = !isBootcampEnabled || displayCount >= totalCapacity;
  const reviewSource = reviews?.length ? reviews : BOOTCAMP_REVIEWS;

  const handleInquiryClick = (event: React.MouseEvent) => {
    event.preventDefault();
    trackInquiryClickAndOpen('bootcamp_detail_inquiry', 'https://open.kakao.com/o/sEgVEi0h');
  };
  const scrollToReviews = () => document.getElementById('actual-reviews')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToPricing = () => document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' });

  const handleOpenPlan = (plan: PlanName) => {
    if (isClosed) {
      trackInquiryClickAndOpen('bootcamp_detail_inquiry', 'https://open.kakao.com/o/sEgVEi0h');
      return;
    }
    setSelectedPlan(plan);
    setIsSubmitted(false);
    setIsApplyModalOpen(true);
    void trackAnalyticsEvent({ eventName: 'bootcamp_apply_start', buttonLocation: `pricing_${plan}`, bootcampCohort: 9 });
  };

  const handleSubmitApplication = (event: React.FormEvent) => {
    event.preventDefault();
    if (isClosed) return;
    setIsSubmitted(true);
    void trackAnalyticsEvent({ eventName: 'bootcamp_apply_complete', buttonLocation: `application_${selectedPlan}`, bootcampCohort: 9 });
    onApplicationSubmitted?.();
  };

  return (
    <div className="w-full overflow-x-clip bg-[#09090B] font-sans text-zinc-100 selection:bg-[#FFD600] selection:text-zinc-950">
      <section className="mx-auto max-w-7xl sm:px-4 sm:pt-5">
        <div className="overflow-hidden border-y border-zinc-800 bg-[#0D0E12] sm:rounded-[1.75rem] sm:border">
          <h1 className="sr-only">AI를 이기는 리포지셔닝 부트캠프</h1>
          <div className="relative w-full">
            <picture className="block w-full">
              <source media="(max-width: 639px)" srcSet={bootcampCoverMobileImg} />
              <img src={bootcampCoverImg} alt="AI를 이기는 리포지셔닝 부트캠프. 스펙은 바꾸지 않고 읽히는 방식을 바꾸는 기획자J의 3주 밀착 과정" className="block h-auto w-full" fetchPriority="high" />
            </picture>
            <button type="button" onClick={scrollToPricing} aria-label="부트캠프 프로그램과 수강료 보기" className="absolute bottom-[4.3%] left-[5.8%] h-[7.4%] w-[43.6%] rounded-xl sm:hidden" />
            <button type="button" onClick={scrollToPricing} aria-label="프로그램과 수강료 보기" className="absolute bottom-[4.3%] right-[5.2%] h-[7.4%] w-[43.1%] rounded-xl sm:hidden" />
          </div>
          <div className="border-t border-zinc-800 px-4 py-4 sm:px-7 sm:py-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
              <span className={`self-start rounded-full border px-3 py-1 text-xs font-black sm:mr-auto ${isClosed ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>{isClosed ? '현재 모집 마감' : `현재 모집 중 · 잔여 ${remainingSlots}자리`}</span>
              {isClosed ? (
                <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" onClick={handleInquiryClick} className="hidden min-h-12 items-center justify-center rounded-xl bg-[#FFD600] px-6 text-sm font-black text-zinc-950 sm:flex">다음 기수 상담하기</a>
              ) : (
                <button type="button" onClick={scrollToPricing} className="hidden min-h-12 rounded-xl bg-[#FFD600] px-6 text-sm font-black text-zinc-950 sm:block">부트캠프 신청하기</button>
              )}
              <button type="button" onClick={scrollToReviews} className="min-h-11 rounded-xl border border-zinc-700 px-5 text-sm font-black text-white sm:min-h-12">실제 수강생 후기 보기</button>
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-16 z-30 border-y border-zinc-800 bg-[#0B0B0E]/95 px-4 py-3 backdrop-blur" aria-label="부트캠프 상세 바로가기">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto text-sm font-bold text-zinc-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            ['실제 후기', '#actual-reviews'], ['왜 리포지셔닝인가', '#why-repositioning'], ['3주 과정', '#bootcamp-schedule'], ['1:1 컨설팅', '#one-to-one'], ['수강료', '#pricing-plans'], ['FAQ', '#faq']
          ].map(([label, href]) => <a key={href} href={href} className="shrink-0 rounded-full border border-zinc-700 px-4 py-2 transition hover:border-[#FFD600] hover:text-white">{label}</a>)}
        </div>
      </nav>

      <BootcampResultsShowcase reviews={reviewSource} />
      <BootcampReviewsShowcase reviews={reviewSource} />
      <BootcampCoreSections />
      <BootcampOfferSections isClosed={isClosed} remainingSlots={remainingSlots} onInquiry={handleInquiryClick} onOpenPlan={handleOpenPlan} />

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-800 bg-[#101014]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_35px_rgba(0,0,0,0.35)] backdrop-blur sm:hidden">
        <p className="mb-2 truncate text-xs font-bold text-zinc-400">{isClosed ? '현재 기수 모집 마감 · 다음 기수 상담 가능' : `리포지셔닝 부트캠프 모집 중 · 잔여 ${remainingSlots}자리`}</p>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          {isClosed ? (
            <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" onClick={handleInquiryClick} className="flex min-h-12 items-center justify-center rounded-xl bg-[#FFD600] px-4 text-sm font-black text-zinc-950">다음 기수 상담하기</a>
          ) : (
            <button type="button" onClick={scrollToPricing} className="min-h-12 rounded-xl bg-[#FFD600] px-4 text-sm font-black text-zinc-950">부트캠프 신청하기</button>
          )}
          <button type="button" onClick={scrollToReviews} className="flex min-h-12 items-center gap-2 rounded-xl bg-zinc-800 px-4 text-sm font-black text-white"><MessageSquare className="h-4 w-4" />후기</button>
        </div>
      </div>

      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && setIsApplyModalOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="apply-title" className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 text-zinc-950 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-black text-amber-700">{selectedPlan} 플랜</p><h2 id="apply-title" className="mt-1 text-2xl font-black">부트캠프 신청</h2></div>
              <button type="button" onClick={() => setIsApplyModalOpen(false)} aria-label="신청 창 닫기" className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100"><X className="h-5 w-5" /></button>
            </div>
            {isSubmitted ? (
              <div className="py-12 text-center"><p className="text-2xl font-black">신청이 접수되었습니다.</p><p className="mt-3 text-sm leading-6 text-zinc-600">확인 후 안내드리겠습니다.</p><button type="button" onClick={() => setIsApplyModalOpen(false)} className="mt-7 min-h-12 rounded-xl bg-zinc-950 px-7 text-sm font-black text-white">확인</button></div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="mt-7 space-y-4">
                <label className="block text-sm font-black">이름<input required value={applicantName} onChange={(event) => setApplicantName(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 px-4 font-medium outline-none focus:border-amber-500" /></label>
                <label className="block text-sm font-black">연락처<input required inputMode="tel" value={applicantPhone} onChange={(event) => setApplicantPhone(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 px-4 font-medium outline-none focus:border-amber-500" /></label>
                <label className="block text-sm font-black">목표 직무<input required value={applicantTargetJob} onChange={(event) => setApplicantTargetJob(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-zinc-300 px-4 font-medium outline-none focus:border-amber-500" /></label>
                <label className="block text-sm font-black">현재 가장 큰 고민<textarea required rows={4} value={applicantMotivation} onChange={(event) => setApplicantMotivation(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-300 p-4 font-medium outline-none focus:border-amber-500" /></label>
                <button type="submit" className="min-h-14 w-full rounded-xl bg-[#FFD600] text-base font-black text-zinc-950">{selectedPlan} 플랜 신청하기</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
