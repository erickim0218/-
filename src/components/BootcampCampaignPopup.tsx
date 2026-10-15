import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock3, X } from 'lucide-react';
import { trackAnalyticsEvent } from '../lib/analytics';

interface BootcampCampaignPopupProps {
  currentTab: string;
  enabled: boolean;
  onTabChange: (tab: string) => void;
}

const HIDE_UNTIL_KEY = 'reposition_bootcamp_popup_hide_until';
const VARIANT_INDEX_KEY = 'reposition_bootcamp_popup_variant_index';
const SIX_HOURS = 6 * 60 * 60 * 1000;

const variants = [
  {
    id: 'bootcamp_popup_1',
    badge: '리포지셔닝 부트캠프 9기',
    title: <>단 3주,<br /><span className="text-[#B38F00]">최정예 취업·이직 리포지셔너</span>로 만들어드립니다.</>,
    body: <>스펙을 더 쌓기 전에,<br />기업이 원하는 방식으로 나를 다시 설계하세요.</>,
    cta: '9기 모집 확인하기'
  },
  {
    id: 'bootcamp_popup_2',
    badge: '혼자 준비하고 있다면',
    title: <>아직도<br /><span className="text-[#B38F00]">혼자 준비하세요?</span></>,
    body: <>방향을 모르면 오래 준비해도 제자리입니다.<br />3주 동안 이력서부터 면접까지 제대로 완성하세요.</>,
    cta: '9기 모집 확인하기'
  },
  {
    id: 'bootcamp_popup_3',
    badge: '반복되는 탈락을 끝낼 때',
    title: <>떨어질 때마다<br /><span className="text-[#B38F00]">자소서만 고치세요?</span></>,
    body: <>문장이 아니라 방향이 문제일 수 있습니다.<br />내 경험을 기업이 선택할 이유로 바꿔드립니다.</>,
    cta: '합격의 방향 바꾸기'
  },
  {
    id: 'bootcamp_popup_4',
    badge: '쓰레드 팔로워 1만 명',
    title: <>수많은 후기가 증명한<br /><span className="text-[#B38F00]">3주의 리포지셔닝</span></>,
    metric: '부트캠프 만족도 98.6%',
    body: <>혼자서는 보이지 않던 방향부터<br />이력서와 면접까지 제대로 완성합니다.</>,
    cta: '후기와 9기 모집 확인하기'
  }
] as const;

export const BootcampCampaignPopup: React.FC<BootcampCampaignPopupProps> = ({
  currentTab,
  enabled,
  onTabChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);
  const isEligiblePage = ['home', 'repositioning', 'classes', 'consulting', 'practical'].includes(currentTab);
  const variant = variants[variantIndex];

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
      <div className="relative w-full max-w-[540px] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.48)] ring-1 ring-white/70">
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
          <span className="inline-flex rounded-full border border-[#E5BD00]/35 bg-[#FFD600]/20 px-3 py-1.5 text-[11px] font-black text-[#7A6500]">
            {variant.badge}
          </span>
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
          <span className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFD600] px-5 py-4 text-sm font-black text-black transition hover:bg-yellow-300">
            {variant.cta}
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
