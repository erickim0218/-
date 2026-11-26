import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, Star, X } from 'lucide-react';
import { BOOTCAMP_REVIEWS, BootcampReview } from '../data/bootcampReviews';
import { trackAnalyticsEvent } from '../lib/analytics';

type ReviewFilter = '전체' | '최종합격' | '서류합격' | '면접' | '이직' | '컨설팅';

const FILTERS: ReviewFilter[] = ['전체', '최종합격', '서류합격', '면접', '이직', '컨설팅'];

function getReviewFilters(review: BootcampReview): ReviewFilter[] {
  const text = `${review.title} ${review.content} ${review.highlightTag || ''}`;
  const filters: ReviewFilter[] = [];
  if (/최종|최합|합격해서.*출근|합격했습니다/.test(text)) filters.push('최종합격');
  if (/서류|서합|자소서/.test(text)) filters.push('서류합격');
  if (/면접|완벽통제/.test(text)) filters.push('면접');
  if (/이직|재취업|연봉|경력직|커리어/.test(text)) filters.push('이직');
  if (/컨설팅|피드백|첨삭|화상통화/.test(text)) filters.push('컨설팅');
  return filters;
}

function ReviewStars({ rating }: { rating: number }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5 text-[#FFD600]" aria-label={`별점 ${rating}점`}>
      {Array.from({ length: rating }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  );
}

export function ReviewDetailModal({ review, onClose }: { review: BootcampReview | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!review) return;
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
  }, [review, onClose]);

  if (!review) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby={`review-title-${review.id}`}
        className="relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[1.5rem] border border-zinc-700 bg-[#151519] px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 shadow-2xl sm:max-w-2xl sm:rounded-[1.5rem] sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700"
          aria-label="후기 원문 닫기"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-12">
          <ReviewStars rating={review.rating} />
          {review.highlightTag && (
            <p className="mt-4 text-sm font-bold text-[#FFD600]">{review.highlightTag}</p>
          )}
          <h3 id={`review-title-${review.id}`} className="mt-3 text-xl font-black leading-8 text-white sm:text-2xl">
            {review.title}
          </h3>
        </div>

        <p className="mt-6 whitespace-pre-line border-y border-zinc-800 py-6 text-base leading-8 text-zinc-200">
          {review.content}
        </p>

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
          <span className="font-mono font-bold text-zinc-200">{review.author}</span>
          <span>{review.date} · 수강 후기 원문</span>
        </footer>
      </article>
    </div>
  );
}

function ReviewCard({ review, featured = false, onOpen }: { review: BootcampReview; featured?: boolean; onOpen: (review: BootcampReview) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(review)}
      className={`group flex w-full flex-col text-left transition hover:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600] ${
        featured
          ? 'rounded-2xl border border-zinc-700 bg-[#151519] p-6 sm:p-8'
          : 'rounded-xl border border-zinc-800 bg-[#111114] p-5'
      }`}
      aria-label={`${review.title} 후기 원문 보기`}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <ReviewStars rating={review.rating} />
        <span className="text-xs text-zinc-500">{review.date}</span>
      </div>
      {review.highlightTag && (
        <span className="mt-4 w-fit rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-bold text-zinc-300">
          {review.highlightTag.replace(/^[^\p{L}\p{N}]+/u, '')}
        </span>
      )}
      <h3 className={`mt-3 font-black text-white group-hover:text-[#FFD600] ${featured ? 'text-xl leading-8 sm:text-2xl' : 'text-base leading-6'}`}>
        “{review.title}”
      </h3>
      <p className={`mt-3 text-zinc-400 ${featured ? 'line-clamp-4 text-base leading-7' : 'line-clamp-3 text-sm leading-6'}`}>
        {review.content}
      </p>
      <div className="mt-auto flex w-full items-center justify-between gap-3 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
        <span className="font-mono font-bold text-zinc-300">{review.author}</span>
        <span className="font-bold text-zinc-300">원문 보기</span>
      </div>
    </button>
  );
}

interface BootcampReviewsShowcaseProps {
  reviews?: BootcampReview[];
}

