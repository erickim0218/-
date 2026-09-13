import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MessageSquareQuote, CheckCircle2, AlertTriangle, ThumbsUp, Edit3, Trash2, Eye, EyeOff, Award, Send, X, Flag, Sparkles } from 'lucide-react';
import { UserBootcampReview, fetchUserReviews, upsertUserReview, deleteUserReview, adminUpdateReview, reportReview, fetchReviewReports } from '../lib/userReviewService';
import { supabase } from '../lib/supabase';

interface UserReviewsSectionProps {
  onTabChange?: (tab: string) => void;
}

export const UserReviewsSection: React.FC<UserReviewsSectionProps> = ({ onTabChange }) => {
  const [reviews, setReviews] = useState<UserBootcampReview[]>([]);
  const [reportsCountMap, setReportsCountMap] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('');

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  // Edit states
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Sort & Filter
  const [sortBy, setSortBy] = useState<'latest' | 'rating'>('latest');

  // Report Modal
  const [reportModalReviewId, setReportModalReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState<string>('부적절한 내용');
  const [reportDetail, setReportDetail] = useState<string>('');
  const [reportSubmitting, setReportSubmitting] = useState<boolean>(false);
  const [reportSuccessMsg, setReportSuccessMsg] = useState<string>('');

  // Admin Reply Modal / Input state per review
  const [adminReplyInput, setAdminReplyInput] = useState<Record<string, string>>({});
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);

  const loadData = async () => {
    const list = await fetchUserReviews();
    setReviews(list);

    // load reports count for admin
    try {
      const reps = await fetchReviewReports();
      const map: Record<string, number> = {};
      reps.forEach(r => {
        map[r.review_id] = (map[r.review_id] || 0) + 1;
      });
      setReportsCountMap(map);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();

    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        const metaName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '수강생';
        setDisplayName(metaName);

        // Check if admin
        try {
          const { data: access } = await supabase
            .from('user_access')
            .select('app_role')
            .eq('user_id', user.id)
            .single();
          if (access?.app_role === 'admin' || user.email === 'admin@reposition.kr' || user.email === 'kjyoon52@gmail.com') {
            setIsAdmin(true);
          }
        } catch {
          if (user.email === 'admin@reposition.kr' || user.email === 'kjyoon52@gmail.com') {
            setIsAdmin(true);
          }
        }
      }
    }
    checkAuth();
  }, []);

  // Check if current user has already written a review
  const myReview = currentUser ? reviews.find(r => r.user_id === currentUser.id) : null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      if (onTabChange) onTabChange('login');
      return;
    }

    if (!content.trim() || content.trim().length < 10) {
      setFormError('후기 내용은 최소 10자 이상 입력해주세요.');
      return;
    }
    if (content.trim().length > 3000) {
      setFormError('후기 내용은 최대 3000자까지 입력 가능합니다.');
      return;
    }
    if (title.trim().length > 60) {
      setFormError('후기 제목은 최대 60자까지 입력 가능합니다.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      await upsertUserReview({
        id: editingReviewId || myReview?.id,
        user_id: currentUser.id,
        bootcamp_cohort: '8기',
        display_name: displayName || '수강생',
        title: title.trim(),
        content: content.trim(),
        rating
      });

      setFormSuccess(editingReviewId ? '후기가 수정되었습니다.' : '후기가 성공적으로 등록되었습니다!');
      setTitle('');
      setContent('');
      setEditingReviewId(null);
      await loadData();

      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    } catch (err: any) {
      setFormError(err.message || '후기 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = () => {
    if (!myReview) return;
    setEditingReviewId(myReview.id);
    setTitle(myReview.title || '');
    setContent(myReview.content);
    setRating(myReview.rating);
    setDisplayName(myReview.display_name);
  };

  const handleDeleteReview = async (id: string) => {
    if (!currentUser) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    if (!window.confirm('작성한 후기를 삭제하시겠습니까?')) return;
    try {
      await deleteUserReview(id, currentUser.id, isAdmin);
      if (editingReviewId === id) {
        setEditingReviewId(null);
        setTitle('');
        setContent('');
      }
      await loadData();
      setFormSuccess('후기가 삭제되었습니다.');
      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error('Delete review error:', err);
      alert(err.message || '후기 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleAdminToggleVisible = async (id: string, currentVal: boolean) => {
    await adminUpdateReview(id, { is_visible: !currentVal });
    await loadData();
  };

  const handleAdminToggleFeatured = async (id: string, currentVal: boolean) => {
    await adminUpdateReview(id, { is_featured: !currentVal });
    await loadData();
  };

  const handleAdminSaveReply = async (id: string) => {
    const replyText = adminReplyInput[id] || '';
    await adminUpdateReview(id, { admin_reply: replyText.trim() ? replyText.trim() : null });
    setReplyingReviewId(null);
    await loadData();
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }
    if (!reportModalReviewId) return;

    setReportSubmitting(true);
    try {
      await reportReview(reportModalReviewId, currentUser.id, reportReason, reportDetail);
      setReportSuccessMsg('신고가 접수되었습니다. 관리자 확인 후 조치됩니다.');
      setTimeout(() => {
        setReportSuccessMsg('');
        setReportModalReviewId(null);
        setReportDetail('');
      }, 1500);
      loadData();
    } catch {
      alert('신고 처리 중 오류가 발생했습니다.');
    } finally {
      setReportSubmitting(false);
    }
  };

  // Filter & Sort reviews
  const visibleReviews = reviews.filter(r => {
    if (isAdmin) return true;
    if (r.is_visible) return true;
    if (currentUser && r.user_id === currentUser.id) return true; // own hidden review visible to author
    return false;
  });

  const sortedReviews = [...visibleReviews].sort((a, b) => {
    // Featured first
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;

    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // latest
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="w-full space-y-10">
      {/* Section Header & Rating Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-bold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>실제 수강생 검증된 후기</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            수강생 후기
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            직접 경험한 리포지셔닝의 변화를 남겨주세요.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-200 px-5 py-3 rounded-2xl shadow-sm">
          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-500 justify-end">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs text-zinc-500 font-medium mt-0.5">총 {reviews.length}개의 후기</div>
          </div>
          <div className="text-3xl font-black text-zinc-900 font-mono pl-3 border-l border-zinc-200">
            {avgRating} <span className="text-sm text-zinc-400 font-normal">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Review Form or My Review Box */}
      <div className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-zinc-800">
        {!currentUser ? (
          <div className="text-center py-6 space-y-4">
            <MessageSquareQuote className="w-10 h-10 text-[#FFD600] mx-auto opacity-80" />
            <h3 className="text-lg font-bold text-white">수강생 후기를 작성하시려면 로그인이 필요합니다.</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              로그인 후 리포지셔닝 부트캠프를 통해 경험한 성과와 변화를 직접 공유해보세요.
            </p>
            <button
              onClick={() => {
                if (onTabChange) onTabChange('login');
              }}
              className="px-6 py-3 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 font-black text-xs rounded-xl transition shadow-lg cursor-pointer"
            >
              로그인하기
            </button>
          </div>
        ) : myReview && !editingReviewId ? (
          /* Already wrote a review: show review card & edit/delete buttons */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFD600]/15 text-[#FFD600] border border-[#FFD600]/30">
                  내가 작성한 후기
                </span>
                <span className="text-xs text-zinc-400 font-mono">{myReview.created_at.slice(0, 10)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartEdit}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> 수정
                </button>
                <button
                  onClick={() => handleDeleteReview(myReview.id)}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 삭제
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#FFD600]">
              {[...Array(myReview.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFD600]" />
              ))}
            </div>

            {myReview.title && (
              <h4 className="text-base font-bold text-white">"{myReview.title}"</h4>
            )}

            <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
              {myReview.content}
            </p>

            <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span>작성자: {myReview.display_name}</span>
              {myReview.is_visible === false && (
                <span className="text-amber-400 font-bold">[관리자 검토중/숨김]</span>
              )}
            </div>
          </div>
        ) : (
          /* Write / Edit Form */
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-[#FFD600]" />
                {editingReviewId ? '수강생 후기 수정하기' : '수강생 후기 작성하기'}
              </h3>
              {editingReviewId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReviewId(null);
                    setTitle('');
                    setContent('');
                  }}
                  className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                >
                  수정 취소
                </button>
              )}
            </div>

            {formError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-bold">
                {formSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Rating selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">별점 선택</label>
                <div className="flex items-center gap-1.5 bg-zinc-800/80 px-4 py-2.5 rounded-xl border border-zinc-700 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'fill-[#FFD600] text-[#FFD600]' : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-[#FFD600] font-mono">{rating}.0점</span>
                </div>
              </div>

              {/* Display name */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">작성자 표시명</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD600]"
                  placeholder="예: 김준* (대기업 마케터)"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">후기 제목 (선택, 최대 60자)</label>
              <input
                type="text"
                maxLength={60}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 서류 합격률이 3배 이상 뛰었습니다"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD600]"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-zinc-300">후기 내용 (필수, 최소 10자 ~ 최대 3000자)</label>
                <span className="text-[11px] text-zinc-400 font-mono">{content.length} / 3000자</span>
              </div>
              <textarea
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="리포지셔닝 부트캠프를 수강하며 경험한 변화, 가장 도움이 되었던 점 등을 솔직하게 작성해주세요."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FFD600] leading-relaxed resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 font-black text-xs rounded-xl transition shadow-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? '등록 중...' : editingReviewId ? '후기 수정하기' : '후기 등록하기'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Review List Header & Sort */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm font-bold text-zinc-800">
          전체 후기 리스트 <span className="text-zinc-500 font-mono text-xs">({sortedReviews.length})</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              sortBy === 'latest'
                ? 'bg-zinc-900 text-[#FFD600]'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              sortBy === 'rating'
                ? 'bg-zinc-900 text-[#FFD600]'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            높은 평점순
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 rounded-3xl border border-zinc-200 text-zinc-500 space-y-2">
            <MessageSquareQuote className="w-10 h-10 mx-auto text-zinc-400" />
            <p className="text-sm font-medium">등록된 수강생 후기가 없습니다.</p>
            <p className="text-xs text-zinc-400">첫 번째 후기의 주인공이 되어보세요!</p>
          </div>
        ) : (
          sortedReviews.map((review) => {
            const isOwn = currentUser && review.user_id === currentUser.id;
            const reportsCount = reportsCountMap[review.id] || 0;

            return (
              <div
                key={review.id}
                className={`p-6 sm:p-7 rounded-3xl border transition shadow-sm bg-white relative space-y-4 ${
                  review.is_featured
                    ? 'border-amber-400 ring-1 ring-amber-400/50 bg-gradient-to-br from-amber-50/40 to-white'
                    : 'border-zinc-200 hover:border-zinc-300'
                } ${review.is_visible === false ? 'opacity-70 bg-zinc-100' : ''}`}
              >
                {/* Top Badges & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {review.is_featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-amber-500 text-zinc-955 shadow-sm">
                        <Award className="w-3 h-3" /> 추천 후기
                      </span>
                    )}
                    {review.is_visible === false && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-zinc-800 text-amber-300">
                        <EyeOff className="w-3 h-3" /> 숨김 처리됨
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-zinc-700">{review.display_name}</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {review.created_at.slice(0, 10)}
                      {review.updated_at !== review.created_at && ' (수정됨)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Title */}
                {review.title && (
                  <h4 className="text-base font-bold text-zinc-900">
                    "{review.title}"
                  </h4>
                )}

                {/* Content */}
                <p className="text-sm text-zinc-700 whitespace-pre-line leading-relaxed font-normal">
                  {review.content}
                </p>

                {/* Admin Reply */}
                {review.admin_reply && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-600" /> 기획자J 답변
                      </span>
                      {review.admin_replied_at && (
                        <span className="text-[10px] font-mono text-amber-700/75">
                          {review.admin_replied_at.slice(0, 10)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-700 whitespace-pre-line leading-relaxed">
                      {review.admin_reply}
                    </p>
                  </div>
                )}

                {/* Footer Actions (Report, Own Edit/Delete, Admin Controls) */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {/* Report button */}
                    <button
                      onClick={() => setReportModalReviewId(review.id)}
                      className="text-zinc-400 hover:text-rose-500 transition flex items-center gap-1 cursor-pointer"
                      title="후기 신고"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>신고</span>
                    </button>

                    {isAdmin && reportsCount > 0 && (
                      <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                        신고 접수됨 ({reportsCount})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Own edit/delete */}
                    {isOwn && !isAdmin && (
                      <>
                        <button
                          onClick={handleStartEdit}
                          className="text-zinc-600 hover:text-zinc-900 font-bold transition cursor-pointer"
                        >
                          수정
                        </button>
                        <span className="text-zinc-300">|</span>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-rose-600 hover:text-rose-700 font-bold transition cursor-pointer"
                        >
                          삭제
                        </button>
                      </>
                    )}

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <button
                          onClick={() => handleAdminToggleVisible(review.id, review.is_visible)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            review.is_visible
                              ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                              : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                          }`}
                        >
                          {review.is_visible ? '숨김처리' : '노출복구'}
                        </button>

                        <button
                          onClick={() => handleAdminToggleFeatured(review.id, review.is_featured)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            review.is_featured
                              ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                              : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                          }`}
                        >
                          {review.is_featured ? '추천해제' : '추천지정'}
                        </button>

                        <button
                          onClick={() => {
                            if (replyingReviewId === review.id) {
                              setReplyingReviewId(null);
                            } else {
                              setReplyingReviewId(review.id);
                              setAdminReplyInput(prev => ({ ...prev, [review.id]: review.admin_reply || '' }));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-zinc-900 text-[#FFD600] hover:bg-zinc-800 transition cursor-pointer"
                        >
                          {review.admin_reply ? '답글수정' : '답글달기'}
                        </button>

                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500 text-white hover:bg-rose-600 transition cursor-pointer"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Reply Input Box Inline */}
                {isAdmin && replyingReviewId === review.id && (
                  <div className="mt-3 p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
                    <label className="block text-xs font-bold text-zinc-700">관리자(기획자 J) 공식 답변 작성</label>
                    <textarea
                      rows={3}
                      value={adminReplyInput[review.id] || ''}
                      onChange={(e) => setAdminReplyInput(prev => ({ ...prev, [review.id]: e.target.value }))}
                      placeholder="수강생 후기에 대한 공식 피드백이나 답변을 입력하세요."
                      className="w-full bg-white border border-zinc-300 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyingReviewId(null)}
                        className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleAdminSaveReply(review.id)}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs rounded-xl cursor-pointer"
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

      {/* Report Modal */}
      {reportModalReviewId && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setReportModalReviewId(null);
          }}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 text-left">
            <button
              onClick={() => setReportModalReviewId(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 text-rose-600">
              <Flag className="w-5 h-5" />
              <h3 className="text-base font-bold text-zinc-900">후기 신고하기</h3>
            </div>

            {reportSuccessMsg ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl text-xs font-bold text-center">
                {reportSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">신고 사유</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-none focus:border-rose-500"
                  >
                    <option value="스팸">스팸 및 홍보성 내용</option>
                    <option value="욕설/비방">욕설 및 타인 비방</option>
                    <option value="개인정보 노출">개인정보 노출</option>
                    <option value="부적절한 내용">부적절하거나 허위인 내용</option>
                    <option value="기타">기타 사유</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">상세 내용 (선택)</label>
                  <textarea
                    rows={3}
                    value={reportDetail}
                    onChange={(e) => setReportDetail(e.target.value)}
                    placeholder="신고 사유에 대한 상세 내용을 적어주세요."
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalReviewId(null)}
                    className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {reportSubmitting ? '접수 중...' : '신고 제출'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
