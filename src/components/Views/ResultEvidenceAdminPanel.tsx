import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, FileArchive, Image as ImageIcon, Loader2, ShieldCheck, Upload } from 'lucide-react';
import {
  BootcampResultEvidence,
  fetchAdminResultEvidence,
  importResultEvidenceZip,
  updateResultEvidenceReview
} from '../../lib/bootcampResultEvidence';

export function ResultEvidenceAdminPanel() {
  const [items, setItems] = useState<BootcampResultEvidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await fetchAdminResultEvidence());
    } catch (caught: any) {
      setError(caught?.message || '성과 자료를 불러오지 못했습니다. 데이터베이스 마이그레이션 적용 여부를 확인해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const result = await importResultEvidenceZip(file);
      const excluded = result.excludedCaseKeys.length > 0
        ? ` 최신 통합본에 없는 기존 사례 ${result.excludedCaseKeys.length}건은 삭제하지 않고 고객 화면 노출만 중단했습니다.`
        : '';
      setMessage(`${result.caseCount}개 사례와 ${result.imageCount}개 이미지를 가져왔습니다. 신규 사례는 동의 미확인·비공개 상태입니다.${excluded}`);
      await load();
    } catch (caught: any) {
      setError(caught?.message || 'ZIP 가져오기에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (item: BootcampResultEvidence, consent: boolean, published: boolean) => {
    setError('');
    setMessage('');
    try {
      await updateResultEvidenceReview(item.case_key, {
        publication_consent_confirmed: consent,
        is_published: published
      });
      setMessage(published ? '공개 동의 확인 및 고객 화면 게시 상태로 변경했습니다.' : '검수 상태를 저장했습니다.');
      await load();
    } catch (caught: any) {
      setError(caught?.message || '상태 변경에 실패했습니다.');
    }
  };

  return (
    <section className="space-y-5 rounded-2xl border border-zinc-700 bg-[#101014] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-white"><ShieldCheck className="h-5 w-5 text-[#FFD600]" />실제 성과 증빙 검수</div>
          <p className="mt-2 text-xs leading-6 text-zinc-400">공개 동의 전 이미지는 비공개 저장소에서 관리자만 확인합니다. 동의 확인 후 개별 게시하세요.</p>
        </div>
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-4 py-2 text-xs font-black text-zinc-950">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? '가져오는 중' : '후기 ZIP 가져오기'}
          <input type="file" accept=".zip,application/zip" className="sr-only" onChange={handleImport} disabled={uploading} />
        </label>
      </div>

      {message && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-300">{message}</p>}
      {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-bold leading-6 text-rose-300">{error}</p>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-zinc-900 p-4"><p className="text-[11px] text-zinc-500">등록 사례</p><p className="mt-1 font-mono text-xl font-black text-white">{items.length}</p></div>
        <div className="rounded-xl bg-zinc-900 p-4"><p className="text-[11px] text-zinc-500">등록 이미지</p><p className="mt-1 font-mono text-xl font-black text-white">{items.reduce((sum, item) => sum + item.image_paths.length, 0)}</p></div>
        <div className="rounded-xl bg-zinc-900 p-4"><p className="text-[11px] text-zinc-500">동의 확인</p><p className="mt-1 font-mono text-xl font-black text-white">{items.filter((item) => item.publication_consent_confirmed).length}</p></div>
        <div className="rounded-xl bg-zinc-900 p-4"><p className="text-[11px] text-zinc-500">고객 화면 게시</p><p className="mt-1 font-mono text-xl font-black text-white">{items.filter((item) => item.is_published).length}</p></div>
      </div>

      {loading ? (
        <div className="flex min-h-32 items-center justify-center text-zinc-500"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 text-center">
          <FileArchive className="h-8 w-8 text-zinc-600" />
          <p className="mt-3 text-sm font-bold text-zinc-300">아직 가져온 성과 자료가 없습니다.</p>
          <p className="mt-1 text-xs text-zinc-500">최신 통합 ZIP을 선택하면 이미지와 사례 데이터를 비공개 저장소에서 검수할 수 있습니다.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article key={item.case_key} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
                <span className="rounded bg-[#FFD600]/10 px-2 py-1 text-[#FFD600]">{item.category}</span>
                <span className="text-zinc-500">{item.profile}</span>
                {item.is_published ? <span className="ml-auto flex items-center gap-1 text-emerald-400"><Eye className="h-3 w-3" />게시 중</span> : <span className="ml-auto flex items-center gap-1 text-zinc-500"><EyeOff className="h-3 w-3" />비공개</span>}
              </div>
              <h3 className="mt-3 text-sm font-black leading-6 text-white">{item.headline}</h3>
              <p className="mt-2 text-xs leading-5 text-zinc-400">“{item.quote}”</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {(item.image_urls || []).map((url, index) => (
                  <a key={url} href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
                    <img src={url} alt={`${item.image_alt} ${index + 1}`} className="h-36 w-full object-contain" loading="lazy" />
                  </a>
                ))}
                {item.image_paths.length > 0 && (item.image_urls || []).length === 0 && (
                  <div className="col-span-2 flex h-24 items-center justify-center gap-2 rounded-lg bg-zinc-900 text-xs text-zinc-500"><ImageIcon className="h-4 w-4" />이미지 접근 권한을 확인해 주세요.</div>
                )}
              </div>
              <p className="mt-3 text-[11px] leading-5 text-zinc-500">{item.evidence_type} · {item.source}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => void updateStatus(item, !item.publication_consent_confirmed, false)} className={`min-h-10 rounded-lg px-3 text-xs font-black ${item.publication_consent_confirmed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-300'}`}>
                  {item.publication_consent_confirmed ? '동의 확인됨' : '동의 미확인'}
                </button>
                <button type="button" disabled={!item.publication_consent_confirmed} onClick={() => void updateStatus(item, true, !item.is_published)} className={`min-h-10 rounded-lg px-3 text-xs font-black disabled:cursor-not-allowed disabled:opacity-40 ${item.is_published ? 'bg-zinc-800 text-zinc-300' : 'bg-[#FFD600] text-zinc-950'}`}>
                  {item.is_published ? '고객 화면 숨기기' : '고객 화면 게시'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
