import React, { useState } from 'react';
import { Lock, ShieldAlert, CheckCircle, Sparkles, Pen, ArrowRight, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { MemberTier, ManagedUser } from '../types';
import { supabaseApi } from '../lib/supabase';

interface NonMemberBlockGateProps {
  onSignUpFree: () => void;
  onGoToSignUp?: () => void;
  onGoToProPayment: () => void;
  onLoginSuccess: (tier: MemberTier, user?: Partial<ManagedUser>) => void;
  managedUsers?: ManagedUser[];
}

export const NonMemberBlockGate: React.FC<NonMemberBlockGateProps> = ({
  onSignUpFree,
  onGoToSignUp,
  onGoToProPayment,
  onLoginSuccess,
  managedUsers = []
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const formattedEmail = loginEmail.trim().toLowerCase();
    if (!formattedEmail) {
      setLoginError('이메일 주소를 입력해주세요.');
      return;
    }

    if (!loginPassword) {
      setLoginError('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const res = await supabaseApi.signInWithEmail(formattedEmail, loginPassword);
      if (res && res.user) {
        const foundUser: ManagedUser = {
          id: res.user.id,
          username: res.user.user_metadata?.username || formattedEmail.split('@')[0],
          name: res.user.user_metadata?.name || res.user.user_metadata?.display_name || formattedEmail.split('@')[0],
          email: res.user.email || formattedEmail,
          phone: res.user.user_metadata?.phone || '010-0000-0000',
          tier: 'FREE',
          joinedDate: new Date().toISOString().slice(0, 10),
          lastLoginDate: new Date().toISOString().slice(0, 10),
          targetJob: '리포지셔닝 수강생',
          totalSpent: 0,
          status: '활성'
        };
        setIsLoggingIn(false);
        onLoginSuccess(foundUser.tier, foundUser);
        setShowLoginModal(false);
        return;
      }
    } catch (err: any) {
      setIsLoggingIn(false);
      let msg = err.message || '로그인 중 오류가 발생했습니다.';
      if (msg.includes('Failed to fetch')) {
        msg = 'Supabase 서버 연결 실패: 네트워크 상태를 확인해 주세요.';
      } else if (msg.toLowerCase().includes('invalid credentials') || msg.toLowerCase().includes('invalid login credentials')) {
        msg = '이메일 또는 비밀번호가 올바르지 않습니다.';
      }
      setLoginError(msg);
    }
  };

  const handleSignUpClick = () => {
    if (onGoToSignUp) {
      onGoToSignUp();
    } else {
      onSignUpFree();
    }
  };

  return (
    <div className="relative min-h-[85vh] bg-[#09090B] text-white flex items-center justify-center px-4 py-12">
      {/* Background glowing gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[250px] bg-red-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto space-y-8 text-center">
        
        {/* Lock Warning Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black animate-pulse">
          <ShieldAlert className="w-4 h-4" />
          <span>비회원 접근 제한 (회원 전용 서비스)</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#18181C] border border-[#27272A] flex items-center justify-center shadow-xl shadow-black/60">
            <Lock className="w-8 h-8 text-[#FFD600]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            비회원은 모든 기능 이용이 <span className="text-red-400 underline underline-offset-4 decoration-red-400/50">제한</span>됩니다
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            리포지셔닝 클래스, 합격 진단 분석, 실전 템플릿, 부트캠프 신청 등<br className="hidden sm:inline" />
            핵심 취업·이직 솔루션은 <strong>로그인 후 이용</strong>하실 수 있습니다.
          </p>
        </div>

        {/* Comparison Card: Non-member vs Member */}
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 sm:p-6 text-left shadow-2xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Non-member column */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-red-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> 현재: 비회원
                </span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-black">
                  기능 사용 불가
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2 line-through text-zinc-500">
                  <span className="text-red-400">✕</span> 리포지셔닝 입문 강의 시청
                </li>
                <li className="flex items-center gap-2 line-through text-zinc-500">
                  <span className="text-red-400">✕</span> 3분 합격 포지셔닝 자가진단
                </li>
                <li className="flex items-center gap-2 line-through text-zinc-500">
                  <span className="text-red-400">✕</span> 실전 이력서·자기설득서 템플릿
                </li>
                <li className="flex items-center gap-2 line-through text-zinc-500">
                  <span className="text-red-400">✕</span> 내 강의실 학습 진도 관리
                </li>
              </ul>
            </div>

            {/* Free Member column */}
            <div className="p-4 rounded-xl bg-[#18181C] border border-amber-500/40 space-y-3 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#FFD600]/10 rounded-full blur-xl" />
              <div className="flex items-center justify-between relative z-10">
                <span className="text-xs font-bold text-[#FFD600] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 무료 회원 (FREE)
                </span>
                <span className="text-[10px] bg-[#FFD600] text-zinc-950 px-2 py-0.5 rounded font-black">
                  3초 만에 해금
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-200 relative z-10">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>기획자 J 입문 특강 무료 수강</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>맞춤형 취약점 진단 & 처방</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>합격 사례 분석 리포트 열람</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>내 강의실 학습 기록 저장</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="text-[11px] text-zinc-400 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Pen className="w-4 h-4 text-[#FFD600]" />
              <strong>더 깊은 실전 합격을 원하시나요?</strong> 7대 심화 특강 & 템플릿 무제한 PRO 플랜
            </span>
            <button
              onClick={onGoToProPayment}
              className="text-[#FFD600] font-black underline hover:text-yellow-300 transition shrink-0 ml-2"
            >
              PRO로 시작하기 →
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* 1. Fast Free Sign up CTA */}
          <button
            onClick={handleSignUpClick}
            className="w-full py-4 px-6 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 font-black text-sm rounded-xl shadow-lg shadow-yellow-500/20 transition flex items-center justify-center gap-2.5 group transform active:scale-[0.99] cursor-pointer"
          >
            <UserPlus className="w-5 h-5 text-zinc-950" />
            <span>무료 회원가입하고 모든 콘텐츠 이용하기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 2. Sub Actions (PRO Subscription / Login) */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onGoToProPayment}
              className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:bg-amber-500/30 text-[#FFD600] border border-amber-500/40 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Pen className="w-4 h-4" />
              <span>PRO로 시작하기 (1/3/6개월 플랜)</span>
            </button>

            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full sm:w-auto py-3 px-6 bg-[#18181C] hover:bg-[#222228] text-zinc-300 hover:text-white border border-[#27272A] font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-zinc-400" />
              <span>기존 계정 로그인</span>
            </button>
          </div>
        </div>

      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#27272A] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-[#FFD600]" />
                <h3 className="text-base font-black text-white">리포지셔닝 로그인</h3>
              </div>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-zinc-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {loginError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-zinc-300 font-bold mb-1.5">이메일 주소</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1.5">비밀번호</label>
                <input
                  type="password"
                  required
                  placeholder="비밀번호를 입력해 주세요"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#FFD600] text-zinc-950 font-black rounded-xl hover:bg-[#ffe033] transition text-center cursor-pointer"
                >
                  로그인하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    handleSignUpClick();
                  }}
                  className="px-4 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-700 transition cursor-pointer"
                >
                  무료 회원가입
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
