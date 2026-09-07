import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { ManagedUser } from '../../types';
import { supabaseApi } from '../../lib/supabase';

interface SignUpViewProps {
  onSignUpSuccess: (user: ManagedUser) => void;
  onGoToLogin?: () => void;
  onTabChange: (tab: string) => void;
  managedUsers?: ManagedUser[];
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSignUpSuccess,
  onGoToLogin,
  onTabChange,
  managedUsers = []
}) => {
  // Step: 'form' (회원정보 입력) | 'otp' (이메일 인증번호 입력)
  const [step, setStep] = useState<'form' | 'otp'>('form');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // OTP states
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [otpError, setOtpError] = useState('');

  // General form submission states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingUser, setPendingUser] = useState<ManagedUser | null>(null);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!email.trim()) {
      newErrors.email = '이메일 주소를 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 6자리 이상이어야 합니다.';
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = '이용약관에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    const newUser: ManagedUser = {
      id: `usr-${Date.now()}`,
      username: trimmedName,
      password: password,
      name: trimmedName,
      email: trimmedEmail,
      phone: '010-0000-0000',
      careerLevel: '신입',
      tier: 'FREE',
      joinedDate: new Date().toISOString().slice(0, 10),
      lastLoginDate: '방금 전',
      targetJob: '리포지셔닝 수강생',
      totalSpent: 0,
      status: '활성',
      notes: `간편 회원가입 (성함: ${trimmedName})`
    };

    try {
      const res = await supabaseApi.signUpWithEmail(trimmedEmail, password, {
        display_name: trimmedName,
        full_name: trimmedName,
        name: trimmedName,
        username: trimmedName
      });

      if (res?.user?.id) {
        newUser.id = res.user.id;
      }

      setPendingUser(newUser);
      setIsSubmitting(false);
      setStep('otp');
      setOtpNotice(`입력하신 이메일(${trimmedEmail})로 6자리 인증번호가 발송되었습니다. 이메일을 확인해 주세요.`);
      setOtpError('');
      setOtpCode('');
    } catch (err: any) {
      console.error('Supabase signUp error:', err.message || err);
      setIsSubmitting(false);
      let msg = err.message || '회원가입 중 오류가 발생했습니다.';
      if (msg.includes('Failed to fetch') || msg.includes('fetch')) {
        msg = 'Supabase 서버 연결 실패 (Failed to fetch): 네트워크 상태를 확인해 주세요.';
      } else if (msg.toLowerCase().includes('invalid api key') || msg.toLowerCase().includes('api key')) {
        msg = 'Supabase API 키가 유효하지 않습니다.';
      } else if (msg.includes('already registered')) {
        msg = '이미 등록된 이메일 주소입니다. 다른 이메일을 사용하거나 로그인해 주세요.';
      } else if (msg.includes('Password')) {
        msg = '비밀번호 요구사항(6자 이상)을 충족하지 않습니다.';
      }
      setErrors({ submit: msg });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = otpCode.trim();
    if (!trimmedCode) {
      setOtpError('인증번호를 입력해 주세요.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');
    setOtpNotice('');

    try {
      const res = await supabaseApi.verifyEmailOtp(email.trim(), trimmedCode);

      setIsVerifying(false);

      if (res?.user) {
        const completedUser: ManagedUser = pendingUser ? {
          ...pendingUser,
          id: res.user.id || pendingUser.id
        } : {
          id: res.user.id || `usr-${Date.now()}`,
          username: name.trim(),
          password: password,
          name: name.trim(),
          email: email.trim(),
          phone: '010-0000-0000',
          tier: 'FREE',
          joinedDate: new Date().toISOString().slice(0, 10),
          lastLoginDate: '방금 전',
          targetJob: '리포지셔닝 수강생',
          totalSpent: 0,
          status: '활성'
        };

        setOtpNotice('이메일 인증이 성공적으로 완료되었습니다! 메인 화면으로 이동합니다.');
        setTimeout(() => {
          onSignUpSuccess(completedUser);
        }, 1200);
      } else {
        setOtpError('인증에 성공했으나 사용자 정보를 불러오지 못했습니다. 다시 시도해 주세요.');
      }
    } catch (err: any) {
      console.error('Supabase verifyOtp error:', err.message || err);
      setIsVerifying(false);
      const rawMsg = err.message || '';
      let msg = '인증번호 검증 중 오류가 발생했습니다.';

      if (rawMsg.toLowerCase().includes('expired') || rawMsg.includes('otp_expired')) {
        msg = '인증번호가 만료되었습니다. 인증번호 재전송 버튼을 눌러주세요.';
      } else if (
        rawMsg.toLowerCase().includes('invalid') ||
        rawMsg.toLowerCase().includes('mismatch') ||
        rawMsg.toLowerCase().includes('incorrect') ||
        rawMsg.toLowerCase().includes('token')
      ) {
        msg = '인증번호가 일치하지 않습니다. 다시 확인 후 정확히 입력해 주세요.';
      } else if (rawMsg.toLowerCase().includes('rate limit') || rawMsg.toLowerCase().includes('too many')) {
        msg = '인증 시도가 너무 빈번합니다. 잠시 후 다시 시도해 주세요.';
      } else if (rawMsg.includes('Failed to fetch')) {
        msg = 'Supabase 서버 연결 실패: 네트워크 상태를 확인해 주세요.';
      } else {
        msg = rawMsg || msg;
      }

      setOtpError(msg);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setOtpError('');
    setOtpNotice('');

    try {
      await supabaseApi.resendSignUpOtp(email.trim());
      setIsResending(false);
      setOtpNotice(`이메일(${email.trim()})로 새로운 인증번호가 재발송되었습니다.`);
    } catch (err: any) {
      console.error('Supabase resend error:', err.message || err);
      setIsResending(false);
      const rawMsg = err.message || '';
      let msg = '인증번호 재전송 중 오류가 발생했습니다.';

      if (rawMsg.toLowerCase().includes('rate limit') || rawMsg.toLowerCase().includes('too many') || rawMsg.includes('429')) {
        msg = '재전송 요청이 너무 빈번하거나 이메일 발송 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.';
      } else if (rawMsg.includes('Failed to fetch')) {
        msg = 'Supabase 서버 연결 실패: 네트워크 상태를 확인해 주세요.';
      } else {
        msg = rawMsg || msg;
      }

      setOtpError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">

        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REPOSITION 회원가입</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {step === 'form' ? (
              <>회원가입하고 <span className="text-[#FFD600]">시작하기</span></>
            ) : (
              <>이메일 <span className="text-[#FFD600]">인증번호 입력</span></>
            )}
          </h1>
          <p className="text-xs text-zinc-400">
            {step === 'form'
              ? '이름과 이메일 주소, 비밀번호를 입력하고 이메일 인증을 완료해 가입하세요.'
              : '수신된 이메일의 6자리 인증번호를 입력하여 회원가입을 완료하세요.'}
          </p>
        </div>

        {/* Step 1: Registration Form */}
        {step === 'form' && (
          <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD600]/5 rounded-full blur-3xl pointer-events-none" />

            {errors.submit && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                <span className="font-bold leading-relaxed">{errors.submit}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* 1. 이름 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#FFD600]" />
                  이름 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해 주세요 (예: 홍길동)"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* 2. 이메일 주소 (로그인 계정) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#FFD600]" />
                  이메일 주소 (로그인 계정) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  로그인할 때 이메일 전체 주소를 입력합니다
                </p>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* 3. 비밀번호 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FFD600]" />
                  비밀번호 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6자 이상 비밀번호"
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* 4. 비밀번호 확인 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#FFD600]" />
                  비밀번호 확인 <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호 재입력"
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                />
                {errors.passwordConfirm && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.passwordConfirm}
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400 select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-[#FFD600] focus:ring-[#FFD600]"
                  />
                  <span>이용약관 및 개인정보 처리방침에 동의합니다 (필수)</span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#FFD600] hover:bg-[#FFE033] active:scale-[0.99] text-zinc-950 font-black text-sm rounded-xl shadow-lg shadow-yellow-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <span>회원가입 요청 및 이메일 발송 중...</span>
                ) : (
                  <>
                    <span>인증번호 받기</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Go to login */}
            <div className="pt-6 text-center border-t border-zinc-800/80 mt-6 text-xs text-zinc-400">
              <span>이미 계정이 있으신가요? </span>
              <button
                type="button"
                onClick={onGoToLogin}
                className="font-black text-[#FFD600] hover:underline ml-1 cursor-pointer"
              >
                로그인하기 →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification Screen */}
        {step === 'otp' && (
          <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD600]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Target Email Info Badge */}
            <div className="mb-6 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs space-y-1">
              <span className="text-zinc-400 block font-medium">인증번호가 발송된 이메일:</span>
              <div className="font-mono font-bold text-base text-[#FFD600] break-all flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFD600] shrink-0" />
                <span>{email}</span>
              </div>
            </div>

            {/* Notice Message */}
            {otpNotice && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-start gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                <span className="font-bold leading-relaxed">{otpNotice}</span>
              </div>
            )}

            {/* Error Message */}
            {otpError && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <span className="font-bold leading-relaxed">{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#FFD600]" />
                  이메일 인증번호 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={10}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="이메일로 발송된 인증번호 입력"
                  className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-base tracking-widest font-mono text-center text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD600] transition"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || !otpCode.trim()}
                className="w-full py-3.5 bg-[#FFD600] hover:bg-[#FFE033] active:scale-[0.99] text-zinc-950 font-black text-sm rounded-xl shadow-lg shadow-yellow-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>인증번호 확인 중...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>인증하기</span>
                  </>
                )}
              </button>
            </form>

            {/* Actions: Resend & Go Back */}
            <div className="pt-6 mt-6 border-t border-zinc-800/80 space-y-3 text-center">
              <button
                type="button"
                disabled={isResending}
                onClick={handleResendOtp}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>{isResending ? '재전송 중...' : '인증번호 재전송'}</span>
              </button>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setOtpError('');
                    setOtpNotice('');
                  }}
                  className="text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto py-1 cursor-pointer transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>회원가입 화면으로 돌아가기</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
