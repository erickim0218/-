import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface TermsViewProps {
  onTabChange: (tab: string) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onTabChange }) => {
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
            <Shield className="w-3.5 h-3.5" /> REPOSITION 이용약관
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">이용약관</h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            REPOSITION 서비스 이용에 필요한 기본적인 사항을 안내합니다.
          </p>
          <p className="text-xs text-zinc-500 font-mono">시행일: 2026년 9월 13일</p>
        </div>

        <div className="space-y-8 text-sm text-zinc-300 leading-relaxed font-normal">
          <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-xs text-zinc-400 space-y-1">
            <p>본 이용약관은 REPOSITION(이하 “운영자”)이 re-position.co.kr을 통해 제공하는 리포지셔닝 부트캠프, 온라인 교육 콘텐츠, 멤버십, 취업·이직 관련 교육 및 기타 관련 서비스의 이용조건과 절차, 운영자와 이용자의 권리·의무 및 책임사항을 규정합니다.</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제1조 목적</h2>
            <p>본 약관은 운영자가 제공하는 REPOSITION 서비스 이용과 관련하여 운영자와 회원 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제2조 정의</h2>
            <p>“서비스”란 운영자가 REPOSITION 웹사이트를 통해 제공하는 다음 서비스를 의미합니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>리포지셔닝 부트캠프</li>
              <li>온라인 강의 및 교육 콘텐츠</li>
              <li>이력서, 자기소개서, 자기설득서, 면접 관련 템플릿 및 자료</li>
              <li>PRO 또는 이에 준하는 유료 멤버십</li>
              <li>취업·이직 관련 교육, 컨설팅 및 피드백</li>
              <li>후기 작성 및 관련 기능</li>
              <li>기타 운영자가 제공하는 관련 서비스</li>
            </ul>
            <p className="pt-2">“회원”이란 본 약관 및 개인정보처리방침에 동의하고 회원가입을 완료한 이용자를 의미합니다.</p>
            <p>“유료회원”이란 운영자가 정한 요금을 결제하고 유료 콘텐츠 또는 기능에 대한 이용권한을 부여받은 회원을 의미합니다.</p>
            <p>“부트캠프 회원”이란 리포지셔닝 부트캠프에 신청 및 등록하여 해당 프로그램을 제공받는 회원을 의미합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제3조 약관의 효력 및 변경</h2>
            <p>본 약관은 사이트에 게시하는 시점부터 효력이 발생합니다.</p>
            <p>운영자는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.</p>
            <p>회원에게 불리하거나 중요한 내용이 변경되는 경우 적용일 및 변경사유를 합리적인 기간 전에 사이트 등을 통해 안내합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제4조 회원가입 및 계정관리</h2>
            <p>회원은 본인의 정확한 정보를 이용하여 회원가입하여야 합니다.</p>
            <p>회원은 본인의 계정 및 비밀번호를 안전하게 관리할 책임이 있습니다.</p>
            <p>회원은 본인의 계정을 제3자에게 양도, 판매, 대여 또는 공유할 수 없습니다.</p>
            <p>계정 도용, 비정상적인 이용 또는 서비스 운영을 방해하는 행위가 확인될 경우 운영자는 서비스 이용을 제한할 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제5조 서비스 제공</h2>
            <p>운영자는 회원의 이용등급 또는 구매상품에 따라 이용 가능한 서비스 범위를 달리할 수 있습니다.</p>
            <p>FREE, PRO, BOOTCAMP 등 회원등급에 따라 제공되는 콘텐츠와 기능이 달라질 수 있습니다.</p>
            <p>운영자는 서비스 품질 개선, 콘텐츠 업데이트 또는 운영상 필요에 따라 서비스의 세부 구성이나 제공방식을 변경할 수 있습니다.</p>
            <p>이미 구매한 유료서비스의 핵심 이용조건에 중대한 변경이 발생하는 경우에는 필요한 내용을 사전에 안내합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제6조 리포지셔닝 부트캠프</h2>
            <p>리포지셔닝 부트캠프는 지원자가 이미 보유한 경험과 역량을 기업 및 직무의 채용 니즈 관점에서 재해석하고 이를 이력서, 자기소개서, 면접 등 채용 과정에서 효과적으로 전달할 수 있도록 돕는 교육 및 컨설팅 프로그램입니다.</p>
            <p>프로그램에는 기수별 안내에 따라 다음 내용이 포함될 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>기업 및 직무 니즈 분석</li>
              <li>경험 및 경력 리포지셔닝</li>
              <li>이력서 작성 및 구조화</li>
              <li>자기소개서 또는 자기설득서 작성전략</li>
              <li>면접 전략 및 답변 구조화</li>
              <li>과제 및 피드백</li>
              <li>1:1 컨설팅 및 온라인 강의</li>
              <li>템플릿 및 관련 자료</li>
            </ul>
            <p className="pt-2">구체적인 일정과 제공범위는 각 기수 모집페이지 또는 별도 안내를 기준으로 합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제7조 결제</h2>
            <p>유료서비스의 가격, 이용기간 및 제공범위는 결제 또는 신청 전에 안내합니다.</p>
            <p>정상적으로 결제가 완료된 경우 해당 상품의 이용권한이 부여됩니다.</p>
            <p>결제가 정상적으로 처리되지 않은 경우 유료서비스 이용이 제한될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제8조 청약철회 및 환불</h2>
            <p>리포지셔닝 부트캠프의 자체 환불 운영기준은 다음과 같습니다.</p>
            <p>리포지셔닝 부트캠프는 1:1 컨설팅 종료 시점으로부터 24시간 이내 환불 요청이 가능합니다.</p>
            <p>환불 요청은 아래 이메일 또는 사이트에서 안내하는 공식 문의채널을 통해 접수할 수 있습니다.</p>
            <p className="text-[#FFD600] font-mono">이메일: kjyoon0218@naver.com</p>
            <p>결제수단 및 결제사업자의 처리절차에 따라 실제 환불 완료까지 일정 기간이 소요될 수 있습니다.</p>
            <p>디지털 콘텐츠 또는 교육서비스의 제공이 이미 개시된 경우 관련 법령에 따라 청약철회가 제한될 수 있습니다. 다만 운영자의 자체 환불기준보다 관련 법령상 이용자에게 더 유리한 청약철회 또는 환불권이 인정되는 경우에는 해당 법령을 우선 적용합니다.</p>
            <p>운영자의 귀책사유로 서비스를 정상적으로 제공할 수 없는 경우 관련 법령 및 결제수단의 정책에 따라 필요한 환불조치를 진행합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제9조 콘텐츠 및 지식재산권</h2>
            <p>REPOSITION에서 제공되는 강의영상, 문서, 템플릿, 이력서 양식, 자기설득서, 면접자료, 이미지, 디자인, 문구 및 기타 교육 콘텐츠의 저작권과 지식재산권은 운영자 또는 정당한 권리자에게 귀속됩니다.</p>
            <p>회원은 본인의 취업·이직 준비 및 학습 목적의 범위에서만 콘텐츠를 이용할 수 있습니다.</p>
            <p>운영자의 사전 동의 없이 다음 행위를 할 수 없습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>콘텐츠 복제 또는 배포</li>
              <li>제3자에게 파일 또는 계정 제공</li>
              <li>온라인 공개 게시</li>
              <li>판매 또는 재판매</li>
              <li>강의영상 녹화 및 공유</li>
              <li>템플릿을 이용한 유사 상품 제작 및 판매</li>
              <li>계정 공유를 통한 유료 콘텐츠 공동 이용</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제10조 회원의 의무</h2>
            <p>회원은 다음 행위를 해서는 안 됩니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>다른 사람의 개인정보 또는 계정 도용</li>
              <li>허위 경력 또는 경험 작성</li>
              <li>타인의 경험을 본인의 경험으로 사용하는 행위</li>
              <li>서비스 정상 운영을 방해하는 행위</li>
              <li>유료 콘텐츠를 무단 복제·배포하는 행위</li>
              <li>서비스 또는 시스템에 비정상적으로 접근하는 행위</li>
              <li>다른 회원 또는 제3자의 권리를 침해하는 행위</li>
              <li>기타 관련 법령을 위반하는 행위</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제11조 후기</h2>
            <p>회원은 본인의 실제 서비스 이용 경험을 바탕으로 후기를 작성할 수 있습니다.</p>
            <p>후기의 저작권은 원칙적으로 작성자에게 귀속됩니다.</p>
            <p>다음 내용이 포함된 후기는 운영방침에 따라 숨김 또는 삭제될 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>허위 사실</li>
              <li>욕설 또는 비방</li>
              <li>개인정보</li>
              <li>광고 또는 스팸</li>
              <li>불법적인 내용</li>
              <li>타인의 권리를 침해하는 내용</li>
              <li>서비스 이용과 직접적인 관련이 없는 반복 게시물</li>
            </ul>
            <p className="pt-2">회원이 사이트에 후기를 게시한 경우 운영자는 서비스 내 후기 소개 및 서비스 운영 목적으로 해당 후기를 노출할 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제12조 서비스 이용 제한</h2>
            <p>회원이 본 약관을 위반하거나 서비스 정상 운영을 방해하는 경우 운영자는 다음 조치를 취할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>콘텐츠 이용 제한</li>
              <li>게시물 숨김 또는 삭제</li>
              <li>계정 이용 제한</li>
              <li>회원자격 제한</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제13조 서비스 중단</h2>
            <p>서버 점검, 통신장애, 외부 플랫폼 장애, 보안사고, 천재지변 등 운영자가 합리적으로 통제하기 어려운 사유가 발생한 경우 서비스가 일시적으로 중단될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제14조 합격 및 성과에 관한 안내</h2>
            <p>REPOSITION은 취업 및 이직을 지원하기 위한 교육·컨설팅 서비스입니다. 다음 결과를 보장하지 않습니다.</p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>특정 기업 서류합격 또는 면접합격</li>
              <li>최종합격 및 특정 수준의 연봉</li>
              <li>이직 성공 및 채용 가능성</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제15조 책임의 제한</h2>
            <p>운영자는 고의 또는 중대한 과실이 없는 한 천재지변, 통신장애, 외부 플랫폼 장애 등 통제하기 어려운 사유로 발생한 손해에 대해 책임이 제한될 수 있습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white border-l-2 border-[#FFD600] pl-3">제16조 준거법 및 분쟁해결</h2>
            <p>본 약관은 대한민국 법령을 기준으로 해석하며, 서비스와 관련하여 분쟁이 발생하는 경우 운영자와 이용자는 원만한 해결을 위해 상호 협의합니다.</p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
            <p>운영자: 김지윤</p>
            <p>문의: kjyoon0218@naver.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};
