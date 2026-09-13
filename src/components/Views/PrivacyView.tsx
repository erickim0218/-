import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyViewProps {
  onTabChange: (tab: string) => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onTabChange }) => {
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
            <Shield className="w-3.5 h-3.5" /> REPOSITION 개인정보처리방침
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">개인정보처리방침</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            REPOSITION은 이용자의 개인정보를 중요하게 생각하며 개인정보 보호법 등 관련 법령을 준수합니다.
          </p>
          <p className="text-xs text-zinc-500 font-mono">시행일: 2026년 9월 13일</p>
        </div>

        <div className="space-y-8 text-sm text-zinc-300 leading-relaxed font-normal">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">1. 개인정보 처리 목적</h2>
            <p>REPOSITION은 다음 목적을 위해 개인정보를 처리합니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>회원가입 및 본인 식별, 로그인 및 계정관리</li>
              <li>회원등급 및 멤버십 권한 관리 (PRO 및 BOOTCAMP 이용권한)</li>
              <li>부트캠프 신청 및 운영, 교육 콘텐츠 제공</li>
              <li>후기 작성 및 관리, 이용자 문의 대응</li>
              <li>결제 및 환불, 서비스 부정 이용 방지</li>
              <li>서비스 안정성 확보 및 이용통계 분석·개선</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">2. 처리하는 개인정보 항목</h2>
            <p>회원가입 및 로그인 과정에서 다음 정보가 처리될 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>이메일 주소, 사용자 표시명 또는 닉네임, 회원 식별값, 인증에 필요한 정보</li>
            </ul>
            <p className="pt-2">서비스 이용 과정에서는 다음 정보가 처리될 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>회원등급(membership_tier), 부트캠프 기수, 콘텐츠 이용정보</li>
              <li>작성한 후기 및 별점, 문의내용, 서비스 이용기록</li>
            </ul>
            <p className="pt-2">결제 및 자동으로 생성되는 정보:</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>결제금액, 결제일시, 결제상태, 주문 및 결제 식별정보</li>
              <li>IP 주소, 접속일시, 브라우저 및 기기정보, 쿠키 및 접속기록</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">3. 개인정보 보유 및 이용기간</h2>
            <p>개인정보는 원칙적으로 수집 및 이용목적이 달성될 때까지 보유합니다. 회원이 탈퇴하거나 목적이 달성된 경우 지체 없이 파기하며, 관계 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 별도 보관합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">4. 개인정보 제3자 제공</h2>
            <p>REPOSITION은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 사전 동의를 받았거나 법령에 근거가 있는 경우는 예외로 합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">5. 개인정보 처리업무의 위탁 및 외부 서비스</h2>
            <p>서비스 운영을 위해 다음과 같은 외부 서비스를 이용합니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li><strong>Supabase</strong>: 회원 인증, 회원정보 관리, 데이터베이스, 멤버십, 후기, 데이터 저장 및 처리</li>
              <li><strong>Cloudflare</strong>: 도메인, 웹서비스 제공, 콘텐츠 전송, 네트워크 및 보안</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">6. 개인정보의 국외 처리</h2>
            <p>Supabase, Cloudflare 등 해외 사업자가 제공하는 서비스를 이용하는 과정에서 일부 정보가 해외에 위치한 시스템에서 처리될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">7. 개인정보 파기</h2>
            <p>개인정보 보유기간이 경과하거나 처리목적이 달성된 경우 복구 또는 재생하기 어려운 방법으로 지체 없이 파기합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">8. 이용자의 권리</h2>
            <p>이용자는 개인정보 열람, 정정, 삭제, 처리정지 요청 및 회원탈퇴를 행사할 수 있습니다.</p>
            <p className="text-[#FFD600] font-mono">문의 이메일: kjyoon0218@naver.com</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">9. 쿠키 및 유사 기술</h2>
            <p>로그인 유지, 이용환경 제공 및 서비스 개선을 위해 쿠키를 사용할 수 있으며, 브라우저 설정을 통해 거부할 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">10. 개인정보 안전성 확보조치</h2>
            <p>인증을 통한 접근통제, Supabase RLS 등 데이터 접근 제한, HTTPS 통신, 최소권한 원칙 등을 적용하고 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">11. 후기 작성 시 개인정보 보호</h2>
            <p>회원은 후기 작성 시 전화번호, 주소 등 불필요한 개인정보를 게시하지 않아야 합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">12. 개인정보 보호책임자</h2>
            <p>개인정보 보호책임자: 김지윤</p>
            <p className="text-[#FFD600] font-mono">이메일: kjyoon0218@naver.com</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">13. 개인정보처리방침 변경</h2>
            <p>본 개인정보처리방침이 변경되는 경우 변경사항과 적용일을 사이트 등을 통해 안내합니다.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
