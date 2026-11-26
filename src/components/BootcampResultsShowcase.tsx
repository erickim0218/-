import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Award, BriefcaseBusiness, FileCheck2, MessageSquareText, X } from 'lucide-react';
import { BOOTCAMP_REVIEWS, BootcampReview } from '../data/bootcampReviews';
import { trackAnalyticsEvent } from '../lib/analytics';

interface ResultCase {
  id: string;
  stage: '최종합격' | '서류합격' | '면접 기회';
  profile: string;
  headline: string;
  summary: string;
  quotes: string[];
  reviewIds: string[];
  featured?: boolean;
  before?: string[];
  after?: string[];
}

const RESULT_CASES: ResultCase[] = [
  {
    id: 'career-final-two',
    stage: '최종합격',
    profile: '마케팅 · 경력직',
    headline: '서류를 넣어도 감감무소식. 그리고 최종합격 2곳.',
    summary: '자소서와 포트폴리오를 다시 구성한 뒤 여러 면접을 거쳐 두 기업의 최종합격 소식을 전한 사례입니다.',
    quotes: ['그동안은 서류넣어도 감감무소식이었는데', '최종으로는 2군데에 합격했습니다.'],
    reviewIds: ['13', '14'],
    featured: true,
    before: ['퇴사 후 구직 중', '지원 후에도 감감무소식', '수강 결정에 대한 부담'],
    after: ['자소서·포트폴리오 전면 개선', '복수 기업 면접 진행', '최종합격 2곳 소식 공유']
  },
  {
    id: 'agency-final',
    stage: '최종합격',
    profile: '광고·마케팅 · 경력직',
    headline: '원하던 종합대행사 최종합격.',
    summary: '이력서·자기소개서·포트폴리오와 면접 방향을 정리한 뒤 최종합격과 출근 소식을 전했습니다.',
    quotes: ['결국 원하던 종대사 합격해서 담달부터 출근합니다!!'],
    reviewIds: ['1']
  },
  {
    id: 'self-written-pass',
    stage: '서류합격',
    profile: '자기소개서 · 직접 작성',
    headline: '스스로 설계한 자소서로 서류통과.',
    summary: '문장 첨삭에 머무르지 않고 사고 과정과 구조를 익혀 직접 작성한 자기소개서로 서류통과 소식을 전했습니다.',
    quotes: ['스스로 글을 설계하는 힘을 기를 수 있었던 점이 가장 좋았습니다.'],
    reviewIds: ['8']
  },
  {
    id: 'career-interviews',
    stage: '면접 기회',
    profile: '마케팅 · 경력직',
    headline: '자소서와 포트폴리오 개선 후 면접 기회.',
    summary: '자소서와 포트폴리오를 정리한 뒤 두 기업의 면접 기회를 얻었다고 직접 전한 사례입니다.',
    quotes: ['J님 덕분에 자소서랑 포폴 잘 만들어서 면접 2군데 갑니다'],
    reviewIds: ['16']
  },
  {
    id: 'first-document-pass',
    stage: '서류합격',
    profile: '신입 취업 준비',
    headline: '계속된 서류 탈락에서 첫 합격으로.',
    summary: '자기소개서 작성 구조를 익힌 뒤 첫 서류합격과 면접 경험을 공유한 사례입니다.',
    quotes: ['최근 첫 번째 서류 합격해서 면접도 보고 왔습니다'],
    reviewIds: ['24']
  }
];

function ResultIcon({ stage }: { stage: ResultCase['stage'] }) {
  if (stage === '최종합격') return <Award className="h-5 w-5" />;
  if (stage === '서류합격') return <FileCheck2 className="h-5 w-5" />;
  return <BriefcaseBusiness className="h-5 w-5" />;
}

