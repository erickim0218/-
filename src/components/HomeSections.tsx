import React, { useState, useEffect, useId } from 'react';
import {
  Sparkles,
  ArrowRight,
  Quote,
  Check,
  ChevronRight,
  Zap,
  BookOpen,
  FileText
} from 'lucide-react';
import { BRAND_INFO, REPOSITIONING_EXAMPLES, CASE_STUDIES, REVIEWS } from '../data/mockData';
import { fetchSiteFeatures } from '../lib/siteFeatures';

interface HomeSectionsProps {
  onTabChange: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
  onSelectCourse?: (courseId: string) => void;
  siteFeatures?: Record<string, boolean>;
}

/* 1. Hero Section - Ultra Clean & Direct */
export const HeroSection: React.FC<HomeSectionsProps> = ({ onTabChange, siteFeatures }) => {
  const [isClassEnabled, setIsClassEnabled] = useState<boolean>(false);
  const [isBootcampEnabled, setIsBootcampEnabled] = useState<boolean>(true);
  const [showClassTooltip, setShowClassTooltip] = useState<boolean>(false);
  const classTooltipId = useId();

  useEffect(() => {
    if (siteFeatures) {
      setIsClassEnabled(siteFeatures.repositioning_class === true);
      setIsBootcampEnabled(siteFeatures.bootcamp !== false);
    } else {
      fetchSiteFeatures().then(f => {
        setIsClassEnabled(f.repositioning_class === true);
        setIsBootcampEnabled(f.bootcamp !== false);
      });
    }
  }, [siteFeatures]);

  return (
    <section className="relative bg-[#09090B] text-white pt-16 pb-20 md:py-24 border-b border-[#1A1A1E] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        {/* Pure Symbol J */}
        <div className="flex justify-center">
          <span className="font-black text-8xl sm:text-9xl italic text-[#FFD600] tracking-tighter leading-none select-none">
            J
          </span>
        </div>

        {/* Title & Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            REPOSITION
          </h1>

          <div className="space-y-2 pt-2">
            <p className="text-xl sm:text-3xl font-bold text-zinc-200 tracking-tight leading-snug">
              <span className="block sm:inline">스펙은 바꾸지 않습니다.</span>{' '}
              <span className="text-[#FFD600] font-black block sm:inline">읽히는 방식을 바꿉니다.</span>
            </p>
          </div>
          
          <p className="text-xs sm:text-base text-zinc-400 font-medium max-w-2xl mx-auto pt-2 leading-relaxed">
            <span className="block sm:inline">대기업 광고대행사 출신 브랜딩 취업 컨설턴트 J가</span>{' '}
            <span className="block sm:inline">지원자의 경험을 기업이 선택할 가치로 정리합니다.</span>
          </p>
        </div>

        {/* Primary Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {!isClassEnabled ? (
            <div
              className="relative w-full sm:w-auto cursor-not-allowed"
              onMouseEnter={() => setShowClassTooltip(true)}
              onMouseLeave={() => setShowClassTooltip(false)}
              onFocus={() => setShowClassTooltip(true)}
              onBlur={() => setShowClassTooltip(false)}
              tabIndex={0}
              aria-describedby={showClassTooltip ? classTooltipId : undefined}
            >
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-800/90 text-zinc-400 border border-zinc-700/80 font-black text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 shrink-0" />
                <span className="hidden sm:inline">리포지셔닝 클래스 수강하기</span>
                <span className="sm:hidden">리포지셔닝 클래스</span>
                <span className="px-2 py-0.5 text-[11px] sm:text-xs font-bold bg-[#18181B] text-amber-200/90 border border-amber-500/30 rounded shrink-0">
                  준비 중
                </span>
              </button>

              {showClassTooltip && (
                <div
                  id={classTooltipId}
                  role="tooltip"
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-zinc-900/95 text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700/80 shadow-2xl whitespace-nowrap pointer-events-none animate-fade-in backdrop-blur-md"
                >
                  리포지셔닝 클래스를 준비하고 있습니다. 곧 공개됩니다.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onTabChange('classes')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-sm sm:text-base rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline">리포지셔닝 클래스 수강하기</span>
              <span className="sm:hidden">리포지셔닝 클래스</span>
            </button>
          )}

          <button
            onClick={() => onTabChange('bootcamp')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-sm sm:text-base rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#09090B] shrink-0" />
            <span>{isBootcampEnabled ? '부트캠프 8기 신청하기' : '모집 마감 (다음 기수 예약)'}</span>
            <ArrowRight className="w-4 h-4 text-[#09090B] shrink-0" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6">
          {BRAND_INFO.plannerJ.summaryStats.map((st, idx) => (
            <div key={idx} className="p-4 bg-[#121215] border border-[#222228] rounded-xl text-center space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-[#FFD600] block tracking-tight">{st.value}</span>
              <span className="text-xs font-bold text-zinc-400 block">{st.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

/* 2. Featured Programs Section */
export const FeaturedCoursesSection: React.FC<{
  onTabChange: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
}> = ({ onTabChange }) => {
  const [isBootcampEnabled, setIsBootcampEnabled] = useState<boolean>(true);
  const [isClassEnabled, setIsClassEnabled] = useState<boolean>(false);
  const [isPracticalEnabled, setIsPracticalEnabled] = useState<boolean>(false);

  useEffect(() => {
    const loadState = async () => {
      const features = await fetchSiteFeatures();
      setIsBootcampEnabled(features.bootcamp !== false);
      setIsClassEnabled(features.repositioning_class === true);
      setIsPracticalEnabled(features.practical_tools === true);
    };
    loadState();

    const handleFeaturesUpdate = () => {
      loadState();
    };
    window.addEventListener('site_features_updated', handleFeaturesUpdate);
    return () => {
      window.removeEventListener('site_features_updated', handleFeaturesUpdate);
    };
  }, []);

  return (
    <section className="py-20 bg-[#0C0C0F] text-white border-b border-[#1A1A1E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            단계별 커리큘럼 & 워크북
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            1:1 밀착 코칭 부트캠프, VOD 클래스, 그리고 실전활용 워크북입니다.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Live Bootcamp */}
          <div className="bg-[#121216] border border-[#FFD600]/40 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className={`absolute top-0 right-0 font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-widest ${
              isBootcampEnabled ? 'bg-[#FFD600] text-[#09090B]' : 'bg-rose-600 text-white'
            }`}>
              {isBootcampEnabled ? '모집중 (선착순 10명)' : '모집 마감'}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#FFD600]/10 text-[#FFD600]">
                  <Zap className="w-5 h-5" />
                </span>
                <span className="text-xs font-bold text-[#FFD600] tracking-wider uppercase">BOOTCAMP 8기</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">리포지셔닝 부트캠프</h3>
                <p className="text-xs text-[#FFD600] font-bold pt-1">
                  🔥 1기~7기 연속 전회 완판 릴레이!
                </p>
                <p className="text-xs text-zinc-400 pt-2 leading-relaxed">
                  3주 특강 + 1:1 라이브 피드백 3회 + 실전 빌딩업 과제로 나만의 포지셔닝 완비
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#1F1F24]">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>1주차: 취업시장 & 자소서 리포지셔닝 특강</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>2주차: 우수 과제 리뷰 & 면접통제 특강</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>3주차: 이직 STP 전략 특강 & 1:1 3회 컨설팅</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTabChange('bootcamp')}
              className="w-full py-3.5 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-sm rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg"
            >
              부트캠프 커리큘럼 상세보기
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: VOD */}
          <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-zinc-800 text-zinc-300">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">VOD</span>
                </div>
                {!isClassEnabled && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#18181B] text-amber-200/90 border border-amber-500/30 rounded">
                    오픈 준비 중
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white">자소서 & 면접 설득 클래스</h3>
                <p className="text-xs text-zinc-400 pt-2 leading-relaxed">
                  자소서 작성 법부터 면접 5단계 완전 소장 강의
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#1F1F24]">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>총 28강 VOD 무제한 반복 수강</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>자기설득서 5단계 PDF 워크북</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>직무별 합격 자소서 분석 자료</span>
                </div>
              </div>
            </div>

            {!isClassEnabled ? (
              <div
                className="relative w-full cursor-not-allowed group"
                tabIndex={0}
                aria-label="리포지셔닝 클래스를 준비하고 있습니다. 곧 공개됩니다."
              >
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 font-extrabold text-sm rounded-xl border transition flex items-center justify-center gap-2 bg-zinc-800/80 text-zinc-400 border-zinc-700/80 cursor-not-allowed opacity-80"
                >
                  <span>VOD 클래스 목록보기</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#18181B] text-amber-200/90 border border-amber-500/30 rounded">
                    오픈 준비 중
                  </span>
                </button>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[100] px-3 py-1.5 bg-zinc-900 text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700 shadow-2xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                  리포지셔닝 클래스를 준비하고 있습니다. 곧 공개됩니다.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => onTabChange('classes')}
                className="w-full py-3.5 font-extrabold text-sm rounded-xl border transition flex items-center justify-center gap-1.5 bg-[#1C1C22] hover:bg-[#25252D] text-white border-[#27272A]"
              >
                <span>VOD 클래스 목록보기</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Card 3: Practical Workbook */}
          <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-[#FFD600]/10 text-[#FFD600]">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span className="text-xs font-bold text-[#FFD600] tracking-wider uppercase">PAID EXCLUSIVE</span>
                </div>
                {!isPracticalEnabled && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#18181B] text-amber-200/90 border border-amber-500/30 rounded">
                    오픈 준비 중
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-white">리포지셔닝 실전활용</h3>
                <p className="text-xs text-zinc-400 pt-2 leading-relaxed">
                  REALNEEDS 이력서, 자기설득서, 완벽통제면접 빌딩업
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#1F1F24]">
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>REALNEEDS 3단계 이력서</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>자기설득서 4단계 빌딩업</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="w-4 h-4 text-[#FFD600]" />
                  <span>완벽통제면접 1분 스크립트</span>
                </div>
              </div>
            </div>

            {!isPracticalEnabled ? (
              <div
                className="relative w-full cursor-not-allowed group"
                tabIndex={0}
                aria-label="실전 워크북과 프레임워크를 준비하고 있습니다. 곧 공개됩니다."
              >
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 font-extrabold text-sm rounded-xl border transition flex items-center justify-center gap-2 bg-zinc-800/80 text-zinc-400 border-zinc-700/80 cursor-not-allowed opacity-80"
                >
                  <span>실전활용 워크북 보기</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#18181B] text-amber-200/90 border border-amber-500/30 rounded">
                    오픈 준비 중
                  </span>
                </button>
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[100] px-3 py-1.5 bg-zinc-900 text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700 shadow-2xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                  실전 워크북과 프레임워크를 준비하고 있습니다. 곧 공개됩니다.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => onTabChange('practical')}
                className="w-full py-3.5 font-extrabold text-sm rounded-xl border transition flex items-center justify-center gap-1.5 bg-[#1C1C22] hover:bg-[#25252D] text-white border-[#27272A]"
              >
                <span>실전활용 워크북 보기</span>
                <ChevronRight className="w-4 h-4 text-[#FFD600]" />
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

/* 3. Core Philosophy */
export const ProblemSection: React.FC<{ onTabChange: (tab: string) => void }> = ({ onTabChange }) => {
  return (
    <section className="py-20 bg-[#09090B] text-white text-center border-b border-[#1A1A1E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Quote className="w-10 h-10 text-[#FFD600] mx-auto opacity-80" />

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            사람들이 기억하는 건 스펙 나열이 아닙니다 <br />
            <span className="text-[#FFD600] text-3xl sm:text-5xl font-black block mt-2">
              전략입니다
            </span>
          </h2>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto pt-2">
            단 한 문장으로 당신의 본질을 정리하고 전달해야 합니다.
          </p>
        </div>

        {/* Minimal 2-column contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto pt-4">
          <div className="p-5 bg-[#121215] border border-[#27272A] rounded-2xl space-y-2">
            <span className="text-xs font-bold text-zinc-400 block">[기존] 단순 팩트 나열</span>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              "카페에서 1년간 결제 및 수량 관리를 하며 책임감을 배웠습니다."
            </p>
          </div>

          <div className="p-5 bg-[#141418] border border-[#27272A] rounded-2xl space-y-2">
            <span className="text-xs font-bold text-[#FFD600] block">[리포지셔닝] 직무 가치 전달</span>
            <p className="text-xs sm:text-sm text-white font-bold leading-relaxed">
              "주문 병목을 해결해 피크타임 대기시간을 30% 단축한 프로세스 개선자"
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onTabChange('repositioning')}
            className="px-8 py-3.5 bg-[#FFD600] text-[#09090B] font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffe033] transition"
          >
            리포지셔닝 원리 자세히 보기
          </button>
        </div>

      </div>
    </section>
  );
};

/* 4. Definition Section */
export const RepositioningDefinition: React.FC = () => {
  return (
    <section className="py-20 bg-[#0C0C0F] text-white border-b border-[#1A1A1E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          REPOSITIONING 이란?
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
          마케팅 분야의 '포지셔닝' 개념을 개인의 취업과 커리어에 이식한 개념입니다. 기업 인사담당자의 인식 속에서 타 지원자와 확연히 구분되는 단 하나의 강점을 앵커링하는 전략입니다.
        </p>
      </div>
    </section>
  );
};

/* 5. Methodology */
export const MethodologySection: React.FC = () => {
  return (
    <section className="py-20 bg-[#09090B] text-white border-b border-[#1A1A1E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            REPOSITION 3단계 방법론
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
            <span className="text-2xl font-black text-[#FFD600]">01</span>
            <h3 className="text-lg font-bold text-white">경험 해체 & 발굴</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              사소한 경험이라도 조직 내에서 해낸 의사결정과 문제 해결 순간을 분해합니다.
            </p>
          </div>

          <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
            <span className="text-2xl font-black text-[#FFD600]">02</span>
            <h3 className="text-lg font-bold text-white">기업 니즈 타격</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              채용 공고 뒤에 숨겨진 인사담당자의 진짜 결핍(Real Needs)에 맞추어 키워드를 재정의합니다.
            </p>
          </div>

          <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
            <span className="text-2xl font-black text-[#FFD600]">03</span>
            <h3 className="text-lg font-bold text-white">앵커링 완성</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              자소서 서두와 면접 1분 자기소개에서 강력한 가치 기준을 제시해 면접 주도권을 잡습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* 6. Comparison Table */
export const ComparisonSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#0C0C0F] text-white border-b border-[#1A1A1E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl sm:text-4xl font-black text-center text-white">
          일반 자소서 첨삭 vs REPOSITION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
            <span className="text-xs font-bold text-zinc-400 block uppercase">일반 자소서 첨삭</span>
            <ul className="space-y-2 text-zinc-400">
              <li>• 문장 교정, 오탈자 수정 수준</li>
              <li>• 기존에 적어온 팩트 나열 유지</li>
              <li>• 수동적인 피드백 제공</li>
            </ul>
          </div>

          <div className="p-6 bg-[#121216] border border-[#FFD600]/40 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-[#FFD600] block uppercase">REPOSITION 컨설팅</span>
            <ul className="space-y-2 text-zinc-100 font-semibold">
              <li>• 관점 자체를 재정의하는 포지션 재설계</li>
              <li>• 인사담당자 결핍에 맞춘 전략 재구성</li>
              <li>• 1:1 실시간 밀착 피드백 및 면접 통제</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/* 7. Case Studies */
export const CaseStudiesSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#09090B] text-white border-b border-[#1A1A1E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            실전 리포지셔닝 사례
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REPOSITIONING_EXAMPLES.map((ex, idx) => (
            <div key={idx} className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
              <span className="text-xs font-bold text-[#FFD600] bg-[#FFD600]/10 px-2 py-0.5 rounded">
                {ex.category}
              </span>
              <h3 className="text-base font-bold text-white">{ex.afterLabel}</h3>
              
              <div className="space-y-2 text-xs pt-2">
                <div className="p-3 bg-[#18181C] rounded-xl text-zinc-400">
                  <span className="text-red-400 font-bold block mb-1">Before:</span>
                  {ex.beforeText}
                </div>
                <div className="p-3 bg-[#18181C] rounded-xl text-zinc-100 font-semibold">
                  <span className="text-[#FFD600] font-bold block mb-1">After:</span>
                  {ex.afterText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* 8. Planner J Profile */
export const PlannerJProfileSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#0C0C0F] text-white border-b border-[#1A1A1E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="font-black text-7xl italic text-[#FFD600] tracking-tighter select-none block">
          J
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          브랜딩 취업 컨설턴트 J
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
          대기업 기획 및 광고대행사 출신으로 브랜드 수십 개를 유수의 시장에 안착시킨 브랜드 기획자입니다. 그 관점 그대로 지원자 한 분 한 분의 커리어를 리포지셔닝합니다.
        </p>
      </div>
    </section>
  );
};

/* 9. Reviews */
export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#09090B] text-white border-b border-[#1A1A1E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl sm:text-4xl font-black text-center text-white">
          수강생 실제 후기
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.id} className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFD600]">{r.category}</span>
                <span className="text-xs text-zinc-400">{r.author} ({r.targetJob})</span>
              </div>
              <h3 className="font-extrabold text-white text-base">{r.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{r.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* 9.5 Bootcamp Curriculum Preview Section */
export const BootcampCurriculumPreview: React.FC<{
  onTabChange: (tab: string) => void;
}> = ({ onTabChange }) => {
  return (
    <section className="py-20 bg-[#0C0C0F] text-white border-b border-[#1A1A1E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-black rounded-full uppercase">
            🔥 BOOTCAMP CURRICULUM
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            기획자 J의 리포지셔닝 부트캠프 3주 과정
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            완판 릴레이 1기~6기 입증! 전략적 이직/취업을 위한 주차별 1:1 밀착 전수 과정
          </p>
        </div>

        {/* 3 Weeks Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3 relative overflow-hidden">
            <span className="px-2.5 py-1 bg-[#FFD600] text-[#09090B] font-black text-xs rounded">
              1주차 (4시간)
            </span>
            <h3 className="font-extrabold text-base text-white pt-1">
              취업시장 & 자소서 리포지셔닝
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              취업시장 특강 + 자소서 리포지셔닝 특강 및 1:1 1차 개별 컨설팅 (자기설득서 과제)
            </p>
          </div>

          <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3 relative overflow-hidden">
            <span className="px-2.5 py-1 bg-[#FFD600] text-[#09090B] font-black text-xs rounded">
              2주차 (2시간)
            </span>
            <h3 className="font-extrabold text-base text-white pt-1">
              우수 과제 리뷰 & 면접 리포지셔닝
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              면접통제 특강 + 1:1 2차 개별 컨설팅 (면접통제 Building-Up Book 과제)
            </p>
          </div>

          <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3 relative overflow-hidden">
            <span className="px-2.5 py-1 bg-[#FFD600] text-[#09090B] font-black text-xs rounded">
              3주차 (1시간 30분)
            </span>
            <h3 className="font-extrabold text-base text-white pt-1">
              이직 STP 전략 & 합격 케어
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              이직 STP전략 특강 + 1:1 3차 개별 컨설팅 + 자소서 3회 합격용 첨삭 & 상시 피드백
            </p>
          </div>
        </div>

        <div className="p-6 bg-[#18181C] border border-[#FFD600]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[#FFD600] font-black text-sm block">리포지셔닝 부트캠프 8기 모집 안내 · 모집 마감: 9월 18일(금) 오후 9시 · 선착순 10명</span>
            <p className="text-xs text-zinc-300">1회차 컨설팅 만족 불발 시 24시간 이내 전액 환불 보장</p>
          </div>
          <button
            onClick={() => onTabChange('bootcamp')}
            className="px-6 py-3 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-xs rounded-xl transition shrink-0"
          >
            상세 커리큘럼 & 가격 보기
          </button>
        </div>

      </div>
    </section>
  );
};

/* 10. Final Section */
export const FinalConversionSection: React.FC<{
  onTabChange: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
  siteFeatures?: Record<string, boolean>;
}> = ({ onTabChange, siteFeatures }) => {
  const [isClassEnabled, setIsClassEnabled] = useState<boolean>(false);
  const [isBootcampEnabled, setIsBootcampEnabled] = useState<boolean>(true);
  const [showClassTooltip, setShowClassTooltip] = useState<boolean>(false);
  const classTooltipId = useId();

  useEffect(() => {
    if (siteFeatures) {
      setIsClassEnabled(siteFeatures.repositioning_class === true);
      setIsBootcampEnabled(siteFeatures.bootcamp !== false);
    } else {
      fetchSiteFeatures().then(f => {
        setIsClassEnabled(f.repositioning_class === true);
        setIsBootcampEnabled(f.bootcamp !== false);
      });
    }
  }, [siteFeatures]);

  return (
    <section className="py-24 bg-[#09090B] text-white text-center border-t border-[#1A1A1E]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <span className="font-black text-7xl italic text-[#FFD600] tracking-tighter select-none block">
          J
        </span>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
            당신의 스펙이 부족한 게 아닐 수 있습니다. <br />
            <span className="text-[#FFD600]">아직 선택받을 이유로 읽히지 않았을 뿐입니다.</span>
          </h2>
          <p className="text-xs sm:text-base text-zinc-400 max-w-xl mx-auto">
            지금 클래스와 실전활용 워크북으로 나만의 경쟁력을 완성해보세요.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
          {!isClassEnabled ? (
            <div
              className="relative w-full sm:w-auto cursor-not-allowed"
              onMouseEnter={() => setShowClassTooltip(true)}
              onMouseLeave={() => setShowClassTooltip(false)}
              onFocus={() => setShowClassTooltip(true)}
              onBlur={() => setShowClassTooltip(false)}
              tabIndex={0}
              aria-describedby={showClassTooltip ? classTooltipId : undefined}
            >
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-8 py-4 bg-zinc-800/90 text-zinc-400 border border-zinc-700/80 font-black text-base rounded-xl flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
              >
                <Sparkles className="w-5 h-5 text-zinc-500" />
                <span>리포지셔닝 클래스 수강하기</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-[#18181B] text-amber-200/90 border border-amber-500/30 rounded">
                  오픈 준비 중
                </span>
              </button>

              {showClassTooltip && (
                <div
                  id={classTooltipId}
                  role="tooltip"
                  className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-zinc-900/95 text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700/80 shadow-2xl whitespace-nowrap pointer-events-none animate-fade-in backdrop-blur-md"
                >
                  리포지셔닝 클래스를 준비하고 있습니다. 곧 공개됩니다.
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onTabChange('classes')}
              className="px-8 py-4 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-base rounded-xl transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              리포지셔닝 클래스 수강하기
            </button>
          )}

          <button
            onClick={() => onTabChange('bootcamp')}
            className="w-full sm:w-auto px-8 py-4 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-base rounded-xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[#09090B] shrink-0" />
            <span>{isBootcampEnabled ? '부트캠프 8기 신청하기' : '모집 마감 (다음 기수 예약)'}</span>
            <ArrowRight className="w-5 h-5 text-[#09090B] shrink-0" />
          </button>
        </div>
      </div>
    </section>
  );
};
