import React, { useState, useId } from 'react';
import { BRAND_INFO } from '../data/mockData';

interface FooterProps {
  onTabChange: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
  siteFeatures?: Record<string, boolean>;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange, siteFeatures }) => {
  const isClassDisabled = siteFeatures?.repositioning_class !== true;
  const isPracticalDisabled = siteFeatures?.practical_tools !== true;

  const [showClassTooltip, setShowClassTooltip] = useState(false);
  const [showPracticalTooltip, setShowPracticalTooltip] = useState(false);

  const classTooltipId = useId();
  const practicalTooltipId = useId();

  return (
    <footer className="bg-[#09090B] text-zinc-400 border-t border-[#1F1F24] pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#1F1F24]">
          
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[#FFD600] font-black italic text-2xl tracking-tighter select-none">
                J
              </span>
              <span className="font-black text-xl text-white tracking-tight">
                REPOSITION
              </span>
            </div>
            
            <p className="text-sm text-zinc-300 font-bold leading-relaxed">
              "스펙은 바꾸지 않습니다. 읽히는 방식을 바꿉니다."
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              브랜딩 취업 컨설턴트 J가 기업이 당신을 선택할 이유를 설계합니다.
            </p>
          </div>

          {/* Nav Links Column */}
          <div className="md:col-span-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              메뉴
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => onTabChange('home')} className="text-left text-zinc-400 hover:text-white transition">
                홈
              </button>
              <button onClick={() => onTabChange('repositioning')} className="text-left text-zinc-400 hover:text-white transition">
                리포지셔닝이란?
              </button>

              {/* 리포지셔닝 클래스 */}
              {isClassDisabled ? (
                <div
                  className="relative inline-block text-left cursor-not-allowed"
                  onMouseEnter={() => setShowClassTooltip(true)}
                  onMouseLeave={() => setShowClassTooltip(false)}
                  onFocus={() => setShowClassTooltip(true)}
                  onBlur={() => setShowClassTooltip(false)}
                  tabIndex={0}
                  aria-describedby={showClassTooltip ? classTooltipId : undefined}
                >
                  <span className="text-zinc-600 flex items-center gap-1.5 opacity-70 pointer-events-none">
                    <span>리포지셔닝 클래스</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#18181B] text-amber-200/80 border border-amber-500/20 rounded whitespace-nowrap">
                      오픈 준비 중
                    </span>
                  </span>

                  {showClassTooltip && (
                    <div
                      id={classTooltipId}
                      role="tooltip"
                      className="absolute bottom-full mb-2 left-0 z-[100] px-3 py-1.5 bg-zinc-900 text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700 shadow-2xl whitespace-nowrap pointer-events-none animate-fade-in"
                    >
                      리포지셔닝 클래스를 준비하고 있습니다. 곧 공개됩니다.
                      <div className="absolute top-full left-4 border-4 border-transparent border-t-zinc-900" />
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => onTabChange('classes')} className="text-left text-zinc-400 hover:text-white transition">
                  리포지셔닝 클래스
                </button>
              )}

              <button onClick={() => onTabChange('bootcamp')} className="text-left text-zinc-400 hover:text-white transition">
                리포지셔닝 부트캠프
              </button>

              {/* 리포지셔닝 실전활용 */}
              {isPracticalDisabled ? (
                <div
                  className="relative inline-block text-left cursor-not-allowed"
                  onMouseEnter={() => setShowPracticalTooltip(true)}
                  onMouseLeave={() => setShowPracticalTooltip(false)}
                  onFocus={() => setShowPracticalTooltip(true)}
                  onBlur={() => setShowPracticalTooltip(false)}
                  tabIndex={0}
                  aria-describedby={showPracticalTooltip ? practicalTooltipId : undefined}
                >
                  <span className="text-zinc-600 flex items-center gap-1.5 opacity-70 pointer-events-none">
                    <span>리포지셔닝 실전활용</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#18181B] text-amber-200/80 border border-amber-500/20 rounded whitespace-nowrap">
                      오픈 준비 중
                    </span>
                  </span>

                  {showPracticalTooltip && (
                    <div
                      id={practicalTooltipId}
                      role="tooltip"
                      className="absolute bottom-full mb-2 left-0 z-[100] px-3 py-1.5 bg-zinc-900 text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700 shadow-2xl whitespace-nowrap pointer-events-none animate-fade-in"
                    >
                      실전 워크북과 프레임워크를 준비하고 있습니다. 곧 공개됩니다.
                      <div className="absolute top-full left-4 border-4 border-transparent border-t-zinc-900" />
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => onTabChange('practical')} className="text-left text-zinc-400 hover:text-white transition flex items-center gap-1.5">
                  <span>리포지셔닝 실전활용</span>
                  <span className="text-[10px] text-[#FFD600] font-bold">[PRO]</span>
                </button>
              )}

              <button onClick={() => onTabChange('pro-payment')} className="text-left text-[#FFD600] hover:text-yellow-300 font-bold transition flex items-center gap-1.5">
                <span>PRO 멤버십 결제 (1/3/6개월)</span>
              </button>
              <button onClick={() => onTabChange('mylms')} className="text-left text-zinc-400 hover:text-white transition">
                내 강의실
              </button>
              <button onClick={() => onTabChange('admin')} className="text-left text-amber-300 hover:text-[#FFD600] font-bold transition flex items-center gap-1">
                <span>관리자 콘솔</span>
                <span className="text-[9px] bg-amber-400/20 text-[#FFD600] px-1 rounded">ADMIN</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
          <p>© REPOSITION. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">이용약관</span>
            <span className="hover:underline cursor-pointer">개인정보처리방침</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

