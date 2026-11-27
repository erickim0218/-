import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Images, X } from 'lucide-react';
import { BootcampResultEvidence, fetchPublishedResultEvidence } from '../lib/bootcampResultEvidence';
import { trackAnalyticsEvent } from '../lib/analytics';

const VERIFIED_BEFORE: Record<string, string> = {
  'review-01': '서류를 넣어도 감감무소식이었던 구직 상황',
  'review-07': '계속되는 서류 탈락으로 면접 기회를 얻기 어려웠던 상황',
  'review-09': 'AI에 의존해 질문에 맞는 답을 찾기 어려웠던 취업 준비',
  'review-10': '중간에 포기하고 싶고 의욕이 떨어졌던 취업 준비',
  'review-11': '이력서 열람과 면접 제안이 적었던 이직 준비'
};

function evidenceVisibility(index: number, expanded: boolean) {
  if (expanded || index < 4) return 'block';
  if (index < 6) return 'hidden sm:block';
  return 'hidden';
}

export function PublishedResultEvidenceGallery() {
  const [items, setItems] = useState<BootcampResultEvidence[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    void fetchPublishedResultEvidence().then(setItems).catch(() => setItems([]));
  }, []);

  const selected = selectedIndex === null ? null : items[selectedIndex];
  const activeImages = selected?.image_urls || [];
  const featuredIndex = useMemo(() => {
    const index = items.findIndex((item) => item.is_featured);
    return index >= 0 ? index : 0;
  }, [items]);
  const featured = items[featuredIndex];
  const rest = items.map((item, index) => ({ item, index })).filter(({ index }) => index !== featuredIndex);

  const goPrevious = () => {
    if (selectedIndex === null) return;
    if (imageIndex > 0) {
      setImageIndex((value) => value - 1);
      return;
    }
    const nextSelected = (selectedIndex - 1 + items.length) % items.length;
    setSelectedIndex(nextSelected);
    setImageIndex(Math.max(0, (items[nextSelected].image_urls?.length || 1) - 1));
  };

  const goNext = () => {
    if (selectedIndex === null) return;
    if (imageIndex < activeImages.length - 1) {
      setImageIndex((value) => value + 1);
      return;
    }
    setSelectedIndex((selectedIndex + 1) % items.length);
    setImageIndex(0);
  };

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null);
      if (event.key === 'ArrowLeft') goPrevious();
      if (event.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  // selected and image navigation intentionally refresh the keyboard handler.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, selected, imageIndex]);

  if (items.length === 0) return null;

  const open = (index: number) => {
    setImageIndex(0);
    setSelectedIndex(index);
    void trackAnalyticsEvent({ eventName: 'bootcamp_result_open', buttonLocation: items[index].case_key, bootcampCohort: 9 });
  };

  return (
    <section id="actual-reviews" className="scroll-mt-28 border-y border-zinc-800 bg-[#09090B] px-4 py-14 sm:px-8 sm:py-24" aria-label="공개 동의가 확인된 실제 성과 원본">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center [word-break:keep-all]">
          <p className="text-sm font-black tracking-[0.14em] text-[#FFD600]">REAL RESULTS</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">전략이 달라지자,<br />결과가 달라지기 시작했습니다.</h2>
          <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">서류합격부터 최종합격까지.<br />공개 동의와 개인정보 검수를 마친 실제 결과입니다.</p>
        </div>

        <button type="button" onClick={() => open(featuredIndex)} className="mt-9 grid w-full overflow-hidden rounded-2xl border border-zinc-700 bg-[#141417] text-left transition hover:border-[#FFD600] lg:grid-cols-[1.08fr_0.92fr]" aria-label={`${featured.headline} 개인정보 제거 원본 보기`}>
          <div className="flex min-h-72 items-center justify-center bg-black p-3 sm:p-5">
            {featured.image_urls?.[0] ? (
              <img src={featured.image_urls[0]} alt={featured.image_alt} className="max-h-[38rem] w-full rounded-xl object-contain" fetchPriority="high" />
            ) : <ImageIcon className="h-10 w-10 text-zinc-700" />}
          </div>
          <div className="flex flex-col justify-center p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FFD600] px-3 py-1 text-xs font-black text-zinc-950">{featured.category}</span>
              <span className="text-xs font-bold text-zinc-500">{featured.profile}</span>
            </div>
            <h3 className="mt-4 text-2xl font-black leading-9 text-white sm:text-4xl sm:leading-tight">{featured.headline}</h3>
            <p className="mt-5 border-l-2 border-[#FFD600] pl-4 text-base font-bold leading-7 text-zinc-200">“{featured.quote}”</p>
            {VERIFIED_BEFORE[featured.case_key] && <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"><p className="text-[11px] font-black text-zinc-500">수강 전 고민</p><p className="mt-2 text-sm leading-6 text-zinc-300">{VERIFIED_BEFORE[featured.case_key]}</p></div>}
            <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"><p className="text-[11px] font-black text-[#FFD600]">확인된 변화</p><p className="mt-2 text-sm leading-6 text-zinc-300">{featured.summary}</p></div>
            <p className="mt-5 flex items-center gap-2 text-xs font-bold leading-5 text-zinc-500"><Images className="h-4 w-4" />{featured.evidence_type} · 개인정보 제거 원본 {featured.image_urls?.length || featured.image_paths.length}장</p>
          </div>
        </button>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map(({ item, index }, restIndex) => (
            <button key={item.case_key} type="button" onClick={() => open(index)} className={`${evidenceVisibility(restIndex, expanded)} overflow-hidden rounded-xl border border-zinc-800 bg-[#111114] text-left transition hover:border-zinc-600`} aria-label={`${item.headline} 개인정보 제거 원본 보기`}>
              <div className="flex h-60 items-center justify-center bg-black p-2 sm:h-72">
                {item.image_urls?.[0] ? <img src={item.image_urls[0]} alt={item.image_alt} className="h-full w-full rounded-lg object-contain" loading="lazy" /> : <ImageIcon className="h-8 w-8 text-zinc-700" />}
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-[#FFD600]/30 bg-[#FFD600]/5 px-2.5 py-1 text-[11px] font-black text-[#FFD600]">{item.category}</span><span className="text-[11px] font-bold text-zinc-500">{item.profile}</span></div>
                <h3 className="mt-3 text-base font-black leading-6 text-white sm:text-lg sm:leading-7">{item.headline}</h3>
                <p className="mt-3 text-sm font-bold leading-6 text-zinc-300">“{item.quote}”</p>
                {VERIFIED_BEFORE[item.case_key] && <p className="mt-4 text-xs leading-5 text-zinc-500"><strong className="text-zinc-400">수강 전</strong> · {VERIFIED_BEFORE[item.case_key]}</p>}
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500"><strong className="text-zinc-400">변화</strong> · {item.summary}</p>
                <p className="mt-4 border-t border-zinc-800 pt-4 text-[11px] font-bold leading-5 text-zinc-500">{item.evidence_type} · 원본 확대</p>
              </div>
            </button>
          ))}
        </div>

        {rest.length > 4 && <div className="mt-7 text-center"><button type="button" onClick={() => { setExpanded((value) => !value); void trackAnalyticsEvent({ eventName: 'bootcamp_reviews_more_click', buttonLocation: 'real_results', bootcampCohort: 9 }); }} className="min-h-12 rounded-xl border border-zinc-700 px-6 text-sm font-black text-white transition hover:border-[#FFD600]">{expanded ? '후기 접기' : '실제 후기 더 보기'}</button></div>}
        <p className="mt-6 text-center text-xs leading-6 text-zinc-500">실제 전달받은 개별 사례이며 개인에 따라 결과는 달라질 수 있습니다. 이미지 수는 수강생 수나 합격률을 의미하지 않습니다.</p>
      </div>

      {selected && <div className="fixed inset-0 z-[75] flex items-end justify-center bg-black/90 backdrop-blur-sm sm:items-center sm:p-5" onClick={(event) => event.target === event.currentTarget && setSelectedIndex(null)}>
        <article role="dialog" aria-modal="true" aria-labelledby="evidence-modal-title" className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl border border-zinc-700 bg-[#111114] px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:max-w-4xl sm:rounded-3xl sm:p-8">
          <button ref={closeRef} type="button" onClick={() => setSelectedIndex(null)} aria-label="성과 원본 닫기" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/80 text-white"><X className="h-5 w-5" /></button>
          <p className="pr-14 text-xs font-black text-[#FFD600]">{selected.category} · {selected.profile}</p>
          <h3 id="evidence-modal-title" className="mt-2 pr-14 text-xl font-black leading-8 text-white sm:text-3xl">{selected.headline}</h3>
          {activeImages.length > 0 && <div className="relative mt-5 flex min-h-60 items-center justify-center overflow-hidden rounded-2xl bg-black">
            <img src={activeImages[imageIndex]} alt={`${selected.image_alt} ${imageIndex + 1}`} className="max-h-[65dvh] w-full object-contain" />
            <button type="button" aria-label="이전 후기 또는 이미지" onClick={goPrevious} className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/75 text-white"><ChevronLeft /></button>
            <button type="button" aria-label="다음 후기 또는 이미지" onClick={goNext} className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/75 text-white"><ChevronRight /></button>
          </div>}
          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-zinc-500"><span>후기 {(selectedIndex || 0) + 1}/{items.length}</span><span>이미지 {imageIndex + 1}/{Math.max(1, activeImages.length)}</span></div>
          <p className="mt-5 whitespace-pre-line border-l-2 border-[#FFD600] pl-4 text-base font-bold leading-7 text-zinc-200">“{selected.quote}”{selected.quote2 ? `\n“${selected.quote2}”` : ''}</p>
          <p className="mt-4 text-sm leading-7 text-zinc-400">확인된 변화 · {selected.summary}</p>
          <p className="mt-3 text-xs leading-6 text-zinc-500">{selected.evidence_type} · {selected.source}</p>
        </article>
      </div>}
    </section>
  );
}
