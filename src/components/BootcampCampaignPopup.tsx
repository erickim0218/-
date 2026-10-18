import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock3, X } from 'lucide-react';
import { trackAnalyticsEvent } from '../lib/analytics';
import { supabase } from '../lib/supabase';
import bootcampKnightKeyVisual from '../assets/images/bootcamp_knight_keyvisual.webp';

interface BootcampCampaignPopupProps {
  currentTab: string;
  enabled: boolean;
  onTabChange: (tab: string) => void;
}

const HIDE_UNTIL_KEY = 'reposition_bootcamp_popup_hide_until';
const VARIANT_INDEX_KEY = 'reposition_bootcamp_popup_variant_index';
const SIX_HOURS = 6 * 60 * 60 * 1000;
const BOOTCAMP_DEADLINE = new Date('2026-10-23T21:00:00+09:00').getTime();
const BOOTCAMP_CAPACITY = 5;

function getRemainingTime(now: number) {
  const difference = Math.max(0, BOOTCAMP_DEADLINE - now);
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
}

const variants = [
  {
    id: 'bootcamp_popup_1',
    badge: '리포지셔닝 부트캠프 9기',
    title: <>단 3주,<br /><span className="text-[#B38F00]">최정예 취업·이직 리포지셔너</span>로 만들어드립니다.</>,
    body: <>기업의 니즈를 찾고 내 경험을 다시 해석해,<br />이력서·자소서·면접을 하나의 합격 논리로 완성합니다.</>,
    cta: '9기 모집 확인하기'
  },
  {
    id: 'bootcamp_popup_2',
    badge: '리포지셔닝 부트캠프 9기',
    title: <>아직도<br /><span className="text-[#B38F00]">혼자 준비하세요?</span></>,
    body: <>기획자 J와 3주간 방향을 바로잡고,<br />과제와 밀착 피드백으로 실제 지원 결과물을 완성합니다.</>,
    cta: '9기 모집 확인하기'
  },
  {
    id: 'bootcamp_popup_3',
    badge: '리포지셔닝 부트캠프 9기',
    title: <>떨어질 때마다<br /><span className="text-[#B38F00]">자소서만 고치세요?</span></>,
    body: <>문장 몇 줄을 고치는 과정이 아닙니다.<br />기업이 나를 선택할 이유부터 다시 세웁니다.</>,
    cta: '합격의 방향 바꾸기'
  },
  {
    id: 'bootcamp_popup_4',
    badge: '리포지셔닝 부트캠프 9기',
    title: <>수많은 후기가 증명한<br /><span className="text-[#B38F00]">3주의 리포지셔닝</span></>,
    metric: '쓰레드 팔로워 1만 · 부트캠프 만족도 98.6%',
    body: <>혼자서는 보이지 않던 강점을 찾고,<br />서류와 면접에서 통하는 전략으로 바꿉니다.</>,
    cta: '부트캠프 후기 및 상세내용 확인하기'
  },
  {
    id: 'bootcamp_popup_5',
    badge: '리포지셔닝 부트캠프 9기',
    title: <>단 3주, 취업·이직 정예 리포지셔너로 만들어드립니다.</>,
    body: <>전략 없이 지원하지 않도록, 기업의 니즈를 읽고 경험을 설득력 있게 보여주는 방법을 완성합니다.</>,
    cta: '부트캠프 9기 자세히 보기',
    image: bootcampKnightKeyVisual,
    imageAlt: '갑옷을 입은 기사와 단 3주 취업·이직 정예 리포지셔너 메시지가 담긴 리포지셔닝 부트캠프 9기 광고'
  }
] as const;

