import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, CheckCircle, RotateCcw, Download, Copy, RefreshCw, 
  ChevronRight, AlertCircle, FileText, Compass, ShieldCheck, Check,
  BookOpen, HelpCircle, Layers, Award, Send
} from 'lucide-react';

const COMPETENCIES = [
  {
    cat: "🧠 사고·전략 역량",
    items: [
      ["분석력", "복잡한 현상을 변수·원인·구조로 분해해 의사결정에 쓰일 수 있는 판단 근거로 재구성한다"],
      ["구조화 능력", "흩어진 정보와 아이디어를 위계와 흐름이 보이도록 정리한다"],
      ["문제정의력", "증상과 원인을 구분해 해결해야 할 핵심 문제를 정확히 규정한다"],
      ["가설수립능력", "검증 가능한 형태로 가설을 세우고 결과를 통해 지속적으로 수정한다"],
      ["논리적 사고", "감정이 아닌 사실과 근거를 연결해 일관된 결론을 도출한다"],
      ["추상화 능력", "개별 사례에서 공통 패턴과 본질을 도출한다"],
      ["통찰력", "데이터와 맥락을 결합해 표면 아래의 의미를 읽어낸다"],
      ["시스템 사고", "개별 요소가 아닌 전체 구조와 상호작용 관점에서 문제를 바라본다"],
      ["전략적 사고", "현재 행동을 중장기 목표 관점에서 역으로 설계한다"],
      ["판단력", "제한된 정보와 시간 속에서 가장 영향력이 큰 선택지를 선별한다"],
    ]
  },
  {
    cat: "🚀 실행·성과 역량",
    items: [
      ["집요함", "문제가 설명 가능해질 때까지 원인을 끝까지 추적한다"],
      ["실행력", "완벽한 조건을 기다리지 않고 실행을 통해 정확도를 높인다"],
      ["추진력", "불확실한 상황에서도 일을 전진시킨다"],
      ["완결력", "시작한 일을 결과물까지 책임지고 마무리한다"],
      ["우선순위 설정 능력", "중요도와 영향도를 기준으로 자원을 배분한다"],
      ["속도감", "의사결정과 실행 사이의 간극을 최소화한다"],
      ["성과관리 능력", "활동을 지표와 결과로 연결해 설명한다"],
      ["개선 주도력", "기존 방식의 한계를 인식하고 대안을 실행한다"],
      ["리스크 관리 능력", "발생 가능성을 사전에 인지하고 영향을 최소화한다"],
    ]
  },
  {
    cat: "🤝 커뮤니케이션·협업 역량",
    items: [
      ["보고 역량", "핵심 메시지와 판단 포인트 중심으로 설명한다"],
      ["설득력", "감정이 아닌 논리와 근거로 상대의 판단을 움직인다"],
      ["조율 능력", "서로 다른 이해관계를 조정해 실행 방향을 만든다"],
      ["이해관계자 관리", "관점과 니즈를 고려해 협업을 설계한다"],
      ["커뮤니케이션 능력", "상대의 이해와 의사결정을 돕는 방식으로 전달한다"],
      ["공감 능력", "상대의 입장을 이해하고 소통 방식에 반영한다"],
      ["피드백 수용력", "의견을 방어하지 않고 개선 재료로 전환한다"],
    ]
  },
  {
    cat: "🌱 자기관리·성장 역량",
    items: [
      ["목표의식", "모든 선택과 행동을 설정한 목표에 수렴시키며 판단한다"],
      ["자기주도성", "지시를 기다리지 않고 스스로 문제를 정의하고 행동한다"],
      ["자기객관화", "성과와 한계를 동일한 시선으로 인식한다"],
      ["학습능력", "경험과 실패를 다음 실행의 정확도로 환산한다"],
      ["회복탄력성", "압박과 실패 속에서도 방향성을 유지한다"],
      ["지속성", "단기 성과에 흔들리지 않고 기준을 유지한다"],
      ["기준 설정 능력", "스스로의 업무 품질 기준을 명확히 정한다"],
      ["자기관리 능력", "시간·에너지·우선순위를 관리해 퍼포먼스를 유지한다"],
    ]
  }
];

const DECLARATIONS = [
  "나 OOO은 보통의 취준생이 아닌, 인사담당자를 전략적으로 설득시킬 리포지셔너다.",
  "나는 [OO회사] [OO직무]를 전략적으로 분석해서 Real Needs를 파악할 것이다.",
  "Real Needs에 What(경험)을 붙여, \"OOO은 우리 회사에 꼭 필요한 사람\"이라는 결론을 만들 것이다.",
  "자소서가 아닌 질문에 대한 주장과 근거를 기반으로 설득하게 만드는 \"자기설득서\"를 작성할 것이다.",
  "반드시 상대 회사에 기여하겠다는 의지를 밝혀 설득력을 높일 것이다.",
  "이를 통해 나 OOO은 [OO회사] [OO직무]에서 회사가 원하는 지원자로 반드시 기억된다.",
];

const DIRECT_CHECK = [
  "질문에 '바로' 답했나? (서론/성장기/배경으로 도망 안 감)",
  "니즈(회사)와 역량(나)이 한 문장에 같이 있나",
  "행동이 보이나 (동사로 쓰였나)",
  "결과가 있나 (수치/전후 변화/증거)",
  "경쟁자와 달라 보이나 (나만의 기준/방식이 있나)",
];

