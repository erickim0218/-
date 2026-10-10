import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchSiteFeatures } from '../lib/siteFeatures';
import { trackAnalyticsEvent } from '../lib/analytics';
import { MemberTier } from '../types';

interface BootcampBottomBarProps {
  currentTab: string;
  currentTier: MemberTier;
  isAdmin?: boolean;
  onTabChange: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
}

export const BootcampBottomBar: React.FC<BootcampBottomBarProps> = ({
  currentTab,
  currentTier,
  isAdmin = false,
  onTabChange
}) => {
  const [confirmedCount, setConfirmedCount] = useState<number>(0);
  const [isBootcampEnabled, setIsBootcampEnabled] = useState<boolean>(true);

  // Check if bar should be hidden
  const excludedTabs = ['login', 'signup', 'auth', 'mylms', 'admin', 'pro-payment', 'consulting', 'terms', 'privacy', 'policy'];
  const shouldHide =
    excludedTabs.includes(currentTab) ||
    currentTier === 'BOOTCAMP' ||
    Boolean(isAdmin);

  useEffect(() => {
    if (currentTab !== 'home' && currentTab !== 'bootcamp') {
      return;
    }

    const fetchStats = async () => {
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
        // ignore
      }
    };

    const checkFeatures = async () => {
      const features = await fetchSiteFeatures();
      if (features && typeof features.bootcamp === 'boolean') {
        setIsBootcampEnabled(features.bootcamp);
      }
    };

    fetchStats();
    checkFeatures();
  }, [currentTab]);

  if (shouldHide) {
    return null;
  }

  const totalCapacity = 5;
  const remainingSpots = Math.max(0, totalCapacity - confirmedCount);
  const isTimeExpired = Date.now() >= new Date('2026-10-23T21:00:00+09:00').getTime();
  const isCountFull = confirmedCount >= totalCapacity;
  const isClosed = !isBootcampEnabled || isTimeExpired || isCountFull;
  const isBootcampOpen = !isClosed;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121216]/95 backdrop-blur-md border-t border-zinc-800 text-white py-2.5 px-3 sm:py-3 sm:px-4 shadow-2xl transition-all pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        
        {/* Mobile View (< 640px) */}
        <div className="flex sm:hidden flex-col w-full text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span
                className="text-zinc-300 font-medium"
                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
              >
                부트캠프 9기 실시간 모집인원:
              </span>
              <span
                className="text-white font-black"
                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
              >
                <strong className="text-[#FFD600]">{confirmedCount}</strong> / {totalCapacity}명
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-emerald-400 text-[11px] font-extrabold whitespace-nowrap shrink-0">
              잔여 {remainingSpots}자리
            </span>
            <button
              onClick={() => {
                trackAnalyticsEvent({
                  eventName: 'bootcamp_click',
                  buttonLocation: 'bottom_fixed_inquiry',
                  bootcampCohort: 9
                });
                onTabChange('bootcamp');
              }}
              className="px-3 py-1.5 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-xs rounded-xl transition shadow flex items-center justify-center min-h-[34px] whitespace-nowrap cursor-pointer"
            >
              <span>{isBootcampOpen ? '부트캠프 9기 신청하기' : '다음 기수 예약 문의'}</span>
            </button>
          </div>
        </div>

        {/* Desktop & Tablet View (>= 640px) */}
        <div className="hidden sm:flex items-center gap-3 overflow-hidden">
          <span className="px-2.5 py-1 bg-[#FFD600] text-[#09090B] font-black text-xs rounded-lg shrink-0">
            {isBootcampOpen ? 'BOOTCAMP 9기' : '9기 모집 마감'}
          </span>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold truncate">
            <span
              className="text-zinc-200"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
            >
              부트캠프 9기 실시간 모집인원:
            </span>
            <span
              className="text-[#FFD600]"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
            >
              {confirmedCount} / {totalCapacity}명
            </span>
            <span className="text-zinc-400">·</span>
            <span className="text-emerald-400 font-extrabold whitespace-nowrap shrink-0">
              잔여 {remainingSpots}자리
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={() => onTabChange('bootcamp')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>일정 보기</span>
          </button>
          
          <button
            onClick={() => {
              trackAnalyticsEvent({
                eventName: 'bootcamp_click',
                buttonLocation: 'bottom_fixed_inquiry',
                bootcampCohort: 9
              });
              onTabChange('bootcamp');
            }}
            className="px-4 py-2 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBootcampOpen ? '부트캠프 9기 신청하기' : '다음 기수 예약 문의'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