export const BootcampCampaignPopup: React.FC<BootcampCampaignPopupProps> = ({
  currentTab,
  enabled,
  onTabChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const isEligiblePage = ['home', 'repositioning', 'classes', 'consulting', 'practical'].includes(currentTab);
  const variant = variants[variantIndex];
  const timeLeft = getRemainingTime(now);
  const displayCount = Math.min(BOOTCAMP_CAPACITY, Math.max(0, confirmedCount));
  const remainingSlots = Math.max(0, BOOTCAMP_CAPACITY - displayCount);
  const isExpired = now >= BOOTCAMP_DEADLINE;
  const isFull = displayCount >= BOOTCAMP_CAPACITY;
  const isClosed = isExpired || isFull;
  const countdownText = isExpired
    ? '모집 마감'
    : isFull
      ? '선착순 마감'
      : `D-${timeLeft.days} ${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!enabled || !isEligiblePage) return;

    const fetchConfirmedCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_access')
          .select('user_id', { count: 'exact', head: true })
          .eq('membership_tier', 'bootcamp')
          .eq('bootcamp_cohort', '9기');

        if (!error && count !== null && count !== undefined) {
          setConfirmedCount(count);
        }
      } catch {
        // Keep the last successfully loaded count.
      }
    };

    void fetchConfirmedCount();
    const statsTimer = window.setInterval(fetchConfirmedCount, 10_000);
    const refreshStats = () => void fetchConfirmedCount();
    window.addEventListener('focus', refreshStats);
    window.addEventListener('bootcamp_stats_updated', refreshStats);

    return () => {
      window.clearInterval(statsTimer);
      window.removeEventListener('focus', refreshStats);
      window.removeEventListener('bootcamp_stats_updated', refreshStats);
    };
  }, [currentTab, enabled, isEligiblePage]);

  useEffect(() => {
    setIsOpen(false);

    if (!enabled || !isEligiblePage) {
      return;
    }

    try {
      const hideUntil = Number(localStorage.getItem(HIDE_UNTIL_KEY) || 0);
      if (hideUntil > Date.now()) return;

      const lastIndex = Number(localStorage.getItem(VARIANT_INDEX_KEY) || -1);
      const nextIndex = Number.isFinite(lastIndex) ? (lastIndex + 1) % variants.length : 0;
      setVariantIndex(nextIndex);
      localStorage.setItem(VARIANT_INDEX_KEY, String(nextIndex));

      const timer = window.setTimeout(() => setIsOpen(true), 700);
      return () => window.clearTimeout(timer);
    } catch {
      const timer = window.setTimeout(() => setIsOpen(true), 700);
      return () => window.clearTimeout(timer);
    }
  }, [currentTab, enabled, isEligiblePage]);

  useEffect(() => {
    if (!isOpen) return;
    void trackAnalyticsEvent({
      eventName: 'bootcamp_popup_view',
      buttonLocation: variant.id,
      bootcampCohort: 9
    });

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, variant.id]);

  const closePopup = () => {
    setIsOpen(false);
    void trackAnalyticsEvent({
      eventName: 'bootcamp_popup_close',
      buttonLocation: variant.id,
      bootcampCohort: 9
    });
  };

  const hideForSixHours = () => {
    try {
      localStorage.setItem(HIDE_UNTIL_KEY, String(Date.now() + SIX_HOURS));
    } catch {}
    setIsOpen(false);
    void trackAnalyticsEvent({
      eventName: 'bootcamp_popup_snooze',
      buttonLocation: variant.id,
      bootcampCohort: 9
    });
  };

  const openBootcamp = () => {
    try {
      sessionStorage.setItem('reposition_bootcamp_popup_attribution', variant.id);
    } catch {}
    setIsOpen(false);
    void Promise.all([
      trackAnalyticsEvent({ eventName: 'bootcamp_popup_click', buttonLocation: variant.id, bootcampCohort: 9 }),
      trackAnalyticsEvent({ eventName: 'bootcamp_click', buttonLocation: variant.id, bootcampCohort: 9 })
    ]);
    onTabChange('bootcamp');
  };

  if (!isOpen || !enabled || !isEligiblePage) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/35 px-3 pb-3 pt-20 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="리포지셔닝 부트캠프 9기 안내">
      <div className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.48)] ring-1 ring-white/70">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#FFD600]/20 blur-3xl" />
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 z-20 rounded-full border border-black/10 bg-zinc-100 p-2 text-zinc-600 transition hover:border-black/25 hover:bg-zinc-200 hover:text-black"
          aria-label="팝업 닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <button type="button" onClick={openBootcamp} className="relative block w-full px-6 pb-5 pt-7 text-left sm:px-9 sm:pb-7 sm:pt-9">
          <div className="flex items-start justify-between gap-4 pr-11">
            <span className="inline-flex shrink-0 rounded-full border border-[#E5BD00]/35 bg-[#FFD600]/20 px-3 py-1.5 text-[11px] font-black text-[#7A6500]">
              {variant.badge}
            </span>
            <div className="hidden text-right sm:block">
              <p className="text-[9px] font-bold text-zinc-500">10월 23일 오후 9시 마감</p>
              <p className="mt-0.5 font-mono text-xs font-black text-black">{countdownText}</p>
              <p className="mt-0.5 text-[9px] font-bold text-zinc-500">
                현재 {displayCount}/{BOOTCAMP_CAPACITY}명 · 잔여 {remainingSlots}명
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-b border-black/10 pb-3 text-[10px] font-bold sm:hidden">
            <span className="font-mono font-black text-black">{countdownText}</span>
            <span className="text-zinc-500">현재 {displayCount}/{BOOTCAMP_CAPACITY}명 · 잔여 {remainingSlots}명</span>
          </div>
          {'image' in variant ? (
            <div className="mt-5 overflow-hidden rounded-xl bg-[#1B2733] shadow-xl ring-1 ring-black/10">
              <img
                src={variant.image}
                alt={variant.imageAlt}
                className="mx-auto block max-h-[58dvh] h-auto w-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          ) : (
            <>
              <h2 className="mt-5 pr-5 text-[28px] font-black leading-[1.2] tracking-[-0.04em] text-[#111114] sm:text-[38px]">
                {variant.title}
              </h2>
              {'metric' in variant ? (
                <p className="mt-5 inline-flex rounded-xl border border-black/10 bg-zinc-100 px-4 py-2.5 text-sm font-black text-[#111114]">
                  {variant.metric}
                </p>
              ) : null}
              <p className="mt-5 text-sm font-medium leading-6 text-zinc-600 sm:text-[15px] sm:leading-7">
                {variant.body}
              </p>
              <div className="mt-6 border-y border-black/10 py-4">
                <p className="text-[10px] font-black tracking-[0.12em] text-zinc-400">3주 후, 이렇게 달라집니다</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {['지원 방향 확정', '경험을 강점으로', '서류·면접 완성'].map((benefit) => (
                    <span key={benefit} className="flex min-h-12 items-center justify-center rounded-lg bg-zinc-100 px-2 text-center text-[11px] font-black leading-4 text-zinc-800 sm:text-xs">
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
          <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FFD600] px-5 py-4 text-sm font-black text-black transition hover:bg-yellow-300">
            {isClosed ? '9기 모집 마감' : variant.cta}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>

        <div className="relative flex items-center justify-center border-t border-black/10 bg-zinc-50 px-5 py-3.5 sm:px-7">
          <button type="button" onClick={hideForSixHours} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 transition hover:text-black">
            <Clock3 className="h-3.5 w-3.5" />
            6시간 동안 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
};
