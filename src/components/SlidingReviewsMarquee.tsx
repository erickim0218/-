import React from 'react';
import { Star, Sparkles, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { BOOTCAMP_REVIEWS } from '../data/bootcampReviews';

export const SlidingReviewsMarquee: React.FC = () => {
  // Reviews list with tags prioritized
  const taggedReviews = BOOTCAMP_REVIEWS.filter(r => r.highlightTag || r.title.length > 10);
  
  // Duplicate array for seamless infinite looping
  const row1 = [...taggedReviews, ...taggedReviews];
  const row2 = [...BOOTCAMP_REVIEWS.slice().reverse(), ...BOOTCAMP_REVIEWS.slice().reverse()];

  return (
    <div className="w-full bg-zinc-900 border-y border-zinc-800 py-6 overflow-hidden relative select-none">
      
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
          <span className="text-zinc-500 text-[11px]">(마우스 올리면 멈춤)</span>
        </div>
      </div>

      {/* MARQUEE ROW 1 (Right to Left) */}
      <div className="relative w-full overflow-hidden py-2 mb-3">
        {/* Left/Right Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0D0D11] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0D0D11] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-4 hover:[animation-play-state:paused]">
          {row1.map((review, idx) => (
            <div
              key={`row1-${review.id}-${idx}`}
              className="w-80 sm:w-96 shrink-0 p-4 rounded-2xl bg-[#16161B] border border-zinc-800 hover:border-[#FFD600]/60 transition-all shadow-lg flex flex-col justify-between"
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

                <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
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

        <div className="animate-marquee-slow flex gap-4 hover:[animation-play-state:paused]">
          {row2.map((review, idx) => (
            <div
              key={`row2-${review.id}-${idx}`}
              className="w-80 sm:w-96 shrink-0 p-4 rounded-2xl bg-[#141418] border border-zinc-800/90 hover:border-[#FFD600]/60 transition-all shadow-md flex flex-col justify-between"
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

                <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">
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
  );
};