const SUBTITLE_CHECK = [
  "직독직답을 대표하고 보완하고 있나?",
  "본문이 소제목을 증명하나? (증명 못 하면 소제목/본문 중 하나를 고쳐야 함)"
];

const STAR_CHECK = [
  "STAR 흐름대로 잘 정리가 되었나",
  "결과가 KPI 언어로 번역됐나",
  "설명이 길지 않나 (핵심만 남았나)"
];

const DEAL_CHECK = [
  "감정(열심히) 대신 오퍼(제안)로 끝났나?"
];

const FINAL_CHECK = [
  "인식되고자하는 최종목표와 작성된 자소서의 주장이 일치하는가",
  "직독직답으로 명확한 주장을 하였는가",
  "주장에 대한 근거의 흐름이 자연스러운가",
  "모든 글을 읽고 설득이 되는가",
  "마지막 어필을 통해 기여수준까지 작성하였는가",
];

interface QuestionItem {
  intent: string;
  direct: string;
  directCheck: boolean[];
  keyword: string;
  original: string;
  twist: string;
  subtitle: string;
  subtitleCheck: boolean[];
  s: string;
  t: string;
  a: string;
  r: string;
  starCheck: boolean[];
  dealCompetency: string;
  dealAction: string;
  dealMethod: string;
  dealText: string;
  dealCheck: boolean[];
  draft: string;
  finalCheck: boolean[];
}

interface SelfPersuasionData {
  userName: string;
  declare: boolean[];
  basic: {
    company: string;
    role: string;
    q: string[];
    deadline: string;
    link: string;
  };
  needs: {
    why1: string;
    why2: string;
    why3: string;
    why4: string;
    before: string;
    after: string;
    problem: string;
    change: string;
  };
  comp: {
    selected: string[];
    direction: string;
  };
  items: QuestionItem[];
}

const STORAGE_KEY = "selfPersuasionBook_v2";

const createDefaultData = (): SelfPersuasionData => ({
  userName: '',
  declare: [false, false, false, false, false, false],
  basic: {
    company: '',
    role: '',
    q: ['', '', '', ''],
    deadline: '',
    link: ''
  },
  needs: {
    why1: '',
    why2: '',
    why3: '',
    why4: '',
    before: '',
    after: '',
    problem: '',
    change: ''
  },
  comp: {
    selected: [],
    direction: ''
  },
  items: [0, 1, 2, 3].map(() => ({
    intent: '',
    direct: '',
    directCheck: [false, false, false, false, false],
    keyword: '',
    original: '',
    twist: '',
    subtitle: '',
    subtitleCheck: [false, false],
    s: '',
    t: '',
    a: '',
    r: '',
    starCheck: [false, false, false],
    dealCompetency: '',
    dealAction: '',
    dealMethod: '',
    dealText: '',
    dealCheck: [false],
    draft: '',
    finalCheck: [false, false, false, false, false]
  }))
});

type TabType = 'usage' | 'declare' | 'info' | 'needs' | 'comp' | 'work' | 'assemble';

