import React, { useEffect, useRef } from 'react';
import { Check, ChevronDown, ShieldCheck } from 'lucide-react';
import { trackAnalyticsEvent } from '../lib/analytics';

type PlanName = '코어' | '프로' | '퍼스트클래스';

interface Props {
  isClosed: boolean;
  remainingSlots: number;
  onInquiry: (event: React.MouseEvent) => void;
  onOpenPlan: (plan: PlanName) => void;
}

const plans: Array<{ name: PlanName; price: string; note: string; featured?: boolean; benefits: string[] }> = [
  {
    name: '코어', price: '290,000원', note: '핵심 전략을 배우고 기본 피드백까지',
    benefits: ['3주 라이브 전략 특강', '프로자료 전체 및 실전 프롬프트', '1:1 컨설팅 2회', '과제 피드백 2회', '이력서 점검']
  },
  {
    name: '프로', price: '390,000원', note: '3주 동안 가장 밀도 있게 적용하는 과정', featured: true,
    benefits: ['코어 플랜 전체 혜택', '주차별 1:1 컨설팅 3회', '자기소개서 정밀 피드백 3회', '운영 기간 내 카카오톡 피드백']
  },
  {
    name: '퍼스트클래스', price: '690,000원', note: '최종 합격까지 장기 밀착 관리',
    benefits: ['프로 플랜 전체 혜택', '취업 시즌 내 1:1 컨설팅', '자기소개서·면접 피드백', '최종 합격까지 밀착 관리']
  }
];

const faqItems = [
  ['스펙이 부족한데 수강해도 될까요?', '리포지셔닝은 현재 가지고 있는 경험과 역량의 가치를 재발견하는 것에서 시작합니다. 지원 기업이 필요로 하는 역량을 어떻게 증명할 수 있을지 함께 고민합니다.'],
  ['신입뿐만 아니라 경력직도 수강할 수 있나요?', '신입 취업과 경력직 이직 모두를 대상으로 합니다. 개인의 상황과 목표에 맞춰 전략을 설계합니다.'],
  ['기존 취업 컨설팅과 무엇이 다른가요?', '문장을 고치는 데 그치지 않습니다. 기업의 채용 니즈와 개인의 경험·강점을 연결해 앞으로도 스스로 활용할 수 있는 지원 전략을 함께 설계합니다.'],
  ['라이브 강의에 참여하기 어려우면 어떻게 하나요?', '녹화본 제공 여부와 수강 가능 기간은 기수별 운영 방식에 따라 달라질 수 있습니다. 신청 전 상담을 통해 현재 기수 기준으로 정확히 안내드립니다.'],
  ['녹화본을 제공하나요?', '녹화본 제공 여부와 열람 기간은 기수별 운영 방식에 따라 달라질 수 있습니다. 결제 전 현재 모집 기수의 제공 기준을 상담으로 확인해 주세요.'],
  ['1:1 컨설팅 일정은 어떻게 정하나요?', '신청 후 개인 일정과 운영 가능 시간을 확인해 조율합니다. 세부 방식은 현재 기수 운영 안내에서 확인할 수 있습니다.'],
  ['이력서와 포트폴리오도 함께 다루나요?', '3주차에 취업 STP, REAL NEEDS 이력서, 완벽설득 포트폴리오 방법론을 다룹니다. 개인별 검토 범위는 선택한 플랜에 따라 안내드립니다.'],
  ['카카오톡 피드백은 언제까지 받을 수 있나요?', '피드백 가능 기간과 범위는 플랜별로 다릅니다. 결제 전 현재 운영 기준을 상담으로 확인하실 수 있습니다.'],
  ['프로와 퍼스트클래스의 차이는 무엇인가요?', '프로는 3주 동안 주차별 컨설팅과 피드백을 집중적으로 적용하는 과정입니다. 퍼스트클래스는 프로 혜택에 취업 시즌 동안의 장기 밀착 관리가 추가됩니다. 정확한 기간과 제공 범위는 결제 전 현재 운영 기준을 확인해 주세요.'],
  ['카드 결제와 할부가 가능한가요?', '실제 결제 단계에서 제공되는 결제 수단과 할부 조건을 확인할 수 있습니다. 결제 전 확인이 필요하면 먼저 상담해 주세요.'],
  ['프로그램이 저와 맞지 않는다면 어떻게 하나요?', '1회차 컨설팅 후 방향이 맞지 않는다고 판단되면 24시간 이내에 전액 환불을 요청할 수 있습니다. 세부 적용 조건은 기존 환불 정책에 따릅니다.']
];

