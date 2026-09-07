import React from 'react';
import { Rocket, CheckCircle2, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

export const RocketInfographic: React.FC = () => {
  return (
    <section className="p-6 sm:p-12 border-b border-zinc-200 bg-zinc-950 text-white overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* 타이틀 헤더 */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 bg-zinc-900 text-zinc-300 px-4 py-1.5 rounded-full text-xs font-semibold border border-zinc-800 shadow-inner">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
            <span>합격 역량 리포지셔닝</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            부트캠프 수강 전과 후의 합격 곡선
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            반복되는 서류 탈락 상태에서 올바른 관점을 세우고 목표 기업 합격 궤도로 올라서는 실질적 변화입니다.
          </p>
        </div>

        {/* 검은 배경의 궤도 그래프 대시보드 */}
        <div className="bg-black border border-zinc-800 rounded-3xl p-5 sm:p-10 relative overflow-hidden shadow-2xl space-y-6">
          
          {/* 대시보드 서브 헤더 */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 text-xs text-zinc-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white font-bold">합격 역량 및 지원 성과 변화</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg text-[11px] text-zinc-300">
              리포지셔닝 부트캠프 수강생 3단계 성장 프로세스
            </div>
          </div>

          {/* SVG 극명한 상승 곡선 (업로드 이미지 곡선 느낌 100% 반영) */}
          <div className="relative w-full pt-2 pb-4">
            <svg 
              className="w-full h-56 sm:h-72 overflow-visible" 
              viewBox="0 0 800 240" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 곡선 아래 은은한 흰색 그라데이션 광채 */}
              <path 
                d="M 40 200 C 220 210, 360 195, 460 165 C 560 120, 650 45, 750 15 L 750 240 L 40 240 Z" 
                fill="url(#whiteGlowGradient)" 
                opacity="0.1"
              />

              {/* 메인 비행 궤도 선 (단일 단색 흰색 두꺼운 곡선) */}
              <path 
                d="M 40 200 C 220 210, 360 195, 460 165 C 560 120, 650 45, 750 15" 
                stroke="#FFFFFF" 
                strokeWidth="5" 
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="whiteGlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* ===== 노드 1: 현재 너의 상황 (x=130, y=202) ===== */}
              <line x1="130" y1="202" x2="130" y2="240" stroke="#3F3F46" strokeWidth="2" strokeDasharray="4 4" />
              <g transform="translate(130, 160)">
                <rect x="-65" y="-13" width="130" height="24" rx="6" fill="#18181B" stroke="#3F3F46" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#A1A1AA" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                  01. 현재 너의 상황
                </text>
              </g>
              <g>
                <circle cx="130" cy="202" r="12" fill="#000000" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="130" cy="202" r="5" fill="#EF4444" />
              </g>

              {/* ===== 노드 2: 리포지셔닝 부트캠프 (x=380, y=192) ===== */}
              <line x1="380" y1="192" x2="380" y2="240" stroke="#A1A1AA" strokeWidth="2" strokeDasharray="4 4" />
              <g transform="translate(380, 145)">
                <rect x="-80" y="-13" width="160" height="24" rx="6" fill="#27272A" stroke="#A1A1AA" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="sans-serif">
                  02. 리포지셔닝 부트캠프
                </text>
              </g>
              <g>
                <circle cx="380" cy="192" r="13" fill="#000000" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="380" cy="192" r="5" fill="#FFFFFF" />
              </g>

              {/* ===== 노드 3: 부트캠프 수강 후 (x=680, y=38) ===== */}
              <line x1="680" y1="38" x2="680" y2="240" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
              <g transform="translate(680, 10)">
                <rect x="-70" y="-13" width="140" height="24" rx="6" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fill="#34D399" fontSize="11" fontWeight="800" fontFamily="sans-serif">
                  03. 부트캠프 수강 후
                </text>
              </g>
              <g>
                <circle cx="680" cy="38" r="13" fill="#000000" stroke="#FFFFFF" strokeWidth="2.5" />
                <circle cx="680" cy="38" r="5" fill="#10B981" />
              </g>

              {/* 최상단 로켓 뱃지 (x=750, y=15) */}
              <g transform="translate(750, 15)">
                <circle cx="0" cy="0" r="18" fill="#FFFFFF" />
                <path 
                  d="M-4 5 L-1 1 L3 1 L6 -3 L3 -6 L-1 -3 L-1 1 Z" 
                  fill="#000000" 
                  transform="scale(1.3) rotate(45)"
                />
              </g>
            </svg>
          </div>

          {/* 그래프 상단 노드들과 1:1 매핑되는 3단계 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left relative z-10">
            
            {/* [01] 현재 너의 상황 */}
            <div className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-3 relative hover:border-zinc-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/80 border border-red-800/80 text-red-400 text-[11px] font-bold rounded-md">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>수강 전 정체기</span>
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white leading-snug">
                  01. 현재 너의 상황
                </h4>
                <p className="text-xs text-red-400 font-semibold mt-0.5">
                  비전략적인 열정 소비
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>스펙 나열식 작성</strong>: 남들과 똑같은 템플릿형 자기소개서 제출</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>수동적 면접 대응</strong>: 면접관 질문을 통제하지 못하고 방어만 수행</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>무분별한 지원</strong>: 원인을 깨닫지 못한 채 양으로만 서류 제출</span>
                </div>
              </div>
            </div>

            {/* [02] 리포지셔닝 부트캠프 */}
            <div className="p-5 bg-zinc-900 border border-zinc-700 rounded-2xl space-y-3 relative shadow-lg hover:border-zinc-500 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800 border border-zinc-600 text-white text-[11px] font-bold rounded-md">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>전략적 관점 재정립</span>
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white leading-snug">
                  02. 리포지셔닝 부트캠프
                </h4>
                <p className="text-xs text-amber-300 font-semibold mt-0.5">
                  1:1 밀착 코칭 & 무기 구축
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>자기설득서 빌딩업</strong>: 인사담당자를 설득하는 차별화 서사 구상</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>면접통제 빌딩업</strong>: 질문 주도권을 내 메시지로 끌어오는 훈련</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>1:1 3회 개별 피드백</strong>: 개인 맞춤 방향성 수립 및 점검</span>
                </div>
              </div>
            </div>

            {/* [03] 부트캠프 수강 후 */}
            <div className="p-5 bg-zinc-900/90 border border-emerald-800/80 rounded-2xl space-y-3 relative hover:border-emerald-600 transition-all">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-[11px] font-bold rounded-md">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>합격 궤도 안착</span>
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white leading-snug">
                  03. 부트캠프 수강 후
                </h4>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  목표 기업 최종 합격
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>상향 목표 기업 지원</strong>: 자신감 있는 서사로 상위 기업 도전</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>주도적 면접 통제</strong>: 의도대로 면접을 이끌며 높은 합격률 달성</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>실질적 밀착 지속</strong>: 3회 자소서 정밀 첨삭 및 상시 피드백 케어</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ==================== 2. 리포지셔닝 부트캠프를 통해 당신이 경험할 5가지 변화 ==================== */}
        <div className="pt-6 space-y-6">
          
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              리포지셔닝 부트캠프를 통해 <span className="text-zinc-300 underline underline-offset-8">당신이 경험할 5가지 변화</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              취업 시장에서 나만의 명확한 경쟁력과 합격 전략을 갖추게 됩니다.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            
            {/* 변화 1 */}
            <div className="p-4 sm:p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-4 hover:border-zinc-700 transition-all">
              <span className="w-7 h-7 rounded-lg bg-white text-zinc-950 font-black text-sm flex items-center justify-center shrink-0">
                1
              </span>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  취업시장의 구조와 차별화되는 전략적 접근 방법에 대해 이해하게 됩니다.
                </h4>
                <p className="text-xs text-zinc-400">
                  - 취업시장 특강 및 기존 취업에 대한 사고의 REPOSITIONING 진행
                </p>
              </div>
            </div>

            {/* 변화 2 */}
            <div className="p-4 sm:p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-4 hover:border-zinc-700 transition-all">
              <span className="w-7 h-7 rounded-lg bg-white text-zinc-950 font-black text-sm flex items-center justify-center shrink-0">
                2
              </span>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  자기설득서 빌딩업 북을 통해 더욱 쉽고 빠르게 전략적인 자소서를 쓰게 됩니다.
                </h4>
                <p className="text-xs text-zinc-400">
                  - <strong className="text-white underline underline-offset-2">한정 제공되는 자료(빌딩업 북)</strong> 기반 자기소개서 "자기설득서" 쓰는 방법 터득
                </p>
              </div>
            </div>

            {/* 변화 3 */}
            <div className="p-4 sm:p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-4 hover:border-zinc-700 transition-all">
              <span className="w-7 h-7 rounded-lg bg-white text-zinc-950 font-black text-sm flex items-center justify-center shrink-0">
                3
              </span>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  총 3회의 1:1 컨설팅을 통해 현재 가장 알맞은 방향성을 수립하게 됩니다.
                </h4>
                <p className="text-xs text-zinc-400">
                  - 각 주차별 특강 후 1:1 피드백으로 방향성 수립 및 점검
                </p>
              </div>
            </div>

            {/* 변화 4 */}
            <div className="p-4 sm:p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-4 hover:border-zinc-700 transition-all">
              <span className="w-7 h-7 rounded-lg bg-white text-zinc-950 font-black text-sm flex items-center justify-center shrink-0">
                4
              </span>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  면접 빌딩업 북을 통해 통제 가능한 면접을 준비하실 수 있게 됩니다.
                </h4>
                <p className="text-xs text-zinc-400">
                  - <strong className="text-white underline underline-offset-2">한정 제공되는 자료(빌딩업 북)</strong> 통제 불가 구역에 대한 대응 연습
                </p>
              </div>
            </div>

            {/* 변화 5 */}
            <div className="p-4 sm:p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-start gap-4 hover:border-zinc-700 transition-all">
              <span className="w-7 h-7 rounded-lg bg-white text-zinc-950 font-black text-sm flex items-center justify-center shrink-0">
                5
              </span>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  프리미엄 상시 피드백을 통해 완벽하고 지속적인 밀착 케어를 경험하게 됩니다.
                </h4>
                <p className="text-xs text-zinc-400">
                  - 자소서 첨삭권 3회권 증정 및 프리미엄 문의 카톡방 초대, 상시 문의 가능
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};




