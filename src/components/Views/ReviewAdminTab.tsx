import React, { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, Award, Trash2, MessageSquareQuote, Flag, CheckCircle2, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { UserBootcampReview, BootcampReviewReport, fetchUserReviews, adminUpdateReview, deleteUserReview, fetchReviewReports } from '../../lib/userReviewService';

export const ReviewAdminTab: React.FC = () => {
  const [reviews, setReviews] = useState<UserBootcampReview[]>([]);
  const [reports, setReports] = useState<BootcampReviewReport[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'visible' | 'hidden' | 'featured' | 'reported'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin reply inline editor
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const loadAll = async () => {
    const revs = await fetchUserReviews();
    setReviews(revs);
    try {
      const reps = await fetchReviewReports();
      setReports(reps);
    } catch {
      setReports([]);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const reportedReviewIds = new Set(reports.map(r => r.review_id));

  const filteredReviews = reviews.filter(r => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchAuthor = r.display_name.toLowerCase().includes(q);
      const matchContent = r.content.toLowerCase().includes(q);
      const matchTitle = (r.title || '').toLowerCase().includes(q);
      if (!matchAuthor && !matchContent && !matchTitle) return false;
    }

    if (filterType === 'visible') return r.is_visible;
    if (filterType === 'hidden') return !r.is_visible;
    if (filterType === 'featured') return r.is_featured;
    if (filterType === 'reported') return reportedReviewIds.has(r.id);
    return true;
  });

  const totalCount = reviews.length;
  const visibleCount = reviews.filter(r => r.is_visible).length;
  const hiddenCount = reviews.filter(r => !r.is_visible).length;
  const reportedCount = reportedReviewIds.size;
  const avgRating = totalCount > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1) : '5.0';

  const handleToggleVisible = async (id: string, current: boolean) => {
    await adminUpdateReview(id, { is_visible: !current });
    await loadAll();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await adminUpdateReview(id, { is_featured: !current });
    await loadAll();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('해당 후기를 관리자 권한으로 완전히 삭제하시겠습니까?')) return;
    try {
      await deleteUserReview(id, '', true);
      await loadAll();
    } catch (err: any) {
      console.error('Admin delete error:', err);
      alert(err.message || '후기 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleSaveReply = async (id: string) => {
    await adminUpdateReview(id, { admin_reply: replyText.trim() ? replyText.trim() : null });
    setReplyingId(null);
    setReplyText('');
    await loadAll();
  };

  return (
    <div className="space-y-8">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold">전체 후기</span>
            <MessageSquareQuote className="w-4 h-4 text-[#FFD600]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalCount}개</div>
        </div>

        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold">공개 후기</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{visibleCount}개</div>
        </div>

        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold">숨김 후기</span>
            <EyeOff className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{hiddenCount}개</div>
        </div>

        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold">신고된 후기</span>
            <Flag className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{reportedCount}건</div>
        </div>

        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold">평균 평점</span>
            <Star className="w-4 h-4 text-[#FFD600] fill-[#FFD600]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{avgRating} <span className="text-xs text-zinc-400 font-normal">/ 5.0</span></div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['all', 'visible', 'hidden', 'featured', 'reported'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                filterType === tab
                  ? 'bg-[#FFD600] text-zinc-950 font-black'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {tab === 'all' && '전체 보기'}
              {tab === 'visible' && '노출 중'}
              {tab === 'hidden' && '숨김됨'}
              {tab === 'featured' && '추천 후기'}
              {tab === 'reported' && '신고됨'}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="작성자 또는 내용 검색..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
          />
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="bg-[#121216] border border-[#27272A] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-zinc-800 font-bold text-xs text-white flex items-center justify-between">
          <span>수강생 후기 관리 ({filteredReviews.length})</span>
          <span className="text-zinc-400 font-normal">관리자 권한 제어</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-xs">
              조건에 해당하는 후기가 없습니다.
            </div>
          ) : (
            filteredReviews.map((review) => {
              const isReported = reportedReviewIds.has(review.id);

              return (
                <div key={review.id} className="p-6 space-y-4 hover:bg-zinc-900/40 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {review.is_featured && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          추천 후기
                        </span>
                      )}
                      {!review.is_visible && (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-amber-400 text-[10px] font-bold">
                          숨김 상태
                        </span>
                      )}
                      {isReported && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1">
                          <Flag className="w-3 h-3" /> 신고 접수됨
                        </span>
                      )}
                      <span className="text-xs font-bold text-white font-mono">{review.display_name}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-[11px] text-zinc-400 font-mono">{review.created_at.slice(0, 10)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#FFD600]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FFD600]" />
                      ))}
                      <span className="text-xs font-bold text-white ml-1 font-mono">{review.rating}.0</span>
                    </div>
                  </div>

                  {review.title && (
                    <h4 className="text-sm font-bold text-white">"{review.title}"</h4>
                  )}

                  <p className="text-xs sm:text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
                    {review.content}
                  </p>

                  {review.admin_reply && (
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs space-y-1">
                      <div className="font-bold text-[#FFD600] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 기획자J 답변
                      </div>
                      <p className="text-zinc-300">{review.admin_reply}</p>
                    </div>
                  )}

                  {/* Admin Actions Bar */}
                  <div className="pt-2 flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleVisible(review.id, review.is_visible)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                          review.is_visible
                            ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            : 'bg-[#FFD600] text-zinc-955'
                        }`}
                      >
                        {review.is_visible ? '숨김 처리' : '노출 복구'}
                      </button>

                      <button
                        onClick={() => handleToggleFeatured(review.id, review.is_featured)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                          review.is_featured
                            ? 'bg-amber-500 text-zinc-955 font-black'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {review.is_featured ? '추천 해제' : '추천 후기 지정'}
                      </button>

                      <button
                        onClick={() => {
                          if (replyingId === review.id) {
                            setReplyingId(null);
                          } else {
                            setReplyingId(review.id);
                            setReplyText(review.admin_reply || '');
                          }
                        }}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-[#FFD600] font-bold rounded-xl transition cursor-pointer"
                      >
                        {review.admin_reply ? '답글 수정' : '답글 달기'}
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(review.id)}
                      className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 삭제
                    </button>
                  </div>

                  {/* Inline reply edit */}
                  {replyingId === review.id && (
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 mt-2">
                      <label className="block text-xs font-bold text-zinc-300">관리자(기획자 J) 공식 답변 수정/등록</label>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="답변 내용을 입력하세요..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FFD600]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setReplyingId(null)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          취소
                        </button>
                        <button
                          onClick={() => handleSaveReply(review.id)}
                          className="px-4 py-1.5 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 font-black text-xs rounded-xl cursor-pointer"
                        >
                          답글 저장
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
