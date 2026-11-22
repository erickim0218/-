import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  Crown,
  FileText,
  MessageSquareText,
  Search,
  Sparkles,
  Target,
  UserRoundCheck
} from 'lucide-react';
import painPointImg from '../assets/images/bootcamp-story/pain-point.png';
import beforeAfterImg from '../assets/images/bootcamp-story/before-after.png';
import finalCtaImg from '../assets/images/bootcamp-story/final-cta.png';
import aiToolsStrategyImg from '../assets/images/bootcamp-story/ai-tools-strategy.png';
import strategyPyramidImg from '../assets/images/bootcamp-story/strategy-pyramid.png';

const RedUnderline: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`relative isolate inline-block ${className}`}>
    <span className="relative z-10">{children}</span>
    <span
      aria-hidden="true"
      className="absolute -bottom-[0.12em] left-[2%] z-0 h-[0.14em] w-[96%] rounded-full bg-[#E63932]"
    />
  </span>
);

const aiTasks = [
  '채용공고와 기업 정보 요약',
  '자기소개서 초안과 문장 정리',
  '예상 질문과 답변 예시 만들기'
];

const humanEvidence = [
  '왜 그 선택을 했는지',
  '내가 실제로 무엇을 바꿨는지',
  '그 결과 무엇이 달라졌는지'
];

const aiTools = [
  {
    name: 'ChatGPT',
    role: '초안 · 요약',
    mark: '◎',
    markClass: 'bg-emerald-400/15 text-emerald-300 border-emerald-300/30'
  },
  {
    name: 'Gemini',
    role: '탐색 · 정리',
    mark: '✦',
    markClass: 'bg-blue-400/15 text-blue-300 border-blue-300/30'
  },
  {
    name: 'Claude',
    role: '문장 · 검토',
    mark: '✳',
    markClass: 'bg-orange-400/15 text-orange-300 border-orange-300/30'
  }
];

const processSteps = [
  {
    label: 'BRANDING',
    title: '경험을 다시 읽습니다',
    description: '무엇을 했는지 나열하지 않습니다. 내가 어떤 문제를 해결해온 사람인지부터 찾습니다.',
    result: '스펙의 재해석'
  },
  {
    label: 'STORYTELLING',
    title: '근거가 있는 이야기를 찾습니다',
    description: '문제 앞에서 어떤 판단을 했고, 어떻게 움직였으며, 무엇을 바꿨는지 끝까지 파고듭니다.',
    result: '나만 말할 수 있는 스토리'
  },
  {
    label: 'STRATEGY',
    title: '뽑아야 할 이유로 묶습니다',
    description: '기업의 REAL NEEDS에 맞춰 자소서·이력서·면접이 같은 한 가지 주장을 하도록 연결합니다.',
    result: '기업이 선택할 이유'
  }
];

const deliverables = [
  {
    icon: BriefcaseBusiness,
    title: '지원 방향',
    text: '어떤 기업과 직무를 노릴지, 무엇을 앞세울지 분명해집니다.'
  },
  {
    icon: FileText,
    title: '자기설득서',
    text: '주장–근거–어필 구조로 자소서의 중심 이야기를 세웁니다.'
  },
  {
    icon: MessageSquareText,
    title: '면접 전략',
    text: '서류에 쓴 주장을 내 경험으로 증명하고, 다음 질문까지 준비합니다.'
  },
  {
    icon: Target,
    title: '하나로 이어진 지원 전략',
    text: '취업 STP·이력서·포트폴리오가 같은 방향을 보게 만듭니다.'
  }
];

