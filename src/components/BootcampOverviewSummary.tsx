import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Trophy, Zap, Target, Star, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface BootcampOverviewSummaryProps {
  onScrollToDetail?: () => void;
  onSelectTier?: (tier: string) => void;
}

export const BootcampOverviewSummary: React.FC<BootcampOverviewSummaryProps> = ({
  onScrollToDetail,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: '01 / 부트캠프 개요',
      title: '기획자 J의 1:1 리포지셔닝 부트캠프 8기',
      subtitle: '단순 자소서 첨삭이 아닌, 당신의 커리어 가치를 3배 높이는 설득 프로세스',
      badge: '1~7기 전기수 전석 매진 기록',
      stats: [
        { label: '평균 서류 합격률', value: '70%▲', desc: '이전 대비 최대 7배 상승' },
        { label: '수강 만족도', value: '98.6%', desc: '전 기수 수강생 실전 입증' },
        { label: '최종 합격 수', value: '75%', desc: '지원 4개 중 3개 합격 사례' },
      ],
      highlights: [
        '3주 완성 VOD + 라이브 Q&A + 1:1 밀착 피드백',
        '직무 경험 나열에서 인사담당자 타격 "인식 싸움"으로 전환',
        '1회 차 수강 불만족 시 전액 환불 보장 제도 운영'
      ],
      color: 'from-amber-500/20 to-yellow-500/10'
    },
    {
      id: 2,
      tag: '02 / 문제점과 해결책',
      title: '왜 내 자소서는 매번 서류에서 탈락할까?',
      subtitle: '대부분의 취준생/경력직이 범하는 결정적 착각: 단순 경험 나열',
      badge: '핵심 솔루션: 자기설득서 비틀기',
      stats: [
        { label: '기존 자소서', value: '경험 나열', desc: '"나 이런 것도 해봤어요" 어필' },
        { label: 'J의 부트캠프', value: '자기설득서', desc: '5Why로 기업 니즈 정확히 타격' },
        { label: '변화 핵심', value: '인식 재정의', desc: '단점을 무기로 비틀기 스킬' },
      ],
      highlights: [
        'ChatGPT가 써준 영혼 없는 자소서 탈피',
        '신입부터 10년 차 경력직까지 적용되는 타겟팅 프레임워크',
        '화상통화로 실시간 초안 수정 과정을 직접 지켜보는 라이브 코칭'
      ],
      color: 'from-amber-500/20 to-yellow-500/10'
    },
    {
      id: 3,
      tag: '03 / 3주 커리큘럼 로드맵',
      title: '3주 커리큘럼 한눈에 보기',
      subtitle: '주차별 명확한 목표로 단단한 합격 무기를 장착합니다',
      badge: '3주 완성 체계적 프로세스',
      stats: [
        { label: '1주차', value: '직무 재정의', desc: '5Why & 기획자적 관점 재설정' },
        { label: '2주차', value: '자기설득서', desc: '주장-근거-어필 템플릿 완성' },
        { label: '3주차', value: '1:1 피드백', desc: '밀착 첨삭 & 면접 연결 전략' },
      ],
      highlights: [
        '주차별 실전 과제 제출 및 기획자 J의 1:1 맞춤 피드백',
        '지원 직무에 따른 멀티 페르소나 전략 수립',
        '포트폴리오 & 이력서 전면 수정을 통한 서류 합격률 극대화'
      ],
      color: 'from-amber-500/20 to-yellow-500/10'
    },
    {
      id: 4,
      tag: '04 / 실제 수강생 합격 사례',
      title: '검증된 수강생 리얼 서류/최합 후기',
      subtitle: '종합대행사 최종합격, 연봉 280만원 상승, 4개 지원 3개 합격!',
      badge: '수강생 생생 합격 후기',
      stats: [
        { label: '종합대행사 합격', value: '최종합격', desc: '가장 비싼 플랜 수강생의 입증' },
        { label: '연봉 상승', value: '+280만원', desc: '이직 성공 후 처우 협의' },
        { label: '서합률 반전', value: '0% → 합격', desc: '면접 경험 없던 수강생의 반전' },
      ],
      highlights: [
        '대치동 일타강사 수업과 비교되는 진정한 프리미엄 케어',
        '9년차 시니어 마케터도 감탄한 J님만의 비결',
        '잦은 이직/짧은 경력 단점을 강력한 장점으로 재포지셔닝'
      ],
      color: 'from-amber-500/20 to-yellow-500/10'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mb-12">
      {/* 장표 헤더 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD600] to-amber-500 text-black font-black flex items-center justify-center text-lg shadow-lg shadow-[#FFD600]/20">
            J
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30">
                OVERVIEW SUMMARY
              </span>
              <span className="text-xs text-zinc-400">부트캠프 핵심 요약 장표</span>
            </div>
            <h3 className="text-lg font-bold text-white">기획자 J 1:1 리포지셔닝 부트캠프 요약</h3>
          </div>
        </div>

        {/* 슬라이드 탭 컨트롤 */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                currentSlide === idx
                  ? 'bg-[#FFD600] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              장표 {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 대형 슬라이더 뷰어 */}
      <div className="relative rounded-2xl bg-[#121215] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className={`p-6 sm:p-10 bg-gradient-to-br ${slides[currentSlide].color} transition-all duration-300 min-h-[420px] flex flex-col justify-between`}>
          
          {/* 상단 뱃지 & 태그 */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-[#FFD600] tracking-widest uppercase">
                {slides[currentSlide].tag}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/40 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" />
                {slides[currentSlide].badge}
              </span>
            </div>

            {/* 타이틀 & 서브타이틀 */}
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mb-8 font-medium">
              {slides[currentSlide].subtitle}
            </p>

            {/* 3대 주요 수치 지표 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {slides[currentSlide].stats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/50 border border-zinc-800/80 backdrop-blur-sm">
                  <span className="text-xs text-zinc-400 block mb-1">{stat.label}</span>
                  <div className="text-2xl font-black text-[#FFD600] mb-0.5">{stat.value}</div>
                  <div className="text-xs text-zinc-300 font-medium">{stat.desc}</div>
                </div>
              ))}
            </div>

            {/* 핵심 체크 포인트 리스트 */}
            <div className="space-y-2.5">
              {slides[currentSlide].highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD600] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 슬라이더 컨트롤러 & 하단 바 */}
          <div className="pt-8 mt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors border border-zinc-700"
                aria-label="이전 장표"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-zinc-400">
                <strong className="text-white">{currentSlide + 1}</strong> / {slides.length}
              </span>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors border border-zinc-700"
                aria-label="다음 장표"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 상세페이지 이동 유도 */}
            {onScrollToDetail && (
              <button
                onClick={onScrollToDetail}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FFD600] hover:bg-yellow-400 text-black font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-[#FFD600]/20 flex items-center justify-center gap-2"
              >
                <span>상세 커리큘럼 & 수강생 구매후기 보러가기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4개 요약 장표 썸네일 카드 뷰 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {slides.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentSlide === idx
                ? 'bg-zinc-900 border-[#FFD600] shadow-md ring-1 ring-[#FFD600]/40'
                : 'bg-[#121215]/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <div className="text-[10px] font-bold text-[#FFD600] mb-1">장표 0{idx + 1}</div>
            <div className="text-xs font-bold text-white truncate">{slide.title}</div>
            <div className="text-[10px] text-zinc-400 truncate mt-0.5">{slide.badge}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
