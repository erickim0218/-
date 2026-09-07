import {
  CaseStudy,
  PositioningNote,
  Course,
  ReviewItem,
  BootcampCohort,
  DiagnosisResult,
  UserProfile
} from '../types';

export const BRAND_INFO = {
  name: 'REPOSITION',
  tagline: '스펙은 바꾸지 않습니다. 스펙이 읽히는 방식을 바꿉니다.',
  subTagline: '유수의 대기업 광고대행사 및 인하우스 브랜딩 경험으로, 기업이 당신을 선택할 이유를 만듭니다.',
  heroQuote: '사람들이 기억하는 건 스펙 나열이 아닙니다. 전략입니다.',
  plannerJ: {
    name: '브랜딩 취업 컨설턴트 J',
    role: '브랜딩 취업 컨설턴트',
    title: '브랜딩의 원리로 지원자가 선택받는 이유를 만드는 컨설턴트',
    oneLiner: '자소서 문장을 고치는 사람이 아니라, 기업이 당신을 선택할 이유를 만드는 브랜딩 취업 컨설턴트입니다.',
    experienceLogos: [
      { name: '제일기획', desc: '대기업 광고대행사 전략기획' },
      { name: 'TBWA KOREA', desc: '브랜드 캠페인 & 크리에이티브' },
      { name: '에코마케팅', desc: '퍼포먼스 마케팅 & D2C' },
      { name: '현대자동차', desc: '인하우스 브랜드 기획' },
    ],
    summaryStats: [
      { label: '누적 수강생', value: '2,400+' },
      { label: '합격률 전환', value: '3.8배' },
      { label: '부트캠프 만족도', value: '98.6%' },
    ],
  },
};

