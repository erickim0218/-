import React, { useEffect, useState } from 'react';
import { User, Sparkles, BookOpen, Download, Plus, Loader2, FileText, ExternalLink } from 'lucide-react';
import { UserProfile, PositioningVersion, MemberTier } from '../../types';
import { COURSES } from '../../data/mockData';
import {
  ClaimedPracticalResource,
  fetchMyClaimedPracticalResources,
  getPracticalResourceDisplayName,
  redownloadPracticalResource
} from '../../lib/practicalResources';

interface MyLmsViewProps {
  user: UserProfile;
  currentTier: MemberTier;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onTabChange: (tab: string, subTab?: 'resources' | 'persuasion' | 'interview') => void;
}

export const MyLmsView: React.FC<MyLmsViewProps> = ({
  user,
  currentTier,
  onUpdateUser,
  onTabChange
}) => {
  const [newSentence, setNewSentence] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [isAddingVersion, setIsAddingVersion] = useState(false);
  const [claimedResources, setClaimedResources] = useState<ClaimedPracticalResource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [resourceLoadError, setResourceLoadError] = useState('');
  const [downloadingResourceId, setDownloadingResourceId] = useState('');

  const loadClaimedResources = async () => {
    setIsLoadingResources(true);
    setResourceLoadError('');
    try {
      setClaimedResources(await fetchMyClaimedPracticalResources());
    } catch (error) {
      console.error('Failed to load claimed resources:', error);
      setResourceLoadError('받은 자료를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoadingResources(false);
    }
  };

  useEffect(() => {
    if (currentTier === 'NON_MEMBER') return;
    void loadClaimedResources();
  }, [currentTier]);

  const handleRedownload = async ({ resource }: ClaimedPracticalResource) => {
    setDownloadingResourceId(resource.id);
    try {
      await redownloadPracticalResource(resource);
    } catch (error) {
      console.error('Failed to redownload practical resource:', error);
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('RESOURCE_FILE_NOT_CONNECTED')) {
        window.alert('이 자료에 연결된 파일이 없습니다. 관리자에게 문의해 주세요.');
      } else {
        window.alert('자료를 다시 내려받지 못했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setDownloadingResourceId('');
    }
  };

  const tierBadgeColor: Record<MemberTier, string> = {
    NON_MEMBER: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
    FREE: 'bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold',
    PRO: 'bg-[#FFD600] text-[#09090B] font-black',
    BOOTCAMP: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-black'
  };

  const handleAddPositioningVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSentence.trim()) return;

    const newVer: PositioningVersion = {
      id: `v-${Date.now()}`,
      date: new Date().toLocaleDateString('ko-KR'),
      stage: '기업별 맞춤 적용',
      sentence: newSentence,
      companyTarget: selectedCompany || '타겟 기업용',
      feedbackNote: '사용자가 직접 업데이트한 새로운 포지셔닝 문장'
    };

    const updatedVersions = [newVer, ...user.positioningVersions];
    onUpdateUser({
      ...user,
      positioningVersions: updatedVersions
    });

    setNewSentence('');
    setSelectedCompany('');
    setIsAddingVersion(false);
  };

  if (currentTier === 'NON_MEMBER') {
    return (
      <div className="py-20 bg-[#09090B] text-white min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="max-w-md w-full text-center p-8 sm:p-10 rounded-3xl bg-[#121216] border border-[#27272A] space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30 mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">내 콘텐츠는 회원 전용입니다</h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              30초 무료 회원가입 후 수강 콘텐츠와 받은 자료, 포지셔닝 기록을 한곳에서 관리해보세요.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onTabChange('signup')}
              className="w-full py-3.5 bg-[#FFD600] hover:bg-[#ffe033] text-black font-black text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>30초 무료 회원가입하기</span>
            </button>
            <button
              onClick={() => onTabChange('classes')}
              className="w-full py-3 bg-[#18181C] hover:bg-[#222228] text-zinc-300 font-bold text-xs rounded-xl border border-[#27272A] transition cursor-pointer"
            >
              무료 특강 둘러보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#09090B] text-white min-h-screen space-y-10 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <span className="text-xs font-black tracking-[0.18em] text-[#FFD600]">MY CONTENT</span>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">내 콘텐츠</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            수강 중인 콘텐츠와 내려받은 자료를 한곳에서 확인하세요.
          </p>
        </div>
        
        {/* User Profile Header Card */}
        <div className="p-6 md:p-8 bg-[#121216] border border-[#27272A] rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FFD600] rounded-2xl flex items-center justify-center font-black text-[#09090B] text-2xl shadow-md">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-xl font-bold text-white">
                  {currentTier === 'PRO' && user.name ? `${user.name.replace(/님$/, '')} PRO` : `${user.name} 님`}
                </h1>
                <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase w-fit ${tierBadgeColor[currentTier]}`}>
                  {currentTier === 'BOOTCAMP'
                    ? (user.bootcampCohort ? `BOOTCAMP ${user.bootcampCohort}` : 'BOOTCAMP')
                    : currentTier === 'PRO'
                    ? 'REPOSITION PRO'
                    : `${currentTier} MEMBER`}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {currentTier === 'BOOTCAMP' ? (
                  <span className="text-indigo-300 font-bold block mb-0.5">
                    {user.bootcampCohort
                      ? `BOOTCAMP ${user.bootcampCohort} · PRO 전체 콘텐츠 이용 가능`
                      : 'BOOTCAMP · PRO 전체 콘텐츠 이용 가능'}
                  </span>
                ) : null}
                목표 직무: <strong className="text-zinc-200">{user.targetJob}</strong> ({user.email})
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onTabChange('classes')}
              className="px-4 py-2 bg-[#FFD600] text-[#09090B] font-bold text-xs rounded-xl hover:bg-[#ffe033] transition"
            >
              수강 가능 클래스 보기
            </button>
            <button
              onClick={() => onTabChange('practical')}
              className="px-4 py-2 bg-[#18181C] text-zinc-200 border border-[#27272A] font-bold text-xs rounded-xl hover:bg-[#222228] transition"
            >
              실전활용 워크북
            </button>
          </div>
        </div>

        {/* Claimed practical resources */}
        <section className="rounded-3xl border border-[#FFD600]/25 bg-[#121216] p-6 shadow-xl md:p-8">
          <div className="flex flex-col gap-3 border-b border-[#27272A] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-black tracking-[0.16em] text-[#FFD600]">MY DOWNLOADS</span>
              <h2 className="mt-2 flex items-center gap-2 text-xl font-black text-white">
                <Download className="h-5 w-5 text-[#FFD600]" /> 받은 자료
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                한 번 신청한 자료는 이곳에서 다시 내려받을 수 있습니다. 재다운로드는 선착순 수량에 중복 집계되지 않습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onTabChange('practical')}
              className="shrink-0 rounded-xl border border-[#FFD600]/30 px-4 py-2.5 text-xs font-black text-[#FFD600] transition hover:bg-[#FFD600]/10"
            >
              자료실 보기
            </button>
          </div>

          {isLoadingResources ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" /> 받은 자료를 불러오고 있습니다.
            </div>
          ) : resourceLoadError ? (
            <div className="py-10 text-center">
              <p className="text-sm text-zinc-400">{resourceLoadError}</p>
              <button type="button" onClick={() => void loadClaimedResources()} className="mt-4 text-xs font-black text-[#FFD600]">
                다시 불러오기
              </button>
            </div>
          ) : claimedResources.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-zinc-600" />
              <p className="mt-4 text-sm font-bold text-zinc-300">아직 받은 자료가 없습니다.</p>
              <p className="mt-2 text-xs text-zinc-500">자료실에서 필요한 자료를 받아보세요.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {claimedResources.map((claim) => {
                const { resource } = claim;
                const isDownloading = downloadingResourceId === resource.id;
                return (
                  <article key={resource.id} className="flex flex-col gap-4 rounded-2xl border border-[#27272A] bg-[#18181C] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-300">
                        <span className="rounded-md bg-emerald-400/10 px-2 py-1">신청 완료</span>
                        <span className="text-zinc-500">
                          {new Date(claim.claimedAt).toLocaleDateString('ko-KR')} 받음
                        </span>
                      </div>
                      <h3 className="mt-3 break-words text-sm font-black text-white sm:text-base">{resource.title}</h3>
                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {resource.file_name ? getPracticalResourceDisplayName(resource.file_name) : '온라인 자료'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleRedownload(claim)}
                      disabled={isDownloading}
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFD600] px-5 text-xs font-black text-black transition hover:bg-yellow-300 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : resource.external_url ? <ExternalLink className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                      {isDownloading ? '준비 중...' : resource.external_url ? '자료 다시 열기' : '다시 다운로드'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Core Feature: My Positioning Statement Manager with Version History */}
        <div className="p-6 md:p-8 bg-[#121216] border border-[#27272A] rounded-3xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#27272A] pb-4">
            <div>
              <span className="text-xs font-bold text-[#FFD600] uppercase tracking-wider block">
                CORE OUTCOME
              </span>
              <h2 className="text-xl font-black text-white">나의 포지셔닝 문장 관리</h2>
            </div>
            <button
              onClick={() => setIsAddingVersion(!isAddingVersion)}
              className="px-3.5 py-2 bg-[#FFD600] text-[#09090B] font-bold text-xs rounded-xl hover:bg-[#ffe033] flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> 문장 새 버전 수정/추가
            </button>
          </div>

          {/* New Version Form */}
          {isAddingVersion && (
            <form onSubmit={handleAddPositioningVersion} className="p-5 bg-[#18181C] rounded-2xl border border-[#FFD600]/40 space-y-3 text-xs animate-fade-in">
              <div className="space-y-1">
                <label className="font-bold text-white">새로운 포지셔닝 문장</label>
                <textarea
                  rows={2}
                  required
                  placeholder="예: '저는 단순히 이벤트를 진행한 사람이 아니라, 데이터로 고객 이탈 병목을 해소한 서비스 기획자입니다.'"
                  value={newSentence}
                  onChange={(e) => setNewSentence(e.target.value)}
                  className="w-full bg-[#121216] border border-[#27272A] rounded-xl p-3 text-white focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="타겟 기업명 (선택, 예: 네이버, 현대차)"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="flex-1 bg-[#121216] border border-[#27272A] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FFD600]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FFD600] text-[#09090B] font-bold rounded-xl hover:bg-[#ffe033]"
                >
                  저장
                </button>
              </div>
            </form>
          )}

          {/* Current Latest Sentence Highlight */}
          {user.positioningVersions.length > 0 && (
            <div className="p-6 bg-[#18181C] border border-[#FFD600] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#FFD600] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> [최신 확정 포지셔닝 문장] - {user.positioningVersions[0].stage}
                </span>
                <span className="text-zinc-400">{user.positioningVersions[0].date}</span>
              </div>
              <p className="text-base md:text-lg font-black text-[#FFF3B0] leading-snug">
                "{user.positioningVersions[0].sentence}"
              </p>
              {user.positioningVersions[0].feedbackNote && (
                <p className="text-xs text-zinc-300 pt-1 border-t border-[#FFD600]/20">
                  💡 <strong>기획자 J 코멘트:</strong> {user.positioningVersions[0].feedbackNote}
                </p>
              )}
            </div>
          )}

          {/* Version History List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              포지셔닝 문장 변화 이력 ({user.positioningVersions.length})
            </h3>
            <div className="space-y-2">
              {user.positioningVersions.map((v) => (
                <div key={v.id} className="p-4 bg-[#18181C] border border-[#27272A] rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-bold text-white">{v.stage}</span>
                    <span>{v.date}</span>
                  </div>
                  <p className="text-zinc-200 font-medium">{v.sentence}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enrolled Courses & Progress */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-7 bg-[#121216] border border-[#27272A] rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FFD600]" /> 수강 중인 클래스 & 진도율
            </h3>

            <div className="space-y-3">
              {COURSES.slice(0, 2).map((course) => (
                <div key={course.id} className="p-4 bg-[#18181C] rounded-2xl border border-[#27272A] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{course.title}</span>
                    <span className="text-[#FFD600] font-bold">50% 완료</span>
                  </div>
                  <div className="w-full bg-[#27272A] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FFD600] h-full w-1/2 rounded-full" />
                  </div>
                  <button
                    onClick={() => onTabChange('classes')}
                    className="w-full py-2 bg-[#121216] text-zinc-300 hover:text-white text-xs font-bold rounded-lg border border-[#27272A]"
                  >
                    이어서 시청하기
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Downloadable Workbooks & Bootcamp Status */}
          <div className="md:col-span-5 bg-[#121216] border border-[#27272A] rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-[#FFD600]" /> 부트캠프 현황
            </h3>

            <div className="p-4 bg-[#18181C] rounded-2xl border border-[#27272A] space-y-2 text-xs">
              <span className="text-zinc-400 font-bold block">부트캠프 신청 상태</span>
              <span className="text-emerald-400 font-black block text-sm">
                {user.bootcampApplicationStatus || '미신청'}
              </span>
              <button
                onClick={() => onTabChange('bootcamp')}
                className="w-full py-2 bg-[#FFD600] text-[#09090B] font-bold rounded-lg mt-1"
              >
                부트캠프 상세보기
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
