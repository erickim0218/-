import React, { useState } from 'react';
import { 
  Pen, 
  Check, 
  ArrowRight, 
  Sparkles,
  Video,
  FileText,
  Target,
  MessageSquareQuote,
  MessageCircle,
  Compass,
  ShieldCheck
} from 'lucide-react';
import { MemberTier, PaymentRecord, UserProfile } from '../../types';

interface ProPaymentViewProps {
  currentTier: MemberTier;
  userProfile?: UserProfile;
  onPaymentComplete: (record: PaymentRecord) => void;
  onTabChange: (tab: string) => void;
}

interface PlanItem {
  id: '1month' | '3month' | '6month';
  durationMonths: number;
  name: string;
  subLabel: string;
  description: string;
  price: number;
  originalPrice?: number;
  monthlyText: string;
  badge?: string;
  isPopular?: boolean;
}

export const ProPaymentView: React.FC<ProPaymentViewProps> = ({
  currentTier
}) => {
  const KAKAO_OPENCHAT_URL = 'https://open.kakao.com/o/sEgVEi0h';

  const plans: PlanItem[] = [
    {
      id: '1month',
      durationMonths: 1,
      name: 'PRO START 30',
      subLabel: '프로의 시작',
      description: '당장 필요한 서류와 면접을 프로의 언어로 바꾸는 30일',
      price: 35000,
      originalPrice: 69000,
      monthlyText: '35,000원'
    },
    {
      id: '3month',
      durationMonths: 3,
      name: 'PRO POSITION 90',
      subLabel: '프로의 완성',
      description: '경험·서류·면접을 하나의 포지션으로 완성하는 90일',
      price: 75000,
      originalPrice: 149000,
      monthlyText: '월 25,000원',
      badge: '가장 많이 선택',
      isPopular: true
    },
    {
      id: '6month',
      durationMonths: 6,
      name: 'PRO CAREER 180',
      subLabel: '프로의 확장',
      description: '상·하반기 공채와 이직까지 나만의 포지션을 확장하는 180일',
      price: 115000,
      originalPrice: 229000,
      monthlyText: '월 약 19,160원',
      badge: '장기 이용 추천'
    }
  ];

  const [selectedPlanId, setSelectedPlanId] = useState<'1month' | '3month' | '6month'>('3month');
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[1];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* 1. Header with Clean Brand Intro */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm">
            <Pen className="w-3.5 h-3.5 text-[#FFD600]" />
            <span>REPOSITION PRO</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            합격을 기다리는 지원자에서<br className="hidden sm:inline" />
            기업이 선택할 이유를 가진 프로로 시작하세요.
          </h1>

          <div className="max-w-2xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 text-left space-y-4 shadow-xl">
            <p className="font-black text-base sm:text-lg text-[#FFD600] tracking-tight">
              &quot;김프로, 이프로, 박프로&quot;
            </p>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              이름 뒤에 프로가 붙는 사람들은 스펙이 많은 사람이 아닙니다.<br />
              자신의 경험을 기업이 원하는 가치로 설명할 수 있는 사람입니다.
            </p>
            <p className="pt-3 border-t border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              기획자 J의 7대 심화 실전 특강 무제한 수강과 REALNEEDS 이력서, 자기설득서 8문항, 실전 면접 원본 템플릿을 통해 당신이 이미 가진 경험을 직무의 전문성으로 바꿉니다.
            </p>
          </div>

          {currentTier === 'PRO' && (
            <div className="inline-block mt-2 px-4 py-2 bg-white text-zinc-900 rounded-xl text-xs font-bold shadow-sm">
              ✓ 현재 <span className="font-black text-amber-600">REPOSITION PRO 회원</span>입니다. 신청 시 이용 기간이 자동으로 연장됩니다.
            </div>
          )}

          {currentTier === 'BOOTCAMP' && (
            <div className="inline-block mt-2 px-4 py-2.5 bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 rounded-xl text-xs font-bold shadow-md">
              🔥 현재 <span className="font-black text-indigo-300">BOOTCAMP 수강생</span>으로 PRO의 모든 콘텐츠와 실전 워크북을 제한없이 이용하실 수 있습니다.
            </div>
          )}
        </div>

        {/* 2. PRO 전환 3단계 섹션 */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-[#FFD600] tracking-wider uppercase">IDENTITY SHIFT</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">당신의 이름 뒤에 PRO가 붙는 과정</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-black px-2 py-0.5 bg-amber-500/20 text-[#FFD600] rounded">STEP 01</span>
              <h3 className="font-black text-white text-sm">경험을 발견합니다</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                평범하다고 생각했던 경험에서 문제를 해결하고 변화를 만든 순간을 찾아냅니다.
              </p>
            </div>

            <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-black px-2 py-0.5 bg-amber-500/20 text-[#FFD600] rounded">STEP 02</span>
              <h3 className="font-black text-white text-sm">기업의 언어로 바꿉니다</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                나의 행동과 결과를 기업이 원하는 역량과 직무 가치의 언어로 재정의합니다.
              </p>
            </div>

            <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-2">
              <span className="text-[10px] font-black px-2 py-0.5 bg-amber-500/20 text-[#FFD600] rounded">STEP 03</span>
              <h3 className="font-black text-white text-sm">선택할 이유로 증명합니다</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                이력서, 자기설득서, 면접에서 하나의 일관된 포지션으로 나를 각인시킵니다.
              </p>
            </div>
          </div>

          <p className="text-center text-xs font-semibold text-zinc-400 pt-2">
            경험은 그대로지만, 기업이 당신을 읽는 방식은 달라집니다.
          </p>
        </div>

        {/* 3. Plan Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-3xl p-6 sm:p-7 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white text-zinc-900 shadow-2xl shadow-white/10 ring-2 ring-[#FFD600] scale-[1.02]'
                    : 'bg-zinc-900/90 text-zinc-100 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                {/* Top Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className={`px-3 py-1 text-[11px] font-black rounded-full shadow-sm ${
                      isSelected
                        ? 'bg-zinc-950 text-[#FFD600]'
                        : 'bg-[#FFD600] text-zinc-950'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <h3 className={`text-sm font-black tracking-wider uppercase ${isSelected ? 'text-amber-700' : 'text-[#FFD600]'}`}>
                        {plan.name}
                      </h3>
                      <span className={`text-xs font-bold ${isSelected ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        {plan.subLabel}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isSelected ? 'text-zinc-700' : 'text-zinc-300'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Row */}
                  <div className={`pt-4 border-t ${isSelected ? 'border-zinc-200' : 'border-zinc-800'} space-y-1`}>
                    {plan.originalPrice && (
                      <span className={`text-[11px] line-through block ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        ₩ {plan.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-2xl sm:text-3xl font-black ${isSelected ? 'text-zinc-950' : 'text-white'}`}>
                        ₩ {plan.price.toLocaleString()}
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-zinc-600' : 'text-zinc-400'}`}>
                        ({plan.durationMonths}개월 이용)
                      </span>
                    </div>
                    <p className={`text-xs font-bold ${isSelected ? 'text-amber-800' : 'text-[#FFD600]'}`}>
                      {plan.monthlyText}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-inherit">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlanId(plan.id);
                    }}
                    className={`w-full py-3 px-4 rounded-2xl text-xs font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#09090B] text-white hover:bg-zinc-800'
                        : 'bg-[#FFD600] text-zinc-950 hover:bg-[#ffe033]'
                    }`}
                  >
                    <span>{plan.durationMonths === 1 ? '30일 PRO 시작하기' : plan.durationMonths === 3 ? '90일 PRO 완성하기' : '180일 PRO 확장하기'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Before / After Section */}
        <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-rose-400 tracking-wider uppercase">PERSPECTIVE SHIFT</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">지원자의 언어에서 PRO의 언어로</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 bg-rose-950/20 border border-rose-900/30 rounded-2xl space-y-3">
              <span className="text-xs font-black text-rose-400 block">❌ 지원자의 방식</span>
              <ul className="space-y-2.5 text-xs text-zinc-300 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 shrink-0 font-bold">•</span>
                  <span>맡은 업무를 나열합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 shrink-0 font-bold">•</span>
                  <span>기업이 나를 알아봐 주기를 기다립니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 shrink-0 font-bold">•</span>
                  <span>질문에 맞는 답을 찾습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 shrink-0 font-bold">•</span>
                  <span>스펙이 부족하다고 생각합니다.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-amber-950/20 border border-amber-500/30 rounded-2xl space-y-3">
              <span className="text-xs font-black text-[#FFD600] block">✨ REPOSITION PRO의 방식</span>
              <ul className="space-y-2.5 text-xs text-zinc-100 font-semibold">
                <li className="flex items-start gap-2">
                  <span className="text-[#FFD600] shrink-0 font-bold">✓</span>
                  <span>해결한 문제와 만든 변화를 설명합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFD600] shrink-0 font-bold">✓</span>
                  <span>기업이 기억할 포지션을 먼저 제시합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFD600] shrink-0 font-bold">✓</span>
                  <span>나를 선택해야 할 이유로 답변을 설계합니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFD600] shrink-0 font-bold">✓</span>
                  <span>이미 가진 경험의 가치를 재정의합니다.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. 4 Core Weapons Section */}
        <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-2">
            <div>
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">PRO WEAPONS</span>
              <h3 className="text-lg sm:text-xl font-black text-zinc-950">PRO를 만드는 4가지 무기</h3>
            </div>
            <span className="text-xs font-bold text-zinc-500">결제 즉시 모든 콘텐츠와 실전 템플릿을 제한 없이 이용할 수 있습니다.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1 */}
            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex flex-col justify-between space-y-3 shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-900 rounded">PRO INSIGHT</span>
                <div className="flex items-center gap-1.5 font-black text-zinc-950 text-sm">
                  <Video className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>프로의 관점</span>
                </div>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  인사담당자의 평가 기준을 이해하고, 나의 경험을 성과와 가치의 언어로 바꾸는 실전 강의
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 pt-2 border-t border-zinc-200/60 block">취업·이직 실무 강의 전편</span>
            </div>

            {/* 2 */}
            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex flex-col justify-between space-y-3 shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-900 rounded">PRO RESUME</span>
                <div className="flex items-center gap-1.5 font-black text-zinc-950 text-sm">
                  <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>프로의 이력서</span>
                </div>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  단순 경력 나열을 넘어 기업의 REAL NEEDS에 맞춰 나의 전문성을 증명하는 이력서
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 pt-2 border-t border-zinc-200/60 block">신입 프로젝트 및 경력직 성과 수치화 양식</span>
            </div>

            {/* 3 */}
            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex flex-col justify-between space-y-3 shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-900 rounded">PRO STORY</span>
                <div className="flex items-center gap-1.5 font-black text-zinc-950 text-sm">
                  <Target className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>프로의 서사</span>
                </div>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  기업의 필요와 나의 경험을 연결하여 선택할 이유를 완성하는 자기소개서 작성 체계
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 pt-2 border-t border-zinc-200/60 block">기업별 지원동기 완성 공식</span>
            </div>

            {/* 4 */}
            <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex flex-col justify-between space-y-3 shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-900 rounded">PRO INTERVIEW</span>
                <div className="flex items-center gap-1.5 font-black text-zinc-950 text-sm">
                  <MessageSquareQuote className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>프로의 답변</span>
                </div>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  질문에 끌려가지 않고 내가 전달할 가치를 중심으로 면접의 주도권을 잡는 답변 프레임
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 pt-2 border-t border-zinc-200/60 block">꼬리질문 대비 및 질문 대응 가이드</span>
            </div>
          </div>
        </div>

        {/* 6. Brand Declaration Section */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <p className="text-base sm:text-lg font-black text-white">
            저를 만난 순간, 당신은 자신의 커리어를 설계하는 기획자가 됩니다.
          </p>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
            기업이 나를 어떻게 볼지 기다리지 않습니다.<br />
            어떤 사람으로 기억될지 직접 설계합니다.
          </p>
          <div className="pt-2">
            <span className="text-xs font-black text-[#FFD600] tracking-wider uppercase">
              그것이 REPOSITION이 말하는 PRO입니다.
            </span>
          </div>
        </div>

        {/* 7. Bootcamp Notice */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 text-center space-y-2">
          <h3 className="text-sm font-black text-indigo-200">
            BOOTCAMP 수강생은 이미 REPOSITION PRO입니다.
          </h3>
          <p className="text-xs text-indigo-300/80 max-w-xl mx-auto leading-relaxed">
            BOOTCAMP 수강생은 별도 결제 없이 PRO의 모든 강의, 실전 템플릿과 워크북을 제한 없이 이용할 수 있습니다.
          </p>
        </div>

        {/* 8. Payment Inquiry Area */}
        <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>선택한 플랜: {selectedPlan.name} · ₩ {selectedPlan.price.toLocaleString()}원 ({selectedPlan.durationMonths}개월)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-zinc-950">
              당신의 이름 뒤에 PRO를 붙일 시간입니다.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xl">
              선택한 기간을 확인한 후 카카오톡으로 결제를 문의해 주세요. 입금 확인 후 PRO 권한이 활성화됩니다.
            </p>
          </div>

          <a
            href={KAKAO_OPENCHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-[#FEE500] hover:bg-[#ffe033] active:scale-95 text-zinc-950 font-black text-sm sm:text-base rounded-2xl transition shadow-lg flex items-center justify-center gap-2.5 shrink-0 whitespace-nowrap cursor-pointer border border-amber-300"
          >
            <MessageCircle className="w-5 h-5 fill-zinc-950" />
            <span>REPOSITION PRO 시작하기</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
};
