import React, { useState, useEffect, useId } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { BRAND_INFO } from '../../data/mockData';
import { fetchSiteFeatures } from '../../lib/siteFeatures';

interface AboutViewProps {
  onTabChange?: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
  siteFeatures?: Record<string, boolean>;
}

export const AboutView: React.FC<AboutViewProps> = ({ onTabChange, siteFeatures }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isClassEnabled, setIsClassEnabled] = useState<boolean>(false);
  const [showClassTooltip, setShowClassTooltip] = useState<boolean>(false);
  const classTooltipId = useId();

  useEffect(() => {
    if (siteFeatures) {
      setIsClassEnabled(siteFeatures.repositioning_class === true);
    } else {
      fetchSiteFeatures().then(f => setIsClassEnabled(f.repositioning_class === true));
    }
  }, [siteFeatures]);

  const faqs = [
    {
      q: '자소서 첨삭 서비스와 리포지셔닝 부트캠프는 어떻게 다른가요?',
      a: '일반 자소서 첨삭은 작성해온 문장의 오탈자나 어색함을 교정하는 작업입니다. 브랜딩 취업 컨설턴트 J의 리포지셔닝은 지원자가 기업에 어떤 가치로 전달되어야 하는지 전략적 포지션부터 재설계합니다.'
    },
    {
      q: '직무 경험이 없거나 전공이 다른데도 가능한가요?',
      a: '가능합니다. 리포지셔닝의 핵심은 단순 경험 명칭이 아니라 경험 속에서 드러난 의사결정과 행동 패턴을 발굴하는 것입니다.'
    },
    {
      q: '온라인 강의만 들어도 자소서를 고칠 수 있나요?',
      a: '네, PRO 온라인 클래스에는 템플릿과 두괄식 프레임워크가 포함되어 있어 혼자서도 자소서를 완성할 수 있습니다.'
    },
    {
      q: '부트캠프 수강 기간과 방식은 어떻게 되나요?',
      a: '총 4주 과정으로 매주 VOD 수강과 과제 제출 후, 라이브 세션을 통해 1:1 정밀 피드백을 제공합니다.'
    }
  ];

  return (
    <div className="py-12 bg-[#09090B] text-white min-h-screen space-y-12 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-3 pt-4">
          <span className="font-black text-7xl italic text-[#FFD600] tracking-tighter select-none block">
            J
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">브랜딩 취업 컨설턴트 J</h1>
          <p className="text-sm sm:text-base text-zinc-300 font-semibold max-w-xl mx-auto">
            지원자의 경험을 기업이 선택할 가치로 정의합니다.
          </p>
        </div>

        {/* 3 Principles */}
        <div className="p-6 sm:p-8 bg-[#121215] border border-[#27272A] rounded-2xl space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              컨설팅 방향 3가지
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#17171C] border border-[#27272A] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#FFD600] block">01. 실행력</span>
              <h3 className="font-extrabold text-base text-white">명확한 방향 제시</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                취준생의 현재 상태를 분석하고 목표에 맞게 안착하도록 방향을 설계합니다.
              </p>
            </div>

            <div className="p-5 bg-[#17171C] border border-[#27272A] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#FFD600] block">02. 전략기술</span>
              <h3 className="font-extrabold text-base text-white">브랜딩 원리 적용</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                기업이 원하는 니즈를 발굴하고, 이에 맞춰 경험을 전략적으로 재구성합니다.
              </p>
            </div>

            <div className="p-5 bg-[#17171C] border border-[#27272A] rounded-xl space-y-2">
              <span className="text-xs font-bold text-[#FFD600] block">03. 1:1 피드백</span>
              <h3 className="font-extrabold text-base text-white">밀착 멘토링</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                지속적이고 구체적인 1:1 피드백으로 완성도 높은 결과를 만듭니다.
              </p>
            </div>
          </div>
        </div>

        {/* Background Details */}
        <div className="p-6 sm:p-8 bg-[#121215] border border-[#27272A] rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-white text-center">
            주요 경력
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BRAND_INFO.plannerJ.experienceLogos.map((exp, idx) => (
              <div key={idx} className="p-5 bg-[#17171C] border border-[#27272A] rounded-xl space-y-1">
                <span className="text-base font-black text-white block">{exp.name}</span>
                <span className="text-xs text-zinc-400 block">{exp.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-white text-center">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#121215] border border-[#27272A] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between hover:text-[#FFD600]"
                >
                  <span>Q. {faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#FFD600]" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-[#17171C] border-t border-[#27272A] text-xs text-zinc-300 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {onTabChange && (
          <div className="text-center pt-4 flex justify-center">
            {!isClassEnabled ? (
              <div
                className="relative cursor-not-allowed"
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
                  className="px-8 py-3.5 bg-zinc-800/90 text-zinc-400 border border-zinc-700/80 font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-not-allowed opacity-80"
                >
                  <span>리포지셔닝 클래스 둘러보기</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#18181B] text-amber-200/90 border border-amber-500/30 rounded">
                    오픈 준비 중
                  </span>
                </button>

                {showClassTooltip && (
                  <div
                    id={classTooltipId}
                    role="tooltip"
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[100] px-3.5 py-2 bg-zinc-900/95 text-zinc-100 text-xs font-medium rounded-xl border border-zinc-700/80 shadow-2xl whitespace-nowrap pointer-events-none animate-fade-in backdrop-blur-md"
                  >
                    리포지셔닝 클래스를 준비하고 있습니다. 곧 공개됩니다.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onTabChange('classes')}
                className="px-8 py-3.5 bg-[#FFD600] text-[#09090B] font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffe033] transition"
              >
                리포지셔닝 클래스 둘러보기
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