function ResultEvidenceModal({ item, reviews, onClose }: { item: ResultCase | null; reviews: BootcampReview[]; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!item) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [item, onClose]);

  if (!item) return null;
  const evidence = item.reviewIds.map((id) => reviews.find((review) => review.id === id)).filter((review): review is BootcampReview => Boolean(review));

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <article role="dialog" aria-modal="true" aria-labelledby={`result-title-${item.id}`} className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl border border-zinc-700 bg-[#151519] px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 shadow-2xl sm:max-w-3xl sm:rounded-3xl sm:p-8">
        <button ref={closeRef} type="button" onClick={onClose} aria-label="성과 원문 닫기" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 text-white"><X className="h-5 w-5" /></button>
        <p className="pr-14 text-sm font-black text-[#FFD600]">{item.stage} · {item.profile}</p>
        <h3 id={`result-title-${item.id}`} className="mt-3 pr-12 text-2xl font-black leading-9 text-white">{item.headline}</h3>
        <p className="mt-4 text-sm leading-7 text-zinc-400">운영자 요약 · {item.summary}</p>

        <div className="mt-7 space-y-4">
          {evidence.map((review, index) => (
            <section key={review.id} className="rounded-2xl border border-zinc-800 bg-[#0F0F12] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-zinc-500">
                <span>수강생이 작성한 후기 원문{evidence.length > 1 ? ` ${index + 1}` : ''}</span>
                <span>{review.date}</span>
              </div>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-zinc-200">{review.content}</p>
              <p className="mt-5 border-t border-zinc-800 pt-4 font-mono text-xs font-bold text-zinc-400">작성자 {review.author}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

export function BootcampResultsShowcase({ reviews = BOOTCAMP_REVIEWS }: { reviews?: BootcampReview[] }) {
  const [selectedCase, setSelectedCase] = useState<ResultCase | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackedRef = useRef(false);
  const cases = useMemo(() => RESULT_CASES.filter((item) => item.reviewIds.some((id) => reviews.some((review) => review.id === id))), [reviews]);
  const featured = cases.find((item) => item.featured);
  const rest = cases.filter((item) => !item.featured);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !trackedRef.current) {
        trackedRef.current = true;
        void trackAnalyticsEvent({ eventName: 'bootcamp_results_view', buttonLocation: 'real_results', bootcampCohort: 9 });
      }
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const openCase = (item: ResultCase) => {
    setSelectedCase(item);
    void trackAnalyticsEvent({ eventName: 'bootcamp_result_open', buttonLocation: item.id, bootcampCohort: 9 });
  };

  return (
    <section ref={sectionRef} id="actual-reviews" className="scroll-mt-28 border-y border-zinc-800 bg-[#09090B] px-4 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black tracking-[0.14em] text-[#FFD600]">REAL RESULTS</p>
        <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">전략이 달라지자,<br />결과가 달라지기 시작했습니다.</h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">서류합격부터 최종합격까지. 기존에 공개된 수강 후기에서 확인되는 변화와 결과를 먼저 보여드립니다.</p>

        {featured && (
          <button type="button" onClick={() => openCase(featured)} className="mt-9 w-full rounded-2xl border border-zinc-700 bg-[#141417] p-5 text-left transition hover:border-[#FFD600] sm:p-8" aria-label={`${featured.headline} 원문 확인`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-[#FFD600] px-3 py-1 text-xs font-black text-zinc-950">BEST REPOSITIONING STORY</span>
              <span className="text-sm font-bold text-zinc-400">{featured.profile}</span>
            </div>
            <h3 className="mt-5 text-2xl font-black leading-9 text-white sm:text-4xl sm:leading-tight">{featured.headline}</h3>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-[#0D0D10] p-5">
                <p className="text-xs font-black tracking-[0.12em] text-zinc-500">BEFORE</p>
                <ul className="mt-3 space-y-2 text-sm font-bold leading-6 text-zinc-300">{featured.before?.map((item) => <li key={item}>· {item}</li>)}</ul>
              </div>
              <div className="rounded-xl border border-[#FFD600]/30 bg-[#FFD600]/5 p-5">
                <p className="text-xs font-black tracking-[0.12em] text-[#FFD600]">AFTER</p>
                <ul className="mt-3 space-y-2 text-sm font-bold leading-6 text-white">{featured.after?.map((item) => <li key={item}>· {item}</li>)}</ul>
              </div>
            </div>
            <div className="mt-5 space-y-2 border-l-2 border-[#FFD600] pl-4 text-base font-bold leading-7 text-zinc-200">{featured.quotes.map((quote) => <p key={quote}>“{quote}”</p>)}</div>
            <p className="mt-5 text-xs font-bold text-zinc-500">수강생 직접 작성 후기 · 동일 작성자의 후기 2건을 하나의 사례로 통합 · 원문 확인</p>
          </button>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {rest.map((item) => (
            <button key={item.id} type="button" onClick={() => openCase(item)} className="flex min-h-56 flex-col rounded-xl border border-zinc-800 bg-[#111114] p-4 text-left transition hover:border-zinc-600 sm:p-5" aria-label={`${item.headline} 원문 확인`}>
              <div className="flex items-center gap-2 text-xs font-black text-[#FFD600]"><ResultIcon stage={item.stage} />{item.stage}</div>
              <p className="mt-3 text-xs font-bold leading-5 text-zinc-500">{item.profile}</p>
              <h3 className="mt-3 text-base font-black leading-6 text-white sm:text-lg sm:leading-7">{item.headline}</h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">“{item.quotes[0]}”</p>
              <div className="mt-auto flex items-center gap-2 border-t border-zinc-800 pt-4 text-xs font-bold text-zinc-300"><MessageSquareText className="h-4 w-4" />원문 확인</div>
            </button>
          ))}
        </div>

        <p className="mt-7 text-xs leading-6 text-zinc-500">선별된 기존 공개 후기를 결과 단계에 맞춰 재구성했습니다. 수강생이 직접 작성한 개별 사례이며 개인에 따라 결과는 달라질 수 있습니다.</p>
      </div>
      <ResultEvidenceModal item={selectedCase} reviews={reviews} onClose={() => setSelectedCase(null)} />
    </section>
  );
}