export const REPOSITIONING_EXAMPLES = [
  {
    id: '1',
    beforeLabel: '기존 경험 표현',
    beforeText: '대학 축제 및 브랜드 팝업스토어 현장 행사 운영 요원으로 참여하여 인원 안내 및 물품 관리를 담당했습니다.',
    afterLabel: '리포지셔닝된 가치',
    afterText: '고객 체류 시간을 40% 증대시키기 위해 현장 이동 동선을 재설계하고, 병목 현상을 해결한 현장 고객 경험 기획자',
    category: '행사 운영 → 동선 기획'
  },
  {
    id: '2',
    beforeLabel: '기존 경험 표현',
    beforeText: '카페에서 1년간 아르바이트를 하며 음료 제조, POS 결제, 매장 청소 및 수량 점검 업무를 지속했습니다.',
    afterLabel: '리포지셔닝된 가치',
    afterText: '피크타임 대기시간 단축을 위해 주문 접수-제조-지급 동선의 반복 병목을 발견하고 프로세스를 표준화한 매장 운영 개선자',
    category: '아르바이트 → 프로세스 개선'
  },
  {
    id: '3',
    beforeLabel: '기존 경험 표현',
    beforeText: '건축사사무소에서 2년간 캐드 도면 작성 및 구조설계 보조 업무를 수행했습니다.',
    afterLabel: '리포지셔닝된 가치',
    afterText: '도면상의 설계 의도가 공사 현장 오차 없이 100% 시공으로 구현되도록 현장 도면 간섭을 미리 검증한 현장 실행형 설계자',
    category: '구조설계 → 현장 구현 경쟁력'
  },
  {
    id: '4',
    beforeLabel: '기존 경험 표현',
    beforeText: '인사팀 인턴으로 근무하며 연차 관리, 교육 보조, 서류 정리 등 일상적인 행정 업무를 지원했습니다.',
    afterLabel: '리포지셔닝된 가치',
    afterText: '임직원 문의의 60%를 차지하던 반복 질문을 데이터화하여 자주 묻는 질문(FAQ) 자동 안내 체계로 개선한 조직 비효율 단축자',
    category: '인사지원 → 비효율 개선'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    title: '‘직무 경험이 없다는 신입 지원자’에서 ‘고객 행동을 개선한 운영형 인재’로',
    category: '신입/무경험',
    applicantBg: '인문계열 학과 졸업 예정 / 인턴 경험 없음 / 동아리 및 봉사활동 위주',
    oldPosition: '“열정과 끈기로 어떤 직무든 빠르게 배울 준비가 된 지원자입니다.”',
    diagnosis: '직무 연관 경험이 없다고 스스로 판단하여 "기본 태도"와 "열정"만 강조함. 기업 입장에서 직무 수행 위험부담이 커서 계속 서류 탈락.',
    newPosition: '“동아리 회원 유지율을 35% 상승시킨 데이터 기반 고객 행동 개선형 운영자”',
    keyShift: '봉사 및 동아리 활동을 단순 "열정적 이행"이 아니라, "참여자의 이탈 원인을 정의하고 수정한 커뮤니티 운영 프로젝트"로 재해석',
    result: '주요 IT 스타트업 및 중견기업 서비스 운영직무 1차 서류 합격 4곳',
    beforeSentence: '봉사동아리 부회장으로서 회원들의 참여를 유도하기 위해 다방면으로 고군분투했습니다.',
    afterSentence: '신규 동아리원 이탈률이 높은 이유가 "초기 적응 가이드 부재"임을 데이터로 확인하고, 3단계 온보딩 루틴을 기획하여 이탈률을 35% 감소시켰습니다.'
  },
  {
    id: 'cs-2',
    title: '‘평범한 대행사AE’에서 ‘광고주 비즈니스 지표를 성장시키는 스케일업 전략가’로',
    category: '마케팅/기획',
    applicantBg: '중소 대행사 AE 1.5년 차 / 이직 서류 탈락 연속 12회',
    oldPosition: '“다양한 업종의 광고주를 핸들링하며 신속한 피드백을 제공해 온 마케팅 AE”',
    diagnosis: '광고주 수발주 및 단순 수량 채우기식 집행 업무로 보여 본인의 주도적 전략 기획 역량이 드러나지 않음.',
    newPosition: '“광고비 지출을 줄이면서도 구매 전환율을 2.1배 높인 효율 중심의 세일즈 구조 설계자”',
    keyShift: '’소재 제작 및 집행 관리’라는 실행 업무를 ’광고주 매출 구조 한계를 포착하고 랜딩페이지 스크립트를 재정비한 전략적 개입’으로 전환',
    result: '대기업 계열사 퍼포먼스 마케터 및 인하우스 기획직 최종 합격',
    beforeSentence: '월 5,000만원 예산의 퍼포먼스 광고 소재 20여 개를 매달 제작하여 일정을 준수했습니다.',
    afterSentence: '광고비 증액 없이 구매 전환율을 올리기 위해, 기존 광고 타겟의 이탈 지점을 분석하고 세일즈 소구점을 "가격"에서 "시간 단축"으로 포지셔닝을 변경했습니다.'
  },
  {
    id: 'cs-3',
    title: '‘비전공 생산관리자’에서 ‘공정 데이터로 불량률 원인을 사전 예방하는 Q-Leader’로',
    category: '엔지니어링/기술',
    applicantBg: '지방 국립대 공학 전공 / 생산현장 관리와 교대근무 2년',
    oldPosition: '“현장에서 발로 뛰며 라인 가동률을 철저히 관리한 성실한 생산관리자”',
    diagnosis: '‘성실함’과 ‘체력’ 중심의 어필로 인해 전문적인 공정 최적화 및 시스템 개선 능력에 의구심 발생.',
    newPosition: '“작업자 개입 오차를 감축하는 표준작업절차(SOP) 재기획으로 불량률을 0.4%p 낮춘 공정 제어자”',
    keyShift: '단순 라인 감시 업무를 "불량이 발생하는 작업 간격 특이점을 발견하고 설비 가동 가이드를 수정한 개선 활동"으로 재구조화',
    result: '글로벌 제조기업 품질관리 및 공정기술 직무 최종합격',
    beforeSentence: '매일 생산 라인을 순회하며 교대 근무자들의 가동 상태를 체크하고 일지를 작성했습니다.',
    afterSentence: '온도 변화에 따른 미세 불량 패턴을 데이터 시트로 기출력하여 작업 환경 모니터링 가이드를 재구축함으로써 불량 발생율을 원천 차단했습니다.'
  },
  {
    id: 'cs-4',
    title: '‘영업 직무에서 마케팅 기획으로’ 무관한 경력을 강력한 직무 전환 논리로',
    category: '직무전환',
    applicantBg: '제약 영업 3년 차 → IT 서비스 마케팅 기획으로 직무 전환 희망',
    oldPosition: '“병원 및 약국 네트워크를 보유하고 실적을 달성해 온 영업 전문가입니다.”',
    diagnosis: '기존 영업 경험의 "실적"에만 몰두하여, 마케팅 기획에서 요구하는 "고객 니즈 발굴 및 컨텐츠 기획 능력"과의 접점이 보이지 않음.',
    newPosition: '“현장에서 고객이 진짜 거절하는 이유를 수집하여 세일즈 메시지로 재가공하던 필드 마케팅 전략가”',
    keyShift: '영업 활동을 "단순 판매"가 아닌 "고객의 페인 포인트(Pain Point)를 직면하고 설득 가설을 검증한 마케팅 리서치 프로젝트"로 직무 전환 논리 구축',
    result: 'B2B SaaS 마케팅팀 경력직 합격',
    beforeSentence: '의사들을 방문하여 제품의 효능을 설명하고 매월 목표 매출을 110% 달성했습니다.',
    afterSentence: '고객 의사가 처방을 주저하는 3가지 핵심 우려를 정밀 분류하고, 이에 맞춘 논문 요약 리플렛과 세일즈 프레임을 직접 기획하여 계약 성공률을 제고했습니다.'
  }
];

