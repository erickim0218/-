import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  Download,
  ExternalLink,
  FileArchive,
  FileText,
  Eye,
  Loader2,
  Lock,
  MessageSquare,
  RefreshCw,
  Sparkles,
  X
} from 'lucide-react';
import { MemberTier } from '../../types';
import {
  fetchPracticalResources,
  formatResourceSize,
  getMyMarketingConsent,
  getPracticalResourceDownloadName,
  getPracticalResourceUrl,
  getPracticalResourcePreviewUrl,
  PRACTICAL_CATEGORY_LABELS,
  PracticalResource,
  recordPracticalResourceDownload,
  setMyMarketingConsent
} from '../../lib/practicalResources';
import { SelfPersuasionBook } from '../SelfPersuasionBook';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export type PracticalSubTab = 'resources' | 'persuasion' | 'interview';

interface PracticalViewProps {
  currentTier: MemberTier;
  activeSubTab?: PracticalSubTab;
  onSubTabChange?: (subTab: PracticalSubTab) => void;
  onTabChange: (tab: string) => void;
}

const tabItems: Array<{
  id: PracticalSubTab;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'resources', title: '무료자료', shortTitle: '무료자료', icon: Download },
  { id: 'persuasion', title: '프로 전용 실전자료', shortTitle: '프로 전용', icon: Sparkles }
];

const PaidContentLock: React.FC<{
  title: string;
  description: string;
  onTabChange: (tab: string) => void;
}> = ({ title, description, onTabChange }) => (
  <div className="mx-auto max-w-3xl rounded-3xl border border-[#FFD600]/25 bg-[#121216] p-8 text-center shadow-2xl sm:p-12">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FFD600]/30 bg-[#FFD600]/10 text-[#FFD600]">
      <Lock className="h-8 w-8" />
    </div>
    <span className="mt-6 block text-xs font-black tracking-[0.18em] text-[#FFD600]">PRO CONTENT</span>
    <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">{title}</h2>
    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">{description}</p>
    <button
      type="button"
      onClick={() => onTabChange('pro-payment')}
      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-7 py-4 text-sm font-black text-black transition hover:bg-yellow-300 sm:w-auto"
    >
      프로로 시작하기
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
);

