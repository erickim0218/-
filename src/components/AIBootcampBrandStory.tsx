import React from 'react';
import painPointImg from '../assets/images/bootcamp-story/pain-point.png';
import aiToolsStrategyImg from '../assets/images/bootcamp-story/ai-tools-strategy.png';
import strategyPyramidImg from '../assets/images/bootcamp-story/strategy-pyramid.png';
import beforeAfterImg from '../assets/images/bootcamp-story/before-after.png';
import threeWeekRoadmapImg from '../assets/images/bootcamp-story/three-week-roadmap.png';
import finalCtaImg from '../assets/images/bootcamp-story/final-cta.png';

interface VisualFrameProps {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
}

const VisualFrame: React.FC<VisualFrameProps> = ({ src, alt, eager = false, className = '' }) => (
  <figure className={`overflow-hidden rounded-2xl border border-white/10 bg-[#111721] shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:rounded-3xl ${className}`}>
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      className="block h-auto w-full"
    />
  </figure>
);

export const AIBootcampBrandStory: React.FC = () => (
  <div className="bg-[#09090B] text-white">
    <section className="border-b border-zinc-800 px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <VisualFrame
          src={painPointImg}
          alt="열심히 준비해도 결과가 제자리인 이유: AI로 티가 나는 자기소개서, 계속 꼬이는 면접 질문, 달라지지 않는 이력서"
          eager
        />
      </div>
    </section>

    <section className="border-b border-zinc-800 px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-8 sm:space-y-12">
        <VisualFrame
          src={aiToolsStrategyImg}
          alt="ChatGPT, Gemini, Claude는 누구나 쓸 수 있는 도구입니다. 결과를 만드는 차별화는 취업 리포지셔닝 전략입니다."
        />

        <div className="mx-auto max-w-4xl border-y border-zinc-700 py-8 text-center sm:py-12">
          <p className="text-2xl font-black leading-snug tracking-[-0.03em] sm:text-4xl">
            스펙은 바꾸지 않습니다.<br />
            <span className="text-[#FFD600]">읽히는 방식을 바꿉니다.</span>
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-300 sm:text-xl sm:leading-9">
            당신이 해온 일에서 판단과 성과를 찾아<br className="hidden sm:block" />
            당신만 말할 수 있는 스토리로 만듭니다.
          </p>
        </div>

        <VisualFrame
          src={strategyPyramidImg}
          alt="일반적인 취업전략과 AI를 활용한 취업전략 위에 남들이 따라 할 수 없는 나만의 이야기를 쌓아 완성하는 리포지셔닝 전략 피라미드"
        />
      </div>
    </section>

    <section className="border-b border-zinc-800 bg-[#0D0D10] px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl space-y-8 sm:space-y-12">
        <VisualFrame
          src={beforeAfterImg}
          alt="평범한 경험과 부족한 구체성, 기업의 니즈와 연결되지 않은 자기소개서를 기업이 원하는 역량과 설득력 있는 스토리, 면접까지 이어지는 핵심 메시지로 바꾸는 전후 비교"
        />

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black tracking-[0.16em] text-[#FFD600]">서류에서 주장하고, 면접에서 증명합니다</p>
          <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.035em] sm:text-4xl">
            기업이 당신을 선택할 이유.<br />
            <span className="text-zinc-400">그 이유가 하나로 이어져야 합니다.</span>
          </h2>
        </div>

        <VisualFrame
          src={threeWeekRoadmapImg}
          alt="단 3주 동안 자소서 리포지셔닝, 면접 리포지셔닝, 이직 리포지셔닝을 차례대로 완성하는 실전 로드맵"
        />
      </div>
    </section>

    <section className="px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <a href="#pricing-plans" aria-label="리포지셔닝 부트캠프 수강료와 신청 방법 확인하기" className="block transition duration-200 hover:-translate-y-1 hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD600]/60">
          <VisualFrame
            src={finalCtaImg}
            alt="당신을 뽑아야 할 이유를 3주 동안 함께 만드는 기획자J의 리포지셔닝 부트캠프"
          />
        </a>
        <p className="mt-4 text-center text-sm font-bold text-zinc-500">이미지를 누르면 수강 방법으로 이동합니다.</p>
      </div>
    </section>
  </div>
);