export const POSITIONING_NOTES: PositioningNote[] = [
  {
    id: 'note-1',
    title: '직무 경험이 없다는 말이 위험한 진짜 이유 (스펙이 아닌 포지션 문제)',
    category: '기획자 J의 관점',
    date: '2026.08.10',
    readTime: '4분 읽기',
    summary: '취준생들이 가장 흔히 범하는 착각은 "해당 직무 인턴을 안 해봐서 떨어졌다"는 생각입니다. 하지만 기업이 보는 것은 단순 경험 명칭이 아니라, 당신의 행동 양식입니다.',
    beforeExample: '“기획직무 인턴 경험이 없어서 자소서 첫 문장을 무엇으로 시작해야 할지 모르겠습니다.”',
    afterExample: '“인턴 명칭이 중요한 게 아닙니다. 당신이 대학 동아리나 공모전에서 문제를 정의하고 타겟을 설득했던 방식 자체가 기획의 본질입니다.”',
    contentParagraphs: [
      '대부분의 지원자는 채용 공고에 적힌 직무명(예: 퍼포먼스 마케터, 서비스 기획자)을 보고, 똑같은 단어가 들어간 인턴십이나 활동이 없으면 "저는 직무 경험이 없습니다"라고 단정 짓습니다.',
      '하지만 기업의 채용 담당자가 자소서에서 확인하고 싶은 것은 특정 회사에서의 인턴 경력 여부 그 자체가 아닙니다.',
      '기업이 원하는 것은 다음과 같습니다: "이 사람은 복잡한 상황을 만나면 어떻게 문제를 정의하고, 어떤 논리로 해결책을 도출하는가?"',
      '경험의 타이틀에 갇히지 마세요. 당신이 진행했던 동아리 활동, 알바, 공모전, 심지어 학과 팀프로젝트 속에서도 기업이 채용할 직무적 행동 논리를 포지셔닝할 수 있습니다.'
    ],
    ctaText: '‘나만의 ONE THING 찾기’ 클래스에서 내 경험 재해석하기',
    ctaLink: '/classes'
  },
  {
    id: 'note-2',
    title: '채용 공고에서 "우대사항"을 직무적 역할로 번역하는 3단계 공식',
    category: '공고 포지셔닝',
    date: '2026.08.02',
    readTime: '5분 읽기',
    summary: '기업 공고의 자격요건과 우대사항은 단순 문장이 아닙니다. 기업이 현재 겪고 있는 아픔과 기대하는 해결책이 담긴 암호문입니다.',
    beforeExample: '우대사항: "SQL 및 데이터 분석 도구 활용 가능자" → "저는 SQL 자격증이 없는데 어쩌죠?"',
    afterExample: '우대사항의 본질: "데이터를 보고 현상의 원인을 숫자로 추적할 줄 아는 사람" → "자격증은 없지만 엑셀 데이터로 고객 이탈 요인을 분석한 경험으로 포지셔닝"',
    contentParagraphs: [
      '공고에 "SQL 활용 가능자"라고 적혀 있으면 지원자들은 당장 SQL 학원에 등록해야 하는지 고민합니다.',
      '하지만 기업이 SQL을 언급한 진짜 이유는 툴 그 자체가 아니라, "숫자 데이터를 근거로 의사결정을 내릴 수 있는 사람"을 원하기 때문입니다.',
      '공고 번역 1단계: 툴 표면 문장 구별하기',
      '공고 번역 2단계: 기업이 해결하고 싶은 문제 파악하기',
      '공고 번역 3단계: 나의 경험 중 그 문제 해결 능력과 일치하는 행동 포지셔닝 결합하기'
    ],
    ctaText: '‘공고에서 포지션 읽는 법’ 클래스 확인하기',
    ctaLink: '/classes'
  },
  {
    id: 'note-3',
    title: '자소서 10초 스키밍을 견디는 "주장-근거-어필" 3단 구조',
    category: '자소서 리포지셔닝',
    date: '2026.07.25',
    readTime: '6분 읽기',
    summary: '채용 담당자는 자소서를 정독하지 않습니다. 첫 10초 만에 이 사람이 어떤 포지션인지 파악합니다. 수식어를 빼고 두괄식 논리를 만드는 법.',
    beforeExample: '소제목: "열정과 도전정신으로 성과를 창출해 내는 창의적인 인재 기획자 OO입니다."',
    afterExample: '소제목: "고객 인터뷰 30회로 숨은 불편을 발견하여 탈락률을 20% 낮춘 문제 정의형 기획자"',
    contentParagraphs: [
      '자소서 첫 문장에 "열정적인", "창의적인", "소통을 잘하는" 같은 모호한 형용사를 쓰는 순간, 채용 담당자의 눈은 다음 서류로 넘어갑니다.',
      '기업은 형용사를 믿지 않습니다. 오직 "정의된 문제"와 "실행한 행동"만을 믿습니다.',
      '포지셔닝 자소서 소제목의 법칙: [행동/데이터 근거] + [해결한 문제] + [지원자 포지션 명칭]',
      '이 구조만 지켜도 당신의 자소서는 단순 경험 나열에서 "기업이 선택할 명확한 이유"로 탈바꿈합니다.'
    ],
    ctaText: '‘자소서 10초 리포지셔닝’ 실습 클래스 보기',
    ctaLink: '/classes'
  },
  {
    id: 'note-4',
    title: '면접을 "질의응답"이 아닌 "나라는 브랜드 세일즈"로 바꾸는 IMPACT 5',
    category: '면접 세일즈',
    date: '2026.07.18',
    readTime: '5분 읽기',
    summary: '면접관의 질문에 끌려다니는 면접자는 합격하기 어렵습니다. 내가 고수할 포지셔닝 키워드를 중심으로 답변 흐름을 주도하는 답변 프레임워크.',
    beforeExample: '면접관: "가장 힘들었던 경험이 무엇인가요?" → 면접자: "팀원과 갈등이 있었을 때 술 한잔 마시며 대화로 풀었습니다."',
    afterExample: '면접관: "가장 힘들었던 경험이 무엇인가요?" → 면접자: "목표에 대한 이해가 달라 의견이 대립했을 때, 목표 지표를 시각화하여 우선순위를 재조정한 경험입니다."',
    contentParagraphs: [
      '면접은 시험이 아닙니다. 나라는 제품을 기업에 가장 매력적으로 제안하는 "세일즈 미팅"입니다.',
      'IMPACT 5 프레임워크:',
      '1. I (Issue): 직면했던 명확한 문제 정의',
      '2. M (Message): 내가 전달하고자 하는 포지셔닝 메시지',
      '3. P (Proof): 증거가 되는 나의 구체적 행동',
      '4. A (Action): 어떻게 문제점을 타파했는지의 구체적 과정',
      '5. C (Connection): 이 역량이 지원 직무에서 기업에 가져다줄 실제 이점',
      '이 5가지 요소가 갖춰지면 질문이 아무리 압박적으로 들어와도 내 포지셔닝으로 답변을 되돌려놓을 수 있습니다.'
    ],
    ctaText: '‘면접을 세일즈로 바꾸는 IMPACT 5’ 클래스 신청',
    ctaLink: '/classes'
  }
];

