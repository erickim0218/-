import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  FileText,
  MessageSquareText,
  Search,
  Target,
  UserRoundCheck
} from 'lucide-react';

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

const pyramidSteps = [
  {
    number: '03',
    eyebrow: '차이를 만드는 단계',
    title: '나만의 선택 이유',
    description: '내 경험에서 판단과 성과를 꺼내, 서류에서 주장하고 면접에서 증명할 전략으로 만듭니다.',
    desktopClass: 'w-[58%] border-[#FFD600] bg-[#FFD600] text-zinc-950',
    mobileClass: 'border-[#FFD600] bg-[#FFD600] text-zinc-950'
  },
  {
    number: '02',
    eyebrow: '속도를 높이는 단계',
    title: 'AI를 활용한 취업 준비',
    description: '분석하고 쓰고 연습하는 시간은 줄어듭니다. 다만 같은 도구를 쓰는 사람과 결과도 비슷해질 수 있습니다.',
    desktopClass: 'w-[79%] border-zinc-700 bg-zinc-800 text-white',
    mobileClass: 'border-zinc-700 bg-zinc-900 text-white'
  },
  {
    number: '01',
    eyebrow: '기본 단계',
    title: '일반적인 취업 준비',
    description: '스펙을 정리하고 공고를 찾고, 이력서·자소서·면접을 준비합니다.',
    desktopClass: 'w-full border-zinc-300 bg-zinc-100 text-zinc-950',
    mobileClass: 'border-zinc-300 bg-zinc-100 text-zinc-950'
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
        <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl sm:leading-[1.18]">
          AI로 쓰면 빨라집니다.<br />
          <span className="text-[#FFD600]">문제는, 다 비슷해진다는 겁니다.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-3xl text-base font-medium leading-8 text-zinc-300 sm:text-xl sm:leading-9">
          공고를 분석하고 문장을 다듬는 일은 AI가 잘합니다.<br className="hidden sm:block" />
          하지만 왜 그렇게 판단했고 무엇을 바꿨는지는 본인만 말할 수 있습니다.
        </p>

        <div className="mx-auto mt-10 max-w-3xl border-y border-zinc-700 py-8">
          <p className="text-2xl font-black leading-snug text-white sm:text-4xl">
            스펙은 바꾸지 않습니다.<br />
            <span className="text-[#FFD600]">읽히는 방식을 바꿉니다.</span>
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
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            AI에게 맡길 일과<br className="sm:hidden" /> 내가 답할 일을 나눕니다.
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
      </div>
    </section>

    <section className="border-b border-zinc-800 bg-[#0B0B0E] px-5 py-16 text-white sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.18em] text-[#FFD600]">취업 준비의 3단계</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            같은 도구를 쓴다면,<br />
            <span className="text-[#FFD600]">결국 경험에서 차이가 납니다.</span>
          </h2>
        </div>

        <div className="mx-auto mt-12 hidden max-w-4xl flex-col items-center gap-2 md:flex">
          {pyramidSteps.map((step, index) => (
            <article
              key={step.title}
              className={`${step.desktopClass} flex min-h-[145px] items-center justify-center border px-16 py-7 text-center shadow-2xl`}
              style={{ clipPath: index === 0 ? 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' : 'polygon(12% 0, 88% 0, 100% 100%, 0 100%)' }}
            >
              <div className="max-w-2xl">
                <p className="text-sm font-black opacity-65">{step.eyebrow}</p>
                <h3 className="mt-1 text-2xl font-black">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-xl text-base font-medium leading-6 opacity-80">{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-3 md:hidden">
          {pyramidSteps.map((step) => (
            <article key={step.title} className={`rounded-2xl border p-5 ${step.mobileClass}`}>
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current text-sm font-black opacity-70">{step.number}</span>
                <div>
                  <p className="text-sm font-black opacity-65">{step.eyebrow}</p>
                  <h3 className="mt-1 text-xl font-black">{step.title}</h3>
                  <p className="mt-2 text-base font-medium leading-7 opacity-80">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

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
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-5xl">경험을 전략으로 바꾸는 순서</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
            세 가지를 따로 배우지 않습니다. 앞 단계에서 찾은 근거를 다음 단계로 이어, 하나의 지원 전략을 만듭니다.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.label}>
              <article className="flex min-h-[310px] flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)] sm:p-7">
                <p className="text-sm font-black tracking-[0.14em] text-amber-700">{step.label}</p>
                <h3 className="mt-5 text-2xl font-black leading-tight text-zinc-950">{step.title}</h3>
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
      </div>
    </section>

    <section className="border-b border-zinc-200 bg-zinc-50 px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-black tracking-[0.16em] text-amber-700">3주 후, 손에 남는 것</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
            강의를 들었다는 기록이 아니라,<br />
            <span className="text-amber-700">바로 써먹을 지원 전략이 남습니다.</span>
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

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#bootcamp-schedule" className="w-full rounded-xl bg-zinc-950 px-7 py-4 text-center text-base font-black text-white transition hover:bg-zinc-800 sm:w-auto">3주 과정 확인하기</a>
          <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" className="w-full rounded-xl bg-[#FFD600] px-7 py-4 text-center text-base font-black text-zinc-950 transition hover:bg-[#ffe033] sm:w-auto">내 상황 먼저 물어보기</a>
        </div>
      </div>
    </section>
  </div>
);
