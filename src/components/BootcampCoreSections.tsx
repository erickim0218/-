import React, { useState } from 'react';
import { Check, CheckCircle2, Quote } from 'lucide-react';
import { BOOTCAMP_REVIEWS, BootcampReview } from '../data/bootcampReviews';
import { trackAnalyticsEvent } from '../lib/analytics';
import { ReviewDetailModal } from './BootcampReviewsShowcase';
import strategyPyramidImg from '../assets/images/bootcamp-story/strategy-pyramid-v2.webp';
import aiToolsStrategyImg from '../assets/images/bootcamp-story/ai-tools-strategy.png';
import beforeAfterImg from '../assets/images/bootcamp-story/before-after.png';
import consultingPreviewVideo from '../assets/videos/one-to-one-consulting-preview.mp4';
import consultingPreviewPoster from '../assets/images/bootcamp-story/consulting-preview-poster.jpg';

function InlineReview({ reviewId, onOpen }: { reviewId: string; onOpen: (review: BootcampReview) => void }) {
  const review = BOOTCAMP_REVIEWS.find((item) => item.id === reviewId);
  if (!review) return null;
  return (
    <button
      type="button"
      onClick={() => onOpen(review)}
      className="mt-6 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-left transition hover:border-zinc-400"
      aria-label={`${review.title} 후기 원문 보기`}
    >
      <Quote className="h-5 w-5 text-amber-500" />
      <p className="mt-3 line-clamp-3 text-sm font-bold leading-6 text-zinc-800">“{review.title}”</p>
      <p className="mt-3 text-xs font-bold text-zinc-500">{review.author} · 원문 보기</p>
    </button>
  );
}

