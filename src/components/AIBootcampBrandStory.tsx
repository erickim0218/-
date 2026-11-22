import React from 'react';
import { ArrowDown, ArrowRight, MessageSquareText, Search, Target } from 'lucide-react';

const processSteps = [
  {
    label: 'BRANDING',
    title: '스펙을 다시 읽다',
    description: '해온 일을 늘어놓는 대신, 내가 어떤 문제를 해결해온 사람인지 찾습니다.',
    result: '스펙의 재해석'
  },
  {
    label: 'STORYTELLING',
    title: '나만 말할 수 있는 근거를 찾다',
    description: '그 경험에서 내가 내린 판단과 행동, 실제로 만든 변화를 꺼냅니다.',
    result: '나만의 스토리'
  },
  {
    label: 'STRATEGY',
    title: '기업이 선택할 이유로 바꾸다',
    description: '기업의 REAL NEEDS에 맞춰 자소서에서 주장하고 면접에서 증명할 한 가지 이유로 묶습니다.',
    result: '선택의 이유'
  }
];

const pyramidSteps = [
  {
    level: '가장 위',
    title: 'AI를 이기는 리포지셔닝',
    description: '내 경험에서 판단과 성과를 찾아, 내가 직접 증명할 수 있는 선택 이유를 만듭니다.',
    desktopClass: 'w-[58%] bg-[#FFD600] text-zinc-950',
    mobileClass: 'border-[#FFD600] bg-[#FFD600] text-zinc-950'
  },
  {
    level: '그다음',
    title: 'AI를 활용한 준비',
    description: '조사와 작성, 연습이 빨라집니다. 다만 누구나 같은 도구를 쓸 수 있습니다.',
    desktopClass: 'w-[78%] bg-zinc-800 text-white',
    mobileClass: 'border-zinc-700 bg-zinc-900 text-white'
  },
  {
    level: '기본',
    title: '일반적인 취업 준비',
    description: '스펙을 정리하고 공고를 찾고, 서류와 면접을 준비합니다.',
    desktopClass: 'w-full bg-zinc-200 text-zinc-950',
    mobileClass: 'border-zinc-300 bg-zinc-100 text-zinc-950'
  }
];

const aiHelps = ['기업·직무 정보 찾기', '문장 다듬기', '예상 질문 만들기'];
const onlyYouCanAnswer = ['왜 그 선택을 했는지', '무엇을 바꿨는지', '어떤 성과를 만들었는지'];

