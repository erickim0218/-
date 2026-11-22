import React, { useState, useEffect } from 'react';
import {
  Zap,
  Check,
  ShieldCheck,
  CheckCircle2,
  X,
  Calendar,
  Rocket,
  Award,
  ArrowRight,
  MessageSquare,
  ExternalLink,
  Flame,
  Clock,
  Users
} from 'lucide-react';
import { SlidingReviewsMarquee } from './SlidingReviewsMarquee';
import { BootcampReviewsSection } from './BootcampReviewsSection';
import { UserReviewsSection } from './UserReviewsSection';
import { RocketInfographic } from './RocketInfographic';
import { BootcampScheduleCalendar } from './BootcampScheduleCalendar';
import { AIBootcampBrandStory } from './AIBootcampBrandStory';
import standardRocketImg from '../assets/images/standard_rocket_launch_1788079504479.jpg';
import { BootcampReview } from '../data/bootcampReviews';
import { supabase } from '../lib/supabase';
import { fetchSiteFeatures } from '../lib/siteFeatures';
import { trackInquiryClickAndOpen } from '../lib/analytics';

interface BootcampDetailFlowProps {
  onTabChange?: (tab: string, subTab?: 'resources' | 'persuasion' | 'interview') => void;
  onApplicationSubmitted?: () => void;
  reviews?: BootcampReview[];
  onAddReview?: (review: BootcampReview) => void;
}