export const AIBootcampBrandStory: React.FC = () => (
  <div className="bg-white text-zinc-950">
    <section className="border-y border-zinc-800 bg-[#0B0B0E] px-5 py-16 text-white sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-black tracking-[0.18em] text-[#FFD600]">WHY REPOSITIONING</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-[-0.055em] sm:text-6xl sm:leading-[1.14]">
          AI로 쓰면 빨라집니다.<br />
          <span className="mt-2 inline-block text-[#FFD600]">문제는, <RedUnderline className="text-white">다 비슷해진다는 것</RedUnderline>입니다.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-base font-medium leading-8 text-zinc-300 sm:text-xl sm:leading-9">
          공고를 분석하고 문장을 다듬는 일은 AI가 잘합니다.<br className="hidden sm:block" />
          하지만 왜 그렇게 판단했고 무엇을 바꿨는지는 본인만 말할 수 있습니다.
        </p>

        <div className="mx-auto mt-10 max-w-3xl border-y border-zinc-700 py-8">
          <p className="font-serif text-2xl font-black leading-snug text-white sm:text-4xl">
            스펙은 바꾸지 않습니다.<br />
            <span className="font-sans text-[#FFD600]">읽히는 방식을 바꿉니다.</span>
          </p>
          <p className="mt-5 text-base leading-8 text-zinc-300 sm:text-lg">
            이미 해온 일에서 판단과 성과를 찾아<br className="hidden sm:block" />
            나만 말할 수 있는 스토리로 만듭니다.
          </p>
        </div>
      </div>
    </section>

    <section className="border-b border-zinc-200 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.16em] text-amber-700">AI를 쓰지 말자는 이야기가 아닙니다</p>
          <h2 className="mt-4 font-serif text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            AI에게 맡길 일과<br className="sm:hidden" /> <span className="font-sans">내가 <RedUnderline>답할 일</RedUnderline>을 나눕니다.</span>
          </h2>
        </div>

        <div className="mt-12 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <article className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-200 text-zinc-700">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-zinc-500">AI가 잘하는 일</p>
                <h3 className="text-xl font-black text-zinc-950">준비를 빠르게 합니다.</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {aiTasks.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base font-bold text-zinc-700">
                  <Search className="h-4 w-4 shrink-0 text-zinc-400" />
                  {item}
                </li>
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
                <UserRoundCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-[#FFD600]">본인만 답할 수 있는 일</p>
                <h3 className="text-xl font-black">선택받을 근거를 만듭니다.</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {humanEvidence.map((item) => (
                <li key={item} className="flex items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-base font-bold text-zinc-100">
                  <Check className="h-4 w-4 shrink-0 text-[#FFD600]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <p className="mx-auto mt-8 max-w-3xl border-l-4 border-[#FFD600] bg-zinc-950 px-6 py-5 text-base font-black leading-7 text-white sm:text-xl">
          면접관이 확인하는 건 잘 쓴 문장이 아닙니다. 그 문장을 내 경험으로 설명할 수 있는 사람인지 봅니다.
        </p>

        <figure className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
          <img
            src={painPointImg}
            alt="AI로 만든 비슷한 자기소개서, 계속 꼬이는 면접 질문, 달라지지 않는 이력서가 취업 준비를 제자리걸음하게 만드는 상황"
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </figure>
      </div>
    </section>

    <section className="relative overflow-hidden border-b border-zinc-800 bg-[#0B0B0E] px-5 py-16 text-white sm:px-10 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255,214,0,0.16) 0, transparent 42%), radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1px)', backgroundSize: 'auto, 28px 28px' }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.16em] text-[#FFD600]">AI는 도구입니다</p>
          <h2 className="mx-auto mt-4 max-w-5xl text-3xl font-black leading-[1.08] tracking-[-0.055em] sm:text-6xl">
            ChatGPT도, Gemini도, Claude도<br className="hidden sm:block" />
            <span className="mt-2 inline-block text-[#FFD600]">남들이 다 쓰는 도구입니다.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
            모두가 쓸 수 있는 도구가 곧 나만의 전략이 될 수는 없습니다.<br className="hidden sm:block" />
            도구 위에서 무엇을 말할지 결정하는 사람이 되어야 합니다.
          </p>
        </div>

        <figure className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-zinc-700 bg-[#101820] shadow-[0_22px_70px_rgba(0,0,0,0.48)]">
          <img
            src={aiToolsStrategyImg}
            alt="ChatGPT, Gemini, Claude는 누구나 쓰는 도구이며 결과를 만드는 차별화는 취업 리포지셔닝 전략이라는 설명"
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </figure>

        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-[2rem] border border-zinc-700 bg-zinc-950 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="relative px-5 pb-8 pt-10 sm:px-10 sm:pb-12 sm:pt-14">
            <div className="absolute left-1/2 top-[150px] h-40 w-px -translate-x-1/2 bg-gradient-to-b from-[#FFD600] to-zinc-700 sm:top-[170px] sm:h-44" />

            <div className="relative z-10 mx-auto flex w-fit flex-col items-center text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#FFD600]/50 bg-[#FFD600]/10 px-4 py-2 text-sm font-black text-[#FFD600]">
                <Crown className="h-4 w-4" />
                전략의 주도권
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#FFD600] bg-[#FFD600] text-zinc-950 shadow-[0_0_0_12px_rgba(255,214,0,0.08),0_0_60px_rgba(255,214,0,0.22)] sm:h-28 sm:w-28">
                <UserRoundCheck className="h-11 w-11 sm:h-13 sm:w-13" />
              </div>
              <h3 className="mt-5 text-2xl font-black sm:text-3xl">당신의 경험</h3>
              <p className="mt-1 text-base font-bold text-zinc-400">판단 · 행동 · 성과</p>
            </div>

            <div className="relative z-10 mt-16 grid gap-3 sm:mt-20 sm:grid-cols-3 sm:gap-4">
              {aiTools.map((tool) => (
                <article key={tool.name} className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900/95 p-4 shadow-xl sm:flex-col sm:justify-center sm:p-6 sm:text-center">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl font-black ${tool.markClass}`} aria-hidden="true">
                    {tool.mark}
                  </span>
                  <div>
                    <h4 className="text-lg font-black text-white">{tool.name}</h4>
                    <p className="mt-1 text-sm font-bold text-zinc-400">{tool.role}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="relative z-10 mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-400">
              <Sparkles className="h-4 w-4" />
              누구나 쓸 수 있는 공통 도구
            </div>
          </div>

          <div className="grid border-t border-zinc-700 sm:grid-cols-2">
            <div className="border-b border-zinc-700 p-6 sm:border-b-0 sm:border-r sm:p-8">
              <p className="text-sm font-black text-zinc-500">AI가 만들어주는 것</p>
              <p className="mt-2 text-xl font-black text-zinc-200 sm:text-2xl">그럴듯한 문장</p>
            </div>
            <div className="bg-[#FFD600] p-6 text-zinc-950 sm:p-8">
              <p className="text-sm font-black opacity-65">내가 만들어야 하는 것</p>
              <p className="mt-2 text-xl font-black sm:text-2xl">기업이 나를 선택할 이유</p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center font-serif text-lg font-black leading-8 text-white sm:text-2xl">
          AI를 많이 쓰는 사람이 아니라,<br className="sm:hidden" />
          <span className="font-sans text-[#FFD600]">AI 위에서 <RedUnderline className="text-white">방향을 정하는 사람</RedUnderline></span>이 선택받습니다.
        </p>
      </div>
    </section>

    <section className="border-b border-zinc-800 bg-[#0B0B0E] px-5 py-16 text-white sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-[#FFD600]">취업 준비의 3단계</p>
          <h2 className="mt-4 font-serif text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            같은 도구를 쓴다면,<br />
            <span className="font-sans text-[#FFD600]">결국 <RedUnderline className="text-white">경험</RedUnderline>에서 차이가 납니다.</span>
          </h2>
        </div>

        <figure className="mx-auto mt-12 h-[310px] max-w-5xl overflow-hidden rounded-2xl border border-zinc-700 bg-[#111A28] shadow-[0_26px_80px_rgba(0,0,0,0.42)] sm:h-auto">
          <img
            src={strategyPyramidImg}
            alt="일반적인 취업전략 위에 AI를 활용한 취업전략을 쌓고, 최종적으로 남들이 따라 할 수 없는 나만의 이야기로 전략을 완성하는 3단계 피라미드"
            loading="lazy"
            decoding="async"
            className="block h-full w-auto max-w-none -translate-x-[41%] sm:h-auto sm:w-full sm:max-w-full sm:translate-x-0"
          />
        </figure>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#FFD600]/40 bg-[#FFD600]/10 px-6 py-5 text-center">
          <p className="text-base font-black leading-7 text-white sm:text-xl">
            모두가 AI를 쓴다면, AI를 쓴다는 사실은 경쟁력이 아닙니다.<br />
            <span className="text-[#FFD600]">선택받을 이유는 당신이 실제로 해온 일에서 시작됩니다.</span>
          </p>
        </div>
      </div>
    </section>

    <section className="border-b border-zinc-200 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-amber-700">BRANDING → STORYTELLING → STRATEGY</p>
          <h2 className="mt-4 font-serif text-3xl font-black tracking-[-0.04em] sm:text-5xl">경험을 <RedUnderline className="font-sans">전략</RedUnderline>으로 바꾸는 순서</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            세 가지를 따로 배우지 않습니다. 앞 단계에서 찾은 근거를 다음 단계로 이어, 하나의 지원 전략을 만듭니다.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.label}>
              <article className="flex min-h-[310px] flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] sm:p-7">
                <p className="text-sm font-black tracking-[0.14em] text-amber-700">{step.label}</p>
                <h3 className="mt-5 font-serif text-2xl font-black leading-tight text-zinc-950">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-zinc-600">{step.description}</p>
                <div className="mt-auto border-t border-zinc-200 pt-5">
                  <p className="text-sm font-black text-zinc-500">이 단계에서 정리되는 것</p>
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

        <figure className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
          <img
            src={beforeAfterImg}
            alt="경험을 나열한 자기소개서를 기업이 원하는 역량과 설득력 있는 스토리, 면접까지 이어지는 핵심 메시지로 바꾸는 리포지셔닝 전후 비교"
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </figure>
      </div>
    </section>

    <section className="border-b border-zinc-200 bg-zinc-50 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.16em] text-amber-700">3주 후, 손에 남는 것</p>
          <h2 className="mt-4 font-serif text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            강의를 들었다는 기록이 아니라,<br />
            <span className="font-sans text-amber-700">바로 써먹을 <RedUnderline className="text-zinc-950">지원 전략</RedUnderline>이 남습니다.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {deliverables.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD600] text-zinc-950">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-black text-zinc-950">{title}</h3>
              <p className="mt-2 text-base leading-7 text-zinc-600">{text}</p>
            </article>
          ))}
        </div>

        <a
          href="#pricing-plans"
          aria-label="리포지셔닝 부트캠프 수강료와 신청 방법 확인하기"
          className="mx-auto mt-10 block max-w-5xl overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD600]/70"
        >
          <img
            src={finalCtaImg}
            alt="이번이 당신의 전환점이 될 수 있습니다. 리포지셔닝 부트캠프로 지금 커리어의 방향을 바꾸세요."
            loading="lazy"
            decoding="async"
            className="block h-auto w-full transition duration-200 hover:brightness-110"
          />
        </a>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#bootcamp-schedule" className="w-full rounded-xl bg-zinc-950 px-7 py-4 text-center text-base font-black text-white transition hover:bg-zinc-800 sm:w-auto">3주 과정 확인하기</a>
          <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" className="w-full rounded-xl bg-[#FFD600] px-7 py-4 text-center text-base font-black text-zinc-950 transition hover:bg-[#ffe033] sm:w-auto">내 상황 먼저 물어보기</a>
        </div>
      </div>
    </section>
  </div>
);
