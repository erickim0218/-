import React, { useState, useEffect, useId } from 'react';
import { ArrowRight, Anchor } from 'lucide-react';
import heroBg from '../../assets/images/anchor_embedded_chain_1786671818780.jpg';
import { fetchSiteFeatures } from '../../lib/siteFeatures';

interface PhilosophyViewProps {
  onTabChange: (tab: string) => void;
  siteFeatures?: Record<string, boolean>;
}

export const PhilosophyView: React.FC<PhilosophyViewProps> = ({ onTabChange, siteFeatures }) => {
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
  return (
    <div className="bg-[#09090B] text-white min-h-screen">
      
      {/* 1. Hero Section - Pure Dramatic Black & White Beach Anchor Image */}
      <section className="relative w-full overflow-hidden bg-[#09090B]">
        {/* Full display container for the Anchor with Chain image */}
        <div className="relative w-full h-[48vh] sm:h-[56vh] md:h-[62vh] min-h-[380px] max-h-[600px]">
          <img
            src={heroBg}
            alt="Anchor with Chain embedded in Sand"
            className="w-full h-full object-cover object-[center_35%] grayscale contrast-125 brightness-105"
          />
          {/* Natural subtle gradient overlays so image blends naturally while preserving anchor visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#09090B]" />
        </div>

        {/* Hero Title Container below the image */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 pt-4 pb-12 relative z-10">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            세상을 유리하게 바라보는 <br />
            <span className="text-[#FFD600]">관점의 기술, REPOSITIONING</span>
          </h1>

          <p className="text-lg sm:text-2xl font-bold text-zinc-100">
            본디 인식을 고쳐 새롭게 재인식하다.
          </p>

          <p className="text-sm sm:text-base text-zinc-300 font-medium max-w-xl mx-auto">
            같은 스펙, 같은 경험도 어떻게 인식되느냐에 따라 전혀 다른 결과를 만듭니다.
          </p>
        </div>
      </section>

      {/* 2. Main Text Content - Pure Typography Without Heavy Box Cards or Tags */}
      <section className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 py-8 space-y-16 text-zinc-200">
        
        {/* Anchoring Effect Definition */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight border-b border-zinc-800 pb-4 flex items-center gap-3">
            <Anchor className="w-8 h-8 text-[#FFD600] shrink-0" />
            <span>닻내림 효과 <span className="text-[#FFD600] text-xl font-normal">(Anchoring Effect)</span></span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-zinc-300">
            행동경제학의 <strong className="text-white font-bold">닻내림 효과(Anchoring Effect)</strong>는 배가 어느 지점에서 닻을 내릴 때 더 이상 움직이지 못하는 것처럼, 인간의 사고에 특정 기준을 제공하면 해당 기준을 기반으로 판단을 내리는 것을 말합니다.
          </p>

          <p className="text-lg sm:text-xl font-bold text-[#FFD600] py-2">
            모든 문제는 어떻게 "인식"하냐에 따라 그 해결 방법이 결정됩니다.
          </p>
        </div>

        {/* Problem & Perception */}
        <div className="space-y-6 border-l-2 border-[#FFD600] pl-6 py-2">
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            문제가 잘 해결되지 않을 때,<br />
            문제에 대한 인식을 바꾸지 않는다면, 그 해결 방법 또한 바뀌지 않습니다.
          </p>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            인식을 제대로 정의하면<br />
            어려운 문제가 쉬운 문제가 되기도하고<br />
            다수의 경쟁상대가 단일의 경쟁상대가 되기도 합니다.
          </p>
        </div>

        {/* HR Perception */}
        <div className="space-y-6">
          <h3 className="text-xl sm:text-3xl font-black text-white">
            취업을 앞둔 여러분의 경쟁상대는 누구인가요?
          </h3>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
            우리는 경쟁자를 다수의 취준생, 중고신입, 이직 준비생들이 아닌
          </p>

          <div className="space-y-2 py-4 text-base sm:text-lg font-semibold text-zinc-200">
            <p>우리 회사에는 어떤 인재가 필요한가,</p>
            <p>우리 회사에는 어떤 태도를 갖춘 사람이 필요한가,</p>
            <p>우리 회사에는 어떤 역량을 갖춘 사람이 필요한가를 고민하는</p>
            <p className="text-[#FFD600] font-black text-xl sm:text-2xl pt-2">
              오로지 "인사담당자의 인식"으로 규정해야 합니다.
            </p>
          </div>

          <p className="text-xl sm:text-2xl font-black text-white pt-2">
            여러분이 무너뜨려야하는 경쟁자는 <br />
            <span className="text-[#FFD600] underline underline-offset-8">"인사담당자의 인식"</span>입니다.
          </p>
        </div>

        {/* Reposition Agency Role */}
        <div className="space-y-6 text-base sm:text-lg leading-relaxed text-zinc-300 pt-4">
          <p>
            <strong className="text-white font-bold">REPOSITION</strong>은 인사담당자의 인식에 내가 적합한 인재로 정의되도록 기술과 방법을 가르치고 체화시켜 내 스펙이 더욱 핏하게, 명확하게 어필되도록 날카롭게 다듬어 드리는 스펙 리포지셔닝 대행사입니다.
          </p>

          <p>
            여러분의 스펙을 단순히 이력서의 정량적 스펙만 제시하는 것이 아닌 그들의 니즈에 부합하는 가장 적합한 스펙으로 전환 제시하여
          </p>

          <p className="text-lg sm:text-xl font-black text-white py-2">
            궁극적으로 <span className="text-[#FFD600]">앵커링 효과</span>를 통해 여러분의 스펙 기준으로 타지원자를 평가하게 만들어 여러분들에게 유리한 경쟁구도를 만들어 드립니다.
          </p>
        </div>

        {/* Closing */}
        <div className="pt-12 text-center space-y-6 border-t border-zinc-800">
          <div className="space-y-3">
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-widest">
              REPOSITIONING
            </h3>
            <p className="text-base sm:text-lg font-bold text-zinc-300">
              본디 인식을 고쳐 새롭게 재인식하다.
            </p>
            <p className="text-lg sm:text-2xl font-black text-[#FFD600] pt-2">
              세상을 더욱 유리하게 바라보는 방법 "사고의 재인식"<br />
              지금 그 차이를 경험해보세요.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
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
                리포지셔닝 클래스 수강하기
              </button>
            )}

            <button
              onClick={() => onTabChange('bootcamp')}
              className="px-8 py-4 bg-[#18181C] hover:bg-[#222228] text-white border border-zinc-700 font-extrabold text-base rounded-xl transition flex items-center justify-center gap-1.5"
            >
              부트캠프 신청하기
              <ArrowRight className="w-4 h-4 text-[#FFD600]" />
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
