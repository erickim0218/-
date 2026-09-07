import React, { useState, useRef, useEffect, useId } from 'react';
import {
  Menu,
  X,
  Lock,
  Pen,
  Sparkles,
  CreditCard,
  Settings,
  LogOut,
  ShieldAlert,
  BookOpen
} from 'lucide-react';
import { MemberTier } from '../types';

interface HeaderProps {
  currentTab: string;
  practicalSubTab?: 'realneeds' | 'persuasion' | 'interview';
  onTabChange: (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => void;
  currentTier: MemberTier;
  isAdmin?: boolean;
  userName?: string;
  onLogout?: () => void;
  siteFeatures?: Record<string, boolean>;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  practicalSubTab,
  currentTier,
  isAdmin = false,
  userName = '김에릭님',
  onLogout,
  siteFeatures
}) => {
  const [isPracticalHovered, setIsPracticalHovered] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Tooltip states for disabled features (리포지셔닝 클래스, 리포지셔닝 실전활용)
  const [showClassTooltip, setShowClassTooltip] = useState(false);
  const [showPracticalTooltip, setShowPracticalTooltip] = useState(false);

  const classTooltipId = useId();
  const practicalTooltipId = useId();

  // Feature disabled flags
  const isClassDisabled = siteFeatures?.repositioning_class !== true;
  const isPracticalDisabled = siteFeatures?.practical_tools !== true;

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = currentTier !== 'NON_MEMBER';
  const isPaidTier = currentTier === 'PRO' || currentTier === 'BOOTCAMP';

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyInviteCode = () => {
    navigator.clipboard?.writeText('https://reposition.kr/join?ref=RP2026');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const getTierBadgeText = () => {
    if (isAdmin) return '관리자 (Admin)';
    if (currentTier === 'BOOTCAMP') return '부트캠프 수강생';
    if (currentTier === 'PRO') return 'REPOSITION PRO';
    if (currentTier === 'FREE') return '일반 회원';
    return '비회원';
  };

  const displayUserName = currentTier === 'PRO' && userName ? `${userName.replace(/님$/, '')} PRO` : (userName || '김에릭님');

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#09090B]/95 backdrop-blur-md border-b border-[#1F1F24] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Logo */}
            <button
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2 group text-left focus:outline-none shrink-0 cursor-pointer"
            >
              <span className="text-[#FFD600] font-black italic text-2xl lg:text-3xl tracking-tighter select-none leading-none">
                J
              </span>
              <span className="font-extrabold text-sm lg:text-base tracking-tight text-white group-hover:text-[#FFD600] transition">
                REPOSITION
              </span>
            </button>

            {/* Desktop & Tablet Navigation Items */}
            <nav className="hidden min-[1000px]:flex items-center gap-1 xl:gap-2 whitespace-nowrap">
              
              {/* 1. 홈 */}
              <button
                onClick={() => onTabChange('home')}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer ${
                  currentTab === 'home'
                    ? 'text-[#FFD600] bg-[#18181B] shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                홈
              </button>

              {/* 2. 리포지셔닝이란? */}
              <button
                onClick={() => onTabChange('repositioning')}
                className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer ${
                  currentTab === 'repositioning'
                    ? 'text-[#FFD600] bg-[#18181B] shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                리포지셔닝이란?
              </button>

              {/* 3. 리포지셔닝 클래스 (준비중 툴팁 지원) */}
              <div className="relative">
                {isClassDisabled ? (
                  <div
                    onMouseEnter={() => setShowClassTooltip(true)}
                    onMouseLeave={() => setShowClassTooltip(false)}
                    onFocus={() => setShowClassTooltip(true)}
                    onBlur={() => setShowClassTooltip(false)}
                    tabIndex={0}
                    role="region"
                    aria-label="리포지셔닝 클래스 오픈 준비 중"
                    aria-describedby={classTooltipId}
                    className="px-3 py-2 rounded-xl text-xs xl:text-sm font-bold text-zinc-500 bg-zinc-900/40 border border-zinc-800/40 flex items-center gap-1.5 cursor-not-allowed select-none opacity-60"
                  >
                    <span>리포지셔닝 클래스</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onTabChange('classes')}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer ${
                      currentTab === 'classes'
                        ? 'text-[#FFD600] bg-[#18181B] shadow-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    리포지셔닝 클래스
                  </button>
                )}

                {isClassDisabled && showClassTooltip && (
                  <div
                    id={classTooltipId}
                    role="tooltip"
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-zinc-900 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 animate-fade-in pointer-events-none"
                  >
                    🚀 오픈 준비 중입니다. 곧 만나보세요!
                  </div>
                )}
              </div>

              {/* 4. 리포지셔닝 부트캠프 */}
              <button
                onClick={() => onTabChange('bootcamp')}
                className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'bootcamp'
                    ? 'text-[#FFD600] bg-[#18181B] shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <span>리포지셔닝 부트캠프</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              </button>

              {/* 5. 리포지셔닝 실전활용 (준비중 툴팁 지원) */}
              <div 
                className="relative"
                onMouseEnter={() => {
                  setIsPracticalHovered(true);
                  if (isPracticalDisabled) setShowPracticalTooltip(true);
                }}
                onMouseLeave={() => {
                  setIsPracticalHovered(false);
                  setShowPracticalTooltip(false);
                }}
              >
                {isPracticalDisabled ? (
                  <div
                    onFocus={() => setShowPracticalTooltip(true)}
                    onBlur={() => setShowPracticalTooltip(false)}
                    tabIndex={0}
                    role="region"
                    aria-label="리포지셔닝 실전활용 오픈 준비 중"
                    aria-describedby={practicalTooltipId}
                    className="px-3 py-2 rounded-xl text-xs xl:text-sm font-bold text-zinc-500 bg-zinc-900/40 border border-zinc-800/40 flex items-center gap-1.5 cursor-not-allowed select-none opacity-60"
                  >
                    <span>리포지셔닝 실전활용</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onTabChange('practical')}
                    className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition cursor-pointer flex items-center gap-1 ${
                      currentTab === 'practical'
                        ? 'text-[#FFD600] bg-[#18181B] shadow-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <span>리포지셔닝 실전활용</span>
                  </button>
                )}

                {/* Sub-dropdown for practical tools */}
                {!isPracticalDisabled && isPracticalHovered && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-[#121216] border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                    <button
                      onClick={() => onTabChange('practical', 'realneeds')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-[#FFD600] hover:bg-zinc-800/60 transition flex items-center justify-between"
                    >
                      <span>원티드 핵심니즈 분석기</span>
                      {!isPaidTier && !isAdmin && <Lock className="w-3 h-3 text-amber-400" />}
                    </button>
                    <button
                      onClick={() => onTabChange('practical', 'persuasion')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-[#FFD600] hover:bg-zinc-800/60 transition flex items-center justify-between"
                    >
                      <span>이력서 설득력 진단기</span>
                      {!isPaidTier && !isAdmin && <Lock className="w-3 h-3 text-amber-400" />}
                    </button>
                    <button
                      onClick={() => onTabChange('practical', 'interview')}
                      className="w-full text-left px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-[#FFD600] hover:bg-zinc-800/60 transition flex items-center justify-between"
                    >
                      <span>AI 면접 예상 질문 생성기</span>
                      {!isPaidTier && !isAdmin && <Lock className="w-3 h-3 text-amber-400" />}
                    </button>
                  </div>
                )}

                {isPracticalDisabled && showPracticalTooltip && (
                  <div
                    id={practicalTooltipId}
                    role="tooltip"
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-zinc-900 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 animate-fade-in pointer-events-none"
                  >
                    🚀 오픈 준비 중입니다. 곧 만나보세요!
                  </div>
                )}
              </div>

              {/* 6. PRO로 시작하기 Button (단일 유지) */}
              <button
                onClick={() => onTabChange('pro-payment')}
                className="px-4 py-2 rounded-xl text-xs xl:text-sm font-black transition cursor-pointer flex items-center gap-1.5 bg-[#141417] border border-[#FFD600]/40 hover:bg-[#1d1d23] shadow-md"
              >
                <Pen className="w-4 h-4 text-[#FFD600]" />
                <span><span className="text-[#FFD600]">프로</span><span className="text-white">로 시작하기</span></span>
              </button>

            </nav>

            {/* Right Action Area (User Name + Tier + Profile Menu) */}
            <div className="flex items-center gap-3">
              {!isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTabChange('auth')}
                    className="px-4 py-2 text-xs xl:text-sm font-bold text-zinc-300 hover:text-white transition cursor-pointer"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => onTabChange('signup')}
                    className="px-4 py-2 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 font-black text-xs xl:text-sm rounded-xl transition shadow cursor-pointer"
                  >
                    회원가입
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* User Name & Tier text */}
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-white tracking-tight">{displayUserName}</p>
                    <p className="text-[10px] text-emerald-400 font-medium flex items-center justify-end gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      {getTierBadgeText()}
                    </p>
                  </div>

                  {/* Profile Dropdown / Hamburger Menu Toggle */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="p-2.5 rounded-xl bg-[#141417] border border-zinc-800 hover:border-zinc-700 text-[#FFD600] transition cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                      aria-label="사용자 메뉴 열기"
                    >
                      <Menu className="w-5 h-5 text-[#FFD600]" />
                    </button>

                    {/* Profile & Navigation Dropdown Menu */}
                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-[#121216] border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in text-xs font-sans">
                        <div className="px-4 py-3 border-b border-zinc-800 sm:hidden">
                          <p className="font-bold text-white text-sm">{displayUserName}</p>
                          <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                            {getTierBadgeText()}
                          </p>
                        </div>

                        {/* Mobile quick links inside dropdown */}
                        <div className="py-1 min-[1000px]:hidden border-b border-zinc-800/80 mb-1">
                          <button
                            onClick={() => {
                              onTabChange('home');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-zinc-300 hover:text-[#FFD600] hover:bg-zinc-800/60 transition font-bold"
                          >
                            홈
                          </button>
                          <button
                            onClick={() => {
                              onTabChange('repositioning');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-zinc-300 hover:text-[#FFD600] hover:bg-zinc-800/60 transition font-bold"
                          >
                            리포지셔닝이란?
                          </button>
                          <button
                            onClick={() => {
                              onTabChange('classes');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-zinc-300 hover:text-[#FFD600] hover:bg-zinc-800/60 transition font-bold"
                          >
                            리포지셔닝 클래스
                          </button>
                          <button
                            onClick={() => {
                              onTabChange('bootcamp');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-zinc-300 hover:text-[#FFD600] hover:bg-zinc-800/60 transition font-bold"
                          >
                            리포지셔닝 부트캠프
                          </button>
                          <button
                            onClick={() => {
                              onTabChange('practical');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-zinc-300 hover:text-[#FFD600] hover:bg-zinc-800/60 transition font-bold"
                          >
                            리포지셔닝 실전활용
                          </button>
                        </div>

                        <div className="py-1">
                          <button
                            onClick={() => {
                              onTabChange('classes');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition flex items-center gap-2 cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4 text-[#FFD600]" />
                            <span>내 강의실</span>
                          </button>

                          <button
                            onClick={() => {
                              onTabChange('pro-payment');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition flex items-center gap-2 cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4 text-amber-400" />
                            <span>멤버십 관리 / 결제</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsInviteModalOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition flex items-center gap-2 cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span>친구 초대 & 리워드</span>
                          </button>

                          <button
                            onClick={() => {
                              setIsSettingsModalOpen(true);
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition flex items-center gap-2 cursor-pointer"
                          >
                            <Settings className="w-4 h-4 text-zinc-400" />
                            <span>계정 설정</span>
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => {
                                onTabChange('admin');
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-indigo-400 hover:text-indigo-300 hover:bg-zinc-800/60 transition flex items-center gap-2 cursor-pointer font-bold border-t border-zinc-800/80 mt-1 pt-2"
                            >
                              <ShieldAlert className="w-4 h-4 text-indigo-400" />
                              <span>관리자 대시보드</span>
                            </button>
                          )}
                        </div>

                        {onLogout && (
                          <div className="border-t border-zinc-800 pt-1 mt-1">
                            <button
                              onClick={() => {
                                onLogout();
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-zinc-800/60 transition flex items-center justify-between cursor-pointer font-bold"
                            >
                              <span>로그아웃</span>
                              <LogOut className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 친구 추천 모달 */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 animate-fade-in text-zinc-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>친구 초대 & 수강료 리워드</span>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-black text-white">
              친구에게 추천하고 10,000P 받으세요!
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              친구가 추천 링크를 통해 회원가입 시, 친구에게는 <strong>특강 1회 무료 쿠폰</strong>이 지급되고 추천인에게는 <strong>10,000 리포지셔닝 포인트</strong>가 즉시 적립됩니다.
            </p>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-300 truncate">https://reposition.kr/join?ref=RP2026</span>
              <button
                onClick={handleCopyInviteCode}
                className="ml-2 px-3 py-1.5 bg-[#00c776] hover:bg-[#00b068] text-white font-bold rounded-lg text-xs shrink-0 cursor-pointer"
              >
                {copiedInvite ? '복사완료!' : '링크 복사'}
              </button>
            </div>

            <button
              onClick={() => setIsInviteModalOpen(false)}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 계정 설정 모달 */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4 animate-fade-in text-zinc-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
                <Settings className="w-4 h-4 text-[#FFD600]" />
                <span>계정 및 알림 설정</span>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-900 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-200">새 강의 및 부트캠프 알림</p>
                  <p className="text-[11px] text-zinc-500">신규 기수 모집 시 카카오 알림톡 전송</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#00c776]" />
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-200">1:1 과제 첨삭 및 피드백 알림</p>
                  <p className="text-[11px] text-zinc-500">멘토 피드백 등록 시 이메일 알림</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#00c776]" />
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold type-zinc-200">보안 2단계 인증</p>
                  <p className="text-[11px] text-zinc-500">기기 변경 시 SMS 인증번호 확인</p>
                </div>
                <input type="checkbox" className="w-4 h-4 rounded text-[#00c776]" />
              </div>
            </div>

            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full py-3 bg-[#00c776] hover:bg-[#00b068] text-white font-black text-xs rounded-xl cursor-pointer"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
