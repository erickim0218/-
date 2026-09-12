import React, { useState, useEffect, useRef } from 'react';
import { Star, Sparkles, CheckCircle2, MessageSquareQuote, X } from 'lucide-react';
import { BOOTCAMP_REVIEWS, BootcampReview } from '../data/bootcampReviews';

export const SlidingReviewsMarquee: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedReview, setSelectedReview] = useState<BootcampReview | null>(null);

  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Background body scroll lock when modal is open
  useEffect(() => {
    if (selectedReview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedReview]);

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reviews list with tags prioritized
  const taggedReviews = BOOTCAMP_REVIEWS.filter(r => r.highlightTag || r.title.length > 10);
  
  // Duplicate array for seamless infinite looping
  const row1 = [...taggedReviews, ...taggedReviews];
  const row2 = [...BOOTCAMP_REVIEWS.slice().reverse(), ...BOOTCAMP_REVIEWS.slice().reverse()];

  const handlePause = () => setIsPaused(true);
  const handleResume = () => {
    if (!selectedReview) {
      setIsPaused(false);
    }
  };

  const playState = (isPaused || reducedMotion || selectedReview) ? 'paused' : 'running';

  const handlePointerDown = (e: React.PointerEvent, review: BootcampReview) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
    handlePause();

    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      // Mobile / Tablet: long press 450ms
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      pressTimerRef.current = setTimeout(() => {
        if (!hasMovedRef.current) {
          setSelectedReview(review);
        }
      }, 450);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!startPosRef.current) return;
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    if (dx > 10 || dy > 10) {
      hasMovedRef.current = true;
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent, review: BootcampReview) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }

    // PC (mouse): click opens detail view immediately if not dragged
    if (e.pointerType === 'mouse' && !hasMovedRef.current) {
      setSelectedReview(review);
    }
    startPosRef.current = null;
  };

  const handlePointerCancel = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    startPosRef.current = null;
  };

  return (
    <>
      <div
        className="w-full bg-zinc-900 border-y border-zinc-800 py-6 overflow-hidden relative select-none"
        style={{ touchAction: 'pan-y' }}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onFocusCapture={handlePause}
        onBlurCapture={handleResume}
        onTouchStart={handlePause}
        onTouchEnd={handleResume}
        onTouchCancel={handleResume}
        onPointerDown={handlePause}
        onPointerUp={handleResume}
        onPointerCancel={handleResume}
      >
        
        {/* Background Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none" />

        {/* Header Info */}
        <div className="max-w-5xl mx-auto px-4 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative z-10">
          <div className="flex items-center gap-2.5">
            <MessageSquareQuote className="w-5 h-5 text-[#FFD600]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#FFD600] font-bold">실시간 수강 후기</span>
                <span className="text-xs text-zinc-400">· 수강생 서류 합격 입증</span>
              </div>
              <h3 className="text-base font-bold text-white">
                실제 수강생 생생 리뷰
              </h3>
            </div>
          </div>

          {/* Rating summary */}
          <div className="flex items-center gap-2 text-xs text-white">
            <div className="flex items-center text-[#FFD600]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FFD600]" />
              ))}
            </div>
            <span className="font-bold text-[#FFD600]">5.0 / 5.0</span>
            <span className="text-zinc-500 text-[11px]">(클릭 또는 길게 눌러 전체보기)</span>
          </div>
        </div>

        {/* MARQUEE ROW 1 (Right to Left) */}
        <div className="relative w-full overflow-hidden py-2 mb-3">
          {/* Left/Right Gradient Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0D0D11] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0D0D11] to-transparent z-10 pointer-events-none" />

          <div
            className="animate-marquee flex gap-4 cursor-pointer"
            style={{ animationPlayState: playState }}
          >
            {row1.map((review, idx) => (
              <div
                key={`row1-${review.id}-${idx}`}
                tabIndex={0}
                onPointerDown={(e) => handlePointerDown(e, review)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(e, review)}
                onPointerCancel={handlePointerCancel}
                className="w-80 sm:w-96 shrink-0 p-4 rounded-2xl bg-[#16161B] border border-zinc-800 hover:border-[#FFD600]/60 transition-all shadow-lg flex flex-col justify-between focus:outline-none focus:border-[#FFD600] cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-[#FFD600]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#FFD600]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{review.date}</span>
                  </div>

                  {review.highlightTag && (
                    <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#FFD600]/15 text-[#FFD600] border border-[#FFD600]/30 mb-2">
                      {review.highlightTag}
                    </span>
                  )}

                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-1 group-hover:text-[#FFD600] transition-colors">
                    "{review.title}"
                  </h4>

                  <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed font-normal">
                    {review.content}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono font-bold text-zinc-300">{review.author}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 수강생 인증
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MARQUEE ROW 2 (Right to Left - Offset Slower) */}
        <div className="relative w-full overflow-hidden py-2">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0D0D11] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0D0D11] to-transparent z-10 pointer-events-none" />

          <div
            className="animate-marquee-slow flex gap-4 cursor-pointer"
            style={{ animationPlayState: playState }}
          >
            {row2.map((review, idx) => (
              <div
                key={`row2-${review.id}-${idx}`}
                tabIndex={0}
                onPointerDown={(e) => handlePointerDown(e, review)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(e, review)}
                onPointerCancel={handlePointerCancel}
                className="w-80 sm:w-96 shrink-0 p-4 rounded-2xl bg-[#141418] border border-zinc-800/90 hover:border-[#FFD600]/60 transition-all shadow-md flex flex-col justify-between focus:outline-none focus:border-[#FFD600] cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-[#FFD600]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#FFD600]" />
                      ))}
                    </div>
                    <span className="text-[10px] text-[#FFD600] font-bold">98.6% 수강만족</span>
                  </div>

                  {review.highlightTag && (
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
                      {review.highlightTag}
                    </span>
                  )}

                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-1 group-hover:text-[#FFD600] transition-colors">
                    "{review.title}"
                  </h4>

                  <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                    {review.content}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono">{review.author}</span>
                  <span className="text-zinc-500">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Review Detail Modal / Expanded View */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedReview(null);
          }}
        >
          <style>{`
            @keyframes reviewModalIn {
              from {
                opacity: 0;
                transform: scale(0.97);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
          <div
            className="bg-[#18181C] border border-zinc-700/80 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative text-left"
            style={{ animation: 'reviewModalIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-zinc-700 flex items-center justify-center transition cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4 pr-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#FFD600]">
                  {[...Array(selectedReview.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FFD600]" />
                  ))}
                </div>
                <span className="text-xs font-mono text-zinc-400">{selectedReview.date}</span>
              </div>

              {selectedReview.highlightTag && (
                <span className="inline-block text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#FFD600]/15 text-[#FFD600] border border-[#FFD600]/30">
                  {selectedReview.highlightTag}
                </span>
              )}

              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                "{selectedReview.title}"
              </h3>

              <div className="pt-2 pb-4 border-b border-zinc-800">
                <p className="text-sm sm:text-base text-zinc-200 whitespace-pre-line leading-relaxed font-normal">
                  {selectedReview.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-zinc-200">{selectedReview.author}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 수강생 인증 완료
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition text-xs cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