export const BootcampDetailFlow: React.FC<BootcampDetailFlowProps> = ({
  onTabChange,
  onApplicationSubmitted,
  reviews,
  onAddReview
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'코어' | '프로' | '퍼스트클래스'>('프로');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantTargetJob, setApplicantTargetJob] = useState('');
  const [applicantMotivation, setApplicantMotivation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInquiryClick = (e: React.MouseEvent, location: 'bootcamp_detail_inquiry' | 'kakao_inquiry' = 'bootcamp_detail_inquiry') => {
    e.preventDefault();
    trackInquiryClickAndOpen(location, 'https://open.kakao.com/o/sEgVEi0h');
  };

  // 9기 실시간 확정 수강생 수 관리
  const [confirmedCount, setConfirmedCount] = useState<number>(0);
  const [isBootcampEnabled, setIsBootcampEnabled] = useState<boolean>(true);

  // site_features 모집 상태 조회
  const checkFeatures = async () => {
    const features = await fetchSiteFeatures();
    if (features && typeof features.bootcamp === 'boolean') {
      setIsBootcampEnabled(features.bootcamp);
    }
  };

  // 2026년 10월 23일(금) 오후 9시(21:00) 마감 카운트다운 (Asia/Seoul timezone)
  const [timeLeft, setTimeLeft] = useState(() => calculateRemainingTime());

  function calculateRemainingTime() {
    const now = new Date();
    const target = new Date('2026-10-23T21:00:00+09:00');
    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  // 9기 부트캠프 모집 통계 조회 (홈·부트캠프 경로에서만 실행, 반복 경고 방지)
  const hasWarnedStatsRef = React.useRef(false);
  const fetchStats = async () => {
    const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
    const isBootcampRelevantRoute =
      pathname === '/' || pathname === '/home' || pathname === '/bootcamp';
    if (!isBootcampRelevantRoute) {
      return;
    }

    try {
      const { count, error } = await supabase
        .from('user_access')
        .select('user_id', { count: 'exact', head: true })
        .eq('membership_tier', 'bootcamp')
        .eq('bootcamp_cohort', '9기');

      if (!error && count !== null && count !== undefined) {
        setConfirmedCount(count);
        hasWarnedStatsRef.current = false;
      } else if (error && !hasWarnedStatsRef.current) {
        hasWarnedStatsRef.current = true;
      }
    } catch {
      if (!hasWarnedStatsRef.current) {
        hasWarnedStatsRef.current = true;
      }
    }
  };

  useEffect(() => {
    // 1. 카운트다운 타이머
    const timer = setInterval(() => {
      setTimeLeft(calculateRemainingTime());
    }, 1000);

    // 2. 페이지 진입 시 즉시 부트캠프 통계 및 site_features 조회
    fetchStats();
    checkFeatures();

    // 3. 10초마다 get_bootcamp_stats RPC 및 site_features 다시 조회
    const statsInterval = setInterval(() => {
      fetchStats();
      checkFeatures();
    }, 10000);

    // 4. 브라우저 활성화 시 다시 조회
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats();
        checkFeatures();
      }
    };

    const handleFocus = () => {
      fetchStats();
      checkFeatures();
    };

    // 5. 관리자 대시보드 등급 변경 성공 이벤트 수신 후 다시 조회
    const handleStatsUpdateEvent = () => {
      fetchStats();
      checkFeatures();
    };

    const handleFeaturesUpdateEvent = () => {
      checkFeatures();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('bootcamp_stats_updated', handleStatsUpdateEvent);
    window.addEventListener('site_features_updated', handleFeaturesUpdateEvent);

    // 6. 컴포넌트 해제 시 interval과 이벤트 리스너 정리
    return () => {
      clearInterval(timer);
      clearInterval(statsInterval);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('bootcamp_stats_updated', handleStatsUpdateEvent);
      window.removeEventListener('site_features_updated', handleFeaturesUpdateEvent);
    };
  }, []);

  const totalCapacity = 5;
  const isTimeExpired = Date.now() >= new Date('2026-10-23T21:00:00+09:00').getTime();
  const isCountFull = confirmedCount >= totalCapacity;
  const isClosed = !isBootcampEnabled || isTimeExpired || isCountFull;
  const displayCount = Math.min(totalCapacity, Math.max(0, confirmedCount));
  const percent = Math.min(100, Math.round((displayCount / totalCapacity) * 100));
  const remainingSlots = Math.max(0, totalCapacity - displayCount);

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) return;
    setIsSubmitted(true);
    if (onApplicationSubmitted) onApplicationSubmitted();
  };

  const handleOpenPlanModal = (plan: '코어' | '프로' | '퍼스트클래스') => {
    if (isClosed) {
      trackInquiryClickAndOpen('bootcamp_detail_inquiry', 'https://open.kakao.com/o/sEgVEi0h');
      return;
    }
    setSelectedPlan(plan);
    setIsApplyModalOpen(true);
    setIsSubmitted(false);
  };

  const scrollToPricing = () => {
    const elem = document.getElementById('pricing-plans');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#09090B] text-zinc-100 font-sans leading-relaxed selection:bg-[#FFD600] selection:text-[#09090B] pb-24">

      {/* 첫 화면: 핵심 약속, 운영 방식, CTA를 한 번에 보여준다. */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-3 sm:pt-6">
        <div className="overflow-hidden rounded-3xl border border-zinc-800/90 bg-[#121216] shadow-2xl">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
            <div className="p-6 sm:p-10 lg:p-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-[#FFD600]/40 bg-[#FFD600]/15 px-2.5 py-1 text-xs font-black text-[#FFD600]">
                  기획자J의 3주 밀착 과정
                </span>
                <span className={`rounded-lg border px-2.5 py-1 text-xs font-black ${isClosed ? 'border-rose-500/30 bg-rose-500/20 text-rose-400' : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'}`}>
                  {isClosed ? '현재 모집 마감' : '현재 모집 중'}
                </span>
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl">
                AI를 이기는<br />
                <span className="text-[#FFD600]">리포지셔닝 부트캠프</span>
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-black leading-snug tracking-tight text-white sm:text-2xl">
                모두가 AI로 그럴듯한 지원서를 쓰는 시대.<br />
                <span className="text-zinc-400">그럴듯함만으로는 더 이상 선택받기 어렵습니다.</span>
              </p>
              <p className="mt-5 border-l-4 border-[#FFD600] pl-4 text-base font-black text-zinc-200 sm:text-xl">
                스펙은 바꾸지 않습니다. 읽히는 방식을 바꿉니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://open.kakao.com/o/sEgVEi0h"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleInquiryClick}
                  className="flex w-full items-center justify-center rounded-xl bg-[#FFD600] px-7 py-4 text-base font-black text-[#09090B] shadow-lg transition hover:bg-[#ffe033] active:scale-95 sm:w-auto"
                >
                  {isClosed ? '다음 기수 상담하기' : '내 상황 상담하기'}
                </a>
                <button
                  type="button"
                  onClick={scrollToPricing}
                  className="flex w-full items-center justify-center rounded-xl bg-zinc-800 px-7 py-4 text-base font-bold text-white shadow-lg transition hover:bg-zinc-700 active:scale-95 sm:w-auto"
                >
                  프로그램과 수강료 보기
                </button>
              </div>

              <div className="mt-6 flex items-start gap-2 text-xs leading-5 text-zinc-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>1회 차 컨설팅 후 방향이 맞지 않다고 판단되면 24시간 안에 전액 환불을 요청할 수 있습니다.</span>
              </div>
            </div>

            <aside className="border-t border-zinc-800 bg-[#0D0D10] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-sm font-black tracking-[0.12em] text-[#FFD600]">이 과정에서 함께하는 것</p>
              <ul className="mt-5 space-y-4">
                {[
                  ['3주 라이브 특강', 'REAL NEEDS부터 자소서·면접·이직 전략까지'],
                  ['주차별 1:1 컨설팅', '배운 내용을 내 경험과 지원 기업에 바로 적용'],
                  ['과제와 상시 피드백', '혼자 막히는 구간을 그대로 두지 않도록 점검'],
                  ['프로자료 전체 제공', '이력서·포트폴리오·실전 프롬프트까지']
                ].map(([title, description]) => (
                  <li key={title} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FFD600]" />
                    <div>
                      <p className="text-sm font-black text-white">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">{description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-zinc-800 pt-6">
                <p className="text-sm font-bold leading-6 text-zinc-200">
                  “GPT에 의존하지 않고 스스로 생각하는 법을 배웠습니다.”
                </p>
                <p className="mt-2 text-xs font-bold text-zinc-500">실제 수강생 후기 중</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-y border-zinc-800 bg-[#0B0B0E]/95 px-4 py-3 backdrop-blur" aria-label="부트캠프 상세 바로가기">
        <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto text-sm font-bold text-zinc-300 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <a href="#why-repositioning" className="shrink-0 rounded-full border border-zinc-700 px-4 py-2 hover:border-[#FFD600] hover:text-white">왜 리포지셔닝인가</a>
          <a href="#bootcamp-schedule" className="shrink-0 rounded-full border border-zinc-700 px-4 py-2 hover:border-[#FFD600] hover:text-white">3주 과정</a>
          <a href="#bootcamp-reviews" className="shrink-0 rounded-full border border-zinc-700 px-4 py-2 hover:border-[#FFD600] hover:text-white">수강 후기</a>
          <a href="#pricing-plans" className="shrink-0 rounded-full border border-[#FFD600]/50 bg-[#FFD600]/10 px-4 py-2 text-[#FFD600]">수강료·신청</a>
        </div>
      </nav>

      <div id="why-repositioning" className="scroll-mt-16"><AIBootcampBrandStory /></div>

      {/* 핵심 메시지를 이해한 뒤 실제 수강 후기로 신뢰를 확인하도록 배치 */}
      <section id="bootcamp-reviews" className="scroll-mt-16 bg-[#0B0B0E] py-4">
        <SlidingReviewsMarquee />
      </section>

      {/* 임팩트 브랜드 배너 (레드 모션 실루엣 & 흑백 구도 - 풀 width) */}
      <div className="hidden w-full overflow-hidden mt-4 mb-0">
        
        {/* 레드 모션 섹션 */}
        <section className="relative w-full min-h-[380px] sm:min-h-[440px] bg-[#8B0000] flex flex-col items-center justify-center p-6 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-rose-600 to-red-800 opacity-90 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-400 via-rose-700 to-black blur-xl pointer-events-none" />
          
          {/* 옅은 사선 패턴 오버레이 */}
          <div 
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.25) 0px, rgba(255, 255, 255, 0.25) 2px, transparent 2px, transparent 12px)'
            }}
          />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="space-y-1.5">
              <p className="text-white/95 text-sm sm:text-lg font-bold tracking-tight">
                무수히 많은 스펙, 수 많은 정보들
              </p>
              <p className="text-white text-lg sm:text-2xl font-black tracking-tight">
                과연 인사담당자의 뇌리에 남을까요?
              </p>
            </div>

            <div className="space-y-3 pt-3">
              <div>
                <span className="inline-block bg-[#09090B] text-white font-black text-base sm:text-2xl md:text-3xl px-5 py-2.5 sm:px-7 sm:py-3 rounded shadow-2xl">
                  모두가 스펙으로만 승부하려고 할 때
                </span>
              </div>
              <div>
                <span className="inline-block bg-[#09090B] text-white font-black text-lg sm:text-3xl md:text-4xl px-6 py-3 sm:px-8 sm:py-3.5 rounded shadow-2xl">
                  기획자J는 <span className="text-[#FFD600]">메시지를 설계합니다.</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 블랙 쿼트 섹션 (원래 텍스트 완전 복원) */}
        <section className="relative w-full bg-[#050507] text-white pt-14 pb-12 px-6 sm:px-12 text-center overflow-hidden border-t border-zinc-800">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="text-5xl sm:text-7xl font-serif text-zinc-500 leading-none select-none">
              “
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              인사담당자가 기억하는 건 스펙이 아닙니다
            </h2>

            <div>
              <span className="inline-block bg-white text-[#09090B] font-black text-2xl sm:text-4xl md:text-5xl px-8 py-2.5 sm:px-12 sm:py-3.5 rounded shadow-2xl my-2">
                전략입니다
              </span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm font-semibold">
              Specs fade, Strategy stays
            </p>

            <div className="pt-6 space-y-2.5 max-w-2xl mx-auto border-t border-zinc-800/80">
              <p className="text-sm sm:text-lg font-bold text-zinc-200 leading-relaxed">
                내 스펙을 하나의 컨셉으로 전략화하여 인사담당자의 머리에 각인시켜야 합니다
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 font-light italic">
                Capture the essence of the Specs in a single, unforgettable sentence.
              </p>
            </div>
          </div>
        </section>

        {/* 뾰족한 곡선 커튼 SVG 하단 트랜지션 (이미지 형태 완벽 구현) */}
        <div className="relative w-full bg-white leading-none overflow-hidden -mt-px">
          <svg
            className="w-full h-20 sm:h-32 md:h-44 block"
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 -1 L 1200 -1 L 1200 36 L 940 36 C 750 36 605 160 600 216 C 595 160 450 36 260 36 L 0 36 Z"
              fill="#050507"
            />
          </svg>
        </div>

      </div>

      {/* 메인 콘텐츠 영역 (풀-bleed 레이아웃 & 화이트 전환) */}
      <main className="w-full bg-white text-zinc-900 overflow-hidden min-h-screen">
        
        {/* 1. 타겟 진단 */}
        <section className="hidden p-8 sm:p-12 border-b border-zinc-200 bg-white space-y-8 pt-8 sm:pt-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs text-amber-800 bg-amber-100 font-bold px-3 py-1 rounded-full">
              수강 대상 진단
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              메시지 설계가 필요한 <span className="text-amber-600">진짜 이유</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 font-medium">
              아래 5가지 중 3가지 이상 해당된다면, 전략적 리포지셔닝이 시급한 상황입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* 추천 대상 */}
            <div className="p-6 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200 pb-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>메시지 설계 추천 대상</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>평균 이상의 스펙임에도 불구하고 서류 탈락이 반복되는 분</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>단순 경험 나열에서 벗어나 뇌리에 각인될 한 줄 카피가 필요한 분</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>대기업/중견기업 상향 이직을 목표로 차별화 프레임이 필요한 분</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>면접관의 고난도 질문을 내가 만든 테마로 끌고 오고 싶으신 분</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>올해 안으로 구직/이직의 방황을 확실한 전략으로 끝내고 싶으신 분</span>
                </li>
              </ul>
            </div>

            {/* 비추천 대상 */}
            <div className="p-6 bg-rose-50/50 border border-rose-200/80 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm border-b border-rose-200 pb-2">
                <X className="w-4 h-4 text-rose-600" />
                <span>이런 분께는 권하지 않습니다</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>탈락 원인을 분석하기보다 다른 공고 복붙만 반복하시는 분</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>자신의 메시지와 전략을 재설계할 의지가 없으신 분</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>스펙 탓만 하며 정작 서류의 구조와 방향성을 바꾸지 않는 분</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 킬러 멘트 (글씨 크기 확대 및 임팩트 강조) */}
          <div className="pt-8 sm:pt-14 text-center max-w-4xl mx-auto space-y-4">
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-zinc-800 leading-relaxed sm:leading-relaxed">
              같은 실수를 깨닫지 못하고 열정만 소비하는 방식을<br className="hidden sm:inline" />
              우리는 <span className="text-rose-600 font-black">비전략적</span>이라고 합니다.
            </p>
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black text-zinc-950 leading-tight sm:leading-tight">
              취업에 대한 <span className="text-amber-600">올바른 관점</span>을 바로 세우면<br className="hidden sm:inline" />
              합격은 저절로 따라옵니다.
            </p>
          </div>
        </section>

        {/* 2. 로켓 섹션 (선명하고 또렷한 로켓 비주얼 카드) */}
        <section className="hidden p-6 sm:p-10 border-b border-zinc-200 bg-slate-50">
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-xl relative">
            
            {/* 로켓 이미지 배너 - 100% 명확하고 또렷한 로켓 그래픽 */}
            <div className="relative w-full h-[400px] sm:h-[520px] md:h-[620px] bg-zinc-950 flex items-center justify-center overflow-hidden">
              <img
                src={standardRocketImg}
                alt="리포지셔닝 부트캠프 로켓"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain sm:object-cover object-center brightness-105 contrast-105 opacity-100"
              />
              
              {/* 상하단 텍스트 가독성용 은은한 그라데이션 오버레이 (로켓 본체는 100% 선명하게 보임) */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-zinc-950/30 pointer-events-none" />
              
              {/* 상단 뱃지 */}
              <div className="absolute top-6 left-6 right-6 sm:top-8 sm:left-8 z-10">
                <div className="inline-flex items-center gap-2 bg-[#FFD600] text-zinc-950 px-4 py-1.5 rounded-full font-black text-xs sm:text-sm shadow-xl">
                  <Rocket className="w-4 h-4 fill-current text-zinc-950" />
                  <span>리포지셔닝 부트캠프란?</span>
                </div>
              </div>

              {/* 메인 타이틀 */}
              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 space-y-2 z-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
                  리포지셔닝 부트캠프는 <span className="text-[#FFD600]">로켓</span>입니다.
                </h2>
              </div>
            </div>

            {/* 하단 본문 내용 - 깔끔한 고대비 화이트 카너 */}
            <div className="p-6 sm:p-10 space-y-6 bg-white text-zinc-900">
              
              <div className="py-2 space-y-3">
                <p className="text-base sm:text-xl font-bold text-zinc-900 leading-relaxed">
                  스펙을 단순히 나열하는 서류로는 원하는 기업에 합격하기 어렵습니다.<br />
                  당신의 경험과 역량을 인사담당자의 뇌리에 남을 <strong className="text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-black">선명한 메시지</strong>로 재설계합니다.
                </p>
                <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                  스펙 탓만 하며 방황하는 구직 기간을 끝내고, 3주 동안 배우고 적용하고 점검하는 과정을 반복하며 목표 기업에 도전할 전략을 완성합니다.
                </p>
              </div>

              {/* 핵심 2가지 카드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-5 bg-slate-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD600] inline-block border border-amber-400" />
                    <span>01. 차별화된 한 줄 메시지</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900">기억에 남는 브랜딩 컨셉 수립</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    수많은 서류 속에서 3초 만에 인사담당자의 주목을 끄는 나만의 헤드라인 메시지를 만듭니다.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFD600] inline-block border border-amber-400" />
                    <span>02. 기획자J 1:1 밀착 코칭</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900">서류 첨삭부터 면접 대비까지</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    브랜드 기획 전문가가 3주 동안 직접 밀착해 자소서 작성부터 면접 질문 주도권 확보까지 함께합니다.
                  </p>
                </div>
              </div>

              {/* 하단 기획자J 서명 */}
              <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs sm:text-sm text-zinc-500">
                <span className="font-semibold text-zinc-800">리포지셔닝 부트캠프 총괄 기획자J</span>
                <span className="text-amber-800 font-bold">합격을 향한 전략 리포지셔닝</span>
              </div>

            </div>

          </div>
        </section>

        {/* 로켓 궤도 인포그래픽 & 주차별 주요 일정 (이미지 원본 100% 반영) */}
        <div className="hidden"><RocketInfographic /></div>

        {/* 2026년 10월·11월 일정 & 1~3주차 상세 커리큘럼 */}
        <BootcampScheduleCalendar />

        {/* 부트캠프 참여자 공통 자료실 혜택 */}
        <section className="px-6 py-12 sm:px-12 sm:py-16 border-b border-[#174767] bg-[#071B31] text-white">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center rounded-full border border-sky-300/40 bg-sky-300/10 px-4 py-1.5 text-xs font-black text-sky-200">
                수강생 전용 자료실
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                수강을 시작하면,<br className="sm:hidden" /> 자료실도 전부 열립니다.
              </h2>
              <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300">
                강의에서 끝내지 않도록, 실제 지원에 필요한 자료와 프롬프트까지 함께 드립니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 space-y-3">
                <p className="text-xs font-black text-sky-300">01. 기본 자료</p>
                <h3 className="text-lg font-black">자소서와 면접의 기준</h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0 text-sky-300" />자기설득서</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0 text-sky-300" />완벽통제면접</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-sky-300/40 bg-sky-300/[0.09] p-5 sm:p-6 space-y-3 md:scale-[1.02]">
                <p className="text-xs font-black text-sky-300">02. 프로자료 전체</p>
                <h3 className="text-lg font-black">지원할 때 바로 쓰는 자료</h3>
                <ul className="space-y-2 text-sm text-slate-100">
                  <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0 text-sky-300" />취업 STP 전략</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0 text-sky-300" />REAL NEEDS 이력서 전략·예시·Word 템플릿</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 mt-0.5 shrink-0 text-sky-300" />완벽설득포트폴리오 전략·완성 예시</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 space-y-3">
                <p className="text-xs font-black text-sky-300">03. 실전 프롬프트</p>
                <h3 className="text-lg font-black">내 기업과 직무에 맞춰 쓰는 법</h3>
                <p className="text-sm leading-relaxed text-slate-200">
                  프로자료를 내 지원 기업과 직무에 맞춰 적용할 수 있는 프롬프트를 함께 드립니다.
                </p>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm font-bold text-sky-200">
              별도 결제 없이 자료실의 모든 자료를 열람할 수 있습니다.
            </p>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-white px-6 py-14 sm:px-12 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p className="text-sm font-black tracking-[0.16em] text-amber-700">수강생이 직접 말한 변화</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-zinc-950 sm:text-4xl">배운 내용을 혼자서도 꺼내 쓸 수 있게 됩니다.</h2>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {[
                'GPT에 의존하지 않고 스스로 생각하는 연습이 됐습니다.',
                '자소서를 어떤 사고 과정과 구조로 써야 하는지 알게 됐습니다.',
                '제 글의 문제를 이해하고, 스스로 글을 설계하는 힘이 생겼습니다.'
              ].map((quote) => (
                <blockquote key={quote} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-base font-bold leading-7 text-zinc-800">
                  “{quote}”
                  <footer className="mt-4 text-xs font-bold text-zinc-500">실제 수강생 후기 중</footer>
                </blockquote>
              ))}
            </div>
            <p className="mt-5 text-center text-xs text-zinc-500">개인의 준비 상황과 실행 정도에 따라 결과는 달라질 수 있습니다.</p>
          </div>
        </section>

        {/* 6. 수강 가격 플랜 */}
        <section id="pricing-plans" className="p-8 sm:p-12 border-b border-zinc-200 bg-slate-50 space-y-8 scroll-mt-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs text-amber-800 bg-amber-100 font-bold px-3 py-1 rounded-full">
              수강 방법
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              필요한 도움만큼 선택하세요.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              세 플랜 모두 3주 특강과 리포지셔닝 방법론을 포함합니다. 차이는 1:1로 함께 다듬는 범위입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* 코어 */}
            <div className="p-6 bg-white border border-zinc-200 rounded-2xl flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">코어 플랜</h3>
                  <p className="text-xs text-zinc-500">방향을 잡고 직접 완성하는 분</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-400 line-through block">350,000원</span>
                  <span className="text-2xl font-black text-zinc-900">290,000<span className="text-xs font-normal text-zinc-500">원</span></span>
                </div>
                <ul className="space-y-2.5 pt-3 border-t border-zinc-100 text-xs text-zinc-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>3주 라이브 특강 전체 수강 (실시간 진행)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>자기설득서 표준 템플릿 제공</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-bold text-zinc-900">자료실 프로자료 전체 + 실전 프롬프트 제공</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>1:1 개별 컨설팅 2회 (밀착 진단)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>과제 정밀 피드백 2회 제공</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>자소서 서류 정밀 체크</span>
                  </li>
                </ul>
              </div>
              {/* 코어 플랜 버튼 */}
              {isClosed ? (
                <a
                  href="https://open.kakao.com/o/sEgVEi0h"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleInquiryClick}
                  className="w-full py-3 font-black text-xs rounded-xl bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 shadow-md text-center transition flex items-center justify-center gap-1.5"
                >
                  <span>💬 다음 기수 예약 문의</span>
                </a>
              ) : (
                <button
                  onClick={() => handleOpenPlanModal('코어')}
                  className="w-full py-3 font-bold text-xs rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer transition"
                >
                  코어 신청하기
                </button>
              )}
            </div>

            {/* 프로 */}
            <div className="p-6 bg-white border border-zinc-200 rounded-2xl flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">프로 플랜</h3>
                  <p className="text-xs text-amber-800 font-semibold">1:1로 서류까지 함께 완성하는 분</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-400 line-through block">480,000원</span>
                  <span className="text-2xl font-black text-zinc-900">390,000<span className="text-xs font-normal text-zinc-500">원</span></span>
                </div>
                <ul className="space-y-2.5 pt-3 border-t border-zinc-100 text-xs text-zinc-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>코어 플랜 모든 혜택 포함</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-bold text-zinc-900">1:1 컨설팅 3회</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-bold text-zinc-900">자소서 3회 정밀 첨삭 (최대 3문항)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>상시 카카오톡 1:1 피드백</span>
                  </li>
                </ul>
              </div>
              {/* 프로 플랜 버튼 */}
              {isClosed ? (
                <a
                  href="https://open.kakao.com/o/sEgVEi0h"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleInquiryClick}
                  className="w-full py-3 font-black text-xs rounded-xl bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 shadow-md text-center transition flex items-center justify-center gap-1.5"
                >
                  <span>💬 다음 기수 예약 문의</span>
                </a>
              ) : (
                <button
                  onClick={() => handleOpenPlanModal('프로')}
                  className="w-full py-3 font-bold text-xs rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer transition"
                >
                  프로 플랜 신청하기
                </button>
              )}
            </div>

            {/* 퍼스트 클래스 (월 3명 한정 + 가장 많이 선택) */}
            <div className="p-6 bg-white border-2 border-amber-400 rounded-2xl flex flex-col justify-between space-y-5 shadow-lg relative ring-2 ring-amber-400/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap">
                <span className="px-3 py-0.5 bg-red-600 text-white font-black text-[11px] rounded-full shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current text-amber-300" />
                  월 3명 한정
                </span>
                <span className="px-3 py-0.5 bg-[#FFD600] text-zinc-950 font-black text-[11px] rounded-full shadow-sm">
                  가장 많이 선택 ★
                </span>
              </div>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-zinc-900">퍼스트 클래스</h3>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 font-extrabold text-[10px] rounded-md border border-red-200">
                      월 3명 한정
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">최종 합격까지 계속 점검받고 싶은 분</p>
                </div>
                <div>
                  <span className="text-xs text-zinc-400 line-through block">890,000원</span>
                  <span className="text-2xl font-black text-zinc-900">690,000<span className="text-xs font-normal text-zinc-500">원</span></span>
                </div>
                <ul className="space-y-2.5 pt-3 border-t border-zinc-100 text-xs text-zinc-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>프로 플랜 모든 혜택 포함</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-zinc-900">모집 시즌 동안 1:1 컨설팅 횟수 제한 없음</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>자소서 횟수 제한 없는 첨삭 + 면접 점검</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>최종 합격까지 서류와 면접을 계속 점검</span>
                  </li>
                </ul>
              </div>
              {/* 퍼스트클래스 버튼 */}
              {isClosed ? (
                <a
                  href="https://open.kakao.com/o/sEgVEi0h"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleInquiryClick}
                  className="w-full py-3 font-black text-xs rounded-xl bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 shadow-md text-center transition flex items-center justify-center gap-1.5"
                >
                  <span>💬 다음 기수 예약 문의</span>
                </a>
              ) : (
                <button
                  onClick={() => handleOpenPlanModal('퍼스트클래스')}
                  className="w-full py-3 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 shadow-md cursor-pointer"
                >
                  <span>퍼스트클래스 신청하기</span>
                  <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">월 3명 한정</span>
                </button>
              )}
            </div>

          </div>
        </section>

        <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-14 sm:px-12 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-sm font-black tracking-[0.16em] text-amber-700">신청 전에 많이 묻는 질문</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-zinc-950 sm:text-4xl">결제 전에 확인하세요.</h2>
            </div>
            <div className="mt-9 space-y-3">
              {[
                ['AI를 쓰면 안 되는 과정인가요?', '아닙니다. 자료 조사와 초안에는 AI를 적극 활용합니다. 다만 최종 주장은 내 경험에서 찾고, 면접에서 직접 설명할 수 있게 만듭니다.'],
                ['1:1 컨설팅에서는 무엇을 하나요?', '강의에서 배운 방법을 내 경험과 지원 기업에 적용합니다. 지원 방향, 자소서의 주장, 면접에서 증명할 근거를 주차별로 점검합니다.'],
                ['강의만 듣고 끝나는 과정인가요?', '아닙니다. 매주 Building Up Book 과제를 수행하고, 1:1 컨설팅과 피드백을 거쳐 실제 지원에 쓸 결과물로 다듬습니다.'],
                ['자료실은 별도 결제인가요?', '아닙니다. 부트캠프 수강생은 프로자료와 이력서·포트폴리오 자료, 실전 프롬프트까지 모두 열람할 수 있습니다.'],
                ['지금 모집이 마감됐다면 어떻게 하나요?', '상세 내용은 그대로 확인할 수 있습니다. 카카오톡으로 문의하면 다음 기수 일정과 신청 방법을 안내해드립니다.']
              ].map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border border-zinc-200 bg-white p-5 open:border-zinc-400">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-zinc-950">
                    {question}
                    <span className="text-xl font-bold text-zinc-400 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 border-t border-zinc-100 pt-4 text-sm leading-7 text-zinc-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 7. 수강 후기 */}
        <section className="p-8 sm:p-12 border-b border-zinc-200 bg-white space-y-8">
          <BootcampReviewsSection reviews={reviews} onAddReview={onAddReview} />
        </section>

        {/* 7-2. 운영 가능한 사용자 작성 수강생 후기 시스템 */}
        <section className="p-8 sm:p-12 border-b border-zinc-200 bg-white space-y-8">
          <UserReviewsSection onTabChange={onTabChange} />
        </section>

        {/* 8. 환불 보장 & 수강 신청 CTA */}
        <section className="p-8 sm:p-12 bg-zinc-900 text-white space-y-6 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% 안심 환불 보장 제도</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              서류에서는 주장하고,<br />
              <span className="text-[#FFD600]">면접에서는 증명하세요.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              AI가 대신 써준 문장은 면접장에서 대신 답해주지 않습니다.<br />
              내 경험으로 말할 수 있는 ‘왜 나인가’를 3주 동안 함께 만듭니다.
            </p>
            <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-bold leading-6 text-emerald-200">
              1회 차 컨설팅 후 방향이 맞지 않다고 판단되면 24시간 안에 전액 환불을 요청할 수 있습니다.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <a
                href="https://open.kakao.com/o/sEgVEi0h"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInquiryClick}
                className="w-full sm:w-auto px-8 py-4 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 font-black text-base rounded-2xl transition shadow-xl transform active:scale-95 flex items-center justify-center gap-2"
              >
                {isClosed ? '다음 기수 상담하기' : '내 상황 상담하기'}
              </a>
              <a
                href="https://litt.ly/j_positioning/sale/7eqv5tA"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-base rounded-2xl transition shadow-xl transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>수강 후기 더 보기</span>
                <ExternalLink className="w-4 h-4 text-zinc-400" />
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* 하단 고정 신청 바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121216]/95 backdrop-blur-md border-t border-zinc-800 py-2.5 px-3 sm:py-3 sm:px-4 shadow-2xl pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          
          {/* Mobile view (< 640px): 2-line condensed layout */}
          <div className="flex sm:hidden flex-col w-full text-xs space-y-1">
            {/* 1줄: 실시간 모집인원 스타일 반영 */}
            <div className="flex items-center justify-between text-[11px] font-bold">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span
                  className="text-zinc-400 font-medium"
                  style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
                >
                  부트캠프 9기 실시간 모집인원:
                </span>
                <span
                  className="text-white font-black"
                  style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
                >
                  <strong className="text-[#FFD600]">{displayCount}</strong> / 5명
                </span>
                {!isClosed && (
                  <>
                    <div className="w-16 bg-zinc-800 rounded-full h-1.5 overflow-hidden inline-block mx-0.5 shrink-0">
                      <div
                        className="h-full rounded-full bg-[#FFD600]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </>
                )}
                {isClosed && (
                  <span className="px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-400 rounded border border-rose-500/30">
                    모집 마감
                  </span>
                )}
              </div>
            </div>

            {/* 2줄: 남은 시간 + 문의 버튼 */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-zinc-400 text-[11px] font-medium shrink-0">
                {isClosed ? (
                  <span className="text-zinc-400">다음 기수 예약 문의 가능</span>
                ) : (
                  <>
                    남은 시간 <span className="text-[#FFD600] font-mono font-bold">D-{timeLeft.days} {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}</span>
                  </>
                )}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href="https://open.kakao.com/o/sEgVEi0h"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleInquiryClick(e, 'kakao_inquiry')}
                  className="px-3 py-1.5 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-xs rounded-xl transition shadow flex items-center justify-center min-h-[38px] whitespace-nowrap"
                >
                  <span>{isClosed ? '💬 예약 문의' : '💬 신청 문의'}</span>
                </a>
                <a
                  href="https://litt.ly/j_positioning/sale/7eqv5tA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center min-h-[38px] whitespace-nowrap"
                >
                  <span>⭐ 후기</span>
                </a>
              </div>
            </div>
          </div>

          {/* Desktop & Tablet view (>= 640px) */}
          <div className="hidden sm:flex items-center gap-3">
            {isClosed ? (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-400 font-black">부트캠프 9기</span>
                  <span className="text-[10px] px-2 py-0.5 rounded border font-bold bg-rose-500/20 border-rose-500/30 text-rose-400">
                    9기 모집 마감
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-medium">
                  현재 기수 모집이 마감되었습니다. 다음 모집 소식을 먼저 받아보세요.
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span
                      className="text-zinc-400 text-xs font-medium"
                      style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
                    >
                      부트캠프 9기 실시간 모집인원:
                    </span>
                    <span
                      className="text-white text-sm font-black"
                      style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
                    >
                      <strong className="text-[#FFD600]">{displayCount}</strong> / 5명
                    </span>
                  </div>
                  <div className="w-24 bg-zinc-800 rounded-full h-2 overflow-hidden hidden md:block shrink-0">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-[#FFD600]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded border font-bold bg-rose-500/10 border-rose-500/30 text-rose-400 whitespace-nowrap shrink-0">
                    잔여 {remainingSlots}자리
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-medium mt-0.5 block">
                  10월 23일(금) 오후 9시 마감 · 남은 시간 <span className="text-[#FFD600] font-mono font-bold">{timeLeft.days}일 {timeLeft.hours}시간 {timeLeft.minutes}분 {timeLeft.seconds}초</span>
                </span>
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isClosed && (
              <a
                href="#bootcamp-schedule"
                className="hidden md:flex px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-[#FFD600] border border-zinc-700 font-bold text-xs rounded-xl transition items-center justify-center gap-1.5 min-h-[42px]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>10월·11월 일정표</span>
              </a>
            )}
            <a
              href="https://open.kakao.com/o/sEgVEi0h"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleInquiryClick(e, 'kakao_inquiry')}
              className="px-5 py-2.5 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-1.5 min-h-[42px] whitespace-nowrap"
            >
              <span>{isClosed ? '💬 다음 기수 예약 문의' : '💬 신청 문의'}</span>
            </a>
            <a
              href="https://litt.ly/j_positioning/sale/7eqv5tA"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 min-h-[42px] whitespace-nowrap"
            >
              <span>⭐ 수강생 리얼후기보기</span>
            </a>
          </div>
        </div>
      </div>

      {/* 수강 신청 모달 */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] text-white border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#FFD600] font-bold">수강 신청서 작성</span>
                  <h3 className="text-xl font-black text-white">
                    {selectedPlan} 플랜 신청
                  </h3>
                  <p className="text-xs text-zinc-400">
                    신청 정보를 입력해주시면 확인 후 1:1 안내 연락을 드립니다.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">성함 *</label>
                    <input
                      type="text"
                      required
                      placeholder="홍길동"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#18181C] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">연락처 *</label>
                    <input
                      type="tel"
                      required
                      placeholder="010-0000-0000"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#18181C] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">목표 직무 / 기업</label>
                    <input
                      type="text"
                      placeholder="예: 서비스 기획 / 대기업 마케팅"
                      value={applicantTargetJob}
                      onChange={(e) => setApplicantTargetJob(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#18181C] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">현재 고민 또는 지원 동기</label>
                    <textarea
                      rows={3}
                      placeholder="서류 탈락 이유를 모르겠거나 상향 이직을 노리고 있습니다 등"
                      value={applicantMotivation}
                      onChange={(e) => setApplicantMotivation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#18181C] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>신청서 제출하기</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">수강 신청 접수 완료!</h3>
                  <p className="text-xs text-zinc-300">
                    남겨주신 연락처({applicantPhone})로<br />
                    빠른 시일 내 1:1 안내 메시지를 발송해 드립니다.
                  </p>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition"
                >
                  확인 및 닫기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
