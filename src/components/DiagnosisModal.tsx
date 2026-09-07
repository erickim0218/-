import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, RotateCcw, Sparkles, AlertTriangle, BookOpen } from 'lucide-react';
import { DiagnosisResult, DiagnosisType } from '../types';

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse?: (courseId: string) => void;
  onSavePositioningSentence?: (sentence: string) => void;
}

const QUESTIONS = [
  {
    id: 1,
    title: '현재 나의 가장 큰 취업 고민은 무엇인가요?',
    options: [
      { label: '활동과 경험은 많은데 자소서만 쓰면 평범해집니다.', value: '경험 차별화 부족형' },
      { label: '서류 제출 후 연속적으로 서류 탈락 통보를 받고 있습니다.', value: '표현 구조 부족형' },
      { label: '지원하는 직무와 내 전공/경험이 관련이 없다고 느껴집니다.', value: '직무 연결 부족형' },
      { label: '자소서와 면접에서 강조하는 내 모습이 계속 달라집니다.', value: '면접 일관성 부족형' },
      { label: '기존 경력과 전혀 다른 직무나 산업으로 이직하고 싶습니다.', value: '직무 전환형' }
    ]
  },
  {
    id: 2,
    title: '자소서 작성 시 나의 경험을 표현하는 방식에 가까운 것은?',
    options: [
      { label: '했던 일의 날짜와 순서, 역할을 상세히 나열합니다.', value: 'A' },
      { label: '‘열정적인’, ‘창의적인’, ‘소통을 잘하는’ 등의 수식어를 많이 씁니다.', value: 'B' },
      { label: '기업 공고에 적힌 직무명을 그대로 내 경험에 적어넣습니다.', value: 'C' },
      { label: '경험이 별것 아니라고 생각되어 축소해서 간략히 씁니다.', value: 'D' }
    ]
  },
  {
    id: 3,
    title: '서류 탈락 통보를 받았을 때 가장 먼저 드는 생각은?',
    options: [
      { label: '“어학 점수나 스펙을 하나 더 쌓아야 하나?”', value: 'A' },
      { label: '“인턴이나 관련 경험이 없어서 떨어진 거겠지?”', value: 'B' },
      { label: '“자소서 문장이나 글솜씨가 부족한가?”', value: 'C' },
      { label: '“도대체 기업이 나에게서 무엇을 보는지 모르겠다.”', value: 'D' }
    ]
  },
  {
    id: 4,
    title: '기업이 내 자소서를 읽었을 때 반응할 것으로 예상되는 모습은?',
    options: [
      { label: '“열심히 살긴 했는데, 우리 팀에 와서 정확히 뭘 할 수 있지?”', value: '직무 연결 부족형' },
      { label: '“다른 지원자들과 서류가 똑같아서 기억에 남지 않는다.”', value: '경험 차별화 부족형' },
      { label: '“글이 너무 길고 모호해서 핵심 주장이 한눈에 안 들어온다.”', value: '표현 구조 부족형' },
      { label: '“자소서 내용과 면접에서의 말에 일관성이 떨어진다.”', value: '면접 일관성 부족형' }
    ]
  }
];

