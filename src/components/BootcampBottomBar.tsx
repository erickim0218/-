import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchSiteFeatures } from '../lib/siteFeatures';
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
  const [confirmedCount, setConfirmedCount] = useState<number>(7);
  const [isBootcampEnabled, setIsBootcampEnabled] = useState<boolean>(true);

  // Check if bar should be hidden
  const excludedTabs = ['login', 'signup', 'auth', 'mylms', 'admin', 'pro-payment'];
  const shouldHide =
    excludedTabs.includes(currentTab) ||
    currentTier === 'BOOTCAMP' ||
    Boolean(isAdmin);

  if (shouldHide) {
    return null;
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase.rpc('get_bootcamp_stats');
        if (!error && data !== null && data !== undefined) {
          let count: number | null = null;
          if (typeof data === 'number') {
            count = data;
          } else if (typeof data === 'string' && !isNaN(Number(data))) {
            count = Number(data);
          } else if (typeof data === 'object') {
            const item = Array.isArray(data) ? data[0] : data;
            if (item) {
              const val = item.confirmed_count ?? item.count ?? item.bootcamp_count ?? item.confirmed ?? item.total;
              if (val !== undefined && val !== null && !isNaN(Number(val))) {
                count = Number(val);
              }
            }
          }
          if (count !== null) {
            setConfirmedCount(count);
          }
        }
      } catch (err) {
        console.warn('RPC stats error:', err);
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
  }, []);

  const totalCapacity = 10;
  const remainingSpots = Math.max(0, totalCapacity - confirmedCount);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121216]/95 backdrop-blur-md border-t border-zinc-800 text-white py-3 px-4 shadow-2xl transition-all pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Information */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <span className="px-2.5 py-1 bg-[#FFD600] text-[#09090B] font-black text-xs rounded-lg shrink-0">
            {isBootcampEnabled ? 'BOOTCAMP 8기' : '8기 마감임박'}
          </span>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold truncate">
            <span className="text-zinc-200 hidden sm:inline">1:1 리포지셔닝 부트캠프</span>
            <span className="text-[#FFD600]">{confirmedCount}/{totalCapacity}명 확정</span>
            <span className="text-zinc-400 hidden md:inline">·</span>
            <span className="text-emerald-400 font-extrabold hidden md:inline">{remainingSpots}자리 남음</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onTabChange('bootcamp')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span>일정 보기</span>
          </button>
          
          <button
            onClick={() => onTabChange('bootcamp')}
            className="px-4 py-2 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBootcampEnabled ? '부트캠프 신청 문의' : '다음 기수 예약 문의'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
