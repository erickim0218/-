import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import { BootcampResultEvidence, fetchPublishedResultEvidence } from '../lib/bootcampResultEvidence';
import { trackAnalyticsEvent } from '../lib/analytics';

export function PublishedResultEvidenceGallery() {
  const [items, setItems] = useState<BootcampResultEvidence[]>([]);
  const [selected, setSelected] = useState<BootcampResultEvidence | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    void fetchPublishedResultEvidence().then(setItems).catch(() => setItems([]));
  }, []);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowLeft') setImageIndex((value) => Math.max(0, value - 1));
      if (event.key === 'ArrowRight') setImageIndex((value) => Math.min((selected.image_urls?.length || 1) - 1, value + 1));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selected]);

  if (items.length === 0) return null;
  const featured = items.find((item) => item.is_featured) || items[0];
  const rest = items.filter((item) => item.case_key !== featured.case_key);
  const open = (item: BootcampResultEvidence) => {
    setImageIndex(0);
    setSelected(item);
    void trackAnalyticsEvent({ eventName: 'bootcamp_result_open', buttonLocation: item.case_key, bootcampCohort: 9 });
  };
  const activeImages = selected?.image_urls || [];

  return (
    <section className="border-b border-zinc-800 bg-[#09090B] px-4 pb-14 sm:px-8 sm:pb-20" aria-label="공개 동의가 확인된 실제 성과 원본">
      <div className="mx-auto max-w-6xl">
        <p className="mb-5 text-center text-xs font-bold leading-6 text-zinc-500">공개 동의와 개인정보 검수를 마친 실제 메시지 및 채용 안내 원본</p>
        <button type="button" onClick={() => open(featured)} className="grid w-full overflow-hidden rounded-2xl border border-zinc-700 bg-[#141417] text-left transition hover:border-[#FFD600] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-black p-3 sm:p-5">
            {featured.image_urls?.[0] ? <img src={featured.image_urls[0]} alt={featured.image_alt} className="max-h-[34rem] w-full rounded-xl object-contain" /> : <div className="flex min-h-60 items-center justify-center text-zinc-600"><ImageIcon /></div>}
          </div>
          <div className="p-5 sm:p-8">
            <span className="inline-flex rounded-full bg-[#FFD600] px-3 py-1 text-xs font-black text-zinc-950">{featured.category}</span>
            <p className="mt-4 text-xs font-bold text-zinc-500">{featured.profile}</p>
            <h3 className="mt-3 text-2xl font-black leading-9 text-white sm:text-4xl sm:leading-tight">{featured.headline}</h3>
            <p className="mt-5 border-l-2 border-[#FFD600] pl-4 text-base font-bold leading-7 text-zinc-200">“{featured.quote}”</p>
            <p className="mt-5 text-xs font-bold leading-5 text-zinc-500">{featured.evidence_type} · {featured.source} · 원본 확대</p>
          </div>
        </button>

        {rest.length > 0 && <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {rest.map((item) => <button key={item.case_key} type="button" onClick={() => open(item)} className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111114] text-left transition hover:border-zinc-600">
            <div className="bg-black p-2">{item.image_urls?.[0] ? <img src={item.image_urls[0]} alt={item.image_alt} className="max-h-64 w-full rounded-lg object-contain" loading="lazy" /> : <div className="flex h-36 items-center justify-center text-zinc-600"><ImageIcon /></div>}</div>
            <div className="p-3 sm:p-4"><p className="text-[11px] font-black text-[#FFD600]">{item.category}</p><h3 className="mt-2 text-sm font-black leading-5 text-white sm:text-base sm:leading-6">{item.headline}</h3><p className="mt-3 text-[11px] leading-5 text-zinc-500">{item.evidence_type}</p></div>
          </button>)}
        </div>}
        <p className="mt-5 text-center text-xs leading-6 text-zinc-500">실제 전달받은 개별 사례이며 개인에 따라 결과는 달라질 수 있습니다.</p>
      </div>

      {selected && <div className="fixed inset-0 z-[75] flex items-end justify-center bg-black/90 backdrop-blur-sm sm:items-center sm:p-5" onClick={(event) => event.target === event.currentTarget && setSelected(null)}>
        <article role="dialog" aria-modal="true" className="relative max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl border border-zinc-700 bg-[#111114] px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-5 sm:max-w-4xl sm:rounded-3xl sm:p-8">
          <button type="button" autoFocus onClick={() => setSelected(null)} aria-label="성과 원본 닫기" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/80 text-white"><X className="h-5 w-5" /></button>
          <p className="pr-14 text-xs font-black text-[#FFD600]">{selected.category} · {selected.profile}</p>
          <h3 className="mt-2 pr-14 text-xl font-black leading-8 text-white sm:text-3xl">{selected.headline}</h3>
          {activeImages.length > 0 && <div className="relative mt-5 overflow-hidden rounded-2xl bg-black">
            <img src={activeImages[imageIndex]} alt={`${selected.image_alt} ${imageIndex + 1}`} className="max-h-[65dvh] w-full object-contain" />
            {activeImages.length > 1 && <>
              <button type="button" aria-label="이전 이미지" disabled={imageIndex === 0} onClick={() => setImageIndex((value) => Math.max(0, value - 1))} className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/75 text-white disabled:opacity-30"><ChevronLeft /></button>
              <button type="button" aria-label="다음 이미지" disabled={imageIndex === activeImages.length - 1} onClick={() => setImageIndex((value) => Math.min(activeImages.length - 1, value + 1))} className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/75 text-white disabled:opacity-30"><ChevronRight /></button>
            </>}
          </div>}
          <p className="mt-5 whitespace-pre-line border-l-2 border-[#FFD600] pl-4 text-base font-bold leading-7 text-zinc-200">“{selected.quote}”{selected.quote2 ? `\n“${selected.quote2}”` : ''}</p>
          <p className="mt-4 text-sm leading-7 text-zinc-400">운영자 요약 · {selected.summary}</p>
        </article>
      </div>}
    </section>
  );
}