const DIAGNOSIS_DATABASE: Record<DiagnosisType, DiagnosisResult> = {
  '직무 연결 부족형': {
    type: '직무 연결 부족형',
    title: '경험은 풍부하지만 기업 직무와의 연결고리가 불분명한 상태',
    summary: '당신에게 경험이 없는 것이 아닙니다. 단지 그 경험이 기업 직무의 ‘채용 이유’와 연결되지 않았을 뿐입니다.',
    description: '여러 활동과 경험을 소화했지만, 자소서에서는 단순 "열심히 한 과거의 사실"로 머물러 있습니다. 기업은 지원자의 과거 추억이 아니라, 입사 후 해결해 줄 직무적 기여에 관심이 있습니다.',
    keyProblem: '경험의 타이틀(Fact)만 나열되어 기업이 우대하는 ‘직무적 역량(Value)’으로 읽히지 않음.',
    repositioningStrategy: '경험을 [문제 정의 → 나의 행동 → 직무 가치]의 3단계로 해체하고, 공고의 우대사항 언어로 번역할 것.',
    recommendedClassTitle: '공고에서 실제 포지션 읽는 법 & ONE THING 찾기',
    sampleBeforeAfter: {
      before: '동아리에서 다양한 이벤트를 기획하고 성공적으로 진행했습니다.',
      after: '동아리 신규 회원 이탈률 원인을 데이터로 추적하여 온보딩 가이드를 재설계한 고객 경험 개선자'
    }
  },
  '경험 차별화 부족형': {
    type: '경험 차별화 부족형',
    title: '남들과 똑같은 수식어와 흔한 소재로 묻히는 상태',
    summary: '‘성실함’, ‘열정’이라는 모호한 자평으로 수천 명의 지원자 서류 속에 묻히고 있습니다.',
    description: '누구나 쓸 수 있는 모범답안 문장을 복사하여 사용하다 보니, 자소서를 끝까지 읽어도 당신만의 독보적인 색깔이 드러나지 않습니다. 기업은 안전한 모범생보다 차별화된 관점을 가진 기획자를 원합니다.',
    keyProblem: '남들과 동일한 소재에서 동일한 교훈을 도출하여 10초 스키밍 시 사장됨.',
    repositioningStrategy: '‘나만의 ONE THING 키워드’를 도출하여, 남들이 보지 못한 경험의 이면(In-depth Insight)을 포지셔닝할 것.',
    recommendedClassTitle: '나만의 ONE THING 찾기 클래스',
    sampleBeforeAfter: {
      before: '성실한 태도로 맡은 바 업무를 책임감 있게 끝까지 완수했습니다.',
      after: '반복적인 작업 오류 패턴을 수집하여 오차율을 0%로 만든 표준 가이드 기획자'
    }
  },
  '표현 구조 부족형': {
    type: '표현 구조 부족형',
    title: '핵심 메시지가 모호하여 10초 스키밍을 견디지 못하는 상태',
    summary: '하고 싶은 말은 많지만두괄식 논리 구조가 부재하여 채용 담당자가 핵심을 파악하기 어렵습니다.',
    description: '상황 설명에 서류 분량의 80%를 할애하다 보니, 정작 당신이 어떤 의사결정을 내렸고 어떤 결과를 만들었는지가 뒤쪽에 묻혀버립니다.',
    keyProblem: '소제목과 첫 문장에서 채용 이유가 드러나지 않아 10초 만에 이탈 발생.',
    repositioningStrategy: '두괄식 [주장–근거–어필] PREP 프레임으로 자소서 구조를 단숨에 개편할 것.',
    recommendedClassTitle: '자소서 10초 리포지셔닝 Master',
    sampleBeforeAfter: {
      before: '대학 시절 마케팅 공모전에 참여하여 여러 차례 회의를 거친 끝에 인스타그램 홍보를 진행했습니다.',
      after: '고객 페인포인트에 맞춘 랜딩 세일즈 메시지 개편으로 공모전 타겟 전환율 2.3배 달성'
    }
  },
  '면접 일관성 부족형': {
    type: '면접 일관성 부족형',
    title: '서류와 면접의 포지션이 달라 면접관에게 신뢰를 주지 못하는 상태',
    summary: '자소서의 글과 면접 현장에서의 말 사이에 유기적인 닻(Anchor)이 없어 질문에 끌려다닙니다.',
    description: '서류에서는 치밀한 기획자처럼 보였는데 면접장에서는 무조건 열심히 하겠다는 답변만 되풀이하여, 면접관이 지원자의 진정성에 의문을 가지게 됩니다.',
    keyProblem: '나만의 세일즈 닻(Anchor Message)이 없어 압박 질문 시 포지션이 흔들림.',
    repositioningStrategy: 'IMPACT 5 답변 프레임으로 모든 면접 질문을 내 메인 포지셔닝으로 귀환시킬 것.',
    recommendedClassTitle: '면접을 세일즈로 바꾸는 IMPACT 5',
    sampleBeforeAfter: {
      before: '면접관 질문: "갈등을 해결한 경험은?" → "상대방 이야기를 경청하고 양보했습니다."',
      after: '면접관 질문: "갈등을 해결한 경험은?" → "의견 대립 시 감정이 아닌 데이터 지표를 시각화하여 공동의 기준을 제시했습니다."'
    }
  },
  '직무 전환형': {
    type: '직무 전환형',
    title: '과거 경력/전공이 불이익으로 작용할까 불안해하는 상태',
    summary: '과거 경력이 무관해 보인다고 해서 감추려 하지 마세요. 이전 경력은 새로운 직무의 독보적 무기가 될 수 있습니다.',
    description: '이전 직무나 전공이 지원 직무와 완전히 다르다 보니 스스로 위축되어 defensive한 어필을 하게 됩니다. 포지셔닝은 무관한 경력 속에서도 공통된 ‘문제해결 매커니즘’을 찾아내는 것입니다.',
    keyProblem: '이전 경력을 ‘버려진 과거’로 취급하여 설득 논리가 빈약함.',
    repositioningStrategy: '이전 직무에서의 도구와 지원 직무의 목적을 연결하는 직무 재해석 프레임 적용.',
    recommendedClassTitle: '무관한 경력을 경쟁력으로 바꾸는 법 (직무 전환 클래스)',
    sampleBeforeAfter: {
      before: '영업직 경험만 있어 기획이나 마케팅 경험은 부족합니다.',
      after: '현장에서 고객의 거절 이유를 직접 수집하여 마케팅 세일즈 소구점으로 가공하던 필드 마케팅 기획자'
    }
  }
};

