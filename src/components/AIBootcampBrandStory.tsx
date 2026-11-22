import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const processSteps = [
  {
    label: 'BRANDING',
    title: '스펙을 다시 읽다',
    description: '내가 어떤 일을 했는지 나열하는 데서 멈추지 않고, 어떤 문제를 해결하는 사람인지 정의합니다.'
  },
  {
    label: 'STORYTELLING',
    title: '나만 말할 수 있는 이야기를 찾다',
    description: '경험 속 문제와 나의 판단, 행동, 성과를 파고들어 실제 근거가 있는 스토리를 만듭니다.'
  },
  {
    label: 'STRATEGY',
    title: '기업이 선택할 이유로 설계하다',
    description: '기업의 REAL NEEDS에 맞춰 무엇을 강조할지 결정하고, 자소서·이력서·면접을 하나의 주장으로 연결합니다.'
  }
];

const pyramidSteps = [
  {
    level: '상단',
    title: 'AI를 이기는 리포지셔닝',
    description: '나만의 판단과 성과를 브랜드·스토리·전략으로 연결해, 내가 직접 증명할 수 있는 선택 이유를 만듭니다.',
    desktopClass: 'w-[58%] bg-[#FFD600] text-zinc-950',
    mobileClass: 'border-[#FFD600] bg-[#FFD600] text-zinc-950'
  },
  {
    level: '중단',
    title: 'AI 활용 취업 준비',
    description: 'AI로 분석·작성·연습의 속도를 높입니다. 하지만 많은 사람이 같은 방식으로 활용한다면 이것만으로는 차별화하기 어렵습니다.',
    desktopClass: 'w-[78%] bg-zinc-800 text-white',
    mobileClass: 'border-zinc-700 bg-zinc-900 text-white'
  },
  {
    level: '하단',
    title: '일반적인 취업 준비',
    description: '스펙을 쌓고, 공고를 찾고, 서류와 면접을 준비합니다.',
    desktopClass: 'w-full bg-zinc-200 text-zinc-950',
    mobileClass: 'border-zinc-300 bg-zinc-100 text-zinc-950'
  }
];

export const AIBootcampBrandStory: React.FC = () => (
  <div className="bg-white text-zinc-950">
    <section className="border-b border-zinc-200 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black tracking-[0.18em] text-amber-700">AI 시대의 취업 준비</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] text-zinc-950 sm:text-5xl">
            AI가 만든 문장이 문제가 아닙니다.<br />
            <span className="text-amber-600">나만의 이유가 없는 것</span>이 문제입니다.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base font-medium leading-8 text-zinc-600 sm:text-lg">
            AI로 자료를 찾고 문장을 다듬는 일은 누구나 할 수 있습니다. 그래서 잘 쓴 문장만으로는 지원자를 구분하기 어렵습니다.
            필요한 것은 실제 경험에서 나온 나만의 주장과, 그 주장을 끝까지 뒷받침할 근거입니다.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            ['분석', 'AI로 기업과 직무를 빠르게 분석할 수 있습니다.'],
            ['작성', 'AI로 매끄러운 지원서를 빠르게 만들 수 있습니다.'],
            ['연습', 'AI로 예상 질문과 답변을 반복해서 준비할 수 있습니다.']
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <p className="text-sm font-black text-zinc-950">{title}</p>
              <p className="mt-3 text-base leading-7 text-zinc-600">{description}</p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl border-l-4 border-[#FFD600] bg-zinc-950 px-6 py-5 text-base font-bold leading-7 text-white sm:text-lg">
          AI는 준비의 속도를 높여줍니다. 하지만 기업이 왜 당신을 선택해야 하는지는 당신의 경험으로만 답할 수 있습니다.
        </p>
      </div>
    </section>

    <section className="border-b border-zinc-800 bg-[#0B0B0E] px-5 py-16 text-white sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-[#FFD600]">취업 준비의 3단계</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">도구의 차이가 아니라 전략의 차이</h2>
        </div>

        <div className="mx-auto mt-12 hidden max-w-4xl flex-col items-center gap-2 md:flex">
          {pyramidSteps.map((step, index) => (
            <article
              key={step.title}
              className={`${step.desktopClass} flex min-h-[145px] items-center justify-center px-16 py-7 text-center shadow-2xl`}
              style={{
                clipPath: index === 0
                  ? 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)'
                  : 'polygon(12% 0, 88% 0, 100% 100%, 0 100%)'
              }}
            >
              <div className="max-w-2xl">
                <p className="text-xs font-black tracking-[0.16em] opacity-70">{step.level}</p>
                <h3 className="mt-1 text-xl font-black">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm font-medium leading-6 opacity-80">{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-3 md:hidden">
          {pyramidSteps.map((step) => (
            <article key={step.title} className={`rounded-2xl border p-5 ${step.mobileClass}`}>
              <p className="text-xs font-black tracking-[0.14em] opacity-70">{step.level}</p>
              <h3 className="mt-1 text-lg font-black">{step.title}</h3>
              <p className="mt-2 text-[15px] font-medium leading-6 opacity-80">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#FFD600]/40 bg-[#FFD600]/10 px-6 py-5 text-center">
          <p className="text-base font-black leading-7 text-white sm:text-xl">
            모두가 AI를 쓴다면, AI 활용만으로는 차별화되지 않습니다.<br />
            <span className="text-[#FFD600]">선택받을 이유는 당신의 경험에서 시작됩니다.</span>
          </p>
        </div>
      </div>
    </section>

    <section className="border-b border-zinc-200 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-amber-700">REPOSITIONING PROCESS</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">경험이 전략이 되는 과정</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600">
            세 가지는 따로 떨어진 서비스가 아닙니다. 스펙을 다시 읽고, 나만의 이야기로 만들고, 기업이 선택할 이유로 연결하는 하나의 과정입니다.
          </p>
        </div>

        <div className="relative mt-12 grid gap-5 lg:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-zinc-300 lg:block" />
          {processSteps.map((step) => (
            <article key={step.label} className="relative rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] sm:p-7">
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-zinc-950 text-[#FFD600] shadow-lg">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="mt-6 text-xs font-black tracking-[0.16em] text-amber-700">{step.label}</p>
              <h3 className="mt-2 text-xl font-black text-zinc-950">{step.title}</h3>
              <p className="mt-4 text-base leading-7 text-zinc-600">{step.description}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="text-xl font-black leading-9 text-zinc-950 sm:text-3xl sm:leading-[1.5]">
            당신이 해온 일에서 당신만의 판단과 성과를 찾아<br className="hidden sm:block" />
            <span className="text-amber-600">당신만 말할 수 있는 스토리</span>로 만듭니다.
          </p>
          <p className="mt-5 text-base font-medium leading-8 text-zinc-600 sm:text-lg">
            그리고 그 스토리를 자소서에서 주장하고,<br />면접에서 끝까지 증명할 수 있도록 설계합니다.
          </p>
        </div>
      </div>
    </section>
  </div>
);
