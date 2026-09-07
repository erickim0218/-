import React, { useState, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  HelpCircle,
  MessageCircle,
  X
} from 'lucide-react';
import { ManagedUser } from '../../types';
import { SignUpView } from './SignUpView';
import { supabaseApi } from '../../lib/supabase';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
  onLoginSuccess: (user: ManagedUser) => void;
  onSignUpSuccess: (user: ManagedUser) => void;
  onTabChange: (tab: string) => void;
  managedUsers: ManagedUser[];
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onSignUpSuccess,
  onTabChange,
  managedUsers
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset-password'>(initialMode);

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginNotice, setLoginNotice] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Find Email modal state
  const [isFindEmailModalOpen, setIsFindEmailModalOpen] = useState(false);

  // Password Reset states
  const [resetStep, setResetStep] = useState<'email' | 'otp' | 'new-password'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [resetError, setResetError] = useState('');
  const [resetNotice, setResetNotice] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Resend countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginNotice('');

    const formattedEmail = loginEmail.trim().toLowerCase();
    if (!formattedEmail) {
      setLoginError('이메일을 입력해주세요.');
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
        const loggedUser: ManagedUser = {
          id: res.user.id,
          username: res.user.user_metadata?.username || formattedEmail.split('@')[0],
          name: res.user.user_metadata?.name || res.user.user_metadata?.username || formattedEmail.split('@')[0],
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
        onLoginSuccess(loggedUser);
        return;
      }
    } catch (err: any) {
      setIsLoggingIn(false);
      let msg = err.message || '로그인 중 오류가 발생했습니다.';
      if (msg.includes('Failed to fetch') || msg.includes('fetch')) {
        msg = 'Supabase 서버 연결 실패: 네트워크 상태를 확인해 주세요.';
      } else if (msg.toLowerCase().includes('invalid credentials') || msg.toLowerCase().includes('invalid login credentials')) {
        msg = '이메일 또는 비밀번호가 올바르지 않습니다.';
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        msg = '이메일 인증이 완료되지 않았습니다. 수신된 이메일의 인증번호를 입력하여 인증을 완료해 주세요.';
      } else if (msg.toLowerCase().includes('invalid api key') || msg.toLowerCase().includes('api key')) {
        msg = 'Supabase API 키가 유효하지 않습니다.';
      }
      setLoginError(msg);
    }
  };

  // Step 1: Send Password Reset Email
  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedEmail = resetEmail.trim().toLowerCase();
    if (!formattedEmail) {
      setResetError('이메일 주소를 입력해 주세요.');
      return;
    }

    setIsResetLoading(true);
    setResetError('');
    setResetNotice('');

    try {
      await supabaseApi.sendPasswordResetEmail(formattedEmail);
    } catch (err: any) {
      console.error('Password reset email error:', err);
    } finally {
      setIsResetLoading(false);
      // 보안을 위해 성공/실패 여부와 관계없이 동일한 메시지 출력
      setResetNotice('가입된 이메일이라면 인증번호가 발송됩니다. 이메일함을 확인해 주세요.');
      setResetStep('otp');
      setResendTimer(60);
    }
  };

  // Resend Reset Code
  const handleResendResetEmail = async () => {
    if (resendTimer > 0) return;
    const formattedEmail = resetEmail.trim().toLowerCase();
    if (!formattedEmail) return;

    setIsResetLoading(true);
    setResetError('');
    setResetNotice('');

    try {
      await supabaseApi.sendPasswordResetEmail(formattedEmail);
    } catch (err: any) {
      console.error('Resend reset email error:', err);
    } finally {
      setIsResetLoading(false);
      setResetNotice('가입된 이메일이라면 인증번호가 발송됩니다.');
      setResendTimer(60);
    }
  };

  // Step 2: Verify Recovery OTP Code
  const handleVerifyRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedEmail = resetEmail.trim().toLowerCase();
    const code = recoveryCode.trim();

    if (!code) {
      setResetError('6자리 인증번호를 입력해 주세요.');
      return;
    }

    setIsResetLoading(true);
    setResetError('');
    setResetNotice('');

    try {
      await supabaseApi.verifyRecoveryOtp(formattedEmail, code);
      setIsResetLoading(false);
      setResetStep('new-password');
      setResetNotice('인증이 완료되었습니다. 새로운 비밀번호를 설정해 주세요.');
    } catch (err: any) {
      console.error('Verify recovery OTP error:', err);
      setIsResetLoading(false);
      const rawMsg = err.message || '';
      let msg = '인증번호 검증 중 오류가 발생했습니다.';

      if (rawMsg.toLowerCase().includes('expired') || rawMsg.includes('otp_expired')) {
        msg = '인증번호가 만료되었습니다. 인증번호 재전송을 눌러주세요.';
      } else if (
        rawMsg.toLowerCase().includes('invalid') ||
        rawMsg.toLowerCase().includes('mismatch') ||
        rawMsg.toLowerCase().includes('incorrect') ||
        rawMsg.toLowerCase().includes('token')
      ) {
        msg = '인증번호가 일치하지 않습니다. 정확히 입력해 주세요.';
      } else if (rawMsg.toLowerCase().includes('rate limit') || rawMsg.toLowerCase().includes('too many')) {
        msg = '인증 시도가 너무 빈번합니다. 잠시 후 다시 시도해 주세요.';
      } else if (rawMsg.includes('Failed to fetch')) {
        msg = 'Supabase 서버 연결 실패: 네트워크 상태를 확인해 주세요.';
      } else {
        msg = rawMsg || msg;
      }

      setResetError(msg);
    }
  };

  // Step 3: Update New Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setResetError('새 비밀번호를 입력해 주세요.');
      return;
    }

    if (newPassword.length < 6) {
      setResetError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setResetError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsResetLoading(true);
    setResetError('');
    setResetNotice('');

    try {
      await supabaseApi.updateUserPassword(newPassword);
      await supabaseApi.signOutAuth();

      setIsResetLoading(false);
      setMode('login');
      setLoginNotice('비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해 주세요.');

      // Reset internal states
      setResetStep('email');
      setResetEmail('');
      setRecoveryCode('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch (err: any) {
      console.error('Update user password error:', err);
      setIsResetLoading(false);
      let msg = err.message || '비밀번호 변경 중 오류가 발생했습니다.';
      if (msg.includes('Failed to fetch')) {
        msg = 'Supabase 서버 연결 실패: 네트워크 상태를 확인해 주세요.';
      }
      setResetError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REPOSITION 계정 센터</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {mode === 'login' && '수강생 로그인'}
            {mode === 'signup' && '리포지셔닝 신규 회원가입'}
            {mode === 'reset-password' && '비밀번호 재설정'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {mode === 'login' && '수강 중인 강의, 실전 템플릿, 내 강의실을 지금 바로 이용하세요.'}
            {mode === 'signup' && '가입 즉시 입문 특강 무료 수강 및 3분 포지셔닝 진단 분석이 제공됩니다.'}
            {mode === 'reset-password' && '가입된 이메일로 발송된 인증번호를 통해 비밀번호를 안전하게 변경하세요.'}
          </p>
        </div>

        {/* Tab Switcher: [로그인] vs [회원가입] */}
        {mode !== 'reset-password' && (
          <div className="p-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError('');
                setLoginNotice('');
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#FFD600] text-zinc-950 shadow-md shadow-yellow-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>로그인</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setLoginError('');
                setLoginNotice('');
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#FFD600] text-zinc-950 shadow-md shadow-yellow-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>회원가입</span>
            </button>
          </div>
        )}

        {/* View Mode: Login */}
        {mode === 'login' && (
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
            {/* Success / Notice Message */}
            {loginNotice && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span className="font-bold leading-relaxed">{loginNotice}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300">
                  이메일 주소
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-zinc-300">
                    비밀번호
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('reset-password');
                      setResetStep('email');
                      setResetEmail(loginEmail);
                      setResetError('');
                      setResetNotice('');
                    }}
                    className="text-[11px] text-[#FFD600] font-semibold hover:underline cursor-pointer"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full pl-10 pr-10 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Find Email Link */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-400 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#FFD600] focus:ring-[#FFD600]"
                  />
                  <span>로그인 상태 유지</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsFindEmailModalOpen(true)}
                  className="text-zinc-400 hover:text-zinc-200 underline cursor-pointer transition"
                >
                  가입 이메일이 기억나지 않나요?
                </button>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="font-medium leading-relaxed">{loginError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 bg-[#FFD600] hover:bg-[#FFE033] active:scale-[0.99] text-zinc-950 font-black text-sm rounded-xl shadow-lg shadow-yellow-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <span>로그인 처리 중...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>로그인하기</span>
                  </>
                )}
              </button>
            </form>

            {/* Switch to Sign Up */}
            <div className="pt-3 text-center text-xs text-zinc-400 border-t border-zinc-800/80">
              <span>아직 리포지셔닝 계정이 없으신가요? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setLoginError('');
                  setLoginNotice('');
                }}
                className="font-black text-[#FFD600] hover:underline ml-1 cursor-pointer"
              >
                회원가입하기 →
              </button>
            </div>
          </div>
        )}

        {/* View Mode: Reset Password */}
        {mode === 'reset-password' && (
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
              <KeyRound className="w-5 h-5 text-[#FFD600]" />
              <h2 className="text-base font-bold text-white">비밀번호 재설정</h2>
            </div>

            {/* Notice Banner */}
            {resetNotice && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span className="font-bold leading-relaxed">{resetNotice}</span>
              </div>
            )}

            {/* Error Banner */}
            {resetError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="font-bold leading-relaxed">{resetError}</span>
              </div>
            )}

            {/* Step 1: Request OTP Email */}
            {resetStep === 'email' && (
              <form onSubmit={handleSendResetEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    가입한 이메일 주소
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full py-3.5 bg-[#FFD600] hover:bg-[#FFE033] text-zinc-950 font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isResetLoading ? '인증번호 발송 중...' : '인증번호 받기'}
                </button>
              </form>
            )}

            {/* Step 2: Input Verification Code */}
            {resetStep === 'otp' && (
              <form onSubmit={handleVerifyRecoveryOtp} className="space-y-4">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs">
                  <span className="text-zinc-400">인증 대상 이메일: </span>
                  <span className="font-mono font-bold text-[#FFD600] ml-1">{resetEmail}</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    6자리 인증번호
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    placeholder="이메일로 발송된 인증번호 입력"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-center tracking-widest font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] transition"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isResetLoading || resendTimer > 0}
                    onClick={handleResendResetEmail}
                    className="flex-1 py-3 bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold text-xs rounded-xl hover:bg-zinc-800 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResetLoading ? 'animate-spin' : ''}`} />
                    <span>
                      {resendTimer > 0 ? `재전송 (${resendTimer}초)` : '인증번호 재전송'}
                    </span>
                  </button>

                  <button
                    type="submit"
                    disabled={isResetLoading || !recoveryCode.trim()}
                    className="flex-[2] py-3 bg-[#FFD600] hover:bg-[#FFE033] text-zinc-950 font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isResetLoading ? '인증 확인 중...' : '인증번호 확인'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Input New Password */}
            {resetStep === 'new-password' && (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    새 비밀번호 (6자 이상)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호 입력"
                      className="w-full pl-10 pr-10 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-300">
                    새 비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPasswordConfirm}
                      onChange={(e) => setNewPasswordConfirm(e.target.value)}
                      placeholder="새 비밀번호 재입력"
                      className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full py-3.5 bg-[#FFD600] hover:bg-[#FFE033] text-zinc-950 font-black text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isResetLoading ? '비밀번호 변경 중...' : '비밀번호 변경 완료'}
                </button>
              </form>
            )}

            {/* Back to Login button */}
            <div className="pt-2 text-center border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setResetError('');
                  setResetNotice('');
                }}
                className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>로그인 화면으로 돌아가기</span>
              </button>
            </div>
          </div>
        )}

        {/* View Mode: Sign Up */}
        {mode === 'signup' && (
          <div className="animate-fade-in">
            <SignUpView
              onSignUpSuccess={onSignUpSuccess}
              onGoToLogin={() => setMode('login')}
              onTabChange={onTabChange}
              managedUsers={managedUsers}
            />
          </div>
        )}

      </div>

      {/* Find Email Modal */}
      {isFindEmailModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsFindEmailModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#FFD600]/10 text-[#FFD600]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">가입 이메일 찾기 안내</h3>
                <p className="text-xs text-zinc-400">보안 및 개인정보 보호 안내</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-zinc-300 leading-relaxed font-medium">
              가입 이메일 확인에는 본인확인이 필요합니다. 고객센터로 문의해 주세요.
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="https://open.kakao.com/o/sEgVEi0h"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#FFE800] hover:bg-[#FADA00] text-zinc-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <MessageCircle className="w-4 h-4 fill-zinc-950 text-zinc-950" />
                <span>카카오톡 고객센터 문의하기</span>
              </a>
              <button
                type="button"
                onClick={() => setIsFindEmailModalOpen(false)}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