const ResourceCard: React.FC<{
  resource: PracticalResource;
  canUsePro: boolean;
  isDownloading: boolean;
  onDownload: (resource: PracticalResource) => void;
  onUpgrade: () => void;
  onPreview: (resource: PracticalResource) => void;
}> = ({ resource, canUsePro, isDownloading, onDownload, onUpgrade, onPreview }) => {
  const isLocked = resource.access_level === 'pro' && !canUsePro;
  const normalizedTitle = resource.title.toLowerCase();
  const isPdf = resource.mime_type === 'application/pdf' || resource.file_name?.toLowerCase().endsWith('.pdf');
  const canPreview = Boolean(isPdf && !normalizedTitle.includes('예시') && !normalizedTitle.includes('프롬프트'));

  return (
    <article className={`group relative overflow-hidden rounded-3xl border shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition ${
      resource.access_level === 'pro'
        ? 'border-[#FFD600]/35 bg-gradient-to-br from-[#1d1b0e] via-[#151516] to-[#101014] hover:border-[#FFD600]/70'
        : 'border-white/15 bg-gradient-to-br from-[#1b1b20] via-[#151518] to-[#101014] hover:border-[#FFD600]/45'
    }`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFD600]/80 to-transparent" />
      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_260px] md:items-stretch lg:gap-10 lg:p-10">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-3 py-1.5 text-[10px] font-black tracking-wide ${resource.access_level === 'pro' ? 'bg-[#FFD600] text-black' : 'border border-[#FFD600]/30 bg-[#FFD600]/10 text-[#FFD600]'}`}>
              {resource.access_level === 'pro' ? 'PRO 자료' : '무료자료'}
            </span>
            <span className="rounded-md bg-white/10 px-3 py-1.5 text-[10px] font-bold text-zinc-300">{PRACTICAL_CATEGORY_LABELS[resource.category]}</span>
          </div>
          <h3 className="mt-6 text-xl font-black leading-tight text-white sm:text-2xl">{resource.title}</h3>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-[15px]">{resource.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-bold text-zinc-500">
            <span className="rounded-full border border-white/10 px-3 py-1.5">PDF 실전자료</span>
            {canPreview ? <span className="rounded-full border border-white/10 px-3 py-1.5">5페이지 미리보기</span> : null}
            {resource.file_size ? <span className="rounded-full border border-white/10 px-3 py-1.5">{formatResourceSize(resource.file_size)}</span> : null}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/25 p-5 text-center sm:p-6">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${resource.access_level === 'pro' ? 'bg-[#FFD600]/10 text-[#FFD600]' : 'bg-white/10 text-white'}`}>
            {isLocked ? <Lock className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
          </div>
          <p className="mt-3 max-w-full truncate text-xs font-bold text-zinc-400">{resource.file_name || '온라인 자료'}</p>
          {canPreview ? (
            <button type="button" onClick={() => (isLocked ? onUpgrade() : onPreview(resource))} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-xs font-black text-zinc-200 transition hover:border-[#FFD600]/45 hover:text-[#FFD600]">
              {isLocked ? <Lock className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isLocked ? 'PRO에서 미리보기' : '첫 5페이지 미리보기'}
            </button>
          ) : null}
          <button type="button" onClick={() => (isLocked ? onUpgrade() : onDownload(resource))} disabled={isDownloading} className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs font-black transition disabled:opacity-60 ${isLocked ? 'border border-[#FFD600]/35 bg-[#FFD600]/5 text-[#FFD600] hover:bg-[#FFD600]/10' : resource.access_level === 'pro' ? 'bg-[#FFD600] text-black hover:bg-yellow-300' : 'bg-white text-black hover:bg-zinc-200'}`}>
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : isLocked ? <Lock className="h-4 w-4" /> : resource.external_url ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
            {isDownloading ? '준비 중...' : isLocked ? 'PRO에서 이용하기' : resource.external_url ? '자료 열기' : '자료 다운로드'}
          </button>
        </div>
      </div>
    </article>
  );
};

const InterviewBuildingBook: React.FC = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="space-y-4 rounded-2xl border border-[#27272A] bg-[#121216] p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <span className="text-xs font-black uppercase text-[#FFD600]">FRAMEWORK 03</span>
        <span className="text-xs font-bold text-emerald-400">UNLOCKED</span>
      </div>
      <h2 className="text-xl font-black text-white sm:text-3xl">
        완벽통제면접 빌딩업 (Interview Control Framework)
      </h2>
      <p className="text-xs leading-relaxed text-zinc-300 sm:text-sm">
        면접관의 질의를 일방적으로 당하는 수동적 입장에서 벗어나, 내가 정한 앵커링 기준 안에서 면접 질문이 흘러나오도록 주도권을 통제하는 면접 답변 기술입니다.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 text-xs sm:text-sm md:grid-cols-3">
      {[
        ['01. 1분 자기소개 앵커링', '“저는 ~를 해본 경험이 있습니다”가 아닌, “기업이 고민하는 ~문제를 해결해온 기획자입니다”로 선제적 기준 제시.'],
        ['02. 약점 질문 리포지셔닝', '“경험이 일관되지 않네요”라는 약점 공격 시, 변명하지 않고 “다양한 도메인에서 문제의 본질을 파악한 강점”으로 프레임 전환.'],
        ['03. 역질문 주도권 굳히기', '마지막 질문 시 인사담당자가 현재 고민하는 핵심 직무 과제를 재확인하며 나의 전문성에 대한 닻을 확고히 내림.']
      ].map(([title, description]) => (
        <div key={title} className="space-y-3 rounded-2xl border border-[#27272A] bg-[#121216] p-5">
          <span className="text-base font-black text-[#FFD600]">{title}</span>
          <p className="leading-relaxed text-zinc-300">{description}</p>
        </div>
      ))}
    </div>

    <div className="space-y-4 rounded-2xl border border-[#27272A] bg-[#121216] p-6 sm:p-8">
      <h3 className="text-base font-bold text-white">완벽통제 면접 1분 자기소개 스크립트 빌더</h3>
      <div className="space-y-3 rounded-xl border border-[#27272A] bg-[#18181C] p-5 text-xs leading-relaxed text-zinc-200 sm:text-sm">
        <p>
          “안녕하십니까, [지원 직무] 지원자 [이름]입니다. <br />
          저는 기존의 [일반적인 방식]에 머무르지 않고, <strong className="text-[#FFD600]">[나만의 리포지셔닝 포지션]</strong>으로 문제를 정의하고 성과를 도출해왔습니다.”
        </p>
        <p className="mt-3 text-zinc-400">
          “특히 [대표 경험] 당시, [조직의 문제점]을 발굴하여 [개입한 가치]로 전환시켰으며, 이를 통해 [정량적/정성적 성과]를 얻었습니다. 귀사에서도 인사담당자님께서 가장 필요로 하시는 [직무 핵심 니즈]를 해결해 내겠습니다.”
        </p>
      </div>
    </div>

  </div>
);

export const PracticalView: React.FC<PracticalViewProps> = ({
  currentTier,
  activeSubTab = 'resources',
  onSubTabChange,
  onTabChange
}) => {
  const [localSubTab, setLocalSubTab] = useState<PracticalSubTab>(activeSubTab);
  const [resources, setResources] = useState<PracticalResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [downloadingId, setDownloadingId] = useState('');
  const [proSection, setProSection] = useState<'downloads' | 'building'>('downloads');
  const [buildingBookTab, setBuildingBookTab] = useState<'persuasion' | 'interview'>('persuasion');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [consentHandledThisVisit, setConsentHandledThisVisit] = useState(false);
  const [pendingResource, setPendingResource] = useState<PracticalResource | null>(null);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [previewResource, setPreviewResource] = useState<PracticalResource | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewPage, setPreviewPage] = useState(1);
  const [previewPageCount, setPreviewPageCount] = useState(5);
  const [previewDocument, setPreviewDocument] = useState<PDFDocumentProxy | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const [previewViewportWidth, setPreviewViewportWidth] = useState(0);

  const currentSub = onSubTabChange ? activeSubTab : localSubTab;
  const isPaidMember = currentTier === 'PRO' || currentTier === 'BOOTCAMP';

  const setSub = (tab: PracticalSubTab) => {
    if (onSubTabChange) onSubTabChange(tab);
    setLocalSubTab(tab);
  };

  const loadResources = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      setResources(await fetchPracticalResources());
    } catch (error) {
      console.error('Failed to load practical resources:', error);
      setLoadError('자료실을 준비하고 있습니다. 잠시 후 다시 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources, currentTier]);

  useEffect(() => {
    if (currentTier === 'NON_MEMBER') return;
    getMyMarketingConsent()
      .then(setMarketingConsent)
      .catch((error) => console.warn('Failed to load marketing consent:', error));
  }, [currentTier]);

  const groupedResources = useMemo(() => ({
    free: resources.filter((resource) => resource.access_level === 'free'),
    pro: resources.filter((resource) => resource.access_level === 'pro')
  }), [resources]);

  const realNeedsResume = useMemo(() => resources.find((resource) => {
    const normalizedTitle = resource.title.toLowerCase().replace(/[\s_-]/g, '');
    return resource.access_level === 'pro'
      && (normalizedTitle.includes('realneeds') || normalizedTitle.includes('리얼니즈'))
      && normalizedTitle.includes('이력서');
  }), [resources]);

  const handleDownload = async (resource: PracticalResource) => {
    setDownloadingId(resource.id);
    try {
      const url = await getPracticalResourceUrl(resource);
      await recordPracticalResourceDownload(resource.id);

      if (resource.external_url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error(`파일 다운로드 실패 (${response.status})`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = getPracticalResourceDownloadName(resource);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Mobile Safari can start the save flow after the click handler returns.
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch (error) {
      console.error('Failed to open practical resource:', error);
      window.alert('자료를 열지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setDownloadingId('');
    }
  };

  const requestDownload = (resource: PracticalResource) => {
    if (currentTier === 'NON_MEMBER') {
      window.alert('자료 다운로드는 회원가입 후 이용할 수 있습니다.');
      onTabChange('auth');
      return;
    }
    if (marketingConsent || consentHandledThisVisit) {
      void handleDownload(resource);
      return;
    }
    setMarketingOptIn(false);
    setPendingResource(resource);
  };

  const openPreview = async (resource: PracticalResource) => {
    setPreviewResource(resource);
    setPreviewUrl('');
    setPreviewPage(1);
    setPreviewDocument(null);
    setIsPreviewLoading(true);
    try {
      const url = await getPracticalResourcePreviewUrl(resource);
      setPreviewUrl(url);
      const pdf = await getDocument({
        url,
        cMapUrl: '/pdfjs/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/pdfjs/standard_fonts/'
      }).promise;
      setPreviewDocument(pdf);
      setPreviewPageCount(Math.min(5, pdf.numPages));
    } catch (error) {
      console.error('Failed to open resource preview:', error);
      setPreviewResource(null);
      window.alert('미리보기를 열지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (!previewResource || !previewViewportRef.current) return;
    const viewport = previewViewportRef.current;
    const updateWidth = () => setPreviewViewportWidth(viewport.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [previewResource]);

  useEffect(() => {
    if (!previewDocument || !previewCanvasRef.current) return;
    let cancelled = false;
    const renderPage = async () => {
      setIsPreviewLoading(true);
      try {
        const page = await previewDocument.getPage(previewPage);
        if (cancelled || !previewCanvasRef.current) return;
        const horizontalPadding = previewViewportWidth < 640 ? 24 : 48;
        const containerWidth = Math.max(240, Math.min(previewViewportWidth - horizontalPadding, 920));
        const baseViewport = page.getViewport({ scale: 1 });
        const cssScale = Math.min(1.7, containerWidth / baseViewport.width);
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: cssScale * outputScale });
        const canvas = previewCanvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / outputScale}px`;
        canvas.style.height = `${viewport.height / outputScale}px`;
        await page.render({ canvas, canvasContext: context, viewport }).promise;
      } catch (error) {
        if (!cancelled) console.error('Failed to render PDF preview page:', error);
      } finally {
        if (!cancelled) setIsPreviewLoading(false);
      }
    };
    void renderPage();
    return () => { cancelled = true; };
  }, [previewDocument, previewPage, previewViewportWidth]);

  const confirmDownload = async () => {
    if (!pendingResource) return;
    const resource = pendingResource;
    setIsSavingConsent(true);
    try {
      if (marketingOptIn) {
        await setMyMarketingConsent(true);
        setMarketingConsent(true);
      }
      setConsentHandledThisVisit(true);
      setPendingResource(null);
      await handleDownload(resource);
    } catch (error) {
      console.error('Failed to save marketing consent:', error);
      window.alert('수신 동의 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSavingConsent(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] pb-24 text-white selection:bg-[#FFD600] selection:text-black">
      <section className="border-b border-zinc-800 bg-[#101014] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#FFD600]/30 bg-[#FFD600]/10 px-3 py-1.5 text-[11px] font-black text-[#FFD600]">
            <Sparkles className="h-3.5 w-3.5" />
            이직 실전자료 · Building Up Book
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">리포지셔닝 실전활용</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            이직 방향을 점검하는 무료자료부터 기업별 지원에 바로 쓰는 PRO 자료까지,
            지금 필요한 내용을 골라 활용해보세요.
          </p>

          <div className="mt-9 grid grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-[#09090B] p-2 sm:inline-grid sm:min-w-[560px]">
            {tabItems.map(({ id, title, shortTitle, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSub(id)}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black transition sm:text-sm ${
                  currentSub === id
                    ? 'bg-[#FFD600] text-black shadow-lg'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">{shortTitle}</span>
                <span className="hidden sm:inline">{title}</span>
                {id !== 'resources' && !isPaidMember ? <Lock className="hidden h-3.5 w-3.5 sm:block" /> : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        {currentSub === 'resources' && (
          <div className="animate-fade-in">
            <section>
              <div className="text-center">
                <span className="text-xs font-black tracking-[0.18em] text-emerald-400">FREE RESOURCES</span>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">방향을 잡는 데 필요한 무료자료</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
                  경력을 다시 정리하고 이직 준비의 기준을 세울 때 먼저 확인해보세요.
                </p>
              </div>

              <div className="mt-8">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" /> 자료를 불러오고 있습니다.
                  </div>
                ) : loadError ? (
                  <div className="rounded-2xl border border-zinc-800 bg-[#121216] py-12 text-center">
                    <p className="text-sm text-zinc-400">{loadError}</p>
                    <button type="button" onClick={loadResources} className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#FFD600]">
                      <RefreshCw className="h-4 w-4" /> 다시 불러오기
                    </button>
                  </div>
                ) : groupedResources.free.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-700 bg-[#121216]/50 py-14 text-center">
                    <FileText className="mx-auto h-7 w-7 text-zinc-600" />
                    <p className="mt-4 text-sm font-bold text-zinc-400">첫 무료자료를 준비하고 있습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {groupedResources.free.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        canUsePro={isPaidMember}
                        isDownloading={downloadingId === resource.id}
                        onDownload={requestDownload}
                        onUpgrade={() => onTabChange('pro-payment')}
                        onPreview={openPreview}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

          </div>
        )}

        {(currentSub === 'persuasion' || currentSub === 'interview') && (
          <div className="animate-fade-in">
            <div className="text-center">
              <span className="text-xs font-black tracking-[0.18em] text-[#FFD600]">PRO PRACTICAL TOOLS</span>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">프로 전용 실전자료</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
                읽고 끝나는 자료가 아니라, 지금 지원하는 기업에 바로 적용하는 실전 도구입니다.
              </p>
            </div>

            <div className="mx-auto mb-12 mt-8 grid max-w-2xl grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-[#101014] p-2">
              <button
                type="button"
                onClick={() => setProSection('downloads')}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition sm:text-sm ${
                  proSection === 'downloads' ? 'bg-[#FFD600] text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Download className="h-4 w-4" /> 자료 다운로드
              </button>
              <button
                type="button"
                onClick={() => setProSection('building')}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition sm:text-sm ${
                  proSection === 'building' ? 'bg-[#FFD600] text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <BookOpen className="h-4 w-4" /> Building Up Book
              </button>
            </div>

            {proSection === 'downloads' && (
            <section>
              <div className="mb-8 overflow-hidden rounded-3xl border border-[#FFD600]/40 bg-gradient-to-br from-[#1d1b0f] via-[#141416] to-[#101014] p-6 shadow-2xl sm:p-9">
                <div className="grid items-center gap-8 md:grid-cols-[1.35fr_0.65fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[#FFD600] px-2.5 py-1 text-[10px] font-black tracking-wide text-black">PRO 대표자료</span>
                      <span className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold text-zinc-300">이력서 · 경력기술서</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl">REAL NEEDS 이력서</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                      경력을 나열하는 이력서가 아니라, 기업이 찾는 역량과 나의 경험을 연결해
                      채용해야 할 이유를 보여주는 리포지셔닝 이력서입니다.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-zinc-300">
                      {['사용방법', '작성 템플릿', '범용 예시'].map((label) => (
                        <span key={label} className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">{label}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-center">
                    <FileText className="mx-auto h-10 w-10 text-[#FFD600]" />
                    <p className="mt-3 text-xs font-bold text-zinc-400">Word 원본 템플릿</p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isPaidMember) {
                          onTabChange('pro-payment');
                        } else if (realNeedsResume) {
                          requestDownload(realNeedsResume);
                        }
                      }}
                      disabled={isPaidMember && (!realNeedsResume || downloadingId === realNeedsResume.id)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-4 py-3.5 text-xs font-black text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {downloadingId === realNeedsResume?.id ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> 준비 중...</>
                      ) : !isPaidMember ? (
                        <><Lock className="h-4 w-4" /> 프로로 전체 자료 열기</>
                      ) : realNeedsResume ? (
                        <><Download className="h-4 w-4" /> REAL NEEDS 이력서 받기</>
                      ) : (
                        '자료 업로드 준비 중'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-16 text-sm text-zinc-500">
                    <Loader2 className="h-5 w-5 animate-spin" /> 자료를 불러오고 있습니다.
                  </div>
                ) : loadError ? (
                  <div className="rounded-2xl border border-zinc-800 bg-[#121216] py-12 text-center">
                    <p className="text-sm text-zinc-400">{loadError}</p>
                    <button type="button" onClick={loadResources} className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#FFD600]">
                      <RefreshCw className="h-4 w-4" /> 다시 불러오기
                    </button>
                  </div>
                ) : groupedResources.pro.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#FFD600]/25 bg-[#FFD600]/5 py-14 text-center">
                    <BookOpen className="mx-auto h-7 w-7 text-[#FFD600]/60" />
                    <p className="mt-4 text-sm font-bold text-zinc-400">PRO 전용 자료를 준비하고 있습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {groupedResources.pro.filter((resource) => resource.id !== realNeedsResume?.id).map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        canUsePro={isPaidMember}
                        isDownloading={downloadingId === resource.id}
                        onDownload={requestDownload}
                        onUpgrade={() => onTabChange('pro-payment')}
                        onPreview={openPreview}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
            )}

            {proSection === 'building' && (
            <section>
            <div className="mb-10 text-center">
              <span className="text-xs font-black tracking-[0.18em] text-[#FFD600]">BUILDING UP BOOK</span>
              <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">직접 완성하는 리포지셔닝 워크북</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
                자기설득서와 면접 답변을 단계별로 쌓아 올릴 수 있도록 기존 빌딩업북을 그대로 제공합니다.
              </p>
            </div>

            <div className="mx-auto mb-10 grid max-w-2xl grid-cols-2 gap-2 rounded-2xl border border-zinc-800 bg-[#101014] p-2">
              <button
                type="button"
                onClick={() => setBuildingBookTab('persuasion')}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition sm:text-sm ${
                  buildingBookTab === 'persuasion' ? 'bg-[#FFD600] text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Compass className="h-4 w-4" /> 자기설득서
              </button>
              <button
                type="button"
                onClick={() => setBuildingBookTab('interview')}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition sm:text-sm ${
                  buildingBookTab === 'interview' ? 'bg-[#FFD600] text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" /> 면접통제
              </button>
            </div>

            {isPaidMember ? (
              buildingBookTab === 'persuasion' ? <SelfPersuasionBook /> : <InterviewBuildingBook />
            ) : (
              <PaidContentLock
                title={buildingBookTab === 'persuasion' ? '자기설득서 Building Up Book' : '면접통제 Building Up Book'}
                description={buildingBookTab === 'persuasion'
                  ? '기업의 질문 의도를 확인하고, 주장·근거·어필의 구조로 나를 채용해야 할 이유를 직접 정리하는 PRO 전용 워크북입니다.'
                  : '자기소개부터 약점 질문과 역질문까지, 면접에서 보여줄 핵심 메시지를 한 흐름으로 정리하는 PRO 전용 워크북입니다.'}
                onTabChange={onTabChange}
              />
            )}
            </section>
            )}
          </div>
        )}
      </main>

      {pendingResource ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-700 bg-[#121216] p-6 shadow-2xl sm:p-8">
            <span className="text-xs font-black tracking-[0.16em] text-[#FFD600]">DOWNLOAD</span>
            <h2 className="mt-3 text-xl font-black text-white sm:text-2xl">자료를 다운로드할까요?</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              로그인한 회원의 자료 이용 이력은 서비스 운영과 콘텐츠 개선을 위해 저장됩니다.
            </p>

            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-700 bg-black/20 p-4">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(event) => setMarketingOptIn(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#FFD600]"
              />
              <span>
                <span className="block text-sm font-bold text-white">[선택] 마케팅 정보 이메일 수신에 동의합니다.</span>
                <span className="mt-1 block text-xs leading-relaxed text-zinc-500">
                  취업·이직 자료, 신규 프로그램 및 프로모션 소식을 이메일로 보내드립니다.
                </span>
              </span>
            </label>
            <p className="mt-3 text-xs text-zinc-500">동의하지 않아도 자료를 다운로드할 수 있으며, 이메일의 수신거부 링크로 언제든 철회할 수 있습니다.</p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPendingResource(null)}
                disabled={isSavingConsent}
                className="rounded-xl border border-zinc-700 px-4 py-3.5 text-sm font-black text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void confirmDownload()}
                disabled={isSavingConsent}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-4 py-3.5 text-sm font-black text-black hover:bg-yellow-300 disabled:opacity-50"
              >
                {isSavingConsent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                다운로드
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {previewResource ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm sm:px-6 sm:py-4">
          <div className="flex h-[100dvh] w-full max-w-5xl flex-col overflow-hidden border-[#FFD600]/30 bg-[#111114] shadow-2xl sm:h-[92vh] sm:rounded-3xl sm:border">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 sm:px-7 sm:py-4">
              <div className="min-w-0">
                <span className="text-[10px] font-black tracking-[0.16em] text-[#FFD600]">5-PAGE PREVIEW</span>
                <h2 className="mt-1 truncate text-sm font-black text-white sm:text-base">{previewResource.title}</h2>
              </div>
              <button type="button" onClick={() => setPreviewResource(null)} className="rounded-xl border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1 overflow-hidden bg-[#09090B]">
              <div ref={previewViewportRef} className="flex h-full w-full items-start justify-center overflow-auto overscroll-contain p-3 sm:p-6">
                {!previewDocument || !previewUrl ? (
                  <div className="flex h-full items-center justify-center gap-2 text-sm text-zinc-500"><Loader2 className="h-5 w-5 animate-spin" /> 미리보기를 불러오고 있습니다.</div>
                ) : (
                  <div className="relative flex min-h-full w-full items-start justify-center">
                    <canvas ref={previewCanvasRef} className="block h-auto max-w-full rounded-lg bg-white shadow-2xl" />
                    {isPreviewLoading ? <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/45"><Loader2 className="h-7 w-7 animate-spin text-[#FFD600]" /></div> : null}
                  </div>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-between border-t border-zinc-800 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-7 sm:py-4">
              <button type="button" onClick={() => setPreviewPage((page) => Math.max(1, page - 1))} disabled={previewPage === 1} className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 px-3 py-2.5 text-xs font-black text-white disabled:opacity-30 sm:gap-2 sm:px-4">
                <ChevronLeft className="h-4 w-4" /> <span className="hidden min-[360px]:inline">이전</span>
              </button>
              <span className="text-xs font-black text-[#FFD600]">{previewPage} / {previewPageCount}</span>
              <button type="button" onClick={() => setPreviewPage((page) => Math.min(previewPageCount, page + 1))} disabled={previewPage === previewPageCount} className="inline-flex items-center gap-1 rounded-xl bg-[#FFD600] px-3 py-2.5 text-xs font-black text-black disabled:opacity-30 sm:gap-2 sm:px-4">
                <span className="hidden min-[360px]:inline">다음</span> <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
