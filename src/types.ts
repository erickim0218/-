export type MemberTier = 'NON_MEMBER' | 'FREE' | 'PRO' | 'BOOTCAMP';

export interface ProPlanOption {
  id: '1month' | '3month' | '6month';
  durationMonths: number;
  durationLabel: string;
  price: number;
  originalPrice?: number;
  monthlyEquivalent: number;
  discountRate?: string;
  badge?: string;
  features: string[];
}

export type DiagnosisType = 
  | '직무 연결 부족형'
  | '경험 차별화 부족형'
  | '표현 구조 부족형'
  | '면접 일관성 부족형'
  | '직무 전환형';

export interface DiagnosisResult {
  type: DiagnosisType;
  title: string;
  summary: string;
  description: string;
  keyProblem: string;
  repositioningStrategy: string;
  recommendedClassTitle: string;
  sampleBeforeAfter: {
    before: string;
    after: string;
  };
}

export interface PositioningVersion {
  id: string;
  date: string;
  stage: '최초 작성' | '입문강의 수강 후' | '기획자 J 피드백 반영' | '기업별 맞춤 적용' | '최종 면접용';
  sentence: string;
  companyTarget?: string;
  feedbackNote?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: '마케팅/기획' | '운영/영업' | '엔지니어링/기술' | '직무전환' | '신입/무경험';
  applicantBg: string;
  oldPosition: string;
  diagnosis: string;
  newPosition: string;
  keyShift: string;
  result: string;
  beforeSentence: string;
  afterSentence: string;
}

export interface PositioningNote {
  id: string;
  title: string;
  category: '공고 포지셔닝' | '자소서 리포지셔닝' | '면접 세일즈' | '직무 전환' | '합격 사례' | '취준 팩트체크' | '기획자 J의 관점';
  date: string;
  readTime: string;
  summary: string;
  beforeExample?: string;
  afterExample?: string;
  contentParagraphs: string[];
  ctaText: string;
  ctaLink: string;
}

export interface CourseLesson {
  id: string;
  number: number;
  title: string;
  duration: string;
  videoUrl?: string;
  summary: string;
  keyTakeaway: string;
  isFreePreview?: boolean;
  isPro?: boolean;
}

export interface Course {
  id: string;
  levelTag: string;
  title: string;
  subTitle: string;
  description: string;
  targetAudience: string;
  durationTotal: string;
  lessonCount: number;
  requiredTier: MemberTier;
  priceText: string;
  priceValue: number;
  youtubeUrl?: string;
  lessons: CourseLesson[];
  workbookTitle?: string;
  workbookUrl?: string;
}

export interface ReviewItem {
  id: string;
  category: '관점 변화' | '자소서 변화' | '면접 변화' | '실제 합격';
  title: string;
  author: string;
  targetJob: string;
  content: string;
  quote: string;
}

export interface BootcampCohort {
  id: string;
  cohortNumber: number;
  status: '모집중' | '마감임박' | '진행중' | '종료';
  startDate: string;
  durationWeeks: number;
  capacity: number;
  currentEnrolled: number;
  price: string;
  curriculumWeeks: {
    week: number;
    title: string;
    objective: string;
    output: string;
  }[];
}

export type CareerLevel =
  | '인턴'
  | '신입'
  | '1년차'
  | '2년차'
  | '3년차'
  | '4년차'
  | '5년차'
  | '6년차'
  | '7년차'
  | '8년차'
  | '9년차'
  | '10년차'
  | '10년차 이상';

export const CAREER_LEVEL_OPTIONS: CareerLevel[] = [
  '인턴',
  '신입',
  '1년차',
  '2년차',
  '3년차',
  '4년차',
  '5년차',
  '6년차',
  '7년차',
  '8년차',
  '9년차',
  '10년차',
  '10년차 이상'
];

export interface UserProfile {
  id?: string;
  username?: string;
  name: string;
  email: string;
  phone?: string;
  careerLevel?: CareerLevel;
  tier: MemberTier;
  bootcampCohort?: string;
  targetJob: string;
  positioningVersions: PositioningVersion[];
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  bootcampApplicationStatus?: '미신청' | '심사중' | '승인완료' | '수강중';
  isAdmin?: boolean;
}

export interface PaymentRecord {
  id: string;
  orderNumber: string;
  userName: string;
  userEmail: string;
  productName: string;
  productType: 'BOOTCAMP' | 'PRO_CLASS' | 'FIRST_CLASS' | 'CONSULTING' | 'PRO';
  amount: number;
  status: '결제완료' | '환불요청' | '환불완료' | '입금대기';
  paymentMethod: '카드결제' | '무통장입금' | '카카오페이' | '토스페이';
  paidAt: string;
  receiptUrl?: string;
  refundReason?: string;
}

export interface ManagedUser {
  id: string;
  username?: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  careerLevel?: CareerLevel;
  tier: MemberTier;
  joinedDate: string;
  lastLoginDate: string;
  targetJob: string;
  totalSpent: number;
  bootcampCohort?: string;
  notes?: string;
  status: '활성' | '정지' | '탈퇴';
  isAdmin?: boolean;
  isPromotedToPro?: boolean;
  promotedAt?: string;
}

export type ProductGroup = 'bootcamp' | 'pro_membership';

export interface RevenueProduct {
  id: string;
  product_group: ProductGroup;
  plan_code: string;
  plan_name: string;
  default_price: number;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export type TransactionStatus = 'paid' | 'partially_refunded' | 'refunded' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'card' | 'cash' | 'other';

export interface RevenueTransaction {
  id: string;
  sale_date: string;
  product_id: string;
  customer_name: string;
  customer_email: string;
  gross_amount: number;
  refund_amount: number;
  status: TransactionStatus;
  net_amount: number;
  payment_method: PaymentMethod;
  memo?: string;
  member_user_id?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  grant_type?: 'paid' | 'promotion' | 'manual';
  revenue_products?: RevenueProduct;
  product_group?: ProductGroup;
  plan_name?: string;
}