export const AIBootcampBrandStory: React.FC = () => (
  <div className="bg-white text-zinc-950">
    <section className="border-y border-zinc-800 bg-[#0B0B0E] px-5 py-16 text-white sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-black tracking-[0.18em] text-[#FFD600]">WHY REPOSITIONING</p>
          <p className="mt-6 text-xl font-bold leading-8 text-zinc-300 sm:text-3xl sm:leading-[1.45]">
            모두가 AI로 그럴듯한 지원서를 쓰는 시대.<br />
            <span className="text-white">그럴듯함만으로는 더 이상 선택받기 어렵습니다.</span>
          </p>

          <div className="my-10 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

          <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">
            스펙은 바꾸지 않습니다.<br />
            <span className="text-[#FFD600]">읽히는 방식을 바꿉니다.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-3xl text-base font-medium leading-8 text-zinc-300 sm:text-xl sm:leading-9">
            당신이 해온 일에서 당신만의 판단과 성과를 찾아<br className="hidden sm:block" />
            당신만 말할 수 있는 스토리로 만듭니다.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-8 text-zinc-300 sm:text-xl sm:leading-9">
            그리고 그 스토리를 자소서에서 주장하고,<br className="hidden sm:block" />
            면접에서 끝까지 증명할 수 있도록 설계합니다.
          </p>

          <div className="mx-auto mt-10 max-w-2xl border-y border-[#FFD600]/40 py-7">
            <p className="text-xl font-black leading-8 text-white sm:text-3xl sm:leading-[1.4]">
              기업이 당신을 선택할 이유.<br />
              <span className="text-[#FFD600]">그것이 AI 시대에 당신만이 가질 수 있는 전략입니다.</span>
            </p>
          </div>

          <p className="mt-9 text-lg font-black tracking-tight text-white sm:text-2xl">
            AI를 이기는 리포지셔닝 부트캠프
          </p>
        </div>
      </div>
    </section>

    <section className="border-b border-zinc-200 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.16em] text-amber-700">AI는 좋은 도구입니다</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            하지만 마지막 답은<br className="sm:hidden" /> 내 경험에서 나와야 합니다.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            AI를 쓰지 말자는 이야기가 아닙니다. AI로 준비는 더 빠르게 하되, 누구나 쓸 수 있는 문장에서 멈추지 말자는 이야기입니다.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <article className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-200 text-zinc-700">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-zinc-500">AI가 빠르게 해주는 일</p>
                <h3 className="text-xl font-black text-zinc-950">준비의 속도를 높입니다.</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {aiHelps.map((item) => (
                <li key={item} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base font-bold text-zinc-700">{item}</li>
              ))}
            </ul>
          </article>

          <div className="flex items-center justify-center text-zinc-300">
            <ArrowRight className="hidden h-7 w-7 lg:block" />
            <ArrowDown className="h-7 w-7 lg:hidden" />
          </div>

          <article className="rounded-3xl border-2 border-[#FFD600] bg-zinc-950 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD600] text-zinc-950">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-[#FFD600]">결국 내가 답해야 하는 일</p>
                <h3 className="text-xl font-black">선택받을 근거를 만듭니다.</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {onlyYouCanAnswer.map((item) => (
                <li key={item} className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base font-bold text-zinc-100">{item}</li>
              ))}
            </ul>
          </article>
        </div>

        <p className="mx-auto mt-8 max-w-3xl border-l-4 border-[#FFD600] bg-zinc-950 px-6 py-5 text-base font-black leading-7 text-white sm:text-xl">
          면접관이 확인하는 것은 문장의 완성도가 아니라, 그 문장을 내가 직접 설명하고 증명할 수 있는지입니다.
        </p>
      </div>
    </section>

    <section className="border-b border-zinc-800 bg-[#0B0B0E] px-5 py-16 text-white sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-[#FFD600]">취업 준비의 3단계</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            AI보다 잘 쓰는 것이 아니라,<br />
            <span className="text-[#FFD600]">AI가 대신할 수 없는 이유를 만듭니다.</span>
          </h2>
        </div>

        <div className="mx-auto mt-12 hidden max-w-4xl flex-col items-center gap-2 md:flex">
          {pyramidSteps.map((step, index) => (
            <article
              key={step.title}
              className={`${step.desktopClass} flex min-h-[145px] items-center justify-center px-16 py-7 text-center shadow-2xl`}
              style={{ clipPath: index === 0 ? 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' : 'polygon(12% 0, 88% 0, 100% 100%, 0 100%)' }}
            >
              <div className="max-w-2xl">
                <p className="text-sm font-black opacity-65">{step.level}</p>
                <h3 className="mt-1 text-2xl font-black">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xl text-base font-medium leading-6 opacity-80">{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-3 md:hidden">
          {pyramidSteps.map((step, index) => (
            <article key={step.title} className={`rounded-2xl border p-5 ${step.mobileClass}`}>
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current text-sm font-black opacity-70">{3 - index}</span>
                <div>
                  <p className="text-sm font-black opacity-65">{step.level}</p>
                  <h3 className="mt-1 text-xl font-black">{step.title}</h3>
                  <p className="mt-2 text-base font-medium leading-7 opacity-80">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#FFD600]/40 bg-[#FFD600]/10 px-6 py-5 text-center">
          <p className="text-base font-black leading-7 text-white sm:text-xl">
            모두가 AI를 쓴다면, AI를 쓴다는 사실만으로는 달라 보이지 않습니다.<br />
            <span className="text-[#FFD600]">차이는 당신이 실제로 해온 일에서 시작됩니다.</span>
          </p>
        </div>
      </div>
    </section>

    <section className="border-b border-zinc-200 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-amber-700">BRANDING · STORYTELLING · STRATEGY</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">경험이 전략이 되는 순서</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            세 가지를 따로 배우는 과정이 아닙니다. 앞에서 찾은 근거가 다음 단계로 이어져 하나의 지원 전략이 됩니다.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.label}>
              <article className="flex min-h-[310px] flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black tracking-[0.14em] text-amber-700">{step.label}</p>
                  <Target className="h-5 w-5 text-zinc-300" />
                </div>
                <h3 className="mt-5 text-2xl font-black leading-tight text-zinc-950">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-zinc-600">{step.description}</p>
                <div className="mt-auto border-t border-zinc-200 pt-5">
                  <p className="text-sm font-black text-zinc-500">이 단계에서 남는 것</p>
                  <p className="mt-1 text-xl font-black text-zinc-950">{step.result}</p>
                </div>
              </article>
              {index < processSteps.length - 1 && (
                <div className="flex items-center justify-center text-[#D0A900]">
                  <ArrowRight className="hidden h-8 w-8 lg:block" />
                  <ArrowDown className="h-8 w-8 lg:hidden" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border-2 border-zinc-950 bg-zinc-950 text-white">
          <div className="grid sm:grid-cols-2">
            <div className="border-b border-zinc-700 p-6 sm:border-b-0 sm:border-r sm:p-8">
              <p className="text-sm font-black text-[#FFD600]">서류에서</p>
              <p className="mt-2 text-2xl font-black">나를 뽑아야 할 이유를 주장합니다.</p>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-sm font-black text-[#FFD600]">면접에서</p>
              <p className="mt-2 text-2xl font-black">그 주장을 내 경험으로 증명합니다.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#bootcamp-schedule" className="w-full rounded-xl bg-zinc-950 px-7 py-4 text-center text-base font-black text-white transition hover:bg-zinc-800 sm:w-auto">3주 과정 확인하기</a>
          <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" className="w-full rounded-xl bg-[#FFD600] px-7 py-4 text-center text-base font-black text-zinc-950 transition hover:bg-[#ffe033] sm:w-auto">내 경험 점검 문의하기</a>
        </div>
      </div>
    </section>
  </div>
);
