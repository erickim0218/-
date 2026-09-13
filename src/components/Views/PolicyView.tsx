import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PolicyViewProps {
  onTabChange: (tab: string) => void;
}

export const PolicyView: React.FC<PolicyViewProps> = ({ onTabChange }) => {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => onTabChange('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#FFD600] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> 홈으로 돌아가기
        </button>

        <div className="space-y-3 border-b border-zinc-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full">
            <Shield className="w-3.5 h-3.5" /> REPOSITION 서비스 운영방침
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">서비스 운영방침</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            본 운영방침은 REPOSITION이 제공하는 부트캠프, 교육, 콘텐츠, 멤버십 및 후기 서비스의 구체적인 운영기준을 안내합니다.
          </p>
          <p className="text-xs text-zinc-500 font-mono">시행일: 2026년 9월 13일</p>
        </div>

        <div className="space-y-8 text-sm text-zinc-300 leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">1. REPOSITION의 운영철학</h2>
            <p>REPOSITION은 사용자의 스펙이나 경험 자체를 인위적으로 바꾸는 서비스가 아닙니다. 이미 보유하고 있는 경험과 역량을 기업과 직무가 원하는 관점에서 다시 해석하고 효과적으로 전달할 수 있도록 돕습니다.</p>
            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-[#FFD600] font-bold text-center">
              “스펙은 바꾸지 않습니다. 읽히는 방식을 바꿉니다.”
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">2. 리포지셔닝 부트캠프</h2>
            <p>지원자의 경험과 경력을 기업의 채용 니즈 관점에서 재구성하고 실제 취업·이직 과정에 적용할 수 있도록 돕는 교육 및 컨설팅 프로그램입니다. (REAL NEEDS 분석, 이력서/자소서 전략, 면접 전략, 1:1 컨설팅 등 포함)</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">3. 제공하지 않는 서비스</h2>
            <p>REPOSITION은 다음 서비스를 제공하지 않습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>특정 기업 서류·면접·최종 합격 보장 및 연봉 보장</li>
              <li>허위 경력 또는 허위 성과 생성</li>
              <li>존재하지 않는 프로젝트 생성 및 타인 경험 도용 지원</li>
              <li>기업의 비공개 채용정보 제공</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">4. 회원등급</h2>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li><strong>FREE</strong>: 무료회원 콘텐츠 및 기능</li>
              <li><strong>PRO</strong>: PRO 유료 콘텐츠, 강의, 자료 및 템플릿</li>
              <li><strong>BOOTCAMP</strong>: 리포지셔닝 부트캠프 등록자 전용 콘텐츠 및 기능</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">5. 콘텐츠 이용원칙</h2>
            <p>제공되는 모든 교육자료는 회원 본인의 취업·이직 준비 목적으로만 이용할 수 있으며, 파일 전달, 녹화 공유, 재판매, 계정 공유 등을 엄격히 금지합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">6. 과제 및 피드백</h2>
            <p>부트캠프 과제와 피드백은 기수별 일정에 따라 제공되며, 기한 내 미제출 시 피드백 제공이 제한될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">7. 부트캠프 환불 운영기준</h2>
            <p>1:1 컨설팅 종료 시점으로부터 24시간 이내 환불 요청이 가능합니다.</p>
            <p className="text-[#FFD600] font-mono">환불 문의: kjyoon0218@naver.com</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">8. 후기 작성 및 운영관리</h2>
            <p>실제 경험을 바탕으로 작성할 수 있으며, 허위 후기, 욕설, 개인정보, 광고 등은 숨김 또는 삭제될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">9. 추천 후기 및 후기 신고</h2>
            <p>운영자는 서비스 이해를 돕는 후기를 추천/상단 고정할 수 있으며, 회원은 스팸, 욕설, 개인정보 노출 등의 사유로 후기를 신고할 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">10. 프로그램 일정 및 서비스 변경</h2>
            <p>일정 변경 시 참여자에게 안내하며, 서비스 개선을 위해 콘텐츠와 기능을 변경할 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">11. 서비스 이용 제한</h2>
            <p>유료 콘텐츠 불법 공유, 계정 공유, 스팸 등 중대한 위반 시 서비스 이용이 제한될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">12. 문의</h2>
            <p>대표자: 김지윤</p>
            <p className="text-[#FFD600] font-mono">이메일: kjyoon0218@naver.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};
