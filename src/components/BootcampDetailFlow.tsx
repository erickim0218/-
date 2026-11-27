import React, { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import heroVisualImg from '../assets/images/bootcamp-story/hero-visual.webp';
import { BOOTCAMP_REVIEWS, BootcampReview } from '../data/bootcampReviews';
import { supabase } from '../lib/supabase';
import { fetchSiteFeatures } from '../lib/siteFeatures';
import { trackAnalyticsEvent, trackInquiryClickAndOpen } from '../lib/analytics';
import { BootcampReviewsShowcase } from './BootcampReviewsShowcase';
import { BootcampResultsShowcase } from './BootcampResultsShowcase';
import { PublishedResultEvidenceGallery } from './PublishedResultEvidenceGallery';
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
  const [showMobileBottomBar, setShowMobileBottomBar] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const node = heroSectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowMobileBottomBar(!entry.isIntersecting);
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
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
    <div className="w-full overflow-x-clip bg-[#09090B] pb-20 font-sans text-zinc-100 selection:bg-[#FFD600] selection:text-zinc-950 sm:pb-0">
      <section ref={heroSectionRef} className="mx-auto max-w-7xl sm:px-4 sm:pt-5">
        <div className="overflow-hidden border-y border-zinc-800 bg-[#07101d] sm:rounded-[1.75rem] sm:border">
          <div className="relative isolate min-h-[640px] overflow-hidden sm:min-h-[620px] lg:min-h-[650px]">
            <img
              src={heroVisualImg}
              alt="산 정상에서 리포지셔닝 깃발을 든 사람"
              className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center] sm:object-[70%_center] lg:object-right"
              fetchPriority="high"
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,9,17,0.28)_0%,rgba(4,9,17,0.42)_38%,rgba(4,9,17,0.94)_78%,#07101d_100%)] lg:bg-[linear-gradient(90deg,#07101d_0%,rgba(7,16,29,0.96)_36%,rgba(7,16,29,0.54)_63%,rgba(7,16,29,0.08)_100%)]" />
            <div className="flex min-h-[640px] items-end px-5 pb-9 pt-56 sm:min-h-[620px] sm:px-10 sm:pb-12 sm:pt-48 lg:min-h-[650px] lg:items-center lg:px-16 lg:py-16">
              <div className="w-full max-w-2xl text-center lg:text-left">
                <p className="text-xs font-black tracking-[0.18em] text-[#FFD600] sm:text-sm">RE:POSITIONING BOOTCAMP</p>
                <h1 className="mt-4 text-[2.15rem] font-black leading-[1.13] tracking-[-0.055em] text-white [word-break:keep-all] sm:text-5xl lg:text-6xl">
                  AI를 이기는<br />리포지셔닝 부트캠프
                </h1>
                <p className="mt-5 text-[15px] font-bold leading-7 text-zinc-200 [word-break:keep-all] sm:text-lg sm:leading-8">
                  모두가 AI로 그럴듯한 지원서를 쓰는 시대.<br />그럴듯함만으로는 더 이상 선택받기 어렵습니다.
                </p>
                <p className="mt-5 text-xl font-black leading-8 text-white [word-break:keep-all] sm:text-2xl">
                  스펙은 바꾸지 않습니다.<br /><span className="text-[#FFD600]">읽히는 방식을 바꿉니다.</span>
                </p>
                <ul className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold text-zinc-200 lg:mx-0 lg:justify-start sm:text-sm">
                  {['3주 라이브 특강', '주차별 1:1 컨설팅', '과제와 상시 피드백', '프로자료 전체 제공'].map((item) => (
                    <li key={item} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 shrink-0 text-[#FFD600]" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 px-4 py-4 sm:px-7 sm:py-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
              <span className={`self-start rounded-full border px-3 py-1 text-xs font-black sm:mr-auto ${isClosed ? 'border-rose-500/30 bg-rose-500/10 text-rose-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>{isClosed ? '현재 모집 마감' : `현재 모집 중 · 잔여 ${remainingSlots}자리`}</span>
              <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" onClick={handleInquiryClick} className="flex min-h-12 items-center justify-center rounded-xl bg-[#FFD600] px-6 text-sm font-black text-zinc-950">부트캠프 상담 신청하기</a>
              <button type="button" onClick={scrollToPricing} className="min-h-12 rounded-xl border border-zinc-700 px-5 text-sm font-black text-white">프로그램과 수강료 보기</button>
            </div>
          </div>
        </div>
      </section>

      <nav className="border-y border-zinc-800 bg-[#0B0B0E] px-4 py-3 sm:sticky sm:top-16 sm:z-30 sm:bg-[#0B0B0E]/95 sm:backdrop-blur" aria-label="부트캠프 상세 바로가기">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 text-xs font-bold text-zinc-300 sm:flex sm:overflow-x-auto sm:text-sm sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden">
          {[
            ['실제 후기', '#actual-reviews'], ['왜 리포지셔닝인가', '#why-repositioning'], ['3주 과정', '#bootcamp-schedule'], ['1:1 컨설팅', '#one-to-one'], ['수강료', '#pricing-plans'], ['FAQ', '#faq']
          ].map(([label, href]) => <a key={href} href={href} className="flex min-h-10 items-center justify-center rounded-xl border border-zinc-700 px-2 py-2 text-center leading-4 transition hover:border-[#FFD600] hover:text-white sm:shrink-0 sm:rounded-full sm:px-4">{label}</a>)}
        </div>
      </nav>

      <BootcampResultsShowcase reviews={reviewSource} />
      <section className="border-b border-zinc-800 bg-[#0B0B0E] px-4 py-14 text-center sm:py-20">
        <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white [word-break:keep-all] sm:text-5xl">대체 무엇을 바꿨길래,<br />이런 결과가 나오는 걸까요?</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400">경험을 새로 만드는 것이 아니라, 이미 가진 경험을 기업에 전달하는 방식을 다시 설계하는 것.</p>
        <p className="mt-6 text-2xl font-black leading-9 text-[#FFD600]">스펙은 바꾸지 않습니다.<br />읽히는 방식을 바꿉니다.</p>
      </section>
      <BootcampCoreSections reviewsSection={<><PublishedResultEvidenceGallery /><BootcampReviewsShowcase reviews={reviewSource} /></>} />
      <BootcampOfferSections isClosed={isClosed} remainingSlots={remainingSlots} onInquiry={handleInquiryClick} onOpenPlan={handleOpenPlan} />

      {showMobileBottomBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex min-h-[68px] items-center border-t border-zinc-800 bg-[#101014]/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_35px_rgba(0,0,0,0.35)] backdrop-blur sm:hidden">
          <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" onClick={handleInquiryClick} className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#FFD600] px-4 text-sm font-black text-zinc-950">부트캠프 상담 신청하기</a>
        </div>
      )}

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