export const BootcampCoreSections: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<BootcampReview | null>(null);

  const openReview = (review: BootcampReview) => {
    setSelectedReview(review);
    void trackAnalyticsEvent({ eventName: 'bootcamp_review_open', buttonLocation: `curriculum_${review.id}`, bootcampCohort: 9 });
  };

  return (
    <>
      <section id="why-repositioning" className="scroll-mt-28 bg-white px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black text-amber-600">노력의 방향을 다시 봐야 할 때</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">
              아직도 합격하지 못한 이유가<br className="hidden sm:block" /> 스펙 때문이라고 생각하시나요?
            </h2>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-3 border-l-4 border-[#FFD600] pl-5 text-lg font-bold leading-8 text-zinc-700">
              <p>자격증을 하나 더 취득하고,</p>
              <p>자기소개서를 수십 번 고쳐보고,</p>
              <p>AI에게 더 좋은 답변을 요청하고,</p>
              <p>남들의 합격 자소서를 분석하고.</p>
            </div>
            <div>
              <p className="text-lg leading-8 text-zinc-600">
                그렇게 열심히 준비했는데도 결과가 달라지지 않았다면, 이제는 노력의 양이 아니라 <strong className="text-zinc-950">노력의 방향</strong>을 점검해야 합니다.
              </p>
              <p className="mt-6 text-lg leading-8 text-zinc-600">
                기업은 취업 준비를 얼마나 열심히 했는지만으로 사람을 선택하지 않습니다. 자신들에게 필요한 역량을 가진 사람인지, 그 역량을 충분히 증명할 수 있는 사람인지를 평가합니다.
              </p>
              <p className="mt-6 text-xl font-black leading-8 text-zinc-950">
                그렇다면 취업 준비도<br />기업이 당신을 선택해야 할 이유에서 시작해야 하지 않을까요?
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-[#0B0B0E] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-black text-[#FFD600]">AI 시대의 취업 전략</p>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                모두가 AI를 쓰는 시대,<br />당신의 경쟁력은 무엇인가요?
              </h2>
              <p className="mt-6 text-base leading-8 text-zinc-400 sm:text-lg">
                AI는 경험을 정리하고 더 좋은 문장을 만들어줄 수 있습니다. 그러나 기업이 왜 당신을 선택해야 하는지, 그 답은 당신의 경험과 기업의 니즈를 연결하는 전략에서 시작합니다.
              </p>
              <p className="mt-6 text-xl font-black leading-8 text-white">
                AI를 더 잘 쓰는 사람을 넘어,<br /><span className="text-[#FFD600]">남들이 따라 할 수 없는 나만의 이야기로.</span>
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
              className="h-auto w-full rounded-2xl border border-zinc-800 bg-[#101827]"
              loading="lazy"
            />
            <div className="rounded-2xl border border-zinc-800 bg-[#111114] p-6 sm:p-8">
              <h3 className="text-2xl font-black text-white">리포지셔닝은 무엇인가요?</h3>
              <p className="mt-5 text-base leading-8 text-zinc-400">
                당신의 경험과 역량을 기업의 채용 니즈에 맞춰 재해석하고, 기업이 당신을 선택해야 할 이유를 설계하는 취업·이직 전략입니다.
              </p>
              <p className="mt-5 text-base leading-8 text-zinc-400">
                스펙을 과장하거나 새로운 경험을 만들어내지 않습니다. 이미 가지고 있는 가치를 제대로 읽히게 만듭니다.
              </p>
              <div className="mt-7 border-t border-zinc-800 pt-6 text-lg font-black leading-8 text-white">
                스펙의 재해석 → 나만 말할 수 있는 스토리 → <span className="text-[#FFD600]">기업이 선택할 이유</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xl font-black text-white sm:text-2xl">그렇다면 부트캠프에서는 구체적으로 어떤 전략을 배우게 될까요?</p>
          </div>
        </div>
      </section>

      <section id="bootcamp-schedule" className="scroll-mt-28 bg-[#F5F5F3] px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black tracking-[0.14em] text-amber-700">YOUR 3-WEEK REPOSITIONING</p>
          <h2 className="mt-4 text-3xl font-black tracking-[-0.045em] sm:text-5xl">단 3주, 당신의 취업 전략을 다시 설계합니다.</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">
            듣고 끝나는 강의가 아닙니다. 매주 배운 전략을 실제 경험과 지원 기업에 적용하고, 1:1 컨설팅으로 구체화합니다.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-black text-amber-700">WEEK 01 · 자기설득서</p>
              <h3 className="mt-4 text-2xl font-black leading-8">자신을 소개하지 마세요.<br />필요한 이유를 설득하세요.</h3>
              <p className="mt-5 text-base leading-7 text-zinc-600">기업이 필요로 하는 역량을 파악하고, 경험을 그 역량의 근거로 재구성합니다.</p>
              <ul className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm font-bold text-zinc-700">
                {['취업 전략의 재정의', '주장·근거·어필 설계', '경험과 강점의 재해석', '자기소개서 → 자기설득서'].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}
              </ul>
              <p className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm font-bold leading-6 text-zinc-700">무엇을 선택하고 어떤 역량을 증명해야 하는지 판단할 수 있게 됩니다.</p>
              <InlineReview reviewId="17" onOpen={openReview} />
            </article>

            <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-black text-amber-700">WEEK 02 · 완벽통제면접</p>
              <h3 className="mt-4 text-2xl font-black leading-8">면접, 통제할 것인가.<br />통제를 당할 것인가.</h3>
              <p className="mt-5 text-base leading-7 text-zinc-600">답변을 외우는 면접에서 벗어나, 면접관이 내 강점에 주목하도록 흐름을 설계합니다.</p>
              <ul className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm font-bold text-zinc-700">
                {['퍼스트임팩트', '꼬리물기', '임팩트5', '프레임전환'].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}
              </ul>
              <p className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm font-bold leading-6 text-zinc-700">예상 질문이 아니라, 반드시 전달할 핵심 메시지를 중심으로 준비합니다.</p>
              <InlineReview reviewId="14" onOpen={openReview} />
            </article>

            <article className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
              <p className="text-sm font-black text-amber-700">WEEK 03 · 취업 STP / REAL NEEDS</p>
              <h3 className="mt-4 text-2xl font-black leading-8">뽑고 싶은 사람은<br />채용공고 너머에 있습니다.</h3>
              <p className="mt-5 text-base leading-7 text-zinc-600">기업의 진짜 채용 니즈를 분석하고, 이력서와 포트폴리오를 설득의 도구로 바꿉니다.</p>
              <ul className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm font-bold text-zinc-700">
                {['취업 STP 전략', '기업 REAL NEEDS 분석', 'REAL NEEDS 이력서', '완벽설득 포트폴리오'].map((item) => <li key={item} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />{item}</li>)}
              </ul>
              <p className="mt-6 rounded-lg bg-zinc-100 p-4 text-sm font-bold leading-6 text-zinc-700">기업이 필요한 역량을 분석하고, 내 경험을 그에 맞춰 전달합니다.</p>
              <InlineReview reviewId="9" onOpen={openReview} />
            </article>
          </div>

          <div className="mt-10 rounded-2xl bg-zinc-950 p-6 text-white sm:p-8">
            <div className="grid gap-6 md:grid-cols-[0.65fr_1.35fr] md:items-center">
              <div>
                <p className="text-sm font-black text-[#FFD600]">9기 실제 운영 일정</p>
                <h3 className="mt-3 text-2xl font-black">강의 → 과제 → 1:1 컨설팅</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['1주차', '10월 24일', '4시간 강의 · 1차 컨설팅'],
                  ['2주차', '10월 31일', '2시간 강의 · 2차 컨설팅'],
                  ['3주차', '11월 7일', '1시간 강의 · 3차 컨설팅']
                ].map(([week, date, detail]) => (
                  <div key={week} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <p className="text-xs font-black text-[#FFD600]">{week}</p>
                    <p className="mt-2 text-lg font-black">{date}</p>
                    <p className="mt-1 text-sm text-zinc-400">{detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-5 border-t border-zinc-800 pt-5 text-sm leading-6 text-zinc-400">과제 및 피드백: 10월 25일~30일, 11월 1일~6일 · 다음 기수 일정은 상담 시 별도 안내</p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-black">배우는 것은 전략. 가져가는 것은 당신만의 취업 전략.</p>
            <p className="mt-3 text-base text-zinc-600">이번 취업뿐 아니라 앞으로의 커리어에서도 스스로 활용할 사고방식을 익힙니다.</p>
          </div>
        </div>
      </section>

      <section id="one-to-one" className="scroll-mt-28 border-y border-zinc-800 bg-[#0D0E12] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black tracking-[0.14em] text-[#FFD600]">NOT JUST A CLASS.</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">강의만 들으러 오셨다면,<br />굳이 부트캠프일 필요는 없습니다.</h2>
              <p className="mt-6 text-base leading-8 text-zinc-400 sm:text-lg">좋은 전략을 아는 것과 내 상황에 적용하는 것은 전혀 다른 문제입니다. 실제 경험과 지원 기업, 자기소개서와 면접 전략을 기획자J와 함께 점검합니다.</p>
              <p className="mt-6 border-l-4 border-[#FFD600] pl-5 text-xl font-black leading-8 text-white">당신의 전략을<br />당신 혼자 만들게 하지 않습니다.</p>
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
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="text-sm font-black tracking-[0.14em] text-amber-700">ABOUT PLANNER J</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">상품을 선택하게 만드는 전략,<br />사람에게는 왜 적용하지 않을까요?</h2>
          </div>
          <div className="border-l border-zinc-300 pl-6 sm:pl-10">
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

      <section id="situation-reviews" className="scroll-mt-28 bg-[#F5F5F3] px-4 py-16 text-zinc-950 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-black tracking-[0.14em] text-amber-700">YOUR STORY COULD BE NEXT.</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">당신과 같은 고민에서<br />시작했던 사람들.</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">서로 다른 스펙과 상황. 직접 리포지셔닝을 경험한 사람들의 이야기를 확인해보세요.</p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ['계속되는 서류 탈락이 고민이라면', '24'],
              ['면접만 가면 자신감이 떨어진다면', '14'],
              ['경력은 있지만 이직이 어렵다면', '9'],
              ['내 스펙에 경쟁력이 없다고 느낀다면', '15'],
              ['오랜 취업 준비로 지쳐 있다면', '5'],
              ['다른 취업 컨설팅과 무엇이 다른지 궁금하다면', '8']
            ].map(([situation, reviewId]) => {
              const review = BOOTCAMP_REVIEWS.find((item) => item.id === reviewId);
              if (!review) return null;
              return (
                <button key={reviewId} type="button" onClick={() => openReview(review)} className="rounded-2xl border border-zinc-200 bg-white p-6 text-left transition hover:border-zinc-400">
                  <p className="text-sm font-black text-amber-700">{situation}</p>
                  <h3 className="mt-4 text-lg font-black leading-7">“{review.title}”</h3>
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-zinc-600">{review.content}</p>
                  <p className="mt-5 border-t border-zinc-200 pt-4 text-xs font-bold text-zinc-500">{review.author} · 후기 원문 보기</p>
                </button>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-2xl font-black">당신의 이야기도 새롭게 시작할 수 있습니다.</p>
            <a href="#actual-reviews" className="mt-6 inline-flex min-h-12 items-center rounded-xl border border-zinc-900 px-6 text-sm font-black">실제 수강생 후기 전체 보기</a>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-[#0B0B0E] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <img src={beforeAfterImg} alt="경험 나열형 자기소개서가 기업의 니즈와 연결된 설득형 자기소개서로 달라지는 과정" className="h-auto w-full rounded-2xl border border-zinc-800" loading="lazy" />
          <div>
            <p className="text-sm font-black text-[#FFD600]">수강생 전용 자료실</p>
            <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">배운 전략을 바로 꺼내 쓸 수 있도록.</h2>
            <p className="mt-5 text-base leading-8 text-zinc-400">부트캠프 수강생은 별도 결제 없이 프로자료 전체와 실제 지원에 활용할 프롬프트를 열람할 수 있습니다.</p>
            <ul className="mt-7 grid gap-3 text-sm font-bold text-zinc-200 sm:grid-cols-2">
              {['자기설득서', '완벽통제면접', '취업 STP 전략', 'REAL NEEDS 이력서', '완벽설득 포트폴리오', '프로자료 실전 프롬프트'].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD600]" />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <ReviewDetailModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </>
  );
};