export const COURSES: Course[] = [
  {
    id: 'course-1',
    levelTag: '리포지셔닝 핵심',
    title: '세상을 유리하게 보는 기술, 리포지셔닝',
    subTitle: '조금만 다르게 생각하면 다수의 경쟁자가 단일의 경쟁자가 되기도 합니다.',
    description: '스펙 단순 나열에서 벗어나 동일한 경험도 완전히 다른 직무적 가치로 읽히게 만드는 취업시장 인식의 리포지셔닝 핵심 특강.',
    targetAudience: '경쟁자와 비슷한 스펙 속에서 나만의 독보적인 기획자적 포지션을 선점하고 싶은 모든 취준생',
    durationTotal: '40분 (총 2강)',
    lessonCount: 2,
    requiredTier: 'FREE',
    priceText: '오픈 특강',
    priceValue: 0,
    youtubeUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo',
    lessons: [
      { id: 'l1-1', number: 1, title: '1강. 취업시장 특강, 리포지셔닝이란?', duration: '18:30', isFreePreview: true, isPro: false, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '스펙 경쟁과 인식 경쟁의 차이, 기업이 지원자를 평가하는 선점의 기술', keyTakeaway: '기업은 스펙의 양을 보는 것이 아니라 당신이 스스로 정의한 독보적 포지션을 평가한다.' },
      { id: 'l1-2', number: 2, title: '2강. 인식의 리포지셔닝', duration: '21:15', isFreePreview: true, isPro: false, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '다수의 경쟁자 속에서 단일의 개별 경쟁자로 인정받는 인식 프레임 전환 원리', keyTakeaway: '남들과 똑같은 단어로 경험을 말하지 마라. 기업의 시각으로 경험의 가치를 재정의하라.' }
    ],
    workbookTitle: '[가이드북] 인식의 리포지셔닝 프레임워크.pdf',
    workbookUrl: '#'
  },
  {
    id: 'course-2',
    levelTag: '면접 완벽통제',
    title: '면접 특강 : 완벽통제면접',
    subTitle: '그 구조를 이해해야만 면접 주도권을 빼앗기지 않습니다.',
    description: '면접관의 질의응답에 수동적으로 끌려가지 않고, 면접의 판도를 내 포지셔닝 메시지로 완벽히 주도하고 통제하는 면접 전략.',
    targetAudience: '면접만 가면 긴장해서 답변이 꼬이거나 면접의 주도권을 잡고 싶은 지원자',
    durationTotal: '1시간 15분 (총 3강)',
    lessonCount: 3,
    requiredTier: 'FREE',
    priceText: '오픈 특강',
    priceValue: 0,
    youtubeUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo',
    lessons: [
      { id: 'l2-1', number: 1, title: '1강. 면접 그 구조를 파악하자', duration: '22:30', isFreePreview: true, isPro: false, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '면접관이 질의를 던지는 평가 메커니즘과 면접의 심리적 구조 파악', keyTakeaway: '면접관은 정답을 듣고 싶은 것이 아니라 당신의 의사결정 프레임을 확인하고 싶어한다.' },
      { id: 'l2-2', number: 2, title: '2강. 완벽통제면접 특강', duration: '25:10', isFreePreview: true, isPro: false, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '어떤 돌발질문이나 압박질문이 들어와도 내 앵커 메시지로 답변을 수렴시키는 기술', keyTakeaway: '질문에 당황하지 말고 내 준비된 포지셔닝으로 면접의 주도권을 통제하라.' },
      { id: 'l2-3', number: 3, title: '3강. 면접의 주요 10가지 질문', duration: '27:00', isFreePreview: true, isPro: false, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '자기소개, 지원동기, 직무강점 등 면접 필수 10대 질문 통제 답변 가이드', keyTakeaway: '10개 핵심 질문을 관통하는 단 하나의 선명한 정체성을 유지하라.' }
    ],
    workbookTitle: '[스크립트] 완벽통제면접 10대 질문 답변 가이드.pdf',
    workbookUrl: '#'
  },
  {
    id: 'course-3',
    levelTag: '자기설득서 완성',
    title: '자기소개서 특강 : 자기설득서',
    subTitle: '자기소개서는 철저하게 나의 채용이유를 설득하는 “자기설득서”가 되어야 합니다.',
    description: '단순 스펙 일기장에서 벗어나 인사담당자가 나를 반드시 면접장에 부를 수밖에 없도록 채용 이유를 증명하는 자기설득서 작성 필승전략 3부작.',
    targetAudience: '자소서 서류 탈락이 반복되거나, 자신의 채용 이유를 논리적으로 어필하고 싶은 지원자',
    durationTotal: '1시간 01분 (총 3강)',
    lessonCount: 3,
    requiredTier: 'FREE',
    priceText: '오픈 특강',
    priceValue: 0,
    youtubeUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo',
    lessons: [
      { id: 'l3-1', number: 1, title: '1강. 자기설득서의 이해 및 자기설득서 필승전략 1부', duration: '20:10', isFreePreview: true, isPro: false, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '자소서를 채용 세일즈 문서로 만드는 자기설득서 프레임의 개념과 기초 전략', keyTakeaway: '자기소개서는 나를 나열하는 글이 아니라 기업을 설득하는 세일즈 기획서다.' },
      { id: 'l3-2', number: 2, title: '2강. 자기설득서 필승전략 2부', duration: '19:40', isFreePreview: true, isPro: false, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '채용 담당자의 10초 스키밍을 사로잡는 소제목과 두괄식 배치법', keyTakeaway: '소제목과 첫 문장에서 당신의 채용 가치를 바로 각인시켜라.' },
      { id: 'l3-3', number: 3, title: '3강. 자기설득서 필승전략 3부', duration: '21:00', isFreePreview: true, isPro: false, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '기업의 아픔(Pain point)에 나의 문제해결 역량을 완벽히 연결하는 법', keyTakeaway: '기업의 다음 목표 과제에 내 역량이 왜 필연적인지 증명하라.' }
    ],
    workbookTitle: '[워크북] 자기설득서 기초 프레임 가이드.pdf',
    workbookUrl: '#'
  },
  {
    id: 'course-3-pro',
    levelTag: 'PRO 실전',
    title: '자기설득서 실전 특강',
    subTitle: '나만의 Why 분석부터 문항별 적용까지 완성하는 실전 심화 특강',
    description: '단순 이론을 넘어 기업이 왜 나여야만 하는지 명확한 채용 당위성을 도출하고 자소서 문항별로 적용 완성하는 실전 강의.',
    targetAudience: '실제 서류 지원을 앞두고 자소서 문항별로 완성도 높은 설득 논리를 완비하고자 하는 지원자',
    durationTotal: '48분 (총 2강)',
    lessonCount: 2,
    requiredTier: 'PRO',
    priceText: 'PRO 전용',
    priceValue: 79000,
    youtubeUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo',
    lessons: [
      { id: 'l3-pro-1', number: 1, title: '1강. Why 실전 강의', duration: '23:30', isFreePreview: false, isPro: true, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '왜 나여야만 하는가? 깊이 있는 Why 분석과 자소서 적용 실전 강의', keyTakeaway: '왜(Why)라는 질문을 깊게 파고들 때 비로소 남들과 차별화되는 채용이유가 도출된다.' },
      { id: 'l3-pro-2', number: 2, title: '2강. 자기설득서 문항별 적용 실전 강의', duration: '24:50', isFreePreview: false, isPro: true, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '지원동기, 직무역량, 입사후포부 문항별 맞춤 자기설득서 실전 완성', keyTakeaway: '문항의 출제 의도에 맞추어 설득서의 앵커 메시지를 조율하라.' }
    ],
    workbookTitle: '[워크북] 자기설득서 문항별 적용 템플릿.pdf',
    workbookUrl: '#'
  },
  {
    id: 'course-4',
    levelTag: '실전 이직',
    title: '이직 특강 : 기업 REAL NEEDS 맞춤 전략',
    subTitle: '모든 기업의 이직은 기업의 REAL NEEDS(채용의 진짜 이유)에서 출발합니다.',
    description: '경력직 및 신입 이직자를 위한 실전 특강. 채용 공고 뒤에 숨은 기업의 REAL NEEDS를 도출하고 이력서와 포트폴리오를 맞춤 사격하는 이직 공략집.',
    targetAudience: '기업의 진짜 채용 목적에 맞춰 성공적인 이직을 원하는 경력자 및 이직 희망자',
    durationTotal: '1시간 30분 (총 3강)',
    lessonCount: 3,
    requiredTier: 'PRO',
    priceText: 'PRO 전용',
    priceValue: 79000,
    youtubeUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo',
    lessons: [
      { id: 'l4-1', number: 1, title: '1강. 이직 STP전략 및 기업 REAL NEED의 기본 이해', duration: '27:30', isFreePreview: false, isPro: true, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '이직 시장에서의 STP 타겟팅과 기업의 숨겨진 REAL NEED 파악법', keyTakeaway: '이직은 경력 연차가 아닌 현장 문제를 바로 해결해 줄 수 있는 핏(Fit)의 구매다.' },
      { id: 'l4-2', number: 2, title: '2강. 기업 REAL NEEDS 맞춤 이력서 작성 실전 강의', duration: '29:40', isFreePreview: false, isPro: true, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '기업의 REAL NEED를 완벽히 충족하는 경력 기술서 및 이력서 구조화', keyTakeaway: '나열식 업무 목록을 수치화된 성과와 기여 행동 중심으로 전환하라.' },
      { id: 'l4-3', number: 3, title: '3강. 기업 REAL NEEDS 맞춤 포트폴리오 실전 강의', duration: '32:00', isFreePreview: false, isPro: true, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '타겟 기업의 니즈에 맞춘 맞춤형 포트폴리오 구성 실습', keyTakeaway: '포트폴리오는 과거 작업 모음집이 아니라 미래 비즈니스 기여의 강력한 증거다.' }
    ],
    workbookTitle: '[프레임워크] 기업 REAL NEEDS 분석 및 이직 이력서 템플릿.pdf',
    workbookUrl: '#'
  },
  {
    id: 'course-5',
    levelTag: '실전 포트폴리오',
    title: '포트폴리오 특강 : 자기 PR 전략의 이해',
    subTitle: 'PR은 스펙으로 하는게 아닌 캐릭터를 보여줘야 먹힙니다.',
    description: '스펙 늘어놓기식 포트폴리오는 선택받지 못합니다. 나만의 독보적인 정체성과 캐릭터를 각인시키는 스토리 플로우 중심의 자기 PR 포트폴리오 기획 실전.',
    targetAudience: '보는 사람을 한번에 사로잡는 캐릭터 중심의 포트폴리오를 기획하고자 하는 지원자',
    durationTotal: '1시간 10분 (총 2강)',
    lessonCount: 2,
    requiredTier: 'PRO',
    priceText: 'PRO 전용',
    priceValue: 79000,
    youtubeUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo',
    lessons: [
      { id: 'l5-1', number: 1, title: '1강. 기업 및 직무 REAL NEEDS 분석 실전 강의', duration: '31:20', isFreePreview: false, isPro: true, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '포트폴리오 제작 전 핵심 단계인 기업과 직무의 REAL NEEDS 분석', keyTakeaway: '포트폴리오는 단순 스펙 저장이 아닌 기업 니즈에 부합하는 캐릭터의 피칭 공간이다.' },
      { id: 'l5-2', number: 2, title: '2강. REAL NEEDS기반 포트폴리오 플로우 설계 실전 강의', duration: '34:40', isFreePreview: false, isPro: true, videoUrl: 'https://www.youtube.com/watch?v=bWPpI9n0sZo', summary: '오프닝부터 설득으로 이어지는 포트폴리오 스토리 아크 플로우 설계', keyTakeaway: '선명한 캐릭터가 느껴질 때 포트폴리오의 모든 프로젝트가 하나의 설득 서사로 묶인다.' }
    ],
    workbookTitle: '[가이드] 캐릭터 중심 자기 PR 포트폴리오 플로우 가이드.pdf',
    workbookUrl: '#'
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    category: '관점 변화',
    title: '“소재가 없던 게 아니라, 소재를 잘못 보고 있었다는 걸 알았습니다.”',
    author: '김O진 님',
    targetJob: 'IT 서비스 기획 지원',
    content: '스펙이 부족하다고 생각해서 자격증을 더 따야 하나 고민하던 중 기획자 J님의 진단을 받았습니다. 제가 대학 시절 진행했던 소소한 학과 학술제 준비가 기업 관점에서는 "참여자 이탈을 막은 동선 설계"로 탈바꿈하는 것을 보고 온몸에 소름이 돋았습니다. 스펙을 쌓는 게 아니라 관점을 바꾸는 게 먼저였습니다.',
    quote: '단순한 자소서 첨삭이 아니라 제 삶과 경험을 바라보는 프레임 자체를 바꿔주셨습니다.'
  },
  {
    id: 'rev-2',
    category: '자소서 변화',
    title: '“기업마다 새로운 자소서를 쓰는 대신, 하나의 포지션을 조정하게 됐습니다.”',
    author: '박O훈 님',
    targetJob: '퍼포먼스 마케터 전환',
    content: '전에는 지원할 때마다 밤을 새우며 완전히 새로운 자소서를 써야 했습니다. 하지만 리포지셔닝 부트캠프를 거치며 "나만의 ONE THING 포지션"을 정립하고 나니, 이제는 기업의 공고에 맞춰 포지셔닝 문장만 조금씩 미세조정(Tuning)하여 30분 만에 명확한 자소서를 완성할 수 있게 되었습니다.',
    quote: '자소서 작성이 더 이상 막막하고 두려운 고통이 아닌, 전략 게임처럼 느껴집니다.'
  },
  {
    id: 'rev-3',
    category: '면접 변화',
    title: '“면접에서 질문에 끌려가지 않고 제가 전달할 메시지를 유지할 수 있었습니다.”',
    author: '이O아 님',
    targetJob: '대기업 계열사 브랜드 기획',
    content: '면접관이 제 전공과 무관한 직무에 대해 압박 질문을 던졌을 때, 예전 같으면 당황해서 말을 얼버무렸을 겁니다. 하지만 J님의 IMPACT 5 프레임 덕분에 "제가 전공에서 배운 문제 정의 방식이 이 직무에서 어떻게 더 차별화된 가치가 되는지" 당당하게 세일즈할 수 있었습니다. 면접관님들이 고개를 끄덕이며 메모하시던 모습이 아직도 생생합니다.',
    quote: '면접실 문을 열고 들어가서 나올 때까지 제가 준비한 포지션의 주인으로 서 있었습니다.'
  },
  {
    id: 'rev-4',
    category: '실제 합격',
    title: '“15번 연속 서류 탈락하던 제가 대기업 및 주요 계열사 3 곳 동시 최종 합격했습니다.”',
    author: '정O우 님',
    targetJob: '인하우스 브랜드 기획 / 마케팅',
    content: '스펙은 6개월 전과 완전히 동일했습니다. 달라진 것은 오직 기획자 J님과 함께 만든 자소서와 면접에서의 "포지셔닝" 단 하나였습니다. "단순 아르바이트생"에서 "매장 운영동선 개선자"로 포지셔닝을 바꾼 것이 결정적이었습니다. 최종합격 통보를 받고 눈물이 났습니다. 기획자 J님은 제 취업의 은인입니다.',
    quote: '스펙을 바꾸지 않고, 나를 읽는 방식을 바꾸었더니 합격 통지서가 날아왔습니다.'
  }
];

