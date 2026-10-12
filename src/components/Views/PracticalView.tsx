import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  Download,
  ExternalLink,
  FileArchive,
  FileText,
  Loader2,
  Lock,
  MessageSquare,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { MemberTier } from '../../types';
import {
  fetchPracticalResources,
  formatResourceSize,
  getPracticalResourceUrl,
  PRACTICAL_CATEGORY_LABELS,
  PracticalResource,
  recordPracticalResourceDownload
} from '../../lib/practicalResources';
import { SelfPersuasionBook } from '../SelfPersuasionBook';

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
  { id: 'resources', title: '이직 실전자료', shortTitle: '실전자료', icon: BriefcaseBusiness },
  { id: 'persuasion', title: '자기설득서 Building Up Book', shortTitle: '자기설득서', icon: Compass },
  { id: 'interview', title: '면접통제 Building Up Book', shortTitle: '면접통제', icon: MessageSquare }
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
}> = ({ resource, canUsePro, isDownloading, onDownload, onUpgrade }) => {
  const isLocked = resource.access_level === 'pro' && !canUsePro;

  return (
    <article className={`group flex h-full flex-col rounded-3xl border p-6 transition sm:p-7 ${
      resource.access_level === 'pro'
        ? 'border-[#FFD600]/25 bg-gradient-to-b from-[#171712] to-[#111114] hover:border-[#FFD600]/55'
        : 'border-zinc-800 bg-[#121216] hover:border-emerald-500/40'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-md px-2.5 py-1 text-[10px] font-black tracking-wide ${
            resource.access_level === 'pro'
              ? 'bg-[#FFD600] text-black'
              : 'bg-emerald-500/15 text-emerald-300'
          }`}>
            {resource.access_level === 'pro' ? 'PRO' : 'FREE'}
          </span>
          <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-[10px] font-bold text-zinc-400">
            {PRACTICAL_CATEGORY_LABELS[resource.category]}
          </span>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          resource.access_level === 'pro'
            ? 'bg-[#FFD600]/10 text-[#FFD600]'
            : 'bg-emerald-500/10 text-emerald-400'
        }`}>
          {isLocked ? <Lock className="h-5 w-5" /> : <FileArchive className="h-5 w-5" />}
        </div>
      </div>

      <h3 className="mt-6 text-lg font-black leading-snug text-white">{resource.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{resource.description}</p>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4 text-[11px] text-zinc-600">
        <span className="truncate pr-3">{resource.file_name || '외부 링크'}</span>
        {resource.file_size ? <span className="shrink-0">{formatResourceSize(resource.file_size)}</span> : null}
      </div>

      <button
        type="button"
        onClick={() => (isLocked ? onUpgrade() : onDownload(resource))}
        disabled={isDownloading}
        className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-xs font-black transition disabled:opacity-60 ${
          isLocked
            ? 'border border-[#FFD600]/35 bg-[#FFD600]/5 text-[#FFD600] hover:bg-[#FFD600]/10'
            : resource.access_level === 'pro'
              ? 'bg-[#FFD600] text-black hover:bg-yellow-300'
              : 'bg-white text-black hover:bg-zinc-200'
        }`}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isLocked ? (
          <Lock className="h-4 w-4" />
        ) : resource.external_url ? (
          <ExternalLink className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {isDownloading ? '준비 중...' : isLocked ? 'PRO에서 이용하기' : resource.external_url ? '자료 열기' : '자료 다운로드'}
      </button>
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

  const groupedResources = useMemo(() => ({
    free: resources.filter((resource) => resource.access_level === 'free'),
    pro: resources.filter((resource) => resource.access_level === 'pro')
  }), [resources]);

  const handleDownload = async (resource: PracticalResource) => {
    setDownloadingId(resource.id);
    try {
      const url = await getPracticalResourceUrl(resource);
      window.open(url, '_blank', 'noopener,noreferrer');
      void recordPracticalResourceDownload(resource.id);
    } catch (error) {
      console.error('Failed to open practical resource:', error);
      window.alert('자료를 열지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setDownloadingId('');
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

          <div className="mt-9 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-800 bg-[#09090B] p-2 sm:inline-grid sm:min-w-[720px]">
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
          <div className="space-y-16 animate-fade-in">
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
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {groupedResources.free.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        canUsePro={isPaidMember}
                        isDownloading={downloadingId === resource.id}
                        onDownload={handleDownload}
                        onUpgrade={() => onTabChange('pro-payment')}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="border-t border-zinc-800 pt-14">
              <div className="text-center">
                <span className="text-xs font-black tracking-[0.18em] text-[#FFD600]">PRO RESOURCES</span>
                <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">지원에 바로 적용하는 PRO 자료</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
                  목표 공고에 맞춰 이력서·자소서·포트폴리오·면접을 더 깊게 점검합니다.
                </p>
              </div>

              <div className="mt-8">
                {!isLoading && groupedResources.pro.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#FFD600]/25 bg-[#FFD600]/5 py-14 text-center">
                    <BookOpen className="mx-auto h-7 w-7 text-[#FFD600]/60" />
                    <p className="mt-4 text-sm font-bold text-zinc-400">PRO 전용 자료를 준비하고 있습니다.</p>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {groupedResources.pro.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        canUsePro={isPaidMember}
                        isDownloading={downloadingId === resource.id}
                        onDownload={handleDownload}
                        onUpgrade={() => onTabChange('pro-payment')}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {currentSub === 'persuasion' && (
          isPaidMember ? (
            <div className="animate-fade-in"><SelfPersuasionBook /></div>
          ) : (
            <PaidContentLock
              title="자기설득서 Building Up Book"
              description="기업의 질문 의도를 확인하고, 주장·근거·어필의 구조로 나를 채용해야 할 이유를 직접 정리하는 PRO 전용 워크북입니다."
              onTabChange={onTabChange}
            />
          )
        )}

        {currentSub === 'interview' && (
          isPaidMember ? (
            <InterviewBuildingBook />
          ) : (
            <PaidContentLock
              title="면접통제 Building Up Book"
              description="자기소개부터 약점 질문과 역질문까지, 면접에서 보여줄 핵심 메시지를 한 흐름으로 정리하는 PRO 전용 워크북입니다."
              onTabChange={onTabChange}
            />
          )
        )}
      </main>
    </div>
  );
};
