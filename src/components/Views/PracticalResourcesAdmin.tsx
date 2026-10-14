import React, { useCallback, useEffect, useState } from 'react';
import {
  Download,
  Eye,
  EyeOff,
  FileUp,
  Loader2,
  LockKeyhole,
  RefreshCw,
  Trash2,
  Upload,
  Users
} from 'lucide-react';
import {
  createPracticalResource,
  deletePracticalResource,
  fetchPracticalResources,
  formatResourceSize,
  PRACTICAL_CATEGORY_LABELS,
  PracticalResource,
  PracticalResourceAccess,
  PracticalResourceCategory,
  setPracticalResourcePublished
} from '../../lib/practicalResources';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function normalizeResourceTitle(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/^\[(무료자료|프로자료)\]\s*/u, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferResourceCategory(fileName: string): PracticalResourceCategory {
  const normalized = fileName.toLowerCase();
  if (normalized.includes('포트폴리오')) return 'portfolio';
  if (normalized.includes('면접')) return 'interview';
  if (normalized.includes('자소서') || normalized.includes('자기설득서')) return 'cover_letter';
  if (normalized.includes('이력서') || normalized.includes('real needs')) return 'resume';
  if (normalized.includes('이직') || normalized.includes('stp')) return 'job_change';
  return 'career';
}

function inferResourceDescription(fileName: string) {
  const normalized = fileName.toLowerCase();
  if (normalized.includes('포트폴리오') && normalized.includes('프롬프트')) {
    return '지원 직무에 맞는 설득형 포트폴리오를 설계할 수 있도록 구성한 실전 프롬프트입니다.';
  }
  if (normalized.includes('포트폴리오') && normalized.includes('예시')) {
    return '완벽설득포트폴리오의 구성과 흐름을 실제 예시로 확인할 수 있는 자료입니다.';
  }
  if (normalized.includes('포트폴리오')) {
    return '경험 나열을 넘어, 기업이 나를 선택할 이유를 보여주는 포트폴리오 설계 방법입니다.';
  }
  if (normalized.includes('면접')) {
    return '면접의 흐름을 통제하고 답변의 설득력을 높이는 완벽통제면접 실전 자료입니다.';
  }
  if (normalized.includes('자소서') || normalized.includes('자기설득서')) {
    return '자기소개서를 나를 소개하는 글이 아닌, 채용을 설득하는 자기설득서로 바꾸는 방법입니다.';
  }
  if (normalized.includes('사용방법') && normalized.includes('이력서')) {
    return 'REAL NEEDS 이력서의 작성 원리와 활용 방법을 예시와 함께 확인하는 자료입니다.';
  }
  if (normalized.includes('이력서') || normalized.includes('real needs')) {
    return '기업의 REAL NEEDS에 맞춰 경험을 다시 배치하고 읽히는 방식을 바꾸는 이력서 자료입니다.';
  }
  if (normalized.includes('이직') || normalized.includes('stp')) {
    return '취업 STP 전략으로 이직 시장과 목표 직무를 분석하고 방향을 정리하는 자료입니다.';
  }
  return '취업과 이직 과정에서 바로 활용할 수 있는 기획자J의 리포지셔닝 실전 자료입니다.';
}

function getHelpfulError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes('practical_resources') || message.includes('practical-resources')) {
    return '자료실 DB 또는 Storage가 아직 준비되지 않았습니다. Supabase 마이그레이션을 먼저 적용해 주세요.';
  }
  return message || '처리 중 오류가 발생했습니다.';
}