export const BOOTCAMP_INFO: BootcampCohort = {
  id: 'bc-7',
  cohortNumber: 7,
  status: '모집중',
  startDate: '2026년 9월 7일 (월) 개강',
  durationWeeks: 4,
  capacity: 20,
  currentEnrolled: 14,
  price: '490,000원 (온라인 강의 풀패키지 + 1:1 라이브 피드백 포함)',
  curriculumWeeks: [
    {
      week: 1,
      title: '경험 해체 & 나만의 ONE THING 포지션 확정',
      objective: '흩어져 있던 모든 경험 자산을 팩트와 가치로 해체하고, 기업이 선택할 단 하나의 메인 포지셔닝 문장을 확정합니다.',
      output: '기획자 J 1:1 검수를 거친 "나의 시그니처 포지셔닝 리포트"'
    },
    {
      week: 2,
      title: '채용 공고 해독 & 타겟 기업 포지셔닝 튜닝',
      objective: '지원하고 싶은 핵심 기업 3곳의 채용 공고를 해독하여, 기업의 숨은 페인포인트에 맞춰 내 포지션을 정밀 매칭합니다.',
      output: '기업별 맞춤 "공고-경험 매칭 타겟팅 시트"'
    },
    {
      week: 3,
      title: '10초 스키밍을 뚫는 리포지셔닝 자소서 완성',
      objective: '항목별 자소서 작성 프레임워크를 적용하여, 첫 문장부터 기업이 뽑아야 할 논리로 무장된 실전 자소서를 작성합니다.',
      output: '기획자 J의 직접 피드백 반영 완료된 "실전 마스터 자소서"'
    },
    {
      week: 4,
      title: 'IMPACT 5 면접 피칭 & 최종 세일즈 훈련',
      objective: '1분 자기소개부터 압박질문 대처까지, 나라는 브랜드를 면접관에게 확실히 세일즈하는 실전 라이브 시뮬레이션을 진행합니다.',
      output: '"1분 자기소개 피칭 영상 & 질문 20선 포지셔닝 답변집"'
    }
  ]
};

