import React, { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { BOOTCAMP_REVIEWS, BootcampReview } from '../data/bootcampReviews';
import { trackAnalyticsEvent } from '../lib/analytics';
import { ReviewDetailModal } from './BootcampReviewsShowcase';
import strategyPyramidImg from '../assets/images/bootcamp-story/strategy-pyramid-v2.webp';
import aiToolsStrategyImg from '../assets/images/bootcamp-story/ai-tools-strategy.png';
import beforeAfterImg from '../assets/images/bootcamp-story/before-after.png';
import consultingPreviewVideo from '../assets/videos/one-to-one-consulting-preview.mp4';
import consultingPreviewPoster from '../assets/images/bootcamp-story/consulting-preview-poster.jpg';

interface BootcampCoreSectionsProps {
  reviewsSection?: React.ReactNode;
}

export const BootcampCoreSections: React.FC<BootcampCoreSectionsProps> = ({ reviewsSection }) => {
  const [selectedReview, setSelectedReview] = useState<BootcampReview | null>(null);
  const [activeSituation, setActiveSituation] = useState(0);
  const beforeAfterRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = beforeAfterRef.current;
    if (!node) return;
    let tracked = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !tracked) {
        tracked = true;
        void trackAnalyticsEvent({ eventName: 'bootcamp_before_after_view', buttonLocation: 'before_after', bootcampCohort: 9 });
      }
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const openReview = (review: BootcampReview) => {
    setSelectedReview(review);
    void trackAnalyticsEvent({ eventName: 'bootcamp_review_open', buttonLocation: `curriculum_${review.id}`, bootcampCohort: 9 });
  };

  const situationReviews = [
    ['서류 탈락이 반복된다면', '24'],
    ['면접에서 자신감이 떨어진다면', '14'],
    ['경력은 있지만 이직이 어렵다면', '9'],
    ['내 스펙이 약하다고 느낀다면', '15'],
    ['오랜 준비로 지쳐 있다면', '5'],
    ['첨삭과 다른 점이 궁금하다면', '8']
  ] as const;
  const activeSituationReview = BOOTCAMP_REVIEWS.find((item) => item.id === situationReviews[activeSituation][1]);

  return (
    <>
      <section id="why-repositioning" className="scroll-mt-28 bg-white px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center [word-break:keep-all]">
            <p className="text-sm font-black text-amber-600">노력의 방향을 다시 볼 때</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
              스펙을 바꾸기 전에,<br />전략부터 바꿔보세요.
            </h2>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-3 border-l-4 border-[#FFD600] pl-5 text-lg font-bold leading-8 text-zinc-700">
              <p>자격증을 하나 더 취득하고,</p>
              <p>자기소개서를 수십 번 고쳐보고,</p>
              <p>AI에게 더 좋은 답변을 요청하고,</p>
              <p>그렇게 열심히 준비했는데도.</p>
            </div>
            <div>
              <p className="text-lg leading-8 text-zinc-600">
                그렇게 열심히 준비했는데도 결과가 달라지지 않았다면, 이제는 노력의 양이 아니라 <strong className="text-zinc-950">노력의 방향</strong>을 점검해야 합니다.
              </p>
              <p className="mt-6 text-lg leading-8 text-zinc-600">
                기업은 좋은 스펙만을 찾는 것이 아닙니다. 자신들에게 필요한 사람인지, 가진 경험으로 필요한 역량을 증명할 수 있는지를 봅니다.
              </p>
              <p className="mt-6 text-xl font-black leading-8 text-zinc-950">
                기업이 필요로 하는 역량을 이해하고,<br />내 경험으로 그 역량을 증명하는 것.<br /><span className="text-amber-700">취업 전략은 여기서 시작합니다.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-[#0B0B0E] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="text-center [word-break:keep-all]">
              <p className="text-sm font-black text-[#FFD600]">AI 시대의 취업 전략</p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                모두가 AI를 쓴다면,<br />무엇으로 차별화할 것인가.
              </h2>
              <p className="mt-6 text-base leading-8 text-zinc-400 sm:text-lg">
                AI는 경험을 정리하고 더 좋은 문장을 만들어줄 수 있습니다. 그러나 모두가 활용할 수 있는 도구만으로는 나만의 경쟁력을 완성할 수 없습니다.
              </p>
              <p className="mt-6 text-xl font-black leading-8 text-white">
                AI를 더 잘 쓰는 사람을 넘어,<br /><span className="text-[#FFD600]">남들이 따라 할 수 없는 나만의 이야기로.</span><br />그것이 리포지셔닝입니다.
              </p>
            </div>
            <img
              src={aiToolsStrategyImg}
              alt="ChatGPT, Gemini, Claude는 모두가 쓰는 도구이며 차이는 취업 리포지셔닝 전략에서 만들어진다는 설명"
              className="h-auto w-full rounded-2xl border border-zinc-800"
              loading="lazy"
            />
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <img
              src={strategyPyramidImg}
              alt="일반적인 취업전략, AI 활용 취업전략, 나만의 이야기로 완성되는 3단계 전략"
              className="hidden h-auto w-full rounded-2xl border border-zinc-800 bg-[#101827] sm:block"
              loading="lazy"
            />
            <div className="space-y-3 sm:hidden" aria-label="리포지셔닝 3단계 전략">
              {[
                ['01', '일반적인 취업전략', '누구나 알고 있는 취업 준비 방식'],
                ['02', 'AI를 활용한 취업전략', 'AI를 활용해 분석·작성·준비의 효율을 높이는 단계'],
                ['03', '나만의 이야기', '내가 직접 말하고 증명할 수 있는 차별화된 근거']
              ].map(([step, title, copy], index) => (
                <article key={step} className={`rounded-2xl border p-5 ${index === 2 ? 'border-[#FFD600]/50 bg-[#FFD600]/10' : 'border-zinc-800 bg-[#111114]'}`}>
                  <p className="text-xs font-black text-[#FFD600]">{step}</p>
                  <h3 className="mt-2 text-lg font-black text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{copy}</p>
                </article>
              ))}
              <p className="pt-3 text-center text-xl font-black leading-8 text-white">AI는 도구입니다.<br /><span className="text-[#FFD600]">차이를 만드는 것은 나만의 이야기입니다.</span></p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#111114] p-6 sm:p-8">
              <h3 className="text-center text-2xl font-black text-white">AI는 도구입니다.<br />차이를 만드는 것은 전략입니다.</h3>
              <p className="mt-5 text-base leading-8 text-zinc-400">
                리포지셔닝은 경험과 역량을 기업의 채용 니즈에 맞춰 재해석하고, 기업이 당신을 선택해야 할 이유를 만드는 취업·이직 전략입니다.
              </p>
              <p className="mt-5 text-base leading-8 text-zinc-400">
                스펙을 과장하거나 새로운 경험을 만들어내지 않습니다. 이미 가지고 있는 가치를 제대로 읽히게 만듭니다.
              </p>
              <div className="mt-7 border-t border-zinc-800 pt-6 text-lg font-black leading-8 text-white">
                스펙의 재해석 → 나만 말할 수 있는 스토리 → <span className="text-[#FFD600]">기업이 선택할 이유</span>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-zinc-800 pt-12">
            <div className="text-center [word-break:keep-all]">
              <p className="text-sm font-black text-[#FFD600]">접근법의 차이</p>
              <h3 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">잘 쓰는 것과<br />선택받는 것은 다릅니다.</h3>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
              <article className="rounded-2xl border border-zinc-800 bg-[#111114] p-4 sm:p-7">
                <p className="text-sm font-black text-zinc-400">문장 첨삭 중심 접근</p>
                <dl className="mt-4 space-y-3 text-sm">
                  {[['출발점', '작성된 자기소개서'], ['경험', '경험 정리'], ['자소서', '문장 완성도'], ['면접', '예상 답변 준비'], ['목표', '현재 지원서 개선']].map(([term, value]) => <div key={term} className="border-t border-zinc-800 pt-3"><dt className="text-xs font-bold text-zinc-600">{term}</dt><dd className="mt-1 font-bold leading-5 text-zinc-300">{value}</dd></div>)}
                </dl>
              </article>
              <article className="rounded-2xl border border-[#FFD600]/35 bg-[#FFD600]/5 p-4 sm:p-7">
                <p className="text-sm font-black text-[#FFD600]">리포지셔닝</p>
                <dl className="mt-4 space-y-3 text-sm">
                  {[['출발점', '기업의 채용 니즈'], ['경험', '경험의 전략적 재해석'], ['자소서', '기업 설득 논리'], ['면접', '면접 흐름 설계'], ['목표', '스스로 활용할 지원 전략']].map(([term, value]) => <div key={term} className="border-t border-[#FFD600]/15 pt-3"><dt className="text-xs font-bold text-zinc-500">{term}</dt><dd className="mt-1 font-black leading-5 text-white">{value}</dd></div>)}
                </dl>
              </article>
            </div>
            <p className="mt-7 text-center text-lg font-black text-white">이번 지원서만 고치는 것이 아니라,<br /><span className="text-[#FFD600]">앞으로의 지원 방식을 바꿉니다.</span></p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl font-black text-white sm:text-2xl">그렇다면 부트캠프에서는 구체적으로 어떤 전략을 배우게 될까요?</p>
          </div>
        </div>
      </section>

      <section ref={beforeAfterRef} id="before-after" className="scroll-mt-28 bg-white px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center [word-break:keep-all]">
            <p className="text-sm font-black text-amber-700">교육용 BEFORE &amp; AFTER 예시</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">같은 경험,<br />전혀 다른 설득력.</h2>
            <p className="mt-5 text-base leading-8 text-zinc-600 sm:text-lg">실제 개인 자료가 아닌 방법론 설명용 예시입니다. 경험을 과장하지 않고, 기업이 평가할 역량이 보이도록 전달 관점을 바꾸는 과정을 보여드립니다.</p>
          </div>
          <div className="mt-10 grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <img src={beforeAfterImg} alt="경험 나열형 자기소개서를 기업 니즈와 연결된 설득형 자기소개서로 바꾸는 교육용 예시" className="hidden h-auto w-full rounded-2xl border border-zinc-200 sm:block" loading="lazy" />
            <div className="hidden grid-cols-2 gap-3 sm:grid">
              {[
                ['BEFORE', '경험을 시간 순서대로 나열하고 성실함을 주장합니다.'],
                ['REPOSITIONING', '지원 기업이 필요로 하는 역량과 경험 속 행동을 연결합니다.'],
                ['AFTER', '주장·근거·어필의 구조로 필요한 이유가 읽히게 만듭니다.'],
                ['WHY', '평범한 경험에서도 기업이 평가할 행동과 역량이 선명해집니다.']
              ].map(([label, copy]) => <div key={label} className="rounded-xl border border-zinc-200 p-4"><p className="text-xs font-black text-amber-700">{label}</p><p className="mt-2 text-sm font-bold leading-6 text-zinc-700">{copy}</p></div>)}
            </div>
            <div className="space-y-3 sm:hidden">
              {[
                ['BEFORE', ['평범한 경험의 나열', '구체적인 근거 부족', '기업의 채용 니즈와 연결되지 않음']],
                ['REPOSITIONING', ['기업이 필요로 하는 역량을 먼저 분석', '경험 속 판단과 행동을 역량의 근거로 재해석', '주장·근거·어필 구조로 설계']],
                ['AFTER', ['기업이 원하는 역량으로 재구성', '설득력 있는 나만의 스토리', '면접까지 이어지는 일관된 핵심 메시지']]
              ].map(([label, items], index) => (
                <article key={label as string} className={`rounded-2xl border p-5 ${index === 1 ? 'border-amber-300 bg-amber-50' : 'border-zinc-200 bg-white'}`}>
                  <p className="text-xs font-black tracking-[0.12em] text-amber-700">{label as string}</p>
                  <ul className="mt-3 space-y-2 text-[15px] font-bold leading-6 text-zinc-700">
                    {(items as string[]).map((item) => <li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          <p className="mt-9 text-center text-xl font-black">경험을 바꾸는 것이 아니라,<br /><span className="text-amber-700">경험이 읽히는 방식을 바꿉니다.</span></p>
        </div>
      </section>

      <section id="bootcamp-schedule" className="scroll-mt-28 bg-[#F5F5F3] px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center [word-break:keep-all]">
            <p className="text-sm font-black tracking-[0.14em] text-amber-700">YOUR 3-WEEK REPOSITIONING</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-5xl">3주,<br />선택받는 이유를 만드는 시간.</h2>
            <p className="mt-5 text-base leading-8 text-zinc-600 sm:text-lg">
              듣고 끝나는 강의가 아닙니다. 매주 배운 내용을 당신의 경험과 실제 지원 기업에 적용합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-black text-amber-700">WEEK 01 · 자기설득서</p>
              <h3 className="mt-4 text-2xl font-black leading-8">자기소개서가 아닌,<br />자기설득서.</h3>
              <p className="mt-5 text-base leading-7 text-zinc-600">기업이 필요로 하는 역량을 파악하고, 경험을 그 역량의 근거로 재구성합니다.</p>
              <ul className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm font-bold text-zinc-700">
                {['취업 전략의 재정의', '주장·근거·어필 설계', '경험과 강점의 재해석', '자기소개서 → 자기설득서'].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}
              </ul>
              <p className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm font-bold leading-6 text-zinc-700">무엇을 선택하고 어떤 역량을 증명해야 하는지 판단할 수 있게 됩니다.</p>
            </article>

            <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-black text-amber-700">WEEK 02 · 완벽통제면접</p>
              <h3 className="mt-4 text-2xl font-black leading-8">면접, 통제할 것인가.<br />통제를 당할 것인가.</h3>
              <p className="mt-5 text-base leading-7 text-zinc-600">답변을 외우는 면접에서 벗어나, 면접관이 내 강점에 주목하도록 흐름을 설계합니다.</p>
              <ul className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm font-bold text-zinc-700">
                {['퍼스트임팩트', '꼬리물기', '임팩트5', '프레임전환'].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}
              </ul>
              <p className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm font-bold leading-6 text-zinc-700">예상 질문이 아니라, 반드시 전달할 핵심 메시지를 중심으로 준비합니다.</p>
            </article>

            <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-black text-amber-700">WEEK 03 · 취업·이직 리포지셔닝</p>
              <h3 className="mt-4 text-2xl font-black leading-8">기업이 원하는 사람은<br />채용공고 너머에 있습니다.</h3>
              <p className="mt-5 text-base leading-7 text-zinc-600">기업의 진짜 채용 니즈를 분석하고, 이력서와 포트폴리오를 설득의 도구로 바꿉니다.</p>
              <ul className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm font-bold text-zinc-700">
                {['취업 STP 전략', '기업 REAL NEEDS 분석', 'REAL NEEDS 이력서', '완벽설득 포트폴리오'].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}
              </ul>
              <p className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm font-bold leading-6 text-zinc-700">기업이 필요한 역량을 분석하고, 내 경험을 그에 맞춰 전달합니다.</p>
            </article>
          </div>

          <div className="mt-10 rounded-2xl bg-zinc-950 p-6 text-white sm:p-8">
            <div className="mx-auto max-w-4xl text-center [word-break:keep-all]">
              <p className="text-sm font-black text-[#FFD600]">프로그램 운영 구조</p>
              <h3 className="mt-3 text-2xl font-black leading-8 sm:text-3xl">강의로 배우고, 과제로 적용하고,<br />1:1로 완성합니다.</h3>
            </div>
            <ol className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {['강의', '과제 적용', '1:1 컨설팅', '피드백'].map((item, index) => (
                <li key={item} className="relative rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
                  <p className="text-xs font-black text-[#FFD600]">0{index + 1}</p>
                  <p className="mt-2 text-sm font-black sm:text-base">{item}</p>
                </li>
              ))}
            </ol>
            <div className="mx-auto mt-7 max-w-3xl border-t border-zinc-800 pt-6 text-left text-sm leading-7 text-zinc-400 sm:text-center sm:text-base">
              <p>매주 배운 전략을 자신의 경험과 실제 지원 기업에 적용합니다.</p>
              <p className="mt-2">정해진 답을 받는 과정이 아니라, 스스로 지원 전략을 설계할 수 있도록 만드는 과정입니다.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-black">배우는 것은 전략.<br />가져가는 것은 당신만의 경쟁력.</p>
            <p className="mt-3 text-base text-zinc-600">이번 취업뿐 아니라 앞으로의 커리어에서도 활용할 수 있는 사고방식을 익힙니다.</p>
          </div>
        </div>
      </section>

      <section id="one-to-one" className="scroll-mt-28 border-y border-zinc-800 bg-[#0D0E12] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center [word-break:keep-all]">
            <p className="text-sm font-black tracking-[0.14em] text-[#FFD600]">1:1 밀착 컨설팅</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">전략은 강의로 배우고,<br />당신의 것으로 완성합니다.</h2>
          </div>
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-base leading-8 text-zinc-400 sm:text-lg">좋은 방법을 아는 것과 내 상황에 적용하는 것은 전혀 다른 문제입니다. 실제 경험부터 지원 기업, 자기소개서와 면접 답변까지 함께 점검합니다.</p>
              <p className="mt-6 border-l-4 border-[#FFD600] pl-5 text-xl font-black leading-8 text-white">매주 1:1,<br />당신만의 방향을 함께.</p>
              <ul className="mt-8 grid gap-3 text-sm font-bold text-zinc-200 sm:grid-cols-2">
                {['주차별 1:1 밀착 컨설팅', '개인별 경험·핵심 강점 분석', '지원 기업·직무 전략 설계', '과제와 실제 지원 서류 피드백', '운영 기간 내 카카오톡 피드백'].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD600]" />{item}</li>)}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-sm font-black text-white">실제 컨설팅은 이렇게 진행됩니다.</p>
              <div className="overflow-hidden rounded-2xl border border-zinc-700 bg-black">
                <video
                  className="aspect-video w-full bg-black object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  poster={consultingPreviewPoster}
                  aria-label="실제 1대1 밀착 컨설팅 미리보기"
                  onPlay={() => void trackAnalyticsEvent({ eventName: 'bootcamp_consulting_video_play', buttonLocation: 'consulting_video', bootcampCohort: 9 })}
                >
                  <source src={consultingPreviewVideo} type="video/mp4" />
                </video>
                <div className="border-t border-zinc-800 px-4 py-3 text-sm leading-6 text-zinc-400">실제 리포지셔닝 1:1 컨설팅 진행 모습 · 약 1분 미리보기 · 개인정보 가림 처리</div>
              </div>
            </div>
          </div>
          <p className="mt-12 text-center text-2xl font-black text-white">혼자 고민하던 취업에서, <span className="text-[#FFD600]">함께 전략을 만드는 취업으로.</span></p>
        </div>
      </section>

      <section id="planner-j" className="scroll-mt-28 bg-white px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-4xl text-center [word-break:keep-all]">
            <p className="text-sm font-black tracking-[0.14em] text-amber-700">ABOUT PLANNER J</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">상품을 선택하게 만드는 전략,<br />사람에게는 왜 적용하지 않을까요?</h2>
          </div>
          <div className="mx-auto mt-10 max-w-3xl border-l border-zinc-300 pl-6 sm:pl-10">
            <p className="text-lg font-black leading-8">국내외 주요 광고대행사 및 국내 대기업에서의 전략기획 경험</p>
            <p className="mt-2 text-sm font-bold text-zinc-500">광고 · 브랜딩 · 마케팅 · 사업전략</p>
            <div className="mt-8 space-y-5 text-base leading-8 text-zinc-600">
              <p>시장에서 선택받기 위한 전략을 설계해왔습니다. 그리고 기업과 브랜드에 적용하던 전략적 사고를 개인의 취업과 이직에 적용하기 시작했습니다.</p>
              <p>취업도 결국 선택의 문제입니다. 그럴듯하게 포장하는 것이 아니라, 가진 가치가 제대로 평가받도록 만드는 것. 그것이 리포지셔닝을 만든 이유입니다.</p>
            </div>
            <p className="mt-9 text-2xl font-black leading-9">저를 만난 순간,<br />당신은 이미 ‘기획자’입니다.</p>
            <p className="mt-4 text-sm font-bold text-zinc-500">기획자 J 드림.</p>
          </div>
        </div>
      </section>

      {reviewsSection}

      <section id="situation-reviews" className="scroll-mt-28 bg-[#F5F5F3] px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center [word-break:keep-all]">
            <p className="text-sm font-black tracking-[0.14em] text-amber-700">YOUR STORY COULD BE NEXT.</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">당신과 같은 고민에서<br />시작했던 사람들.</h2>
            <p className="mt-5 text-base leading-8 text-zinc-600">서로 다른 스펙과 상황. 직접 리포지셔닝을 경험한 사람들의 이야기를 확인해보세요.</p>
          </div>

          <div className="mt-9 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="수강 전 고민별 후기">
            {situationReviews.map(([situation], index) => <button key={situation} type="button" role="tab" aria-selected={activeSituation === index} onClick={() => setActiveSituation(index)} className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-black ${activeSituation === index ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-300 bg-white text-zinc-600'}`}>{situation}</button>)}
          </div>

          {activeSituationReview && (
            <button type="button" onClick={() => openReview(activeSituationReview)} className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white p-6 text-left transition hover:border-zinc-400 sm:p-8" role="tabpanel">
              <p className="text-sm font-black text-amber-700">{situationReviews[activeSituation][0]}</p>
              <h3 className="mt-4 text-xl font-black leading-8 sm:text-2xl">“{activeSituationReview.title}”</h3>
              <p className="mt-4 line-clamp-4 text-sm leading-7 text-zinc-600 sm:text-base">{activeSituationReview.content}</p>
              <p className="mt-5 border-t border-zinc-200 pt-4 text-xs font-bold text-zinc-500">{activeSituationReview.author} · 후기 원문 보기</p>
            </button>
          )}

          <div className="mt-12 text-center">
            <p className="text-2xl font-black">당신의 이야기도 새롭게 시작할 수 있습니다.</p>
            <a href="#real-reviews" className="mt-6 inline-flex min-h-12 items-center rounded-xl border border-zinc-900 px-6 text-sm font-black">실제 수강생 후기 전체 보기</a>
          </div>
        </div>
      </section>

      <ReviewDetailModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </>
  );
};
