import React, { useState } from 'react';
import { PlayCircle, Download, CheckCircle2, Lock, Clock, FileText, X, Sparkles, Pen } from 'lucide-react';
import { COURSES } from '../../data/mockData';
import { Course, CourseLesson, MemberTier } from '../../types';

interface ClassesViewProps {
  currentTier: MemberTier;
  onTabChange: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
  courses?: Course[];
}

const getYouTubeEmbedUrl = (url?: string) => {
  if (!url) return 'https://www.youtube.com/embed/bWPpI9n0sZo?autoplay=1';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  const videoId = match ? match[1] : 'bWPpI9n0sZo';
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
};

export const ClassesView: React.FC<ClassesViewProps> = ({ currentTier, onTabChange, courses: externalCourses }) => {
  const allCourses = externalCourses || COURSES;
  const [activeCourse, setActiveCourse] = useState<Course>(allCourses[0]);
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);

  const isPaidUser = (tier: MemberTier) =>
    tier === 'PRO' || tier === 'BOOTCAMP';

  const canAccessCourse = (course: Course) => {
    if (course.requiredTier === 'FREE') return currentTier !== 'NON_MEMBER';
    if (course.requiredTier === 'PRO' && isPaidUser(currentTier)) return true;
    if (course.requiredTier === 'BOOTCAMP' && currentTier === 'BOOTCAMP') return true;
    return false;
  };

  const canAccessLesson = (course: Course, lesson: CourseLesson) => {
    if (currentTier === 'NON_MEMBER') {
      return false;
    }
    if (lesson.isPro) {
      return isPaidUser(currentTier);
    }
    return canAccessCourse(course) || !!lesson.isFreePreview;
  };

  const handleLessonSelect = (lesson: CourseLesson) => {
    if (currentTier === 'NON_MEMBER') {
      if (confirm(`'${lesson.title}' 강의는 회원 전용 무료 강의입니다.\n30초 무료 회원가입 후 즉시 시청하시겠습니까?`)) {
        onTabChange('signup');
      }
      return;
    }

    if (canAccessLesson(activeCourse, lesson)) {
      setActiveLesson(lesson);
    } else {
      if (confirm(`'${lesson.title}' 강의는 PRO 회원 전용 실전 강좌입니다.\nPRO 멤버십 결제 페이지로 이동하시겠습니까?`)) {
        onTabChange('pro-payment');
      }
    }
  };

  const handleQuickPlay = () => {
    if (activeCourse.lessons.length === 0) return;
    const firstLesson = activeCourse.lessons[0];

    if (currentTier === 'NON_MEMBER') {
      if (confirm(`'${activeCourse.title}' 특강을 시청하시려면 무료 회원가입이 필요합니다.\n회원가입 페이지로 이동하시겠습니까?`)) {
        onTabChange('signup');
      }
      return;
    }

    if (canAccessLesson(activeCourse, firstLesson)) {
      setActiveLesson(firstLesson);
    } else {
      if (confirm('이 강의는 PRO 회원 전용 실전 특강입니다.\nPRO 멤버십 결제 페이지로 이동하시겠습니까?')) {
        onTabChange('pro-payment');
      }
    }
  };

  return (
    <div className="py-12 bg-[#09090B] text-white min-h-screen space-y-12 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2 border-b border-[#27272A] pb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white">온라인 리포지셔닝 클래스</h1>
          <p className="text-sm text-zinc-400">
            자소서, 면접, 공고 분석이 파편화되지 않고 하나의 포지셔닝 체계로 완성되는 교육 과정
          </p>
        </div>

        {/* Course Catalog Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Course Selector List */}
          <div className="md:col-span-5 space-y-6">
            
            {/* 1. 오픈 핵심 특강 섹션 (앞부분) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" />
                  리포지셔닝 핵심 특강 ({allCourses.filter(c => c.requiredTier === 'FREE').length})
                </h3>
                <span className="text-[10px] text-zinc-400 font-bold">공개 커리큘럼</span>
              </div>

              <div className="space-y-2.5">
                {allCourses.filter(c => c.requiredTier === 'FREE').map((course) => {
                  const isSelected = activeCourse.id === course.id;

                  return (
                    <div
                      key={course.id}
                      onClick={() => setActiveCourse(course)}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 group ${
                        isSelected
                          ? 'bg-[#18181C] border-[#FFD600] shadow-xl'
                          : 'bg-[#121216] border-[#27272A] hover:border-zinc-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-zinc-800 text-zinc-300 font-extrabold flex items-center gap-1">
                          {course.levelTag}
                        </span>
                        <span className="text-zinc-300 flex items-center gap-1 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                          {course.priceText}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-white transition">
                        {course.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {course.subTitle}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-[#202024]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.durationTotal}</span>
                          <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {course.lessonCount}개 강좌</span>
                        </div>
                        <span className="text-zinc-300 group-hover:text-white font-bold text-[11px] flex items-center gap-0.5">
                          강의 보기 →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. PRO 실전 특강 섹션 (뒷부분 - 프로 컬러 및 극명한 대비) */}
            <div className="space-y-3 pt-4 border-t border-[#222226]">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pen className="w-3.5 h-3.5 text-[#FFD600]" />
                  PRO 실전 특강 ({allCourses.filter(c => c.requiredTier === 'PRO').length})
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-[#2B210A] text-[#FFD600] border border-amber-500/50 rounded font-black flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> PRO 전용
                </span>
              </div>

              <div className="space-y-2.5">
                {allCourses.filter(c => c.requiredTier === 'PRO').map((course) => {
                  const isSelected = activeCourse.id === course.id;
                  const hasAccess = canAccessCourse(course);

                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        if (!hasAccess) {
                          alert(
                            `'${course.title}'은 PRO 회원 전용 실전 강의입니다.\n우측 상단의 '회원 등급 전환'을 통해 [PRO 회원]으로 등급을 전환하시면 전체 강의를 바로 수강하실 수 있습니다.`
                          );
                          return;
                        }
                        setActiveCourse(course);
                      }}
                      className={`p-4 rounded-2xl border transition space-y-2 relative overflow-hidden ${
                        !hasAccess
                          ? 'opacity-55 hover:opacity-75 cursor-not-allowed bg-[#13110D] border-zinc-800'
                          : isSelected
                            ? 'cursor-pointer bg-gradient-to-br from-[#261E0E] via-[#1B150A] to-[#12100C] border-[#FFD600] ring-1 ring-[#FFD600]/40 shadow-xl shadow-amber-950/60 group'
                            : 'cursor-pointer bg-gradient-to-br from-[#1C1609] via-[#14120C] to-[#0E0D0B] border-amber-500/40 hover:border-amber-400 shadow-md shadow-amber-950/20 group'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                          {course.levelTag}
                        </span>
                        {hasAccess ? (
                          <span className="text-amber-300 font-extrabold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> 시청 가능
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-zinc-900 text-zinc-400 border border-zinc-800 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-zinc-500" /> 잠금 (PRO 전용)
                          </span>
                        )}
                      </div>

                      <h4 className={`font-black text-sm sm:text-base transition ${
                        !hasAccess ? 'text-zinc-300' : 'text-white group-hover:text-[#FFD600]'
                      }`}>
                        {course.title}
                      </h4>
                      <p className={`text-xs line-clamp-2 leading-relaxed ${
                        !hasAccess ? 'text-zinc-500' : 'text-amber-100/70'
                      }`}>
                        {course.subTitle}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
                        <div className="flex items-center gap-3 text-zinc-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-zinc-500" /> {course.durationTotal}</span>
                          <span className="flex items-center gap-1"><FileText className="w-3 h-3 text-zinc-500" /> {course.lessonCount}개 강좌</span>
                        </div>
                        {hasAccess ? (
                          <span className="text-[#FFD600] font-black text-[11px] flex items-center gap-0.5">
                            강의 보기 →
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-semibold text-[11px] flex items-center gap-1">
                            <Lock className="w-3 h-3" /> 등급 업그레이드 필요
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Selected Course Detail Panel */}
          <div className={`md:col-span-7 rounded-2xl p-6 md:p-8 space-y-6 transition ${
            activeCourse.requiredTier === 'PRO'
              ? 'bg-gradient-to-b from-[#1C160B] via-[#13110C] to-[#0D0C0A] border-2 border-amber-500/40 shadow-2xl shadow-amber-950/40'
              : 'bg-[#121216] border border-[#27272A]'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {activeCourse.requiredTier === 'PRO' ? (
                  <span className="text-xs font-black text-black bg-gradient-to-r from-amber-400 to-[#FFD600] px-2.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <Pen className="w-3.5 h-3.5" /> PRO 실전 특강
                  </span>
                ) : (
                  <span className="text-xs font-bold text-zinc-300 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" /> {activeCourse.levelTag}
                  </span>
                )}
                <span className="text-xs text-zinc-400">{activeCourse.durationTotal}</span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">{activeCourse.title}</h2>
                <p className={`text-sm font-semibold mt-1 ${activeCourse.requiredTier === 'PRO' ? 'text-[#FFD600]' : 'text-zinc-300'}`}>
                  {activeCourse.subTitle}
                </p>
              </div>

              <p className={`text-xs leading-relaxed p-4 rounded-xl border ${
                activeCourse.requiredTier === 'PRO'
                  ? 'text-amber-100/90 bg-[#19150C] border-amber-500/30'
                  : 'text-zinc-300 bg-[#18181C] border-[#27272A]'
              }`}>
                {activeCourse.description}
              </p>

              {/* PRO Guidance Banner for PRO courses */}
              {activeCourse.requiredTier === 'PRO' && (
                <div className="p-4 bg-gradient-to-r from-[#291F0A] via-[#1F1707] to-[#14120B] border border-amber-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD600]/20 text-[#FFD600] flex items-center justify-center shrink-0 border border-amber-500/30">
                      <Pen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-white text-xs sm:text-sm">PRO 회원 전용 실전 특강</p>
                      <p className="text-amber-200/70 text-[11px]">단순 이론을 넘어 인사담당자의 의도를 사전 통제하는 심화 실전 강의</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!canAccessCourse(activeCourse) && (
                      <button
                        onClick={() => onTabChange('pro-payment')}
                        className="px-3 py-1.5 bg-[#FFD600] text-zinc-950 font-black text-xs rounded-lg hover:bg-[#ffe033] shadow-md transition flex items-center gap-1 shrink-0"
                      >
                        <Pen className="w-3.5 h-3.5" />
                        PRO 결제하기 (월 3.8만~)
                      </button>
                    )}
                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-md shrink-0 self-start sm:self-auto ${
                      canAccessCourse(activeCourse)
                        ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                        : 'bg-zinc-800 text-amber-300 border border-amber-500/30'
                    }`}>
                      {canAccessCourse(activeCourse) ? '수강 가능' : 'PRO 전용'}
                    </span>
                  </div>
                </div>
              )}

              {/* Non-member Guidance Banner for FREE courses */}
              {activeCourse.requiredTier === 'FREE' && currentTier === 'NON_MEMBER' && (
                <div className="p-4 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-transparent border border-[#FFD600]/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD600]/10 text-[#FFD600] flex items-center justify-center shrink-0 border border-[#FFD600]/30">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-black text-white text-xs sm:text-sm">무료 회원 전용 오픈 특강</p>
                      <p className="text-zinc-400 text-[11px]">30초 무료 회원가입 후 즉시 전체 강의 VOD 및 실전 워크북을 무료로 이용하실 수 있습니다.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onTabChange('signup')}
                    className="px-3.5 py-2 bg-[#FFD600] text-zinc-950 font-black text-xs rounded-xl hover:bg-[#ffe033] shadow-md transition flex items-center gap-1 shrink-0 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    무료 가입하고 바로 시청하기
                  </button>
                </div>
              )}

              {/* Quick Play Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={handleQuickPlay}
                  className={`px-5 py-3 font-black text-xs rounded-xl transition shadow-lg flex items-center gap-2 ${
                    activeCourse.requiredTier === 'PRO'
                      ? 'bg-gradient-to-r from-amber-400 via-[#FFD600] to-yellow-300 hover:brightness-110 text-black shadow-amber-500/20'
                      : 'bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 shadow-lg'
                  }`}
                >
                  <PlayCircle className="w-4 h-4 fill-current" />
                  <span>
                    {activeCourse.requiredTier === 'PRO' ? 'PRO 실전 1강 바로 재생' : '1강 바로 재생 (플레이어)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Target Audience */}
            <div className="text-xs text-zinc-400 space-y-1 bg-[#18181C]/60 p-3.5 rounded-xl border border-[#222226]">
              <strong className="text-zinc-200 block">수강 대상:</strong>
              <p>{activeCourse.targetAudience}</p>
            </div>

            {/* Lessons List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  강의 커리큘럼 ({activeCourse.lessons.length}강)
                </h3>
              </div>

              <div className="space-y-2">
                {activeCourse.lessons.map((lesson) => {
                  const hasAccess = canAccessLesson(activeCourse, lesson);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`p-3.5 rounded-xl border transition flex items-center justify-between text-xs cursor-pointer group ${
                        lesson.isPro
                          ? 'bg-gradient-to-r from-[#20190C] via-[#16130D] to-[#11100D] border-amber-500/40 hover:border-amber-400 text-zinc-100 shadow-sm'
                          : 'bg-[#18181C] hover:bg-[#222228] border-[#27272A] hover:border-[#FFD600]/50 text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {lesson.isPro ? (
                          hasAccess ? (
                            <div className="w-7 h-7 rounded-lg bg-[#FFD600] text-black font-bold flex items-center justify-center shrink-0 shadow-sm">
                              <PlayCircle className="w-4 h-4 fill-current" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-[#2C210A] text-[#FFD600] border border-amber-500/50 flex items-center justify-center shrink-0">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          )
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-[#FFD600]/10 text-[#FFD600] group-hover:bg-[#FFD600] group-hover:text-black flex items-center justify-center shrink-0 transition">
                            <PlayCircle className="w-4 h-4 fill-current" />
                          </div>
                        )}
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold block transition truncate ${
                              lesson.isPro ? 'text-white group-hover:text-[#FFD600]' : 'text-white group-hover:text-[#FFD600]'
                            }`}>
                              {lesson.title}
                            </span>
                          </div>
                          <span className={`text-[11px] line-clamp-1 ${
                            lesson.isPro ? 'text-amber-200/60' : 'text-zinc-400'
                          }`}>
                            {lesson.summary}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {lesson.isPro ? (
                          hasAccess ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              <PlayCircle className="w-2.5 h-2.5" />
                              시청 가능
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1 bg-zinc-900 text-zinc-400 border border-zinc-800">
                              <Lock className="w-2.5 h-2.5 text-zinc-500" />
                              잠금
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1 bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
                            <PlayCircle className="w-2.5 h-2.5 text-zinc-400" />
                            {currentTier === 'NON_MEMBER' ? '무료 (가입 후 시청)' : '무료 시청 가능'}
                          </span>
                        )}
                        <span className="text-zinc-500 font-mono text-[11px]">{lesson.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Downloadable Workbook */}
            {activeCourse.workbookTitle && (
              <div className="p-4 bg-[#18181C] border border-[#27272A] rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-200 font-bold">
                  <Download className="w-4 h-4 text-[#FFD600]" />
                  <span>{activeCourse.workbookTitle}</span>
                </div>
                <button
                  onClick={() => {
                    if (currentTier === 'NON_MEMBER') {
                      if (confirm('워크북 자료를 다운로드하려면 무료 회원가입이 필요합니다.\n회원가입 페이지로 이동하시겠습니까?')) {
                        onTabChange('signup');
                      }
                      return;
                    }
                    alert(`${activeCourse.workbookTitle} 다운로드가 시작되었습니다.`);
                  }}
                  className="px-3 py-1.5 bg-[#FFD600] text-[#09090B] font-bold text-[11px] rounded-lg hover:bg-[#ffe033]"
                >
                  다운로드
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Video Player Modal */}
        {activeLesson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-4xl bg-[#121216] text-white border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Modal Top Navigation */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272A] bg-[#09090B]">
                <div className="flex items-center gap-2 min-w-0 pr-3">
                  <span className="px-2 py-0.5 bg-[#FFD600] text-[#09090B] font-bold text-xs rounded shrink-0">
                    0{activeLesson.number}강
                  </span>
                  <h3 className="text-sm font-bold text-white truncate">{activeLesson.title}</h3>
                </div>

                <button
                  onClick={() => setActiveLesson(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
                  title="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Embedded Video Player */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(activeLesson.videoUrl || activeCourse.youtubeUrl)}
                  title={activeLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Lesson Details & Key Takeaways */}
              <div className="p-5 bg-[#09090B] border-t border-[#27272A] space-y-4 overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold text-[#FFD600] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    핵심 강의 섭취 노트 (Key Takeaway)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">강의 시간: {activeLesson.duration}</p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-semibold bg-[#18181C] p-4 rounded-xl border border-[#27272A]">
                  "{activeLesson.keyTakeaway}"
                </p>

                <div className="flex items-center justify-end text-[11px] text-zinc-500 pt-1">
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="text-zinc-400 hover:text-white underline font-bold"
                  >
                    플레이어 닫기
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};