export const INITIAL_MOCK_USER: UserProfile = {
  name: '김취준',
  email: 'applicant@example.com',
  tier: 'FREE',
  targetJob: '서비스 기획 / 브랜드 마케팅',
  positioningVersions: [
    {
      id: 'v1',
      date: '2026.08.01',
      stage: '최초 작성',
      sentence: '다양한 동아리 활동과 인턴 경험으로 열정과 소통 능력을 갖춘 준비된 지원자 김취준입니다.',
      companyTarget: '공통 자소서',
      feedbackNote: '너무 추상적이며 "열정", "소통" 같은 일반적인 자평 수식어만 존재함. 기업이 선택할 명확한 문제해결 논리 부재.'
    },
    {
      id: 'v2',
      date: '2026.08.08',
      stage: '입문강의 수강 후',
      sentence: '저는 단순 행사를 운영한 사람이 아니라, 이탈률이 높은 동아리 이벤트를 개선하여 참여율을 35% 높인 운영자입니다.',
      companyTarget: '기본 포지셔닝',
      feedbackNote: '경험의 행동 가치가 들어갔으나, 지원하려는 직무적 목표(서비스 기획)와의 접점이 더 뾰족해질 필요 있음.'
    },
    {
      id: 'v3',
      date: '2026.08.12',
      stage: '기획자 J 피드백 반영',
      sentence: '고객 인터뷰와 유저 행동 데이터를 분석하여 서비스의 병목을 발견하고, 실행 동선을 재기획하여 고객 만족도를 높이는 서비스 기획자',
      companyTarget: '주요 IT 기업 지원용',
      feedbackNote: '문제 정의 능력 + 데이터 행동 + 직무적 쓰임새가 완벽히 결합된 우수한 포지셔닝 문장.'
    }
  ],
  enrolledCourseIds: ['course-1'],
  completedLessonIds: ['l1-1', 'l1-2'],
  bootcampApplicationStatus: '미신청'
};