export const BootcampOfferSections: React.FC<Props> = ({ isClosed, remainingSlots, onInquiry, onOpenPlan }) => {
  const pricingRef = useRef<HTMLElement | null>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const node = pricingRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !trackedRef.current) {
        trackedRef.current = true;
        void trackAnalyticsEvent({ eventName: 'bootcamp_pricing_view', buttonLocation: 'pricing_section', bootcampCohort: 9 });
      }
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section ref={pricingRef} id="pricing-plans" className="scroll-mt-28 bg-white px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black text-amber-700">프로그램 및 수강료</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">3주 동안,<br />당신이 가져갈 모든 것.</h2>
            <p className="mt-5 text-base leading-8 text-zinc-600 sm:text-lg">자소서부터 면접, 이직까지. 매주 배우고, 내 상황에 직접 적용합니다.</p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {[
              ['취업 전략', '자기설득서 · 취업 STP'],
              ['면접 전략', '완벽통제면접 · 퍼스트임팩트'],
              ['이직 전략', 'REAL NEEDS · 포트폴리오'],
              ['밀착 컨설팅', '주차별 1:1 컨설팅 · 피드백'],
              ['실전 콘텐츠', '프로 전용 특강 · 템플릿']
            ].map(([title, detail], index) => <div key={title} className={`rounded-xl border border-zinc-200 bg-zinc-50 p-4 ${index === 4 ? 'col-span-2 lg:col-span-1' : ''}`}><p className="text-sm font-black">{title}</p><p className="mt-2 text-xs font-bold leading-5 text-zinc-500">{detail}</p></div>)}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={`relative flex flex-col rounded-2xl border p-6 sm:p-7 ${plan.featured ? 'border-[#E0B900] bg-[#FFFBE8] shadow-[0_18px_50px_rgba(180,145,0,0.12)]' : 'border-zinc-200 bg-white'}`}>
                {plan.featured && <span className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-zinc-950 px-3 py-1 text-xs font-black text-[#FFD600]">가장 많이 선택하는 구성</span>}
                <h3 className="text-2xl font-black">{plan.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-500">{plan.note}</p>
                <p className="mt-5 text-3xl font-black tracking-tight">{plan.price}</p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-zinc-200 pt-6 text-sm font-bold text-zinc-700">
                  {plan.benefits.map((benefit) => <li key={benefit} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{benefit}</li>)}
                </ul>
                {isClosed ? (
                  <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" onClick={onInquiry} className={`mt-7 flex min-h-12 items-center justify-center rounded-xl px-5 text-sm font-black ${plan.featured ? 'bg-[#FFD600] text-zinc-950' : 'bg-zinc-900 text-white'}`}>다음 기수 상담하기</a>
                ) : (
                  <button type="button" onClick={() => onOpenPlan(plan.name)} className={`mt-7 min-h-12 rounded-xl px-5 text-sm font-black ${plan.featured ? 'bg-[#FFD600] text-zinc-950' : 'bg-zinc-900 text-white'}`}>부트캠프 신청하기</button>
                )}
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex sm:items-start sm:gap-4">
            <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-700" />
            <div className="mt-3 sm:mt-0">
              <p className="font-black text-emerald-950">직접 경험하고 판단하세요.</p>
              <p className="mt-1 text-sm leading-6 text-emerald-900">1회차 컨설팅 후 방향이 맞지 않는다고 판단되면 24시간 이내에 전액 환불을 요청할 수 있습니다. 세부 적용 조건은 기존 환불 정책에 따릅니다.</p>
            </div>
          </div>
          {!isClosed && <p className="mt-5 text-center text-sm font-black text-zinc-600">현재 모집 중 · 잔여 {remainingSlots}자리</p>}
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 border-t border-zinc-800 bg-[#0B0B0E] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-black text-[#FFD600]">FAQ</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">함께하기 전,<br />궁금한 점을 확인해보세요.</h2>
          <div className="mt-10 divide-y divide-zinc-800 border-y border-zinc-800">
            {faqItems.map(([question, answer], index) => (
              <details key={question} className="group" onToggle={(event) => {
                if (event.currentTarget.open) void trackAnalyticsEvent({ eventName: 'bootcamp_faq_open', buttonLocation: `faq_${index + 1}`, bootcampCohort: 9 });
              }}>
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-black text-white [&::-webkit-details-marker]:hidden">
                  <span>Q. {question}</span><ChevronDown className="h-5 w-5 shrink-0 text-zinc-500 transition group-open:rotate-180" />
                </summary>
                <p className="pb-6 pr-8 text-sm leading-7 text-zinc-400 sm:text-base">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#070709] px-4 pb-36 pt-16 text-center sm:px-8 sm:pb-24 sm:pt-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">당신의 가치는<br />아직 제대로 읽히지 않았을지도 모릅니다.</p>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">수많은 경험과 노력에도 기업으로부터 선택받지 못했다면, 이제는 그 가치를 전달하는 방식을 바꿔보세요.</p>
          <p className="mt-7 text-2xl font-black text-[#FFD600]">당신을 뽑아야 할 이유, 함께 만들겠습니다.</p>
          <p className="mt-3 text-sm font-bold text-zinc-500">기획자J와 함께하는 3주간의 취업·이직 전략 과정</p>
          {isClosed ? (
            <a href="https://open.kakao.com/o/sEgVEi0h" target="_blank" rel="noopener noreferrer" onClick={onInquiry} className="mx-auto mt-8 flex min-h-14 max-w-sm items-center justify-center rounded-xl bg-[#FFD600] px-6 text-base font-black text-zinc-950">다음 기수 상담하기</a>
          ) : (
            <button type="button" onClick={() => document.getElementById('pricing-plans')?.scrollIntoView({ behavior: 'smooth' })} className="mx-auto mt-8 min-h-14 w-full max-w-sm rounded-xl bg-[#FFD600] px-6 text-base font-black text-zinc-950">리포지셔닝 부트캠프 신청하기</button>
          )}
        </div>
      </section>
    </>
  );
};
