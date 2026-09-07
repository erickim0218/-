import React, { useState } from 'react';
import {
  Star,
  Quote,
  Search,
  ThumbsUp,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  PenLine,
  Send,
  Check,
  X
} from 'lucide-react';
import { BootcampReview } from '../data/bootcampReviews';

interface BootcampReviewsSectionProps {
  reviews?: BootcampReview[];
  onAddReview?: (review: BootcampReview) => void;
}

export const BootcampReviewsSection: React.FC<BootcampReviewsSectionProps> = ({
  reviews: externalReviews,
  onAddReview
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  // Review Form Modal State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newRating, setNewRating] = useState<number>(5);
  const [newHighlightTag, setNewHighlightTag] = useState('🏆 수강생 인증 후기');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Fallback if not passed
  const allReviews = externalReviews || [];

  const toggleExpand = (id: string) => {
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredReviews = allReviews.filter((rev) => {
    const matchesSearch =
      rev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag ? rev.highlightTag?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const tags = [
    '종합대행사',
    '서류통과율',
    '연봉',
    '1:1 피드백',
    '경력직',
    '75% 합격률'
  ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('제목과 후기 내용을 입력해주세요.');
      return;
    }

    const created: BootcampReview = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim() ? `${newAuthor.slice(0, 3)}****` : '수강생***',
      date: new Date().toISOString().slice(0, 10),
      rating: newRating,
      title: newTitle.trim(),
      content: newContent.trim(),
      highlightTag: newHighlightTag
    };

    if (onAddReview) {
      onAddReview(created);
    }

    setIsSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsWriteModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewAuthor('');
    }, 1200);
  };

  return (
    <div id="bootcamp-reviews" className="w-full py-8 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* 리뷰 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>수강생 생생 리얼 스토리</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-900">
            수강생 생생 리얼 후기
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600">
            실제 부트캠프 수강생들이 입증하는 서류 합격률 70% 반전과 연봉 상승의 기록들입니다.
          </p>

          {/* 평균 평점 요약 바 & 후기 작성 버튼 */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[#FFB800] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FFB800]" />
                  ))}
                </div>
                <span className="text-xl font-black text-zinc-900">4.9 / 5.0</span>
                <span className="text-xs text-zinc-500">평균 수강 만족도</span>
              </div>
              <div className="h-10 w-px bg-zinc-200" />
              <div className="flex flex-col items-baseline text-left">
                <span className="text-2xl font-black text-zinc-900">98.6%</span>
                <span className="text-xs text-zinc-600 font-medium">수강생 평점 및 만족도</span>
              </div>
            </div>

            {/* Write Review CTA Button */}
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="px-5 py-3 bg-[#09090B] hover:bg-zinc-800 text-white font-black text-xs rounded-xl transition shadow-lg flex items-center gap-2 transform active:scale-95"
            >
              <PenLine className="w-4 h-4 text-[#FFD600]" />
              <span>부트캠프 수강 후기 작성하기</span>
            </button>
          </div>
        </div>

        {/* 하이라이트 베스트 후기 3선 */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {allReviews.filter((r) => r.highlightTag).slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 relative flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#FFD600] text-zinc-950">
                    {review.highlightTag}
                  </span>
                  <div className="flex items-center text-[#FFB800]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                    ))}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 mb-2 line-clamp-2">
                  "{review.title}"
                </h3>
                <p className="text-xs text-zinc-700 line-clamp-4 leading-relaxed whitespace-pre-line">
                  {review.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-zinc-500">
                <span className="font-mono font-semibold text-zinc-700">{review.author}</span>
                <span>{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 검색 및 태그 필터 바 */}
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 mb-8 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="후기 키워드 검색 (예: 종대사, 연봉, 대치동, 서류통과)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#FFD600]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-500 text-[11px] font-bold mr-1">인기 필터:</span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedTag === null
                  ? 'bg-zinc-900 text-white font-bold'
                  : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
              }`}
            >
              전체 후기 보기
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-zinc-900 text-white font-bold'
                    : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 전 후기 카드 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((review) => {
            const isLong = review.content.length > 180;
            const isExpanded = expandedReviews[review.id];

            return (
              <div
                key={review.id}
                className="p-5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-[#FFB800]">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800]" />
                        ))}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        구매자 인증
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">{review.date}</span>
                  </div>

                  {review.highlightTag && (
                    <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded mb-2 border border-amber-200">
                      {review.highlightTag}
                    </span>
                  )}

                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 mb-2">
                    {review.title}
                  </h4>

                  <div className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line font-normal">
                    {isLong && !isExpanded
                      ? `${review.content.slice(0, 180)}...`
                      : review.content}
                  </div>

                  {isLong && (
                    <button
                      onClick={() => toggleExpand(review.id)}
                      className="text-[11px] font-bold text-amber-700 hover:underline mt-2 inline-block"
                    >
                      {isExpanded ? '접기 ▲' : '후기 전체 읽기 ▼'}
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-mono font-medium text-zinc-600">{review.author}</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <ThumbsUp className="w-3 h-3 text-zinc-400" /> 도움됨
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-sm">
            검색 조건에 맞는 후기가 없습니다. 키워드를 변경해 보세요.
          </div>
        )}

        {/* 후기 작성하기 하단 배너 카드 */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-white border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-900 text-[11px] font-bold">
              부트캠프 수강생 스토리
            </span>
            <h3 className="text-lg sm:text-xl font-black text-zinc-900">
              리포지셔닝으로 서류 합격과 합격의 기쁨을 경험하셨나요?
            </h3>
            <p className="text-xs text-zinc-600">
              여러분의 솔직한 후기가 길을 헤매는 다음 취준생들에게 가장 든든한 등대가 됩니다.
            </p>
          </div>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-6 py-3.5 bg-[#09090B] hover:bg-zinc-800 text-[#FFD600] font-black text-xs sm:text-sm rounded-xl transition shadow-xl shrink-0 flex items-center gap-2"
          >
            <PenLine className="w-4 h-4" />
            <span>나의 생생 후기 작성하기</span>
          </button>
        </div>

      </div>

      {/* 후기 작성 모달 팝업 */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] text-white border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative shadow-2xl">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmittedSuccess ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#FFD600] font-black">부트캠프 리뷰 작성</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">인증 수강생</span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    솔직한 수강 경험을 들려주세요
                  </h3>
                  <p className="text-xs text-zinc-400">
                    작성하신 후기는 부트캠프 하단 후기 목록에 즉시 반영됩니다.
                  </p>
                </div>

                {/* 별점 선택 */}
                <div className="space-y-1 pt-1">
                  <label className="block text-xs font-semibold text-zinc-300">수강 만족도</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 focus:outline-none transition hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating ? 'fill-[#FFD600] text-[#FFD600]' : 'text-zinc-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-amber-300 ml-2">
                      {newRating}.0 / 5.0 점
                    </span>
                  </div>
                </div>

                {/* 작성자 닉네임 */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    작성자 닉네임 (선택)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 김O준 (미입력 시 자동 마스킹 등록)"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181C] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
                  />
                </div>

                {/* 하이라이트 태그 선택 */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    후기 테마 태그
                  </label>
                  <select
                    value={newHighlightTag}
                    onChange={(e) => setNewHighlightTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181C] border border-zinc-800 rounded-xl text-xs text-amber-300 font-bold focus:outline-none focus:border-[#FFD600]"
                  >
                    <option value="🏆 종합대행사 최종합격">🏆 종합대행사 최종합격</option>
                    <option value="📈 서류통과율 수직상승">📈 서류통과율 수직상승</option>
                    <option value="🎯 나다운 자소서 & 사고의 전환">🎯 나다운 자소서 & 사고의 전환</option>
                    <option value="💼 연봉 앞자리 상승">💼 연봉 앞자리 상승</option>
                    <option value="🔥 1:1 디테일 피드백 최고">🔥 1:1 디테일 피드백 최고</option>
                  </select>
                </div>

                {/* 후기 제목 */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    후기 한 줄 제목 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="예: 서류 탈락 10번 하다가 자소서 한 줄 바꾸고 첫 합격했습니다!"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181C] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
                  />
                </div>

                {/* 후기 본문 */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    상세 수강 경험 및 변화 내용 *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="부트캠프 수강 전 겪었던 고민과, J님의 피드백을 통해 경험이 어떻게 재정의되었는지 솔직하게 적어주세요."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#18181C] border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 font-black text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>후기 등록 완료</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">후기 등록이 완료되었습니다!</h3>
                  <p className="text-xs text-zinc-300">
                    작성해주신 후기가 부트캠프 수강생 리스트에 정상 반영되었습니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