export const BootcampReviewsShowcase: React.FC<BootcampReviewsShowcaseProps> = ({ reviews }) => {
  const reviewSource = reviews?.length ? reviews : BOOTCAMP_REVIEWS;
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('전체');
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedReview, setSelectedReview] = useState<BootcampReview | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedView = useRef(false);

  const featured = useMemo(
    () => ['5'].map((id) => reviewSource.find((review) => review.id === id)).filter((review): review is BootcampReview => Boolean(review)),
    [reviewSource]
  );

  const remainingReviews = useMemo(() => reviewSource.filter((review) => !featured.some((item) => item.id === review.id)), [featured, reviewSource]);

  const filteredReviews = useMemo(() => {
    if (activeFilter === '전체') return remainingReviews;
    return remainingReviews.filter((review) => getReviewFilters(review).includes(activeFilter));
  }, [activeFilter, remainingReviews]);

  const averageRating = useMemo(() => {
    const rated = reviewSource.filter((review) => review.rating > 0);
    if (!rated.length) return null;
    return rated.reduce((sum, review) => sum + review.rating, 0) / rated.length;
  }, [reviewSource]);

  const counts = useMemo(() => Object.fromEntries(FILTERS.map((filter) => [
    filter,
    filter === '전체' ? reviewSource.length : reviewSource.filter((review) => getReviewFilters(review).includes(filter)).length
  ])), [reviewSource]);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasTrackedView.current) {
        hasTrackedView.current = true;
        void trackAnalyticsEvent({ eventName: 'bootcamp_reviews_view', buttonLocation: 'top_reviews', bootcampCohort: 9 });
      }
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const openReview = (review: BootcampReview) => {
    setSelectedReview(review);
    void trackAnalyticsEvent({ eventName: 'bootcamp_review_open', buttonLocation: `review_${review.id}`, bootcampCohort: 9 });
  };

  const selectFilter = (filter: ReviewFilter) => {
    setActiveFilter(filter);
    setVisibleCount(3);
    void trackAnalyticsEvent({ eventName: 'bootcamp_review_filter', buttonLocation: filter, bootcampCohort: 9 });
  };

  return (
    <section ref={sectionRef} id="real-reviews" className="scroll-mt-28 border-b border-zinc-800 bg-[#0B0B0E] px-4 py-14 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black tracking-[0.14em] text-[#FFD600]">REAL REVIEWS</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl">직접 경험한 사람들이<br />리포지셔닝을 이야기합니다.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              기획자J의 설명보다 실제 수강생들이 남긴 평가를 먼저 확인해보세요.
            </p>
          </div>
          <div className="flex items-center gap-5 rounded-xl border border-zinc-800 bg-[#111114] px-5 py-4">
            <div>
              <p className="text-xs font-bold text-zinc-500">기존 공개 후기</p>
              <p className="mt-1 text-2xl font-black text-white">{reviewSource.length}<span className="ml-1 text-sm text-zinc-500">건</span></p>
            </div>
            {averageRating !== null && (
              <div className="border-l border-zinc-800 pl-5">
                <p className="text-xs font-bold text-zinc-500">평점 등록 후기 평균</p>
                <p className="mt-1 text-2xl font-black text-white">{averageRating.toFixed(1)}<span className="ml-1 text-sm text-zinc-500">/ 5.0</span></p>
              </div>
            )}
          </div>
        </div>

        <p className="mt-10 text-xs font-black tracking-[0.12em] text-zinc-500">대표 후기</p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {featured.map((review) => <div key={review.id} className="flex"><ReviewCard review={review} featured onOpen={openReview} /></div>)}
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="후기 분류">
          {FILTERS.filter((filter) => counts[filter] > 0).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => selectFilter(filter)}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold transition ${activeFilter === filter ? 'border-[#FFD600] bg-[#FFD600] text-black' : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500'}`}
            >
              {filter} <span className="ml-1 opacity-60">{counts[filter]}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {filteredReviews.slice(0, visibleCount).map((review) => {
            const compact = review.content.length < 150;
            return <div key={review.id} className={`flex ${compact ? 'col-span-1' : 'col-span-2 lg:col-span-1'}`}><ReviewCard review={review} onOpen={openReview} /></div>;
          })}
        </div>

        {visibleCount < filteredReviews.length && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setVisibleCount((count) => count + 6);
                void trackAnalyticsEvent({ eventName: 'bootcamp_reviews_more', buttonLocation: activeFilter, bootcampCohort: 9 });
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-zinc-700 px-6 text-sm font-black text-white transition hover:border-[#FFD600]"
            >
              실제 수강생 후기 더 보기
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}

        <p className="mt-6 text-xs leading-6 text-zinc-500">평점이 등록된 후기만 평균에 포함합니다. 성과 메시지와 구매 인증 여부가 확인되지 않은 자료는 별도 지표로 합산하지 않습니다.</p>

        <div className="mt-12 border-t border-zinc-800 pt-12 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-[#FFD600]" />
          <h3 className="mt-4 text-2xl font-black text-white sm:text-3xl">대체 무엇을 바꿨길래,<br />이런 결과가 나오는 걸까요?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-zinc-400">
            경험을 새로 만드는 것이 아니라, 이미 가진 경험을 기업에 전달하는 방식을 다시 설계하는 것.
          </p>
          <p className="mt-6 text-xl font-black leading-8 text-white">스펙은 바꾸지 않습니다.<br /><span className="text-[#FFD600]">읽히는 방식을 바꿉니다.</span></p>
          <p className="mt-6 text-sm font-bold text-zinc-500">지금부터 리포지셔닝의 전략을 소개합니다.</p>
        </div>
      </div>

      <ReviewDetailModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </section>
  );
};

export { getReviewFilters };
