import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  X
} from 'lucide-react';
import {
  trackAnalyticsEvent,
  trackInquiryClickAndOpen,
  InquiryButtonLocation
} from '../../lib/analytics';

interface ConsultingViewProps {
  onTabChange?: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
}

const KAKAO_CONSULTING_URL = 'https://open.kakao.com/o/sEgVEi0h';

export const ConsultingView: React.FC<ConsultingViewProps> = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleKakaoInquiry = (
    e: React.MouseEvent<HTMLAnchorElement>,
    location: InquiryButtonLocation
  ) => {
    e.preventDefault();
    trackInquiryClickAndOpen(location, KAKAO_CONSULTING_URL);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenReportModal = () => {
    trackAnalyticsEvent({
      eventName: 'consulting_report_example',
      buttonLocation: 'consulting_report_example'
    }).catch(() => {});
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  // ESC key handler for report modal
  useEffect(() => {
    if (!isReportModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsReportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReportModalOpen]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  // 01. 인사담당자의 인식 — 지원자의 정보가 인식되는 4단계
  const cognitiveStages = [
    {
      step: '01',
      label: '정보 인입',
      question: '이력서의 정보가 눈에 들어옵니다.',
      isHighlight: false
    },
    {
      step: '02',
      label: '적합성 판단',
      question: '인입된 정보를 바탕으로 직무 적합성을 판단합니다.',
      isHighlight: false
    },
    {
      step: '03',
      label: '핵심 인식',
      question: '인사담당자의 머릿속에 지원자의 핵심 인식이 각인됩니다.',
      isHighlight: true
    },
    {
      step: '04',
      label: '기억·선택',
      question: '기억되는 지원자로 남고 선택 여부가 결정됩니다.',
      isHighlight: false
    }
  ];

  // 02. 문제 인식 — 핵심 기준 3개
  const coreCriteria = [
    {
      num: '01',
      title: '지원할 직무',
      desc: '내 경험이 실제로 설득력을 갖는 직무와 목표 공고 기준을 먼저 세웁니다.'
    },
    {
      num: '02',
      title: '앞에 내세울 경험',
      desc: '수많은 이력 중 가장 먼저 보여줄 대표 경험의 우선순위를 정합니다.'
    },
    {
      num: '03',
      title: '기업이 나를 선택할 이유',
      desc: '이력서·자소서·면접을 관통하는 나를 설명할 한 문장을 정리합니다.'
    }
  ];

  // 03. 이런 고민이라면 (3개)
  const concernsList = [
    '지원 방향이 맞는지 모르겠습니다.',
    '경력은 있는데 강점을 한 문장으로 설명하기 어렵습니다.',
    '자소서나 포트폴리오를 계속 고쳐도 결과가 달라지지 않습니다.'
  ];

  // 04. 1:1 컨설팅에서 바뀌는 것 (Before -> After)
  const beforeAfterCases = [
    {
      before: '단순 운영 경험',
      after: '고객사의 문제를 줄이고 업무 효율을 높인 경험'
    },
    {
      before: '다른 산업에서 쌓은 경력',
      after: '새로운 업종에서도 활용할 수 있는 직무 역량'
    }
  ];

  // 05. 60분 진행 과정 (01~04)
  const processSteps = [
    {
      step: '01',
      resultLabel: '현재 문제',
      title: '지금까지의 지원 방향을 살펴봅니다',
      description:
        '지원 회사·직무와 현재 막히는 부분을 확인하고 반복해서 떨어지는 이유를 짚어봅니다.'
    },
    {
      step: '02',
      resultLabel: '기업의 기준',
      title: '목표 기업이 원하는 사람을 찾습니다',
      description:
        '공고 문구를 넘어 실제 직무와 기업이 필요로 하는 기준을 함께 확인합니다.'
    },
    {
      step: '03',
      resultLabel: '사용할 경험',
      title: '경험을 다시 해석합니다',
      description:
        '지금까지의 경험 중 무엇을 강조하고 덜어낼지, 어떤 순서로 보여줄지 결정합니다.'
    },
    {
      step: '04',
      resultLabel: '나를 설명할 한 문장',
      title: '나를 설명할 한 문장을 만듭니다',
      description:
        '이력서·자소서·면접에서 공통으로 사용할 지원 방향과 핵심 문장을 정리합니다.'
    }
  ];

  // 06. 개인별 리포지셔닝 리포트 항목 5개
  const reportItems = [
    {
      num: '01',
      title: '현재 문제 진단',
      example: '단순 업무 나열 위주의 서류 구성에서 반복 탈락이 발생하는 원인을 짚어냅니다.'
    },
    {
      num: '02',
      title: '추천 지원 방향',
      example: '보유한 문제 해결 경험이 가장 잘 읽히는 목표 직무와 지원 우선순위를 제안합니다.'
    },
    {
      num: '03',
      title: '나를 설명할 한 문장',
      example: '이력서 상단과 자기소개서·면접 첫 답변에 공통으로 사용할 한 줄 정의를 정리합니다.'
    },
    {
      num: '04',
      title: '활용할 경험과 표현',
      example: '앞에 배치할 핵심 경험과 덜어낼 이력을 구분하고 직무 기준의 문장으로 바꿉니다.'
    },
    {
      num: '05',
      title: '다음 7일 우선순위',
      example: '상담 직후 일주일 안에 가장 먼저 수정해야 할 서류 항목과 행동 순서를 안내합니다.'
    }
  ];

  // 07. 상품 구조 (메인 1:1 밀착 리포지셔닝 + DEEP DIVE 자소서·포트폴리오)
  const programChoices = [
    {
      isMain: true,
      badge: '방향이 막혔을 때',
      subBadge: '기본 컨설팅',
      title: '1:1 밀착 리포지셔닝 컨설팅',
      scope: '이력서·경력기술서 + 목표 공고 1건 집중 점검',
      points: ['목표 직무', '강점 한 줄', '지원 순서']
    },
    {
      isMain: false,
      badge: '서류가 막혔을 때',
      subBadge: 'DEEP DIVE 컨설팅',
      title: '자소서 DEEP DIVE',
      scope: '공고 1건 + 자소서 최대 3문항 집중 점검',
      points: ['질문 의도', '주장과 근거', '입사 후 기여']
    },
    {
      isMain: false,
      badge: '포트폴리오가 막혔을 때',
      subBadge: 'DEEP DIVE 컨설팅',
      title: '포트폴리오 DEEP DIVE',
      scope: '공고 1건 + 대표 프로젝트 최대 3건 집중 점검',
      points: ['첫 화면', '프로젝트 순서', '역할과 결과']
    }
  ];

  // 09. 실제 후기 3개 (출처 및 마스킹 아이디 포함)
  const reviewQuotes = [
    {
      tag: '서류 합격률 변화',
      quote: '“서류 합격률이 10%에서 70%로 증가했습니다.”',
      source: '리클 1기 수강생 · tmd*********'
    },
    {
      tag: '면접·최종 합격',
      quote: '“2주 만에 면접 5개, 최종 2곳에 합격했습니다.”',
      source: '리클 3기 수강생 · dus******'
    },
    {
      tag: '1:1 피드백 경험',
      quote:
        '“단순 첨삭이 아니라, 초안을 고치는 과정을 함께 보며 사고방식을 배울 수 있었습니다.”',
      source: '1:1 피드백 수강생 · tgv*****'
    }
  ];

  // 신청 후 6단계 흐름
  const sixStepsFlow = [
    '카카오톡 문의',
    '상품·일정 확정',
    '자료 제출',
    '60분 컨설팅',
    '리포트 전달',
    '한 달 방향 피드백'
  ];

  // 10. 가격 카드 3개 (오픈 기념가·취소선 제거, 최종 가격만 표시)
  const pricingCards: Array<{
    isMain: boolean;
    badge: string;
    name: string;
    description: string;
    price: string;
    features: string[];
    buttonText: string;
    ariaLabel: string;
    location: InquiryButtonLocation;
  }> = [
    {
      isMain: true,
      badge: '커리어 리포지셔닝',
      name: '커리어 1:1 밀착 리포지셔닝 컨설팅',
      description: '지원 방향과 내세울 경험을 함께 정리합니다.',
      price: '150,000원',
      features: [
        '사전 검토 (이력서·경력기술서 + 목표 공고 1건)',
        '온라인 60분 1:1 컨설팅 (방향·강점 한 줄 점검)',
        '개인별 리포지셔닝 리포트',
        '한 달 카톡 방향 피드백',
        '미사용 시간 보관 (30일 이내 1회)'
      ],
      buttonText: '1:1 컨설팅 신청하기',
      ariaLabel: '커리어 1:1 밀착 리포지셔닝 컨설팅 신청하기 (카카오톡 새 창 열림)',
      location: 'consulting_career_inquiry'
    },
    {
      isMain: false,
      badge: 'DEEP DIVE 컨설팅',
      name: '자소서 1:1 밀착 리포지셔닝 컨설팅',
      description: '문항별 질문 의도와 경험 근거 문단을 함께 정리합니다.',
      price: '150,000원',
      features: [
        '사전 검토 (공고 1건 + 자소서 최대 3문항 집중 점검)',
        '온라인 60분 1:1 컨설팅 (질문 의도·주장·근거 점검)',
        '개인별 리포지셔닝 리포트',
        '한 달 카톡 방향 피드백',
        '미사용 시간 보관 (30일 이내 1회)'
      ],
      buttonText: '자소서 컨설팅 신청하기',
      ariaLabel: '자소서 1:1 밀착 리포지셔닝 컨설팅 신청하기 (카카오톡 새 창 열림)',
      location: 'consulting_resume_inquiry'
    },
    {
      isMain: false,
      badge: 'DEEP DIVE 컨설팅',
      name: '포트폴리오 1:1 밀착 리포지셔닝 컨설팅',
      description: '첫 화면 문장과 프로젝트 순서·결과를 함께 정리합니다.',
      price: '200,000원',
      features: [
        '사전 검토 (공고 1건 + 대표 프로젝트 최대 3건 집중 점검)',
        '온라인 60분 1:1 컨설팅 (첫 화면·순서·역할과 결과 점검)',
        '개인별 리포지셔닝 리포트',
        '한 달 카톡 방향 피드백',
        '미사용 시간 보관 (30일 이내 1회)'
      ],
      buttonText: '포트폴리오 컨설팅 신청하기',
      ariaLabel: '포트폴리오 1:1 밀착 리포지셔닝 컨설팅 신청하기 (카카오톡 새 창 열림)',
      location: 'consulting_portfolio_inquiry'
    }
  ];

  // 11. FAQ 5개 (운영방침과 기준 일치)
  const faqList = [
    {
      q: '어떤 자료를 보내야 하나요?',
      a: '커리어는 이력서·경력기술서와 목표 공고 1건, 자소서는 목표 공고 1건과 최대 3문항, 포트폴리오는 목표 공고 1건과 대표 프로젝트 최대 3건을 보내주세요.'
    },
    {
      q: '리포트는 언제 받나요?',
      a: '컨설팅 내용을 정리한 뒤 전달하며, 구체적인 전달 일정은 상담 시 안내합니다.'
    },
    {
      q: '한 달 카톡 피드백 범위는?',
      a: '컨설팅에서 정한 방향과 선택 주제에 관한 질문 중심이며 전체 문서 대필·무제한 첨삭은 포함되지 않습니다.'
    },
    {
      q: '60분을 다 사용하지 못하면?',
      a: '남은 시간은 컨설팅 후 30일 이내 1회 예약하여 사용할 수 있으며, 타인 양도 및 현금 환급은 불가합니다.'
    },
    {
      q: '일정 변경과 환불은?',
      a: '일정 변경은 상담 전 카카오톡으로 문의해 주세요. 1:1 컨설팅 환불은 컨설팅 종료 시점부터 24시간 이내 요청 가능하며(문의 이메일: kjyoon0218@naver.com), 미사용 시간은 컨설팅 후 30일 이내 1회 예약 사용만 가능하고 타인 양도 및 현금 환급은 불가합니다.'
    }
  ];

  return (
    <div
      className="w-full bg-[#09090B] text-zinc-100 leading-relaxed selection:bg-[#FFD600] selection:text-[#09090B] overflow-x-hidden"
      style={{
        fontFamily: "Pretendard, 'Noto Sans KR', system-ui, -apple-system, sans-serif",
        wordBreak: 'keep-all'
      }}
    >
      {/* =====================================================================
          HERO. 기획자 J의 1:1 밀착 리포지셔닝 컨설팅
      ===================================================================== */}
      <section className="pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-[#09090B] border-b border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-[#121216] border border-zinc-800/90 p-6 sm:p-10 lg:p-14 shadow-2xl space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-5 max-w-3xl">
              {/* 상단 배지 */}
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[#FFD600] text-[11px] sm:text-xs font-extrabold tracking-wider">
                  1:1 REPOSITIONING CONSULTING
                </span>
              </div>

              {/* 메인 H1 */}
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.2] sm:leading-[1.15]">
                <span className="block">기획자 J의</span>
                <span className="block mt-1">
                  <span className="text-[#FFD600]">1:1 밀착 리포지셔닝</span> 컨설팅
                </span>
              </h1>

              {/* 핵심 요약 문장 */}
              <p className="text-sm sm:text-lg text-zinc-200 font-medium leading-relaxed">
                지금까지 쌓아온 경험을 다시 살펴보고, 기업이 당신을 선택할 이유로 정리해드립니다.
              </p>

              {/* 3칸 핵심 제공 바 (상시 신청 / 60분+리포트 / 30일 피드백) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between sm:flex-col sm:items-start gap-1">
                  <span className="text-[11px] font-bold text-zinc-400">진행 방식</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white">
                    상시 신청 · 1:1 예약제
                  </span>
                </div>
                <div className="px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between sm:flex-col sm:items-start gap-1">
                  <span className="text-[11px] font-bold text-zinc-400">본 상담 및 결과물</span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#FFD600]">
                    온라인 60분 + 개인 리포트
                  </span>
                </div>
                <div className="px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between sm:flex-col sm:items-start gap-1">
                  <span className="text-[11px] font-bold text-zinc-400">사후 관리</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white">
                    상담 후 30일 카톡 피드백
                  </span>
                </div>
              </div>

              {/* CTA 영역 */}
              <div className="pt-2 space-y-3">
                <p className="text-xs sm:text-sm text-zinc-200 font-semibold">
                  지금 당장 피드백이 필요하시다면, 1:1 밀착 컨설팅을 이용해보세요.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToSection('pricing-section')}
                    className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-4 rounded-xl bg-[#FFD600] hover:bg-[#f5cc00] text-[#09090B] font-extrabold text-sm sm:text-base transition shadow-lg cursor-pointer"
                  >
                    <span>내게 맞는 컨설팅 보기</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <a
                    href={KAKAO_CONSULTING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleKakaoInquiry(e, 'consulting_hero_inquiry')}
                    aria-label="카카오톡으로 문의하기 (카카오톡 새 창 열림)"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 font-bold text-sm sm:text-base transition cursor-pointer"
                  >
                    <span>카카오톡으로 문의하기</span>
                    <ExternalLink className="w-4 h-4 shrink-0 text-zinc-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          01. 인식의 경쟁 — 인사담당자의 인식 키비주얼 (가장 강한 첫 섹션)
      ===================================================================== */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#050507] text-white border-b border-zinc-900">
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          {/* 상단 메인 카피 */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="inline-block text-xs sm:text-sm font-extrabold text-[#FFD600] tracking-wider">
              01 · 인식의 경쟁
            </span>
            <p className="text-sm sm:text-lg font-bold text-zinc-300">
              취업의 경쟁자는 다른 지원자만이 아닙니다.
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-black text-white tracking-tight leading-[1.18]">
              진짜 경쟁자는
              <br className="sm:hidden" />{' '}
              <span className="text-[#FFD600]">인사담당자의 인식</span>입니다.
            </h2>
            <p className="text-sm sm:text-lg text-zinc-300 font-medium leading-relaxed pt-1">
              같은 경험도 어떤 사람으로 기억되느냐에 따라 결과는 달라집니다.
            </p>
          </div>

          {/* 인지과학형 키비주얼: 단정한 한 줄 옆얼굴 실루엣 + 정보 인입→경험 인식→핵심 인식→기억·판단 흐름 */}
          <div className="rounded-3xl bg-[#0D0D11] border border-zinc-800/80 p-5 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[11fr_9fr] gap-8 lg:gap-10 items-center">
              {/* 좌측(약 55%): 단정한 한 줄 사람 옆얼굴 실루엣 & 인지 경로 SVG */}
              <div className="flex flex-col items-center w-full">
                <div className="w-full max-w-[520px]">
                  <svg
                    viewBox="0 0 480 360"
                    className="w-full h-auto block"
                    role="img"
                    aria-label="지원자 정보 → 정보 인입 → 적합성 판단 → 핵심 인식 → 기억·선택으로 이어지는 지원자의 정보가 인식되는 4단계 도식"
                  >
                    <defs>
                      <marker
                        id="yellowArrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="5.5"
                        markerHeight="5.5"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#FFD600" />
                      </marker>
                    </defs>

                    {/* 1. 단정한 한 줄 옆얼굴 실루엣 (밝기·두께를 낮춘 절제된 단일 윤곽선) */}
                    <path
                      d="M 218 338 C 218 318 220 296 220 282 L 184 280 C 172 280 166 273 167 262 C 168 254 164 249 164 244 C 164 239 169 235 168 229 C 167 223 169 218 164 215 L 150 206 C 145 202 145 196 150 191 L 170 164 C 173 158 172 148 173 136 C 175 84 222 42 292 42 C 368 42 420 92 420 164 C 420 214 398 254 368 278 C 358 294 358 316 364 338"
                      fill="#121218"
                      stroke="#6E6E7A"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* 두뇌 내부 영역을 암시하는 아주 절제된 단일 실루엣 (불필요한 점선·격자 제거) */}
                    <path
                      d="M 196 156 C 196 102 238 64 298 64 C 358 64 398 104 398 162 C 398 210 366 246 318 252 C 250 252 196 214 196 156 Z"
                      fill="#15151E"
                      stroke="#272733"
                      strokeWidth="1"
                    />

                    {/* 2. 외부 '지원자 정보' (01 정보 인입) 카드 -> 눈으로 들어오는 경로 */}
                    <rect
                      x="12"
                      y="138"
                      width="102"
                      height="48"
                      rx="8"
                      fill="#14141C"
                      stroke="#3F3F4E"
                      strokeWidth="1.2"
                    />
                    <text x="63" y="158" textAnchor="middle" fill="#FFD600" fontSize="11" fontWeight="800">
                      01 정보 인입
                    </text>
                    <text x="63" y="176" textAnchor="middle" fill="#F4F4F5" fontSize="12.5" fontWeight="800">
                      지원자 정보
                    </text>

                    {/* 지원자 정보 -> 정보 인입 화살표 */}
                    <line
                      x1="114"
                      y1="162"
                      x2="178"
                      y2="162"
                      stroke="#FFD600"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                      markerEnd="url(#yellowArrow)"
                    />

                    {/* 얼굴의 눈 위치 포인트 (텍스트 '눈' 제거, 도형만 유지) */}
                    <circle cx="190" cy="162" r="8" fill="#FFD600" opacity="0.18" />
                    <circle cx="190" cy="162" r="4" fill="#FFD600" />

                    {/* 3. 정보 인입 -> 머릿속 '02 적합성 판단' -> 중앙 '03 핵심 인식' 한 방향 노란 선/화살표 */}
                    <path
                      d="M 196 160 C 210 146 220 126 232 116"
                      fill="none"
                      stroke="#FFD600"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="232" cy="116" r="4" fill="#0D0D11" stroke="#FFD600" strokeWidth="2" />
                    <text x="244" y="108" fill="#FFD600" fontSize="11" fontWeight="800">
                      02 적합성 판단
                    </text>
                    <text x="244" y="124" fill="#E4E4E7" fontSize="10" fontWeight="700">
                      인입된 정보를 바탕으로 직무 적합성 판단
                    </text>

                    {/* 적합성 판단 -> 중앙 핵심 인식 카드로 이어지는 화살표 */}
                    <path
                      d="M 232 121 C 244 136 268 146 292 152"
                      fill="none"
                      stroke="#FFD600"
                      strokeWidth="2"
                      strokeLinecap="round"
                      markerEnd="url(#yellowArrow)"
                    />

                    {/* 4. 뇌 중앙의 노란 핵심 카드: 03 핵심 인식 */}
                    <rect
                      x="198"
                      y="158"
                      width="202"
                      height="52"
                      rx="10"
                      fill="#FFD600"
                    />
                    <text
                      x="299"
                      y="177"
                      textAnchor="middle"
                      fill="#09090B"
                      fontSize="11"
                      fontWeight="900"
                    >
                      03 핵심 인식
                    </text>
                    <text
                      x="299"
                      y="197"
                      textAnchor="middle"
                      fill="#09090B"
                      fontSize="11.5"
                      fontWeight="900"
                    >
                      인사담당자의 머릿속에 각인되는 핵심 인식
                    </text>

                    {/* 5. 핵심 인식 -> 04 기억·선택 노드로 이어지는 화살표 */}
                    <line
                      x1="299"
                      y1="210"
                      x2="299"
                      y2="246"
                      stroke="#FFD600"
                      strokeWidth="2.2"
                      markerEnd="url(#yellowArrow)"
                    />
                    <circle cx="299" cy="254" r="4.5" fill="#FFD600" />

                    <rect
                      x="224"
                      y="264"
                      width="150"
                      height="46"
                      rx="8"
                      fill="#14141C"
                      stroke="#3F3F4E"
                      strokeWidth="1.2"
                    />
                    <text x="299" y="283" textAnchor="middle" fill="#FFD600" fontSize="11" fontWeight="800">
                      04 기억·선택
                    </text>
                    <text x="299" y="301" textAnchor="middle" fill="#FFFFFF" fontSize="12.5" fontWeight="800">
                      기억되는 지원자
                    </text>
                  </svg>
                </div>

                {/* 하단 요약 흐름: 지원자 정보 → 정보 인입 → 적합성 판단 → 핵심 인식 → 기억·선택 */}
                <div className="mt-3 sm:mt-4 inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm font-bold">
                  <span className="text-zinc-300">지원자 정보</span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-zinc-300">정보 인입</span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-zinc-300">적합성 판단</span>
                  <span className="text-zinc-600">→</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#FFD600] text-[#09090B] font-black">
                    핵심 인식
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span className="text-white font-extrabold">기억·선택</span>
                </div>
              </div>

              {/* 우측(약 45%): 인지 흐름 4단계 설명 리스트 (데스크톱 우측 / 모바일 하단 수직 적층) */}
              <div className="space-y-3 w-full">
                <div className="pb-1">
                  <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">
                    RECRUITER COGNITIVE FLOW
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                    지원자의 정보가 인식되는 4단계
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {cognitiveStages.map((stage) => (
                    <div
                      key={stage.step}
                      className={`p-4 sm:p-5 rounded-2xl transition ${
                        stage.isHighlight
                          ? 'bg-[#FFD600] text-[#09090B] shadow-lg'
                          : 'bg-[#14141A] border border-zinc-800/90 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-black tabular-nums ${
                            stage.isHighlight ? 'text-[#09090B]' : 'text-[#FFD600]'
                          }`}
                        >
                          {stage.step}
                        </span>
                        <span
                          className={`text-base sm:text-lg font-black ${
                            stage.isHighlight ? 'text-[#09090B]' : 'text-white'
                          }`}
                        >
                          {stage.label}
                        </span>
                      </div>
                      <p
                        className={`text-sm sm:text-base leading-snug ${
                          stage.isHighlight
                            ? 'text-[#09090B] font-black'
                            : 'text-zinc-200 font-bold'
                        }`}
                      >
                        {stage.question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 하단 결론 문장 */}
          <div className="text-center max-w-3xl mx-auto pt-2">
            <p className="text-lg sm:text-2xl lg:text-[26px] font-black text-white tracking-tight leading-snug break-keep">
              기획자 J의 1:1 밀착 리포지셔닝 컨설팅에서
              <br className="hidden sm:inline" />{' '}
              <span className="text-[#FFD600]">인사담당자의 인식을 사로잡을 전략</span>을 가르쳐드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          02. 문제 인식 (Light Section)
      ===================================================================== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F6F7F9] text-[#17181C] border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3 max-w-3xl text-center mx-auto">
            <span className="inline-block text-xs sm:text-sm font-extrabold text-[#D97706]">
              02 · 문제 인식
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-black text-[#17181C] tracking-tight leading-[1.25]">
              스펙이 부족해서가 아니라,
              <br />
              <span className="bg-[#FFD600]/60 px-1.5 rounded">인사담당자에게 제대로 인식되지 못해서</span> 떨어질 수 있습니다.
            </h2>
            <p className="text-sm sm:text-base text-[#555B65] font-medium leading-relaxed pt-1">
              스펙을 더 쌓기 전에, 지금 가진 경험이 어떻게 인식되고 있는지를 파악해야 합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {coreCriteria.map((item) => (
              <div
                key={item.num}
                className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-2"
              >
                <span className="text-xs font-black text-[#D97706] tabular-nums">
                  {item.num}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#17181C]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#555B65] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          03. 이런 고민이라면 (Light Section)
      ===================================================================== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white text-[#17181C] border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2 max-w-2xl text-center mx-auto">
            <span className="inline-block text-xs sm:text-sm font-extrabold text-[#D97706]">
              03 · 상담이 필요한 순간
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17181C] tracking-tight">
              이런 고민이 있다면 지금 점검해야 합니다
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {concernsList.map((concern, index) => (
              <div
                key={concern}
                className="p-6 rounded-2xl bg-[#F6F7F9] border border-[#E5E7EB] space-y-2.5"
              >
                <span className="inline-block text-xs font-black text-[#17181C] bg-[#FFD600] rounded-md px-2 py-0.5 tabular-nums">
                  0{index + 1}
                </span>
                <p className="text-sm sm:text-base font-extrabold text-[#17181C] leading-snug">
                  {concern}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          04. 1:1 컨설팅에서 바뀌는 것 (Before → After) (Dark Section)
      ===================================================================== */}
      <section className="py-16 sm:py-22 px-4 sm:px-6 lg:px-8 bg-[#09090B] border-b border-zinc-900">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2 max-w-2xl text-center mx-auto">
            <span className="inline-block text-xs sm:text-sm font-bold text-[#FFD600]">
              04 · 상담 전후 변화
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              스펙은 바꾸지 않습니다.{' '}
              <span className="text-[#FFD600]">읽히는 방식을 바꿉니다.</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              했던 일을 그대로 나열하는 대신 기업이 필요로 하는 역량으로 다시 설명합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {beforeAfterCases.map((item) => (
              <div
                key={item.before}
                className="rounded-2xl bg-[#121216] border border-zinc-800/90 p-6 space-y-3.5"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400">
                    상담 전 · 단순 나열
                  </span>
                  <p className="text-sm sm:text-base font-medium text-zinc-300">
                    {item.before}
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-800/90 space-y-1">
                  <span className="text-[11px] font-extrabold text-[#FFD600]">
                    상담 후 · 리포지셔닝
                  </span>
                  <p className="text-base sm:text-lg font-extrabold text-white leading-snug">
                    → {item.after}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          05. 60분 진행 과정 (01~04) (Light Section)
      ===================================================================== */}
      <section className="py-16 sm:py-22 px-4 sm:px-6 lg:px-8 bg-[#F6F7F9] text-[#17181C] border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2 max-w-3xl text-center mx-auto">
            <span className="inline-block text-xs sm:text-sm font-extrabold text-[#D97706]">
              05 · 60분 진행 과정
            </span>
            <h2 className="text-xl sm:text-3xl lg:text-[34px] font-black text-[#17181C] tracking-tight leading-[1.3]">
              기획자 J가 이끌어주는{' '}
              <span className="bg-[#FFD600]/60 px-1.5 rounded">1:1 밀착 리포지셔닝 컨설팅</span>으로
              <br />
              60분 동안 최적의 방향성을 점검해보세요.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {processSteps.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#17181C] tabular-nums leading-none">
                    {item.step}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-[#FFD600]/40 text-[#17181C]">
                    결과: {item.resultLabel}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#17181C] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555B65] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          06. 상담 전후 제공 내용 + 개인 리포트 (Dark Section + White Report Box)
      ===================================================================== */}
      <section
        id="report-section"
        className="py-16 sm:py-22 px-4 sm:px-6 lg:px-8 bg-[#09090B] border-b border-zinc-900"
      >
        <div className="max-w-5xl mx-auto space-y-5">
          <div className="rounded-3xl bg-white text-[#17181C] p-6 sm:p-10 shadow-2xl space-y-7">
            <div className="flex flex-col items-center text-center space-y-5">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-block text-xs sm:text-sm font-extrabold text-[#D97706]">
                  06 · 개인별 리포지셔닝 리포트
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#17181C] tracking-tight">
                  컨설팅이 끝나면 리포트로 정리해드립니다
                </h2>
                <p className="text-xs sm:text-sm text-[#555B65] leading-relaxed">
                  상담을 듣고 끝나는 것이 아니라, 지원할 때마다 다시 꺼내볼 나만의 기준을 갖게 됩니다.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenReportModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#17181C] hover:bg-[#2A2D34] text-white font-extrabold text-xs sm:text-sm transition cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#FFD600] shrink-0" />
                <span>리포트 구성 예시 보기</span>
              </button>
            </div>

            {/* 리포트 항목 5개 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {reportItems.map((item) => (
                <div
                  key={item.num}
                  className="p-4 rounded-2xl bg-[#F6F7F9] border border-[#E5E7EB] space-y-1"
                >
                  <span className="block text-xs font-extrabold text-[#D97706] tabular-nums">
                    {item.num}
                  </span>
                  <span className="block text-sm font-bold text-[#17181C] leading-snug">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 사후관리 안내 카드 2개 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#121216] border border-zinc-800/90 space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                한 달 카톡 방향 피드백
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                평일 기준 24시간 이내 답변하며, 선택한 주제와 컨설팅에서 정한 방향에 대한 질문 중심으로 진행합니다. 전체 문서 대필·무제한 첨삭은 별도입니다.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#121216] border border-zinc-800/90 space-y-1.5">
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                미사용 시간 보관 (30일 이내 1회)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                60분을 다 쓰지 못하면 남은 시간을 컨설팅 후 30일 이내 1회 예약해 사용할 수 있습니다. 타인 양도 및 현금 환급은 불가합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          07. DEEP DIVE 자소서·포트폴리오 (상품 위계 안내 · 가격 미표시) (Light Section)
      ===================================================================== */}
      <section
        id="consulting-programs"
        className="py-16 sm:py-22 px-4 sm:px-6 lg:px-8 bg-[#F6F7F9] text-[#17181C] border-b border-[#E5E7EB]"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2.5 max-w-3xl text-center mx-auto">
            <span className="inline-block text-xs sm:text-sm font-extrabold text-[#D97706]">
              07 · 컨설팅 구성과 DEEP DIVE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#17181C] tracking-tight">
              먼저 방향을 잡고, 필요한 문서를 더 깊게 봅니다.
            </h2>
            <p className="text-sm sm:text-base text-[#555B65] leading-relaxed">
              고민에 따라 세 가지 컨설팅 중 하나를 선택합니다. 방향이 막혔다면 커리어, 서류가 막혔다면 자소서, 결과물이 막혔다면 포트폴리오를 집중적으로 봅니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            {programChoices.map((choice) => (
              <div
                key={choice.title}
                className={`rounded-2xl bg-white p-6 flex flex-col justify-between space-y-5 shadow-sm ${
                  choice.isMain
                    ? 'border-2 border-[#17181C]'
                    : 'border border-[#E5E7EB]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-block text-xs font-extrabold px-2.5 py-1 rounded-md bg-[#FFD600]/40 text-[#17181C]">
                      {choice.badge}
                    </span>
                    <span className="text-[11px] font-bold text-[#7C818A]">
                      {choice.subBadge}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#17181C] tracking-tight">
                    {choice.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#555B65] leading-relaxed">
                    {choice.scope}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap gap-1.5">
                  {choice.points.map((pt) => (
                    <span
                      key={pt}
                      className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#F6F7F9] text-[#17181C] border border-[#E5E7EB]"
                    >
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          08. 부트캠프와 1:1 컨설팅의 역할 비교 (Dark Section)
      ===================================================================== */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#09090B] border-b border-zinc-900">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="inline-block text-xs sm:text-sm font-bold text-[#FFD600]">
              08 · 프로그램 비교
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              부트캠프와 무엇이 다른가요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#121216] border border-zinc-800/90 space-y-1.5">
              <span className="inline-block text-xs font-bold text-zinc-400">
                리포지셔닝 부트캠프
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                정해진 기간 동안 방법을 배우고 반복 연습
              </h3>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#121216] border border-[#FFD600]/60 space-y-1.5">
              <span className="inline-block text-xs font-bold text-[#FFD600]">
                1:1 밀착 리포지셔닝 컨설팅
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                지금 막힌 문제를 개인 자료와 함께 바로 점검
              </h3>
            </div>
          </div>

          <p className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs sm:text-sm text-zinc-200 font-bold max-w-3xl mx-auto">
            방법을 배우고 연습하려면 <span className="text-white">부트캠프</span>, 지금 필요한 답을 빠르게 찾으려면 <span className="text-[#FFD600]">1:1 컨설팅</span>.
          </p>
        </div>
      </section>

      {/* =====================================================================
          09. 실제 후기 + 기획자 J가 직접 진행한다는 신뢰 요소 (Light Section)
      ===================================================================== */}
      <section className="py-16 sm:py-22 px-4 sm:px-6 lg:px-8 bg-[#F6F7F9] text-[#17181C] border-b border-[#E5E7EB]">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* 기획자 J 소개 블록 */}
          <div className="rounded-3xl bg-white border border-[#E5E7EB] p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <span className="inline-block text-xs font-extrabold text-[#D97706]">
                09 · 컨설턴트 소개
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-[#17181C] tracking-tight">
                기획자 J가 직접 진행합니다
              </h2>
              <div className="space-y-1 text-xs sm:text-sm text-[#555B65] leading-relaxed font-medium">
                <p>
                  대기업과 광고대행사에서 사람과 브랜드가 선택되는 방식을 기획해왔습니다.
                </p>
                <p>
                  이력서=제품, 자소서=브랜딩, 면접=세일즈 관점으로 지원자의 경험을 기업이 선택할 이유로 정리합니다.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {['이력서 = 제품', '자소서 = 브랜딩', '면접 = 세일즈'].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-2 rounded-xl bg-[#17181C] text-[#FFD600] text-xs font-extrabold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 실제 후기 3개 */}
          <div className="space-y-5">
            <div className="space-y-1.5 text-center mx-auto max-w-2xl">
              <span className="inline-block text-xs sm:text-sm font-extrabold text-[#D97706]">
                실제 수강생 변화
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#17181C] tracking-tight">
                리포지셔닝 방식으로 달라진 결과
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviewQuotes.map((item) => (
                <div
                  key={item.quote}
                  className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <span className="inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded bg-[#FFD600]/40 text-[#17181C]">
                      {item.tag}
                    </span>
                    <p className="text-sm sm:text-base font-extrabold text-[#17181C] leading-snug">
                      {item.quote}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-[#7C818A] pt-2 border-t border-[#E5E7EB]">
                    {item.source}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#7C818A] text-center">
              * 리포지셔닝 프로그램 및 1:1 피드백 경험 후기이며, 개인에 따라 결과는 달라질 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          10. 가격 및 신청 (페이지 마지막 가격 섹션 · 최종 가격만 표시) (Dark Section)
      ===================================================================== */}
      <section
        id="pricing-section"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#09090B] border-b border-zinc-900 scroll-mt-16"
      >
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
          {/* 섹션 헤더 */}
          <div className="space-y-2 max-w-2xl text-center mx-auto">
            <span className="inline-block text-xs sm:text-sm font-bold text-[#FFD600]">
              10 · 상담 프로그램 및 신청
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              지금 필요한 상담을 선택해 주세요
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              지원 일정과 점검 범위에 맞춰 선택할 수 있습니다.
            </p>
          </div>

          {/* 신청 후 6단계 한 줄 프로세스 */}
          <div className="rounded-2xl bg-[#121216] border border-zinc-800/90 p-4 sm:p-5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold text-zinc-100">
              {sixStepsFlow.map((step, i) => (
                <React.Fragment key={step}>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-[#FFD600] font-extrabold tabular-nums">
                      0{i + 1}
                    </span>
                    <span>{step}</span>
                  </span>
                  {i < sixStepsFlow.length - 1 && (
                    <span className="text-zinc-500 font-bold">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-zinc-400 text-center">
              * 구체적인 리포트 전달 일정은 상담 시 안내합니다.
            </p>
          </div>

          {/* 가로 3개 흰색 가격 카드 (오픈 기념가·취소선 완전 삭제) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
            {pricingCards.map((card) => (
              <div
                key={card.name}
                className={`rounded-3xl bg-white text-[#17181C] p-6 sm:p-8 flex flex-col justify-between space-y-6 transition ${
                  card.isMain
                    ? 'border-2 border-[#FFD600] shadow-2xl'
                    : 'border border-[#E5E7EB] shadow-lg'
                }`}
              >
                <div className="space-y-4">
                  {/* 상단 배지 */}
                  <div>
                    <span
                      className={`inline-block text-xs font-extrabold px-3 py-1 rounded-md ${
                        card.isMain
                          ? 'bg-[#FFD600] text-[#17181C]'
                          : 'bg-[#F6F7F9] text-[#555B65] border border-[#E5E7EB]'
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  {/* 상품명 & 설명 */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg sm:text-2xl font-extrabold text-[#17181C] tracking-tight leading-snug">
                      {card.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555B65] leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* 최종 가격 단독 표시 */}
                  <div className="pt-1 pb-4 border-b border-[#E5E7EB]">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#17181C] tabular-nums tracking-tight">
                      {card.price}
                    </span>
                  </div>

                  {/* 체크 리스트 5개 */}
                  <ul className="space-y-2.5 pt-1">
                    {card.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#17181C] font-medium leading-snug"
                      >
                        <Check className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 하단 신청 버튼 */}
                <a
                  href={KAKAO_CONSULTING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleKakaoInquiry(e, card.location)}
                  aria-label={card.ariaLabel}
                  className={`w-full py-4 px-5 rounded-xl font-extrabold text-sm sm:text-base transition flex items-center justify-center gap-2 cursor-pointer ${
                    card.isMain
                      ? 'bg-[#FFD600] hover:bg-[#f5cc00] text-[#17181C] shadow-sm'
                      : 'bg-[#17181C] hover:bg-[#2A2D34] text-white'
                  }`}
                >
                  <span>{card.buttonText}</span>
                  <ExternalLink
                    className={`w-4 h-4 shrink-0 ${
                      card.isMain ? 'text-[#17181C]' : 'text-zinc-300'
                    }`}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          11. FAQ / 운영 안내 & 마지막 문의 CTA (Dark Section)
      ===================================================================== */}
      <section className="py-16 sm:py-22 px-4 sm:px-6 lg:px-8 bg-[#0C0C10]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-6">
            <div className="space-y-2 text-center mx-auto max-w-2xl">
              <span className="inline-block text-xs sm:text-sm font-bold text-[#FFD600]">
                11 · FAQ 및 운영 안내
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                신청 전 많이 묻는 질문
              </h2>
            </div>

            <div className="space-y-3">
              {faqList.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={item.q}
                    className="rounded-2xl bg-[#121216] border border-zinc-800/90 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      className="w-full p-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-900/50 transition"
                    >
                      <span className="text-sm sm:text-base font-extrabold text-white leading-snug">
                        Q{idx + 1}. {item.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#FFD600] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 마지막 CTA 박스 */}
          <div className="rounded-3xl bg-[#121216] border border-zinc-800 p-6 sm:p-10 text-center space-y-5 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                더 많은 스펙을 만들기 전에 지금 가진 경험부터 정리해보세요.
              </h3>
              <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-xl mx-auto">
                어떤 상담이 맞을지 고민된다면 카카오톡으로 현재 상황을 편하게 남겨주세요.
              </p>
            </div>

            <div>
              <a
                href={KAKAO_CONSULTING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleKakaoInquiry(e, 'consulting_bottom_inquiry')}
                aria-label="카카오톡으로 상담 신청하기 (카카오톡 새 창 열림)"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FFD600] hover:bg-[#f5cc00] text-[#09090B] font-extrabold text-sm sm:text-base transition shadow-lg cursor-pointer"
              >
                <span>카카오톡으로 상담 신청하기</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          리포트 구성 예시 모달 (접근성·ESC·배경 클릭 닫기 지원)
      ===================================================================== */}
      {isReportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleCloseReportModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-example-modal-title"
            className="w-full max-w-2xl rounded-3xl bg-white text-[#17181C] p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-4">
              <div className="space-y-1">
                <span className="inline-block text-xs font-extrabold text-[#D97706]">
                  REPORT STRUCTURE PREVIEW
                </span>
                <h3
                  id="report-example-modal-title"
                  className="text-lg sm:text-2xl font-black text-[#17181C] tracking-tight"
                >
                  개인별 리포지셔닝 리포트 구성 예시
                </h3>
                <p className="text-xs text-[#7C818A] font-medium">
                  개인별 상담 내용에 따라 구성은 달라집니다.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseReportModal}
                aria-label="리포트 구성 예시 모달 닫기"
                className="p-2 rounded-xl bg-[#F6F7F9] hover:bg-[#E5E7EB] text-[#17181C] transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {reportItems.map((item) => (
                <div
                  key={item.num}
                  className="p-4 rounded-2xl bg-[#F6F7F9] border border-[#E5E7EB] space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#D97706] tabular-nums">
                      {item.num}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#17181C]">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#555B65] leading-relaxed">
                    {item.example}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E5E7EB]">
              <span className="text-xs text-[#7C818A]">
                * 상담 종료 후 개별 문서 형태로 정리해 전달합니다.
              </span>
              <button
                type="button"
                onClick={handleCloseReportModal}
                className="px-5 py-2.5 rounded-xl bg-[#17181C] hover:bg-[#2A2D34] text-white text-xs sm:text-sm font-extrabold transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