export const SelfPersuasionBook: React.FC = () => {
  const [data, setData] = useState<SelfPersuasionData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...createDefaultData(), ...parsed };
      }
    } catch (e) {
      console.error('Failed to load self persuasion book state', e);
    }
    return createDefaultData();
  });

  const [activeTab, setActiveTab] = useState<TabType>('usage');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Auto-save to localStorage
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save', e);
      }
      setIsSaving(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleResetAll = () => {
    if (window.confirm("모든 작성 내용을 초기화하시겠습니까? (복구할 수 없습니다)")) {
      const reset = createDefaultData();
      setData(reset);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentQIndex(0);
      showToast("모든 데이터가 초기화되었습니다.");
    }
  };

  // Progress Calculation
  const calculateProgress = (): number => {
    let total = 0;
    let filled = 0;

    const check = (val: string) => {
      total++;
      if (val && val.trim() !== '') filled++;
    };

    check(data.basic.company);
    check(data.basic.role);
    data.basic.q.forEach(check);

    const needsKeys: (keyof typeof data.needs)[] = ['why1', 'why2', 'why3', 'why4', 'before', 'after', 'problem', 'change'];
    needsKeys.forEach((k) => check(data.needs[k]));

    total++;
    if (data.comp.selected.length === 2) filled++;
    check(data.comp.direction);

    data.items.forEach((it) => {
      const itemKeys: (keyof QuestionItem)[] = ['intent', 'direct', 'keyword', 'subtitle', 's', 't', 'a', 'r', 'dealText'];
      itemKeys.forEach((k) => {
        if (typeof it[k] === 'string') check(it[k] as string);
      });
    });

    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  const progressPct = calculateProgress();

  // Helper Deal Sentence
  const buildDealSentence = (it: QuestionItem, company: string) => {
    if (!it.dealCompetency && !it.dealAction && !it.dealMethod) return '';
    return `STAR+ 해당 경험을 기반으로 얻은 ${it.dealCompetency || 'OO'} 역량을 바탕으로 ${company || 'OO'}에 일원으로서 ${it.dealAction || '[액션]'}을(를) ${it.dealMethod || '[방식/도구]'}로 실행해 반드시 기여하겠습니다.`;
  };

  // Helper Draft Builder
  const buildDraftText = (it: QuestionItem) => {
    const parts: string[] = [];
    if (it.subtitle) parts.push(`【 ${it.subtitle} 】`);
    if (it.direct) parts.push(it.direct);

    const star = [it.s, it.t, it.a, it.r].filter(Boolean);
    if (star.length > 0) parts.push(star.join(' '));

    if (it.dealText) parts.push(it.dealText);

    const deal = buildDealSentence(it, data.basic.company);
    if (deal) parts.push(deal);

    return parts.join('\n\n');
  };

  // Toggle Competencies
  const toggleCompetency = (name: string) => {
    const isSelected = data.comp.selected.includes(name);
    if (!isSelected) {
      if (data.comp.selected.length >= 2) {
        showToast("역량은 최대 2개까지 선택 가능합니다.");
        return;
      }
      const nextSelected = [...data.comp.selected, name];
      let nextDir = data.comp.direction;
      if (!nextDir.trim() && nextSelected.length === 2) {
        nextDir = `${nextSelected[0]}을(를) 기반으로 ${nextSelected[1]}을(를) 확보한 사람`;
      }
      setData({
        ...data,
        comp: { ...data.comp, selected: nextSelected, direction: nextDir }
      });
    } else {
      setData({
        ...data,
        comp: { ...data.comp, selected: data.comp.selected.filter(n => n !== name) }
      });
    }
  };

  // Regeneration of Draft
  const handleRegenDraft = (index: number) => {
    const target = data.items[index];
    const newDraft = buildDraftText(target);
    const updatedItems = [...data.items];
    updatedItems[index] = { ...target, draft: newDraft };
    setData({ ...data, items: updatedItems });
    showToast(`문항 ${index + 1} 초안이 새로 구성되었습니다.`);
  };

  // Copy Draft
  const handleCopyDraft = (text: string) => {
    if (!text) {
      showToast("복사할 내용이 없습니다.");
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showToast("클립보드에 복사되었습니다!");
    });
  };

  // Export TXT
  const handleExportTxt = () => {
    let out = `[자기설득서 Building-Up Book] ${data.userName ? `${data.userName}님 / ` : ''}${data.basic.company || ''} ${data.basic.role || ''}\n`;
    out += `==================================================\n`;
    out += `■ Real Needs: 이 회사는 ${data.needs.problem || '[문제/상황]'} 때문에, 이번 채용을 통해 ${data.needs.change || '[변화]'}를 만들어 낼 수 있는 사람을 원한다.\n`;
    out += `■ 목표(포지셔닝): 나는 ${data.comp.direction || '[빈칸]'}으로 인사 담당자의 머릿속에 인식될 것이다.\n`;
    out += `==================================================\n\n`;

    data.items.forEach((it, i) => {
      const q = data.basic.q[i];
      if (!q && !it.draft && !it.direct && !it.s) return;
      out += `▶ 문항 ${i + 1}. ${q || '자소서 질문'}\n`;
      out += `--------------------------------------------------\n`;
      out += `${it.draft || buildDraftText(it)}\n\n`;
    });

    const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `자기설득서_${data.basic.company || '빌딩업'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("파일(.txt)로 내보내기가 완료되었습니다.");
  };

  const currentItem = data.items[currentQIndex];

  return (
    <div className="bg-[#09090B] text-zinc-100 min-h-screen rounded-3xl border border-[#27272A] overflow-hidden shadow-2xl my-4">
      {/* Toast Popup */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-6 py-3 rounded-full text-xs font-bold border border-[#FFD600]/40 shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#FFD600]" />
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#18181C] via-[#1f1f26] to-[#18181C] border-b border-[#27272A] p-4 sm:p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#FFD600]/20 text-[#FFD600] border border-[#FFD600]/40 text-[11px] font-black rounded-md">
                WORKBOOK
              </span>
              <h1 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                📘 자기설득서 Building-Up Book
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="이름을 입력하세요"
                value={data.userName}
                onChange={(e) => setData({ ...data, userName: e.target.value })}
                className="bg-[#27272A]/60 border border-[#3F3F46] focus:border-[#FFD600] text-white px-3 py-1 rounded-lg text-xs w-36 outline-none transition"
              />
              <span className="text-xs text-zinc-400 font-medium">
                님의 리포지셔닝 전략 노트
              </span>
            </div>
          </div>

          {/* Right Controls & Progress */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#27272A]">
            <div className="flex items-center gap-3">
              <div className="w-28 sm:w-36 h-2.5 bg-[#27272A] rounded-full overflow-hidden border border-[#3F3F46]">
                <div
                  className="h-full bg-[#FFD600] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-black text-[#FFD600] min-w-[36px]">
                {progressPct}%
              </span>
            </div>

            <span className="text-[11px] text-zinc-400 font-bold flex items-center gap-1">
              {isSaving ? (
                <RefreshCw className="w-3 h-3 animate-spin text-[#FFD600]" />
              ) : (
                <Check className="w-3 h-3 text-emerald-400" />
              )}
              {isSaving ? '저장 중...' : '자동 저장됨'}
            </span>

            <button
              onClick={handleResetAll}
              className="px-3 py-1.5 bg-[#27272A] hover:bg-[#323238] border border-[#3F3F46] text-zinc-300 text-xs font-bold rounded-lg transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-red-400" />
              전체 초기화
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#121216] border-b border-[#27272A] overflow-x-auto scrollbar-none sticky top-[73px] sm:top-[85px] z-30">
        <div className="max-w-6xl mx-auto flex px-4">
          {[
            { id: 'usage', label: '사용법' },
            { id: 'declare', label: '0. 선언문' },
            { id: 'info', label: '0. 정보입력' },
            { id: 'needs', label: '1. Real Needs' },
            { id: 'comp', label: '2. 역량선택' },
            { id: 'work', label: '3~6. 문항 작업장' },
            { id: 'assemble', label: '🧩 Assemble' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-3.5 text-xs font-black whitespace-nowrap border-b-2 transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-[#FFD600] text-[#FFD600] bg-[#18181C]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#18181C]/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* TAB 1: 사용법 */}
        {activeTab === 'usage' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FFD600]" />
                사용법 가이드
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                이 도구는 자기소개서를 단순 "감정 호소"나 "경험 일기"가 아닌, <strong>기업의 진짜 니즈(Real Needs) 분석 → 논리적 설득</strong>으로 완성시키는 리포지셔닝 워크북입니다.
              </p>

              <ol className="space-y-3 text-xs sm:text-sm text-zinc-300 pt-2">
                {[
                  "0. 선언문에서 리포지셔너 마인드셋을 체크한다.",
                  "0. 정보입력에서 지원 회사·직무·자소서 문항 원문을 붙여넣는다.",
                  "1. Real Needs에서 5WHY로 기업이 이 사람을 뽑는 진짜 이유를 파고든다.",
                  "2. 역량선택에서 내 역량을 2개 키워드로 고정한다.",
                  "3~6. 문항 작업장에서 문항별로 소제목 → 직독직답 → STAR → 거래의 기술 순으로 작성한다.",
                  "🧩 Assemble에서 문항별로 모든 내용이 자동 종합된 것을 확인하고, 매끄러운 최종 문장으로 다듬은 뒤 최종 점검한다."
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-[#18181C] p-3.5 rounded-xl border border-[#27272A]">
                    <span className="w-5 h-5 rounded-full bg-[#FFD600]/20 text-[#FFD600] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
                <strong className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-4 h-4" /> 핵심 원칙
                </strong>
                <p>
                  모든 문항의 답은 <strong>"니즈(회사가 원하는 것) + 역량(내가 줄 수 있는 것)"</strong>이 한 문장 안에 함께 작성되어야 강력한 설득력을 갖게 됩니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 0. 선언문 */}
        {activeTab === 'declare' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#FFD600]" />
                  [중요] 멘탈 리셋, 리포지셔너 선언문
                </h2>
                <span className="text-xs text-zinc-400 font-bold">
                  {data.declare.filter(Boolean).length} / {DECLARATIONS.length} 완료
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                작성을 시작하기 전, 아래 문장을 소리 내어 읽고 하나씩 동의 체크하세요.
              </p>

              <div className="space-y-3 pt-2">
                {DECLARATIONS.map((text, idx) => (
                  <label
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-xl border transition cursor-pointer ${
                      data.declare[idx]
                        ? 'bg-[#FFD600]/10 border-[#FFD600]/40 text-white'
                        : 'bg-[#18181C] border-[#27272A] text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={data.declare[idx]}
                      onChange={(e) => {
                        const next = [...data.declare];
                        next[idx] = e.target.checked;
                        setData({ ...data, declare: next });
                      }}
                      className="mt-1 w-4 h-4 accent-[#FFD600] rounded cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                      {text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 0. 정보입력 */}
        {activeTab === 'info' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FFD600]" />
                0. 지원 기업 및 자소서 문항 입력
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">지원 회사</label>
                  <input
                    type="text"
                    placeholder="예: 토스, 카카오, 현대자동차"
                    value={data.basic.company}
                    onChange={(e) => setData({ ...data, basic: { ...data.basic, company: e.target.value } })}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">지원 직무</label>
                  <input
                    type="text"
                    placeholder="예: 서비스 기획자, 마케터, 영업관리"
                    value={data.basic.role}
                    onChange={(e) => setData({ ...data, basic: { ...data.basic, role: e.target.value } })}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none"
                  />
                </div>
              </div>

              {[0, 1, 2, 3].map((qIdx) => (
                <div key={qIdx}>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    자소서 질문 문항 {qIdx + 1}
                  </label>
                  <textarea
                    placeholder={`자소서 질문 ${qIdx + 1}번을 입력하세요 (예: 지원동기 및 직무를 수행하기 위해 본인이 기울인 노력에 대해...)`}
                    value={data.basic.q[qIdx]}
                    onChange={(e) => {
                      const nextQ = [...data.basic.q];
                      nextQ[qIdx] = e.target.value;
                      setData({ ...data, basic: { ...data.basic, q: nextQ } });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none resize-y h-20"
                  />
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">서류 마감일</label>
                  <input
                    type="date"
                    value={data.basic.deadline}
                    onChange={(e) => setData({ ...data, basic: { ...data.basic, deadline: e.target.value } })}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">채용 공고 링크</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={data.basic.link}
                    onChange={(e) => setData({ ...data, basic: { ...data.basic, link: e.target.value } })}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 1. Real Needs */}
        {activeTab === 'needs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#FFD600]" />
                  1. 5WHY 기반 기업의 Real Needs 분석
                </h2>
                <span className="px-2.5 py-1 bg-[#FFD600]/10 text-[#FFD600] text-[11px] font-bold rounded-lg border border-[#FFD600]/30">
                  채용의 진짜 이유 파악
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                "왜 이 직무를 뽑는가"를 5단계로 파고들어 표면적 채용 사유가 아닌 기업의 진짜 페인포인트를 도출합니다.
              </p>

              {/* WHY 1 */}
              <div className="p-4 bg-[#18181C] border-l-4 border-l-[#FFD600] border border-[#27272A] rounded-r-xl space-y-2">
                <strong className="text-xs font-black text-white block">
                  Why 1. 회사가 이 직무를 뽑는 진짜 이유는?
                </strong>
                <span className="text-[11px] text-zinc-400 block italic">
                  "이 자리가 비어 있으면 가장 먼저 터지는 문제는?", "이 직무가 중요한 이유는?"
                </span>
                <textarea
                  placeholder="답을 입력하세요"
                  value={data.needs.why1}
                  onChange={(e) => setData({ ...data, needs: { ...data.needs, why1: e.target.value } })}
                  className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                />
              </div>

              {/* WHY 2 */}
              <div className="p-4 bg-[#18181C] border-l-4 border-l-[#FFD600] border border-[#27272A] rounded-r-xl space-y-2">
                <strong className="text-xs font-black text-white block">
                  Why 2. 그 이유가 하필 지금 '더' 중요한 이유는?
                </strong>
                <span className="text-[11px] text-zinc-400 block italic">
                  "왜 하필 지금 뽑나? (신규 사업, 조직 개편, 지표 하락, 경쟁 과열, 정책 변화 등)"
                </span>
                <textarea
                  placeholder="답을 입력하세요"
                  value={data.needs.why2}
                  onChange={(e) => setData({ ...data, needs: { ...data.needs, why2: e.target.value } })}
                  className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                />
              </div>

              {/* WHY 3 */}
              <div className="p-4 bg-[#18181C] border-l-4 border-l-[#FFD600] border border-[#27272A] rounded-r-xl space-y-2">
                <strong className="text-xs font-black text-white block">
                  Why 3. 그게 해결되지 않으면 회사가 잃게 되는 것은?
                </strong>
                <span className="text-[11px] text-zinc-400 block italic">
                  "그 문제는 매출, 시간, 리스크, 유저 이탈 중 무엇을 손실시키나?"
                </span>
                <textarea
                  placeholder="답을 입력하세요"
                  value={data.needs.why3}
                  onChange={(e) => setData({ ...data, needs: { ...data.needs, why3: e.target.value } })}
                  className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                />
              </div>

              {/* WHY 4 */}
              <div className="p-4 bg-[#18181C] border-l-4 border-l-[#FFD600] border border-[#27272A] rounded-r-xl space-y-2">
                <strong className="text-xs font-black text-white block">
                  Why 4. 그 손실이 실제로 터지는 업무 장면/지표/프로세스는?
                </strong>
                <span className="text-[11px] text-zinc-400 block italic">
                  "손실이 발생하는 구체적 장면 1개 (회의, 보고서, 마케팅 집행, 운영 CS 등)"
                </span>
                <textarea
                  placeholder="답을 입력하세요"
                  value={data.needs.why4}
                  onChange={(e) => setData({ ...data, needs: { ...data.needs, why4: e.target.value } })}
                  className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                />
              </div>

              {/* WHY 5 */}
              <div className="p-4 bg-[#18181C] border-l-4 border-l-[#FFD600] border border-[#27272A] rounded-r-xl space-y-3">
                <strong className="text-xs font-black text-white block">
                  Why 5. 그래서 회사가 이번 채용을 통해 진짜로 원하는 '변화'는?
                </strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Before (현재의 한계/문제 상태)</label>
                    <textarea
                      placeholder="예: 응대 지연과 비표준화된 CS 프로세스"
                      value={data.needs.before}
                      onChange={(e) => setData({ ...data, needs: { ...data.needs, before: e.target.value } })}
                      className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-2.5 rounded-xl outline-none h-16"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">After (채용을 통해 원하는 변화)</label>
                    <textarea
                      placeholder="예: 응대 프로세스 표준화 및 유저 만족도 끌어올림"
                      value={data.needs.after}
                      onChange={(e) => setData({ ...data, needs: { ...data.needs, after: e.target.value } })}
                      className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-2.5 rounded-xl outline-none h-16"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">최종 Real Needs 1문장 요약</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">문제 / 상황 (빈칸 1)</label>
                  <textarea
                    placeholder="예: 신규 채널 확장으로 CS 문의량이 급증하는"
                    value={data.needs.problem}
                    onChange={(e) => setData({ ...data, needs: { ...data.needs, problem: e.target.value } })}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-2.5 rounded-xl outline-none h-16"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">만들어낼 변화 (빈칸 2)</label>
                  <textarea
                    placeholder="예: 응대 프로세스를 표준화하고 효율을 끌어올릴 수 있는"
                    value={data.needs.change}
                    onChange={(e) => setData({ ...data, needs: { ...data.needs, change: e.target.value } })}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-2.5 rounded-xl outline-none h-16"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-xl text-xs text-zinc-200 leading-relaxed font-medium">
                이 회사는 <strong className="text-[#FFD600]">{data.needs.problem || '[문제/상황]'}</strong> 때문에, 이번 채용을 통해 <strong className="text-[#FFD600]">{data.needs.change || '[변화]'}</strong>를 만들어 낼 수 있는 사람을 원한다.
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 2. 역량선택 */}
        {activeTab === 'comp' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#FFD600]" />
                    2. 나만의 차별화 역량 2개 선택
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    단일 역량으로는 경쟁력이 부족합니다. 반드시 2개를 조합해 "나만의 독보적인 역량"으로 만드세요.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400 font-bold block">선택 수</span>
                  <span className="text-lg font-black text-[#FFD600]">
                    {data.comp.selected.length} / 2
                  </span>
                </div>
              </div>

              {/* Competency Groups */}
              <div className="space-y-6">
                {COMPETENCIES.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <h3 className="text-xs font-bold text-[#FFD600] tracking-wide border-b border-[#27272A] pb-2">
                      {group.cat}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {group.items.map(([name, desc], iIdx) => {
                        const isSelected = data.comp.selected.includes(name);
                        return (
                          <div
                            key={iIdx}
                            onClick={() => toggleCompetency(name)}
                            className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-2.5 ${
                              isSelected
                                ? 'bg-[#FFD600]/15 border-[#FFD600]/50 text-white shadow-md'
                                : 'bg-[#18181C] border-[#27272A] text-zinc-300 hover:border-zinc-500'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by parent div
                              className="mt-0.5 accent-[#FFD600] rounded"
                            />
                            <div>
                              <strong className="text-xs font-bold block text-white">{name}</strong>
                              <span className="text-[11px] text-zinc-400 leading-tight block mt-0.5">
                                {desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Direction */}
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white">최종 전략 방향성 수립</h3>
              <p className="text-xs text-zinc-400">
                예시: "나는 [목표의식을 기반으로 추진력을 확보한 사람]으로 인사 담당자의 머릿속에 인식될 것이다."
              </p>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">전략 방향성 문장</label>
                <textarea
                  placeholder="나는 [빈칸 작성]으로 인사 담당자의 머릿속에 인식될 것이다."
                  value={data.comp.direction}
                  onChange={(e) => setData({ ...data, comp: { ...data.comp, direction: e.target.value } })}
                  className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-20"
                />
              </div>

              <div className="p-4 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-xl text-xs text-zinc-200">
                나는 <strong className="text-[#FFD600]">{data.comp.direction || '[빈칸 작성]'}</strong>으로 인사 담당자의 머릿속에 인식될 것이다.
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: 3~6. 문항 작업장 */}
        {activeTab === 'work' && (
          <div className="space-y-6 animate-fade-in">
            {/* Question Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#27272A] pb-3">
              {[0, 1, 2, 3].map((qIdx) => {
                const qText = data.basic.q[qIdx];
                const isFilled = currentItem.direct || currentItem.subtitle || currentItem.s;
                return (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentQIndex(qIdx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      currentQIndex === qIdx
                        ? 'bg-[#FFD600] text-[#09090B] font-black'
                        : isFilled
                        ? 'bg-[#18181C] text-[#FFD600] border border-[#FFD600]/30'
                        : 'bg-[#18181C] text-zinc-400 border border-[#27272A]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    문항 {qIdx + 1}
                    {qText && <span className="text-[10px] opacity-75 max-w-[100px] truncate">({qText})</span>}
                  </button>
                );
              })}
            </div>

            {/* Current Question Text Banner */}
            <div className="p-5 bg-[#18181C] border border-[#27272A] rounded-2xl space-y-1">
              <span className="text-[11px] font-bold text-[#FFD600] block uppercase">
                QUESTION {currentQIndex + 1}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {data.basic.q[currentQIndex] || '미입력 (0. 정보입력 탭에서 자소서 질문 문항을 넣어주세요)'}
              </p>
            </div>

            {/* Step 3: 직독직답 */}
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFD600] text-[#09090B] font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="text-base font-bold text-white">직독직답 (주장 설계)</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">질문 의도 파악</label>
                <span className="text-[11px] text-zinc-400 block mb-1.5">
                  이 질문을 한 이유에 대해 Why 법칙을 사용해 의도를 파악해보세요.
                </span>
                <textarea
                  placeholder="예: 과거 실패 경험을 통해 의사결정 방식이 어떻게 개선되었는지 확인하려는 목적"
                  value={currentItem.intent}
                  onChange={(e) => {
                    const nextItems = [...data.items];
                    nextItems[currentQIndex].intent = e.target.value;
                    setData({ ...data, items: nextItems });
                  }}
                  className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">직독직답 (주장)</label>
                <span className="text-[11px] text-zinc-400 block mb-1.5">
                  질문 의도를 고려하여 문항에 대한 답(주장)을 첫 문장에 바로 제시하세요.
                </span>
                <textarea
                  placeholder="예: 고객 이탈의 근본 원인을 데이터로 재정의하여 전환율을 34% 끌어올린 기획자입니다."
                  value={currentItem.direct}
                  onChange={(e) => {
                    const nextItems = [...data.items];
                    nextItems[currentQIndex].direct = e.target.value;
                    setData({ ...data, items: nextItems });
                  }}
                  className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-20"
                />
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#27272A]">
                <label className="block text-xs font-bold text-zinc-400">직독직답 자가체크</label>
                {DIRECT_CHECK.map((chk, i) => (
                  <label key={i} className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentItem.directCheck[i]}
                      onChange={(e) => {
                        const nextItems = [...data.items];
                        const nextCheck = [...nextItems[currentQIndex].directCheck];
                        nextCheck[i] = e.target.checked;
                        nextItems[currentQIndex].directCheck = nextCheck;
                        setData({ ...data, items: nextItems });
                      }}
                      className="accent-[#FFD600] rounded"
                    />
                    <span>{chk}</span>
                  </label>
                ))}
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-300 leading-relaxed space-y-1">
                <strong>💊 즉시 처방 (체크 실패 시)</strong>
                <p>
                  니즈가 없다 → 최종 니즈 문장을 첫 문장에 바로 삽입<br />
                  행동이 없다 → "해결했다 / 개선했다 / 설계했다 / 전환했다" 동사로 문장 재작성<br />
                  결과가 없다 → 정확한 수치가 없더라도 전/후 변화라도 명시
                </p>
              </div>
            </div>

            {/* Step 4: 소제목 작성 */}
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFD600] text-[#09090B] font-black text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="text-base font-bold text-white">소제목 작성 (임팩트 헤드라인)</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">핵심역량 키워드</label>
                  <input
                    type="text"
                    placeholder="예: 데이터 기반 문제재정의"
                    value={currentItem.keyword}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].keyword = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">통념 / 속담 / 원문</label>
                  <input
                    type="text"
                    placeholder="예: 열 번 찍어 안 넘어가는 나무 없다"
                    value={currentItem.original}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].original = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">비틀기 (대조효과 적용)</label>
                <textarea
                  placeholder="예: 열 번 무작정 찍는 대신 나무의 결을 분석하는 전략적 접근"
                  value={currentItem.twist}
                  onChange={(e) => {
                    const nextItems = [...data.items];
                    nextItems[currentQIndex].twist = e.target.value;
                    setData({ ...data, items: nextItems });
                  }}
                  className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">최종 소제목</label>
                <input
                  type="text"
                  placeholder="예: [나무의 결을 읽는 기획자] 무작정 도끼질 대신 이탈 패턴을 해독하다"
                  value={currentItem.subtitle}
                  onChange={(e) => {
                    const nextItems = [...data.items];
                    nextItems[currentQIndex].subtitle = e.target.value;
                    setData({ ...data, items: nextItems });
                  }}
                  className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none font-bold text-[#FFD600]"
                />
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#27272A]">
                <label className="block text-xs font-bold text-zinc-400">소제목 검증 질문</label>
                {SUBTITLE_CHECK.map((chk, i) => (
                  <label key={i} className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentItem.subtitleCheck[i]}
                      onChange={(e) => {
                        const nextItems = [...data.items];
                        const nextCheck = [...nextItems[currentQIndex].subtitleCheck];
                        nextCheck[i] = e.target.checked;
                        nextItems[currentQIndex].subtitleCheck = nextCheck;
                        setData({ ...data, items: nextItems });
                      }}
                      className="accent-[#FFD600] rounded"
                    />
                    <span>{chk}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 5: ONE THING + STAR */}
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFD600] text-[#09090B] font-black text-xs flex items-center justify-center">
                  5
                </span>
                <h3 className="text-base font-bold text-white">ONE THING + STAR (근거 작성)</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">S (Situation - 상황)</label>
                  <textarea
                    placeholder="당시 직면했던 상황 및 배경"
                    value={currentItem.s}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].s = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">T (Task - 해결 과제)</label>
                  <textarea
                    placeholder="해결해야 했던 핵심 문제 및 목표 지표"
                    value={currentItem.t}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].t = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">A (Action - 나의 행동과 개입)</label>
                  <textarea
                    placeholder="남들과 달랐던 나의 구체적 주도적 행동과 해결 방식"
                    value={currentItem.a}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].a = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">R (Result - 검증된 성과)</label>
                  <textarea
                    placeholder="수치 및 구체적 전/후 정량·정성 성과"
                    value={currentItem.r}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].r = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#27272A]">
                <label className="block text-xs font-bold text-zinc-400">STAR 자가체크</label>
                {STAR_CHECK.map((chk, i) => (
                  <label key={i} className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentItem.starCheck[i]}
                      onChange={(e) => {
                        const nextItems = [...data.items];
                        const nextCheck = [...nextItems[currentQIndex].starCheck];
                        nextCheck[i] = e.target.checked;
                        nextItems[currentQIndex].starCheck = nextCheck;
                        setData({ ...data, items: nextItems });
                      }}
                      className="accent-[#FFD600] rounded"
                    />
                    <span>{chk}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 6: 거래의 기술 */}
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FFD600] text-[#09090B] font-black text-xs flex items-center justify-center">
                  6
                </span>
                <h3 className="text-base font-bold text-white">거래의 기술 (입사 후 기여 제안)</h3>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                마지막 약속 문장 formula: "STAR 경험으로 얻은 <strong>[역량]</strong>을 바탕으로 <strong>{data.basic.company || '기업명'}</strong>에 <strong>[액션]</strong>을 <strong>[방식/도구]</strong>로 실행해 기여하겠습니다."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">얻은 역량</label>
                  <input
                    type="text"
                    placeholder="예: 문제 재정의 역량"
                    value={currentItem.dealCompetency}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].dealCompetency = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">실행 액션</label>
                  <input
                    type="text"
                    placeholder="예: 신규 유저 온보딩 설계"
                    value={currentItem.dealAction}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].dealAction = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">방식 / 도구</label>
                  <input
                    type="text"
                    placeholder="예: 데이터 이탈지점 추적 툴"
                    value={currentItem.dealMethod}
                    onChange={(e) => {
                      const nextItems = [...data.items];
                      nextItems[currentQIndex].dealMethod = e.target.value;
                      setData({ ...data, items: nextItems });
                    }}
                    className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">거래의 기술 (최종 기여 제안 문장)</label>
                <textarea
                  placeholder="구체적 기여 의지 및 오퍼 제안 문장"
                  value={currentItem.dealText}
                  onChange={(e) => {
                    const nextItems = [...data.items];
                    nextItems[currentQIndex].dealText = e.target.value;
                    setData({ ...data, items: nextItems });
                  }}
                  className="w-full bg-[#18181C] border border-[#27272A] focus:border-[#FFD600] text-white text-xs p-3 rounded-xl outline-none h-16"
                />
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#27272A]">
                <label className="block text-xs font-bold text-zinc-400">거래의 기술 검증 질문</label>
                {DEAL_CHECK.map((chk, i) => (
                  <label key={i} className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentItem.dealCheck[i]}
                      onChange={(e) => {
                        const nextItems = [...data.items];
                        const nextCheck = [...nextItems[currentQIndex].dealCheck];
                        nextCheck[i] = e.target.checked;
                        nextItems[currentQIndex].dealCheck = nextCheck;
                        setData({ ...data, items: nextItems });
                      }}
                      className="accent-[#FFD600] rounded"
                    />
                    <span>{chk}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: 🧩 Assemble */}
        {activeTab === 'assemble' && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFD600]" />
                🧩 자기설득서 종합 및 최종 검증
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Building-Up Book에 입력한 내용이 자동으로 조합되었습니다. 매끄럽게 문장을 다듬고 최종 점검 체크리스트를 완료한 후 파일(.txt)로 내보내세요.
              </p>

              {/* Common Strategy Summary Card */}
              <div className="p-4 bg-[#18181C] border border-[#27272A] rounded-xl space-y-3 text-xs">
                <strong className="text-[#FFD600] font-bold block">■ 공통 전략 요약</strong>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Real Needs</span>
                  <p className="text-white font-medium">
                    이 회사는 <span className="text-[#FFD600]">{data.needs.problem || '[문제/상황]'}</span> 때문에, 이번 채용을 통해 <span className="text-[#FFD600]">{data.needs.change || '[변화]'}</span>를 만들어 낼 수 있는 사람을 원한다.
                  </p>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">목표 (포지셔닝)</span>
                  <p className="text-white font-medium">
                    나는 <span className="text-[#FFD600]">{data.comp.direction || '[전략 방향성]'}</span>으로 인사 담당자의 머릿속에 인식될 것이다.
                  </p>
                </div>
              </div>
            </div>

            {/* Assembled Question Cards */}
            {data.items.map((it, qIdx) => {
              const qTitle = data.basic.q[qIdx];
              const autoDraft = buildDraftText(it);
              const currentDraftValue = it.draft !== '' ? it.draft : autoDraft;

              return (
                <div key={qIdx} className="p-6 bg-[#121216] border border-[#27272A] rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-[#FFD600] text-[#09090B] rounded-md text-xs">
                        문항 {qIdx + 1}
                      </span>
                      {qTitle || '질문 미입력'}
                    </h3>
                  </div>

                  {/* Summary Breakdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-[#18181C] border border-[#27272A] rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-[#FFD600]">주장 (소제목 / 직독직답)</span>
                      <p className="font-bold text-white">{it.subtitle || '소제목 미입력'}</p>
                      <p className="text-zinc-300 text-[11px]">{it.direct || '직독직답 미입력'}</p>
                    </div>

                    <div className="p-3 bg-[#18181C] border border-[#27272A] rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-[#FFD600]">근거 (STAR)</span>
                      <p className="text-zinc-300 text-[11px]">
                        {[it.s ? `S: ${it.s}` : '', it.t ? `T: ${it.t}` : '', it.a ? `A: ${it.a}` : '', it.r ? `R: ${it.r}` : ''].filter(Boolean).join(' / ') || 'STAR 미입력'}
                      </p>
                    </div>

                    <div className="p-3 bg-[#18181C] border border-[#27272A] rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-[#FFD600]">어필 (거래의 기술)</span>
                      <p className="text-zinc-300 text-[11px]">{it.dealText || '기여 제안 미입력'}</p>
                    </div>
                  </div>

                  {/* Editable Final Draft Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FFD600]" />
                        최종 자기설득서 문장 다듬기
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenDraft(qIdx)}
                          className="px-2.5 py-1 bg-[#27272A] hover:bg-[#323238] text-zinc-300 text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3 text-[#FFD600]" />
                          초안 재생성
                        </button>
                        <button
                          onClick={() => handleCopyDraft(currentDraftValue)}
                          className="px-2.5 py-1 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] text-[11px] font-black rounded-lg transition flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          복사하기
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={currentDraftValue}
                      onChange={(e) => {
                        const nextItems = [...data.items];
                        nextItems[qIdx].draft = e.target.value;
                        setData({ ...data, items: nextItems });
                      }}
                      className="w-full bg-[#09090B] border border-[#27272A] focus:border-[#FFD600] text-zinc-100 text-xs sm:text-sm p-4 rounded-xl outline-none leading-relaxed h-44 resize-y"
                    />
                  </div>

                  {/* Final Checklist */}
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-emerald-400 block">최종 점검 체크리스트</span>
                    <div className="space-y-1.5">
                      {FINAL_CHECK.map((chk, fIdx) => (
                        <label key={fIdx} className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={it.finalCheck[fIdx]}
                            onChange={(e) => {
                              const nextItems = [...data.items];
                              const nextFinal = [...nextItems[qIdx].finalCheck];
                              nextFinal[fIdx] = e.target.checked;
                              nextItems[qIdx].finalCheck = nextFinal;
                              setData({ ...data, items: nextItems });
                            }}
                            className="accent-emerald-400 rounded"
                          />
                          <span>{chk}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Export Action Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleExportTxt}
                className="px-8 py-4 bg-[#FFD600] hover:bg-[#ffe033] text-[#09090B] font-black text-xs sm:text-sm rounded-xl transition shadow-xl inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                전체 자기설득서 내보내기 (.txt 다운로드)
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