export const PracticalResourcesAdmin: React.FC = () => {
  const [resources, setResources] = useState<PracticalResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<PracticalResourceCategory>('career');
  const [accessLevel, setAccessLevel] = useState<PracticalResourceAccess>('free');
  const [sortOrder, setSortOrder] = useState(0);
  const [externalUrl, setExternalUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const loadResources = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setResources(await fetchPracticalResources({ includeUnpublished: true }));
    } catch (loadError) {
      setError(getHelpfulError(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('career');
    setAccessLevel('free');
    setSortOrder(0);
    setExternalUrl('');
    setFile(null);
    const input = document.getElementById('practical-resource-file') as HTMLInputElement | null;
    if (input) input.value = '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!title.trim() || !description.trim()) {
      setError('자료명과 설명을 입력해 주세요.');
      return;
    }
    if (!file && !externalUrl.trim()) {
      setError('업로드할 파일 또는 외부 링크를 입력해 주세요.');
      return;
    }
    if (accessLevel === 'pro' && !file) {
      setError('PRO 자료는 권한 보호를 위해 파일로 업로드해 주세요.');
      return;
    }
    if (file && file.size > MAX_FILE_SIZE) {
      setError('파일은 50MB 이하만 업로드할 수 있습니다.');
      return;
    }

    setIsSaving(true);
    try {
      await createPracticalResource({
        title,
        description,
        category,
        accessLevel,
        sortOrder,
        file,
        externalUrl
      });
      resetForm();
      setMessage('실전활용 자료를 등록했습니다.');
      await loadResources();
    } catch (saveError) {
      setError(getHelpfulError(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles?.length) return;
    const files = Array.from(selectedFiles);
    const oversized = files.find((item) => item.size > MAX_FILE_SIZE);
    if (oversized) {
      setError(`${oversized.name}: 파일은 50MB 이하만 업로드할 수 있습니다.`);
      return;
    }

    setIsBulkSaving(true);
    setError('');
    setMessage('');
    try {
      for (let index = 0; index < files.length; index += 1) {
        const currentFile = files[index];
        const accessLevel: PracticalResourceAccess = currentFile.name.includes('[프로자료]') ? 'pro' : 'free';
        setBulkProgress(`${index + 1}/${files.length} · ${currentFile.name}`);
        await createPracticalResource({
          title: normalizeResourceTitle(currentFile.name),
          description: inferResourceDescription(currentFile.name),
          category: inferResourceCategory(currentFile.name),
          accessLevel,
          sortOrder: (index + 1) * 10,
          file: currentFile
        });
      }
      setMessage(`${files.length}개 자료를 무료/PRO로 구분해 등록했습니다.`);
      await loadResources();
    } catch (bulkError) {
      setError(`일괄 등록 중 중단되었습니다. ${getHelpfulError(bulkError)}`);
      await loadResources();
    } finally {
      setIsBulkSaving(false);
      setBulkProgress('');
      const input = document.getElementById('practical-resource-bulk-files') as HTMLInputElement | null;
      if (input) input.value = '';
    }
  };

  const handleTogglePublished = async (resource: PracticalResource) => {
    setError('');
    try {
      await setPracticalResourcePublished(resource.id, !resource.is_published);
      setResources((items) =>
        items.map((item) =>
          item.id === resource.id ? { ...item, is_published: !item.is_published } : item
        )
      );
    } catch (toggleError) {
      setError(getHelpfulError(toggleError));
    }
  };

  const handleDelete = async (resource: PracticalResource) => {
    if (!window.confirm(`“${resource.title}” 자료를 삭제하시겠습니까? 파일도 함께 삭제됩니다.`)) return;
    setError('');
    try {
      await deletePracticalResource(resource);
      setResources((items) => items.filter((item) => item.id !== resource.id));
      setMessage('자료를 삭제했습니다.');
    } catch (deleteError) {
      setError(getHelpfulError(deleteError));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-3xl border border-zinc-800 bg-[#121216] p-6 sm:p-8">
        <div className="flex flex-col gap-2 border-b border-zinc-800 pb-5">
          <span className="text-xs font-black tracking-[0.18em] text-[#FFD600]">PRACTICAL LIBRARY</span>
          <h2 className="text-xl font-black text-white">실전활용 자료 등록</h2>
          <p className="text-xs leading-relaxed text-zinc-400">
            무료자료는 누구나 내려받을 수 있고, PRO 자료는 활성 PRO·부트캠프 회원에게만 열립니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 lg:grid-cols-2">
          <label className="space-y-2 text-xs font-bold text-zinc-300">
            <span>자료명</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder="예: 경력직 이직 방향 점검표"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-[#FFD600]"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-2 text-xs font-bold text-zinc-300">
              <span>카테고리</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as PracticalResourceCategory)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-[#FFD600]"
              >
                {Object.entries(PRACTICAL_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-xs font-bold text-zinc-300">
              <span>노출 순서</span>
              <input
                type="number"
                value={sortOrder}
                onChange={(event) => setSortOrder(Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-white outline-none focus:border-[#FFD600]"
              />
            </label>
          </div>

          <label className="space-y-2 text-xs font-bold text-zinc-300 lg:col-span-2">
            <span>자료 설명</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              placeholder="누가, 언제, 어떻게 활용하면 좋은 자료인지 짧게 적어 주세요."
              className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-[#FFD600]"
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-xs font-bold text-zinc-300">공개 범위</legend>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAccessLevel('free')}
                className={`rounded-xl border px-4 py-3 text-xs font-black transition ${
                  accessLevel === 'free'
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                    : 'border-zinc-700 bg-zinc-950 text-zinc-500'
                }`}
              >
                무료자료
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccessLevel('pro');
                  setExternalUrl('');
                }}
                className={`rounded-xl border px-4 py-3 text-xs font-black transition ${
                  accessLevel === 'pro'
                    ? 'border-[#FFD600] bg-[#FFD600]/10 text-[#FFD600]'
                    : 'border-zinc-700 bg-zinc-950 text-zinc-500'
                }`}
              >
                PRO 자료
              </button>
            </div>
          </fieldset>

          <label className="space-y-2 text-xs font-bold text-zinc-300">
            <span>
              외부 링크{' '}
              <span className="font-normal text-zinc-600">(무료자료만 파일 대신 사용 가능)</span>
            </span>
            <input
              type="url"
              value={externalUrl}
              onChange={(event) => setExternalUrl(event.target.value)}
              disabled={accessLevel === 'pro'}
              placeholder="https://"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-[#FFD600] disabled:cursor-not-allowed disabled:opacity-40"
            />
          </label>

          <label className="lg:col-span-2 flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-5 hover:border-[#FFD600]/60">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFD600]/10 text-[#FFD600]">
              <FileUp className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-white">{file ? file.name : '파일 선택'}</span>
              <span className="mt-1 block text-xs text-zinc-500">PDF, Word, Excel, PPT, ZIP · 최대 50MB</span>
            </span>
            <input
              id="practical-resource-file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="sr-only"
            />
          </label>

          <div className="lg:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-7 py-3.5 text-sm font-black text-black transition hover:bg-yellow-300 disabled:opacity-60 sm:w-auto"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isSaving ? '업로드 중...' : '자료 등록하기'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-[#FFD600]/30 bg-[#FFD600]/[0.04] p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black tracking-[0.18em] text-[#FFD600]">BULK UPLOAD</span>
          <h2 className="text-xl font-black text-white">여러 자료 한 번에 등록</h2>
          <p className="text-xs leading-relaxed text-zinc-400">
            파일명의 [무료자료]·[프로자료]를 자동으로 구분하고 제목, 설명, 카테고리까지 설정합니다.
          </p>
        </div>
        <label className={`mt-5 flex items-center justify-center gap-3 rounded-2xl border border-dashed px-5 py-6 text-sm font-black transition ${
          isBulkSaving
            ? 'cursor-wait border-zinc-700 bg-zinc-950 text-zinc-500'
            : 'cursor-pointer border-[#FFD600]/50 bg-zinc-950 text-[#FFD600] hover:border-[#FFD600]'
        }`}>
          {isBulkSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span>{isBulkSaving ? bulkProgress : '파일 여러 개 선택하기'}</span>
          <input
            id="practical-resource-bulk-files"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
            disabled={isBulkSaving}
            onChange={(event) => handleBulkUpload(event.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      {(message || error) && (
        <div className={`rounded-xl border px-4 py-3 text-xs font-bold ${
          error
            ? 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
        }`}>
          {error || message}
        </div>
      )}

      <div className="rounded-3xl border border-zinc-800 bg-[#121216] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white">등록된 자료</h2>
            <p className="mt-1 text-xs text-zinc-500">공개 상태와 다운로드 권한을 관리합니다.</p>
          </div>
          <button
            type="button"
            onClick={loadResources}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-xs font-bold text-zinc-300"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-sm text-zinc-500">자료를 불러오고 있습니다.</div>
          ) : resources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-700 py-12 text-center text-sm text-zinc-500">
              아직 등록된 자료가 없습니다.
            </div>
          ) : resources.map((resource) => (
            <article key={resource.id} className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-1 text-[10px] font-black ${
                    resource.access_level === 'free'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-[#FFD600]/10 text-[#FFD600]'
                  }`}>
                    {resource.access_level === 'free' ? 'FREE' : 'PRO'}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-500">
                    {PRACTICAL_CATEGORY_LABELS[resource.category]}
                  </span>
                  {!resource.is_published && (
                    <span className="rounded-md bg-zinc-800 px-2 py-1 text-[10px] font-black text-zinc-400">비공개</span>
                  )}
                </div>
                <h3 className="mt-2 truncate text-sm font-black text-white">{resource.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">{resource.description}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-zinc-600">
                  <span>{resource.file_name || '외부 링크'}</span>
                  {resource.file_size ? <span>{formatResourceSize(resource.file_size)}</span> : null}
                  <span className="inline-flex items-center gap-1"><Download className="h-3 w-3" /> {resource.download_count || 0}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleTogglePublished(resource)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-zinc-700 px-3 py-2.5 text-xs font-bold text-zinc-300 hover:border-[#FFD600]/50 lg:flex-none"
                >
                  {resource.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {resource.is_published ? '숨기기' : '공개'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(resource)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 px-3 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/10 lg:flex-none"
                >
                  <Trash2 className="h-4 w-4" /> 삭제
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl bg-emerald-500/5 p-4 text-xs text-zinc-400">
            <Users className="h-4 w-4 shrink-0 text-emerald-400" />
            <span><strong className="text-emerald-300">무료자료</strong>는 비회원과 무료회원도 내려받을 수 있습니다.</span>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-[#FFD600]/5 p-4 text-xs text-zinc-400">
            <LockKeyhole className="h-4 w-4 shrink-0 text-[#FFD600]" />
            <span><strong className="text-[#FFD600]">PRO 자료</strong>는 활성 PRO·부트캠프 회원에게만 열립니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
