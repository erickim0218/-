import React from 'react';
import { Calendar as CalendarIcon, Flame, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const BootcampScheduleCalendar: React.FC = () => {
  return (
    <section id="bootcamp-schedule" className="p-6 sm:p-12 border-b border-zinc-200 bg-white text-zinc-900 scroll-mt-10">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* 상단 섹션 헤더 */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-xs font-bold shadow-sm">
            <CalendarIcon className="w-3.5 h-3.5 text-rose-600" />
            <span>2026년 9월·10월 리포지셔닝 부트캠프 8기 공식 일정</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950">
            부트캠프 <span className="text-rose-600">마감 일정 & 9월·10월 캘린더</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
            <strong className="text-rose-600">9월 18일(금) 오후 9시</strong> 선착순 10명 마감 후,<br className="hidden sm:inline" />
            <strong className="text-zinc-950 font-black"> 9월 19일(토) 1주차 첫 강의</strong>부터 3주간의 주차별 커리큘럼이 가동됩니다.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 1. 2026년 9월·10월 달력 */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border-2 border-zinc-900 bg-white overflow-hidden shadow-2xl">
          
          {/* 달력 상단 바 */}
          <div className="bg-white border-b border-zinc-200 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl font-black font-sans tracking-tight text-zinc-900 leading-none">
                9·10
              </span>
              <div>
                <span className="text-xs sm:text-sm font-black tracking-wider text-zinc-700 block uppercase font-mono">
                  SEPTEMBER · OCTOBER 2026
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  기획자J 리포지셔닝 부트캠프 8기 공식 일정표
                </span>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 text-xs font-bold">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                <Flame className="w-3.5 h-3.5 fill-current text-rose-600" />
                18일(금) 21:00 마감
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                19일(토) 1주차 개강
              </span>
            </div>
          </div>

          {/* Mobile period cards view */}
          <div className="sm:hidden p-4 bg-rose-50/95 border-b border-rose-200 space-y-2">
            <p className="text-xs font-black text-rose-800 flex items-center gap-1">
              <span>📌 주요 과제 및 피드백 기간 안내</span>
            </p>
            <div className="space-y-1.5 text-xs font-bold text-zinc-900">
              <div className="p-2.5 bg-white rounded-xl border border-rose-200 flex items-center justify-between shadow-xs">
                <span className="text-rose-600 font-black">9월 20일 ~ 9월 25일</span>
                <span className="text-zinc-900 font-bold">과제 수행 및 피드백</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-rose-200 flex items-center justify-between shadow-xs">
                <span className="text-rose-600 font-black">9월 27일 ~ 10월 2일</span>
                <span className="text-zinc-900 font-bold">과제 수행 및 피드백</span>
              </div>
            </div>
          </div>

          {/* 달력 요일 헤더 바 */}
          <div className="grid grid-cols-7 text-center font-black text-sm sm:text-base bg-black text-white py-3.5 border-b border-zinc-800 tracking-wide">
            <div className="text-white">일</div>
            <div className="text-white">월</div>
            <div className="text-white">화</div>
            <div className="text-white">수</div>
            <div className="text-white">목</div>
            <div className="text-white">금</div>
            <div className="text-white">토</div>
          </div>

          {/* 달력 날짜 그리드 */}
          <div className="grid grid-cols-7 border-collapse select-none relative">
            
            {/* Week 1: 8/30, 8/31, 9/1, 9/2, 9/3, 9/4, 9/5 */}
            <div className="p-2 sm:p-3 min-h-[70px] sm:min-h-[85px] border-r border-b border-zinc-200/80 bg-zinc-50/50 text-zinc-300 font-medium text-xs sm:text-sm">
              30
            </div>
            <div className="p-2 sm:p-3 min-h-[70px] sm:min-h-[85px] border-r border-b border-zinc-200/80 bg-zinc-50/50 text-zinc-300 font-medium text-xs sm:text-sm">
              31
            </div>
            <div className="p-2 sm:p-3 min-h-[70px] sm:min-h-[85px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              1
            </div>
            <div className="p-2 sm:p-3 min-h-[70px] sm:min-h-[85px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              2
            </div>
            <div className="p-2 sm:p-3 min-h-[70px] sm:min-h-[85px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              3
            </div>
            <div className="p-2 sm:p-3 min-h-[70px] sm:min-h-[85px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              4
            </div>
            <div className="p-2 sm:p-3 min-h-[70px] sm:min-h-[85px] border-b border-zinc-200/80 bg-[#FAD2D8]/30 text-zinc-800 font-medium text-xs sm:text-sm">
              5
            </div>

            {/* Week 2: 9/6 ~ 9/12 */}
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              6
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              7
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              8
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              9
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              10
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              11
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              12
            </div>

            {/* Week 3: 9/13 ~ 9/19 (18일 마감, 19일 개강) */}
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              13
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              14
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              15
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              16
            </div>
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 text-zinc-800 font-medium text-xs sm:text-sm">
              17
            </div>

            {/* 18일 금요일: 모집 마감 */}
            <div className="p-2 sm:p-2.5 min-h-[85px] sm:min-h-[115px] border-r border-b border-zinc-200/80 bg-amber-50/80 relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-black text-zinc-950">18</span>
                  <span className="text-[9px] sm:text-[10px] bg-rose-600 text-white font-black px-1.5 py-0.5 rounded">
                    마감
                  </span>
                </div>
                <div className="mt-1 space-y-0.5">
                  <p className="text-[10px] sm:text-xs font-black text-rose-600 leading-tight">
                    🔥 21:00 마감
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium leading-tight">
                    선착순 10명
                  </p>
                </div>
              </div>
            </div>

            {/* 19일 토요일: 1주차 강의 */}
            <div className="p-2 sm:p-3 min-h-[85px] sm:min-h-[115px] border-b border-zinc-200/80 bg-[#F7C6CC] relative flex flex-col justify-start">
              <span className="text-base sm:text-xl font-black text-zinc-950 leading-none block">
                19
              </span>
              <div className="mt-2 space-y-1">
                <p className="text-[11px] sm:text-xs font-black text-zinc-950 flex items-center gap-1 leading-snug">
                  <span className="text-rose-600">🎯</span>1주차 강의
                </p>
                <p className="text-[10px] sm:text-[11px] font-black text-zinc-900 leading-tight">
                  1차 1:1밀착 컨설팅
                </p>
              </div>
            </div>

            {/* Week 4 (20 ~ 25일) Unified Block */}
            <div className="col-span-6 grid grid-cols-6 bg-rose-50/70 border-2 border-rose-300/80 rounded-2xl p-2 sm:p-3 shadow-inner relative items-center">
              <div className="p-1 sm:p-2 border-r border-rose-200/60">
                <span className="text-base sm:text-xl font-black text-rose-600 block">20</span>
              </div>
              {[21, 22, 23, 24, 25].map((d, i) => (
                <div key={d} className={`p-1 sm:p-2 ${i < 4 ? 'border-r border-rose-200/60' : ''}`}>
                  <span className="text-base sm:text-xl font-black text-zinc-800 block">{d}</span>
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 px-4 py-1.5 rounded-full border border-rose-300 shadow-sm text-xs sm:text-sm font-black text-zinc-950 flex items-center gap-1.5">
                  <span className="text-rose-600">📌</span>
                  <span>과제 수행 및 피드백 (9/20~9/25)</span>
                </div>
              </div>
            </div>

            {/* 26일 토요일: 2주차 강의 */}
            <div className="p-2 sm:p-3 border-b border-zinc-200/80 bg-[#F7C6CC] relative flex flex-col justify-start">
              <span className="text-base sm:text-xl font-black text-zinc-950 leading-none block">
                26
              </span>
              <div className="mt-2 space-y-1">
                <p className="text-[11px] sm:text-xs font-black text-zinc-950 flex items-center gap-1 leading-snug">
                  <span className="text-rose-600">🎯</span>2주차 강의
                </p>
                <p className="text-[10px] sm:text-[11px] font-black text-zinc-900 leading-tight">
                  2차 1:1밀착 컨설팅
                </p>
              </div>
            </div>

            {/* Week 5 (27 ~ 10/2) Unified Block */}
            <div className="col-span-6 grid grid-cols-6 bg-rose-50/70 border-2 border-rose-300/80 rounded-2xl p-2 sm:p-3 shadow-inner relative items-center">
              <div className="p-1 sm:p-2 border-r border-rose-200/60">
                <span className="text-base sm:text-xl font-black text-rose-600 block">27</span>
              </div>
              {[28, 29, 30, '10/1', '10/2'].map((d, i) => (
                <div key={String(d)} className={`p-1 sm:p-2 ${i < 4 ? 'border-r border-rose-200/60' : ''}`}>
                  <span className="text-base sm:text-xl font-black text-zinc-800 block">{d}</span>
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 px-4 py-1.5 rounded-full border border-rose-300 shadow-sm text-xs sm:text-sm font-black text-zinc-950 flex items-center gap-1.5">
                  <span className="text-rose-600">📌</span>
                  <span>과제 수행 및 피드백 (9/27~10/2)</span>
                </div>
              </div>
            </div>

            {/* 3일 토요일: 3주차 강의(종료) */}
            <div className="p-2 sm:p-3 border-b border-zinc-200/80 bg-[#F7C6CC] relative flex flex-col justify-start">
              <span className="text-base sm:text-xl font-black text-zinc-950 leading-none block">
                3
              </span>
              <div className="mt-2 space-y-1">
                <p className="text-[11px] sm:text-xs font-black text-zinc-950 flex items-center gap-1 leading-snug">
                  <span className="text-rose-600">🎯</span>3주차(종료)
                </p>
                <p className="text-[10px] sm:text-[11px] font-black text-zinc-900 leading-tight">
                  3차 1:1밀착 컨설팅
                </p>
              </div>
            </div>

          </div>

          {/* 달력 하단 경고/안내 문구 */}
          <div className="bg-zinc-50 px-5 sm:px-8 py-3.5 border-t border-zinc-200 text-xs text-zinc-700 font-medium">
            <p className="font-bold text-zinc-900 flex items-center gap-1.5">
              <span className="text-rose-600 font-black">*</span>
              <span>10명 조기 모집 시 본 프로그램이 마감되며 이후 추가 모집은 진행되지 않습니다.</span>
            </p>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. 주차별 상세 본문 카드 */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-4">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 text-zinc-800 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>커리큘럼 세부 진행 계획</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              1~3주차 <span className="text-rose-600">상세 특강 & 컨설팅 프로세스</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500">
              특강 후 1:1 개별 컨설팅 및 Building Up Book 과제를 통해 실전 합격 무기를 완성합니다.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            
            {/* [1주차 카드] */}
            <div className="p-6 sm:p-8 bg-white border border-zinc-900 rounded-[28px] space-y-4 shadow-sm hover:shadow-md transition">
              <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg md:text-xl font-bold text-zinc-950">
                <span className="text-2xl leading-none">🎯</span>
                <span className="text-rose-600 font-black tracking-tight">1주차</span>
                <span className="font-bold">
                  취업 시장 특강 및 자소서 리포지셔닝 특강 4시간(오전 9시~오후 1시)
                </span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs sm:text-sm font-semibold text-zinc-900">
                <div className="flex justify-center sm:justify-start">
                  <div className="inline-block bg-[#FDE2E4] px-3.5 py-1.5 rounded-md leading-relaxed">
                    + 특강 이후 1:1 개별 컨설팅 진행(순서 공지 예정, 오후 2시 이후 진행)
                  </div>
                </div>
                <div className="flex justify-center sm:justify-start sm:pl-8">
                  <div className="inline-block bg-[#FDE2E4] px-3.5 py-1.5 rounded-md leading-relaxed">
                    + 자기설득서 Building Up Book 기반 1주차 과제 수행
                  </div>
                </div>
              </div>
            </div>

            {/* [2주차 카드] */}
            <div className="p-6 sm:p-8 bg-white border border-zinc-900 rounded-[28px] space-y-4 shadow-sm hover:shadow-md transition">
              <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg md:text-xl font-bold text-zinc-950">
                <span className="text-2xl leading-none">🎯</span>
                <span className="text-rose-600 font-black tracking-tight">2주차</span>
                <span className="font-bold">
                  우수 과제 리뷰 및 면접 리포지셔닝 특강 2시간(오전 9시~오전 11시)
                </span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs sm:text-sm font-semibold text-zinc-900">
                <div className="flex justify-center sm:justify-start sm:pl-8">
                  <div className="inline-block bg-[#FDE2E4] px-3.5 py-1.5 rounded-md leading-relaxed">
                    + 특강 이후 1:1 2차 개별 컨설팅 진행(1주차 동일 순서)
                  </div>
                </div>
                <div className="flex justify-center sm:justify-start sm:pl-12">
                  <div className="inline-block bg-[#FDE2E4] px-3.5 py-1.5 rounded-md leading-relaxed">
                    + 면접통제 Building Up Book 기반 2주차 과제 수행
                  </div>
                </div>
              </div>
            </div>

            {/* [3주차 카드] */}
            <div className="p-6 sm:p-8 bg-white border border-zinc-900 rounded-[28px] space-y-4 shadow-sm hover:shadow-md transition">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-base sm:text-lg md:text-xl font-bold text-zinc-950">
                <span className="text-2xl leading-none">🎯</span>
                <span className="text-rose-600 font-black tracking-tight">3주차</span>
                <span className="font-bold">
                  취업 STP전략 특강 1시간 (오전 9시~오전 10시)
                </span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs sm:text-sm font-semibold text-zinc-900">
                <div className="flex justify-center sm:justify-start sm:pl-14">
                  <div className="inline-block bg-[#FDE2E4] px-3.5 py-1.5 rounded-md leading-relaxed">
                    + 특강 이후 1:1 3차 개별 컨설팅 진행
                  </div>
                </div>
                <div className="flex justify-center sm:justify-start">
                  <div className="inline-block bg-[#FDE2E4] px-3.5 py-1.5 rounded-md leading-relaxed">
                    + 자소서 3회 첨삭권(1회당 최대 3문항) 및 프리미엄 상시 피드백 안내
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