export const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
  onSavePositioningSentence
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [customPositioning, setCustomPositioning] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (optionValue: string) => {
    const updated = { ...answers, [currentStep]: optionValue };
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate result
      const selectedTypeStr = updated[0] || updated[3] || '직무 연결 부족형';
      let finalType: DiagnosisType = '직무 연결 부족형';
      
      if (selectedTypeStr in DIAGNOSIS_DATABASE) {
        finalType = selectedTypeStr as DiagnosisType;
      } else if (updated[0] === '직무 전환형') {
        finalType = '직무 전환형';
      } else if (updated[0] === '경험 차별화 부족형') {
        finalType = '경험 차별화 부족형';
      } else if (updated[0] === '표현 구조 부족형') {
        finalType = '표현 구조 부족형';
      } else if (updated[0] === '면접 일관성 부족형') {
        finalType = '면접 일관성 부족형';
      }

      const res = DIAGNOSIS_DATABASE[finalType];
      setResult(res);
      setCustomPositioning(`저는 ${res.sampleBeforeAfter.after}`);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setIsSaved(false);
  };

  const handleSaveSentence = () => {
    if (onSavePositioningSentence && customPositioning.trim()) {
      onSavePositioningSentence(customPositioning);
      setIsSaved(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#171717] text-white border border-[#2D2D2E] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#121212]">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-[#FFD600] text-[#171717] font-black flex items-center justify-center text-sm shadow-sm">
              P
            </span>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">5분 스펙 리포지셔닝 진단</h3>
              <p className="text-xs text-[#A6A6A1]">기획자 J의 취업 문제 진단 매커니즘</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Area */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-[#171717]">
          {!result ? (
            /* Question Step */
            <div className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#A6A6A1]">
                  <span>진단 진행률 ({currentStep + 1} / {QUESTIONS.length})</span>
                  <span className="text-[#FFD600]">{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-[#262626] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FFD600] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 text-xs font-bold bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30 rounded-md mb-3">
                  질문 {currentStep + 1}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                  {QUESTIONS[currentStep].title}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {QUESTIONS[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option.value)}
                    className="w-full text-left p-4 rounded-xl bg-[#222223] hover:bg-[#2A2A2B] border border-[#333335] hover:border-[#FFD600] transition group flex items-start justify-between gap-4"
                  >
                    <span className="text-sm md:text-base text-zinc-200 group-hover:text-white font-medium leading-relaxed">
                      {option.label}
                    </span>
                    <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-[#FFD600] transition shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Result View */
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#222223] border border-[#FFD600]/40 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD600]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[#FFD600]" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFD600]">
                    진단 리포트 결과
                  </span>
                </div>

                <h2 className="text-2xl font-black text-white mb-2">
                  당신의 취업 진단: <span className="text-[#FFD600]">{result.type}</span>
                </h2>
                <p className="text-base text-zinc-300 font-semibold mb-4">
                  "{result.title}"
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed bg-[#171717] p-4 rounded-xl border border-[#2D2D2E]">
                  {result.description}
                </p>
              </div>

              {/* Key Problem & Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#1F1F20] border border-[#2D2D2E] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    현재 가장 큰 장애 요소
                  </div>
                  <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                    {result.keyProblem}
                  </p>
                </div>

                <div className="p-4 bg-[#1F1F20] border border-[#FFD600]/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-[#FFD600] font-bold text-xs uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    기획자 J의 리포지셔닝 처방전
                  </div>
                  <p className="text-sm text-zinc-200 font-medium leading-relaxed">
                    {result.repositioningStrategy}
                  </p>
                </div>
              </div>

              {/* Sample Before/After */}
              <div className="bg-[#121212] border border-[#29292A] rounded-xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  표현 전후 비교 예시 (Before vs Repositioned)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-[#1A1A1B] rounded-lg border border-red-500/20 text-red-300">
                    <span className="font-bold text-red-400 mr-2">[기존 표현]</span>
                    {result.sampleBeforeAfter.before}
                  </div>
                  <div className="p-3 bg-[#23231F] rounded-lg border border-[#FFD600]/40 text-[#FFF3B0] font-medium">
                    <span className="font-bold text-[#FFD600] mr-2">[리포지셔닝]</span>
                    {result.sampleBeforeAfter.after}
                  </div>
                </div>
              </div>

              {/* Interactive Positioning Statement Editor */}
              <div className="bg-[#222223] p-5 rounded-xl border border-[#333335] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFD600]" />
                    나만의 첫 포지셔닝 문장 저장하기
                  </label>
                  {isSaved && (
                    <span className="text-xs text-[#FFD600] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 내 강의실에 저장됨
                    </span>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={customPositioning}
                  onChange={(e) => setCustomPositioning(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2D2D2E] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#FFD600]"
                  placeholder="추천 포지셔닝 문장을 다듬어보세요..."
                />
                <button
                  onClick={handleSaveSentence}
                  className="w-full py-2.5 bg-[#FFD600] text-[#171717] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#ffe033] transition"
                >
                  {isSaved ? '포지셔닝 문장 업데이트 완료' : '내 강의실 포지션 노트에 저장하기'}
                </button>
              </div>

              {/* Recommendation Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-[#262626] hover:bg-[#303030] text-zinc-300 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> 진단 다시하기
                </button>
                <button
                  onClick={() => {
                    onClose();
                    if (onSelectCourse) onSelectCourse('course-1');
                  }}
                  className="flex-1 px-6 py-3 bg-[#FFD600] hover:bg-[#ffe033] text-[#171717] font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" /> 처방 클래스 시청하기
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
