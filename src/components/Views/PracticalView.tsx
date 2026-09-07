import React, { useState } from 'react';
import { Lock, FileText, Compass, MessageSquare, CheckCircle, Sparkles, ShieldCheck, Pen } from 'lucide-react';
import { MemberTier } from '../../types';
import { SelfPersuasionBook } from '../SelfPersuasionBook';

interface PracticalViewProps {
  currentTier: MemberTier;
  activeSubTab?: 'realneeds' | 'persuasion' | 'interview';
  onSubTabChange?: (subTab: 'realneeds' | 'persuasion' | 'interview') => void;
  onTabChange: (tab: string) => void;
  onChangeTier?: (tier: MemberTier) => void;
}

export const PracticalView: React.FC<PracticalViewProps> = ({
  currentTier,
  activeSubTab = 'persuasion',
  onSubTabChange,
  onTabChange,
  onChangeTier
}) => {
  const [localSubTab, setLocalSubTab] = useState<'realneeds' | 'persuasion' | 'interview'>(activeSubTab);

  const currentSub = onSubTabChange ? activeSubTab : localSubTab;
  const setSub = (tab: 'realneeds' | 'persuasion' | 'interview') => {
    if (onSubTabChange) onSubTabChange(tab);
    setLocalSubTab(tab);
  };

  const isPaidMember = currentTier === 'PRO' || currentTier === 'BOOTCAMP';

  return (
    <div className="bg-[#09090B] text-white min-h-screen pb-20 animate-fade-in">
      
      {/* Sub-Header Banner */}
      <div className="bg-[#121216] border-b border-[#27272A] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-black rounded uppercase">
              PRO 전용
            </span>
            <span className="text-xs text-zinc-400 font-bold">
              PRO 회원 전용 실전 워크북
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            리포지셔닝 실전활용
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            인사담당자의 인식을 완벽히 제어하고 나의 가치를 앵커링(Anchoring)하는 실전 이력서, 자기설득서, 면접 통제 프레임워크입니다.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              onClick={() => setSub('realneeds')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                currentSub === 'realneeds'
                  ? 'bg-[#FFD600] text-[#09090B] shadow-lg'
                  : 'bg-[#18181C] text-zinc-300 border border-[#27272A] hover:border-zinc-500'
              }`}
            >
              <FileText className="w-4 h-4" />
              REALNEEDS 이력서
            </button>

            <button
              onClick={() => setSub('persuasion')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                currentSub === 'persuasion'
                  ? 'bg-[#FFD600] text-[#09090B] shadow-lg'
                  : 'bg-[#18181C] text-zinc-300 border border-[#27272A] hover:border-zinc-500'
              }`}
            >
              <Compass className="w-4 h-4" />
              자기설득서 빌딩업
            </button>

            <button
              onClick={() => setSub('interview')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                currentSub === 'interview'
                  ? 'bg-[#FFD600] text-[#09090B] shadow-lg'
                  : 'bg-[#18181C] text-zinc-300 border border-[#27272A] hover:border-zinc-500'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              완벽통제면접 빌딩업
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {!isPaidMember ? (
          /* PAID LOCKED SCREEN FOR NON-PRO/FREE USERS */
          <div className="p-8 sm:p-12 bg-[#121216] border border-[#27272A] rounded-3xl space-y-8 text-center max-w-3xl mx-auto shadow-2xl">
            <div className="w-16 h-16 bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-black text-[#FFD600] uppercase tracking-widest block">
                MEMBERSHIP LOCKED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                리포지셔닝 실전활용은 PRO 회원 전용 페이지입니다
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                클래스(PRO) 또는 부트캠프 회원에게만 제공되는 실전 프레임워크입니다. 단순 이론을 넘어 인사담당자의 의도를 사전 통제하는 실무 워크북을 경험해보세요.
              </p>
            </div>

            {/* Preview Card List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
              <div className="p-4 bg-[#18181C] border border-[#27272A] rounded-2xl space-y-2 opacity-80">
                <span className="text-[11px] font-bold text-[#FFD600]">01. REALNEEDS 이력서</span>
                <p className="text-xs text-zinc-300 font-semibold">기업의 시각에서 나의 경험을 앵커링하는 3단계 이력서 구조</p>
              </div>

              <div className="p-4 bg-[#18181C] border border-[#27272A] rounded-2xl space-y-2 opacity-80">
                <span className="text-[11px] font-bold text-[#FFD600]">02. 자기설득서 빌딩업</span>
                <p className="text-xs text-zinc-300 font-semibold">내 스펙의 맥락을 인사담당자 니즈에 부합시키는 재설득 가이드</p>
              </div>

              <div className="p-4 bg-[#18181C] border border-[#27272A] rounded-2xl space-y-2 opacity-80">
                <span className="text-[11px] font-bold text-[#FFD600]">03. 완벽통제면접 빌딩업</span>
                <p className="text-xs text-zinc-300 font-semibold">면접관의 질의 주도권을 내 앵커링 기준으로 끌어오는 통제 기술</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onTabChange('pro-payment')}
                className="w-full sm:w-auto px-8 py-4 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Pen className="w-4 h-4" />
                PRO로 시작하기 (1/3/6개월)
              </button>
              
              <button
                onClick={() => onTabChange('classes')}
                className="w-full sm:w-auto px-6 py-4 bg-[#18181C] hover:bg-[#222228] text-zinc-200 border border-[#27272A] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#FFD600]" />
                리포지셔닝 클래스 둘러보기
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED PAID CONTENT FOR PRO / BOOTCAMP MEMBERS */
          <div className="space-y-10">
            
            {/* SUB-TAB 1: REALNEEDS 이력서 */}
            {currentSub === 'realneeds' && (
              <div className="space-y-8 animate-fade-in">
                <div className="p-6 sm:p-8 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#FFD600] uppercase">FRAMEWORK 01</span>
                    <span className="text-xs text-emerald-400 font-bold">UNLOCKED</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-white">
                    REALNEEDS 이력서 작성 프레임워크
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    기업의 채용 공고(JD) 뒤에 숨겨진 '인사담당자의 진짜 결핍(Real Needs)'을 타격하여, 내 정량적 경험을 기업에 가장 필연적인 역량으로 변환하는 리포지셔닝 이력서 양식입니다.
                  </p>
                </div>

                {/* Core Contrast Table */}
                <div className="p-6 sm:p-8 bg-[#121216] border border-[#27272A] rounded-2xl space-y-6">
                  <h3 className="text-lg font-bold text-white">
                    일반 이력서 vs REPOSITION REALNEEDS 이력서
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                    <div className="p-5 bg-[#18181C] border border-red-500/30 rounded-xl space-y-3">
                      <span className="text-red-400 font-extrabold block">❌ 기존 나열식 이력서 (탈락 위험)</span>
                      <p className="text-zinc-300">
                        "OO 프로젝트 참여, 서포터즈 활동 3개월, 마케팅 카드뉴스 10건 제작"
                      </p>
                      <p className="text-zinc-500 text-xs">
                        → 단점: 단순히 무엇을 했는지 결과물 수치만 언급하여 인사담당자에게 어떤 가치를 줄지 모호함.
                      </p>
                    </div>

                    <div className="p-5 bg-[#18181C] border border-[#FFD600]/40 rounded-xl space-y-3">
                      <span className="text-[#FFD600] font-extrabold block">✓ REALNEEDS 리포지셔닝 이력서</span>
                      <p className="text-zinc-100 font-medium">
                        "[신규 고객 이탈 방지] 타겟 페르소나 재정의를 통한 유기적 유입률 +34% 전환 설계"
                      </p>
                      <p className="text-zinc-400 text-xs">
                        → 장점: 인사담당자의 결핍(고객 이탈/유입)에 정확히 앵커링하여 내 행동의 기획 가치를 증명.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Practical Checklist */}
                <div className="p-6 sm:p-8 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
                  <h3 className="text-base font-bold text-white">REALNEEDS 이력서 3대 수칙</h3>
                  <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#FFD600] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">1. 서두 포지셔닝 한 문장 앵커링</strong>
                        이력서 맨 상단에 "어떤 문제를 해결해주는 인재인가"를 정의하는 한 문장 서두를 반드시 배치합니다.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#FFD600] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">2. 경험 나열이 아닌 해결 가치 명시</strong>
                        단순 업무 목록이 아닌, 어떤 결핍과 문제를 해결했는지 성과 지표와 함께 구조화합니다.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#FFD600] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block">3. 기업 JD 니즈 키워드 직격 매칭</strong>
                        채용 공고 우대사항의 숨은 의도를 파악해 내 경험의 수식어로 치환합니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 2: 자기설득서 빌딩업 */}
            {currentSub === 'persuasion' && (
              <div className="animate-fade-in">
                <SelfPersuasionBook />
              </div>
            )}

            {/* SUB-TAB 3: 완벽통제면접 빌딩업 */}
            {currentSub === 'interview' && (
              <div className="space-y-8 animate-fade-in">
                <div className="p-6 sm:p-8 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#FFD600] uppercase">FRAMEWORK 03</span>
                    <span className="text-xs text-emerald-400 font-bold">UNLOCKED</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-white">
                    완벽통제면접 빌딩업 (Interview Control Framework)
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    면접관의 질의를 일방적으로 당하는 수동적 입장에서 벗어나, 내가 정한 앵커링 기준 안에서 면접 질문이 흘러나오도록 주도권을 통제하는 면접 답변 기술입니다.
                  </p>
                </div>

                {/* 3 Rules of Interview Control */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
                  <div className="p-5 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
                    <span className="text-base font-black text-[#FFD600]">01. 1분 자기소개 앵커링</span>
                    <p className="text-zinc-300 leading-relaxed">
                      "저는 ~를 해본 경험이 있습니다"가 아닌, "기업이 고민하는 ~문제를 해결해온 기획자입니다"로 선제적 기준 제시.
                    </p>
                  </div>

                  <div className="p-5 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
                    <span className="text-base font-black text-[#FFD600]">02. 약점 질문 리포지셔닝</span>
                    <p className="text-zinc-300 leading-relaxed">
                      "경험이 일관되지 않네요"라는 약점 공격 시, 변명하지 않고 "다양한 도메인에서 문제의 본질을 파악한 강점"으로 프레임 전환.
                    </p>
                  </div>

                  <div className="p-5 bg-[#121216] border border-[#27272A] rounded-2xl space-y-3">
                    <span className="text-base font-black text-[#FFD600]">03. 역질문 주도권 굳히기</span>
                    <p className="text-zinc-300 leading-relaxed">
                      마지막 질문 시 인사담당자가 현재 고민하는 핵심 직무 과제를 재확인하며 나의 전문성에 대한 닻을 확고히 내림.
                    </p>
                  </div>
                </div>

                {/* Script Template */}
                <div className="p-6 sm:p-8 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
                  <h3 className="text-base font-bold text-white">완벽통제 면접 1분 자기소개 스크립트 빌더</h3>
                  <div className="p-5 bg-[#18181C] border border-[#27272A] rounded-xl text-xs sm:text-sm space-y-3 leading-relaxed text-zinc-200">
                    <p>
                      "안녕하십니까, [지원 직무] 지원자 [이름]입니다. <br />
                      저는 기존의 [일반적인 방식]에 머무르지 않고, <strong className="text-[#FFD600]">[나만의 리포지셔닝 포지션]</strong>으로 문제를 정의하고 성과를 도출해왔습니다."
                    </p>
                    <p className="text-zinc-400">
                      "특히 [대표 경험] 당시, [조직의 문제점]을 발굴하여 [개입한 가치]로 전환시켰으며, 이를 통해 [정량적/정성적 성과]를 얻었습니다. 귀사에서도 인사담당자님께서 가장 필요로 하시는 [직무 핵심 니즈]를 해결해 내겠습니다."
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
