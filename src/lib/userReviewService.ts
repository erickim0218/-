import { supabase } from './supabase';

export interface UserBootcampReview {
  id: string;
  user_id: string;
  bootcamp_cohort?: string | null;
  display_name: string;
  title?: string | null;
  content: string;
  rating: number;
  is_visible: boolean;
  is_featured: boolean;
  admin_reply?: string | null;
  admin_replied_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BootcampReviewReport {
  id: string;
  review_id: string;
  reporter_user_id: string;
  reason: string;
  detail?: string | null;
  status: string;
  created_at: string;
}

const LOCAL_STORAGE_REVIEWS_KEY = 'reposition_user_reviews_v1';
const LOCAL_STORAGE_REPORTS_KEY = 'reposition_user_reports_v1';

const INITIAL_MOCK_USER_REVIEWS: UserBootcampReview[] = [
  {
    id: 'rev-demo-1',
    user_id: 'usr-demo-1',
    bootcamp_cohort: '8기',
    display_name: '김준* (대기업 마케터)',
    title: '스펙은 그대로인데 서류 합격률이 완전히 달라졌습니다',
    content: '이전에는 제 경험을 나열하기 바빴는데, 기획자 J님의 컨설팅을 받고 제 강점이 어떻게 기업에 읽혀야 하는지 명확히 깨달았습니다. 자소서 구조를 바꾼 것만으로도 서류 합격률이 3배 이상 뛰었어요. 강력 추천합니다!',
    rating: 5,
    is_visible: true,
    is_featured: true,
    admin_reply: '경험의 본질을 기업이 원하는 언어로 리포지셔닝한 모범적인 사례입니다. 합격을 진심으로 축하드립니다!',
    admin_replied_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'rev-demo-2',
    user_id: 'usr-demo-2',
    bootcamp_cohort: '8기',
    display_name: '박서* (서비스 기획)',
    title: '면접관의 눈빛이 달라지는 경험을 했습니다',
    content: '무경험 신입이나 다름없던 제가 어떤 식으로 포인트를 잡아야 하는지 1:1로 짚어주셔서 면접 때 횡설수설하지 않고 자신있게 대답할 수 있었습니다. 고민하는 시간이 아까우니 꼭 들으세요.',
    rating: 5,
    is_visible: true,
    is_featured: false,
    admin_reply: null,
    admin_replied_at: null,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export async function fetchUserReviews(): Promise<UserBootcampReview[]> {
  try {
    const { data, error } = await supabase
      .from('bootcamp_reviews')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error || !data) {
      // Fallback to localStorage / mock
      const stored = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(INITIAL_MOCK_USER_REVIEWS));
      return INITIAL_MOCK_USER_REVIEWS;
    }
    return data as UserBootcampReview[];
  } catch {
    const stored = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return INITIAL_MOCK_USER_REVIEWS;
  }
}

export async function upsertUserReview(reviewData: {
  id?: string;
  user_id: string;
  bootcamp_cohort?: string;
  display_name: string;
  title?: string;
  content: string;
  rating: number;
}): Promise<UserBootcampReview> {
  const now = new Date().toISOString();
  
  // Try Supabase first
  try {
    if (reviewData.id) {
      // Update
      const { data, error } = await supabase
        .from('bootcamp_reviews')
        .update({
          title: reviewData.title || null,
          content: reviewData.content,
          rating: reviewData.rating,
          display_name: reviewData.display_name,
          updated_at: now
        })
        .eq('id', reviewData.id)
        .eq('user_id', reviewData.user_id)
        .select()
        .single();

      if (!error && data) {
        return data as UserBootcampReview;
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('bootcamp_reviews')
        .insert([{
          user_id: reviewData.user_id,
          bootcamp_cohort: reviewData.bootcamp_cohort || '8기',
          display_name: reviewData.display_name,
          title: reviewData.title || null,
          content: reviewData.content,
          rating: reviewData.rating,
          is_visible: true,
          is_featured: false,
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();

      if (!error && data) {
        return data as UserBootcampReview;
      }
    }
  } catch {
    // ignore supabase error and fallback to localStorage
  }

  // Fallback to localStorage implementation
  const reviews = await fetchUserReviews();
  let updatedReview: UserBootcampReview;

  if (reviewData.id) {
    const idx = reviews.findIndex(r => r.id === reviewData.id && r.user_id === reviewData.user_id);
    if (idx >= 0) {
      reviews[idx] = {
        ...reviews[idx],
        title: reviewData.title || null,
        content: reviewData.content,
        rating: reviewData.rating,
        display_name: reviewData.display_name,
        updated_at: now
      };
      updatedReview = reviews[idx];
    } else {
      throw new Error('후기를 찾을 수 없거나 수정 권한이 없습니다.');
    }
  } else {
    // Check 1 per user
    const existing = reviews.find(r => r.user_id === reviewData.user_id);
    if (existing) {
      throw new Error('이미 작성한 후기가 존재합니다. 기존 후기를 수정해주세요.');
    }
    updatedReview = {
      id: `rev-${Date.now()}`,
      user_id: reviewData.user_id,
      bootcamp_cohort: reviewData.bootcamp_cohort || '8기',
      display_name: reviewData.display_name,
      title: reviewData.title || null,
      content: reviewData.content,
      rating: reviewData.rating,
      is_visible: true,
      is_featured: false,
      admin_reply: null,
      admin_replied_at: null,
      created_at: now,
      updated_at: now
    };
    reviews.unshift(updatedReview);
  }

  localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  return updatedReview;
}

export async function deleteUserReview(reviewId: string, userId: string, isAdmin: boolean): Promise<void> {
  if (!reviewId) {
    throw new Error('삭제할 후기 ID가 존재하지 않습니다.');
  }
  if (!isAdmin && !userId) {
    throw new Error('로그인 정보가 없거나 삭제 권한이 없습니다.');
  }

  try {
    let query = supabase.from('bootcamp_reviews').delete().eq('id', reviewId);
    if (!isAdmin) {
      query = query.eq('user_id', userId);
    }
    const { error } = await query;
    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`후기 삭제에 실패했습니다: ${error.message || '권한이 없거나 존재하지 않는 후기입니다.'}`);
    }
  } catch (err: any) {
    console.error('Delete exception:', err);
    throw err;
  }

  try {
    const reviews = await fetchUserReviews();
    const filtered = reviews.filter(r => {
      if (r.id === reviewId) {
        if (isAdmin || (userId && r.user_id === userId) || r.id.startsWith('rev-demo-')) return false;
      }
      return true;
    });
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Local storage update error on delete:', e);
  }
}

export async function adminUpdateReview(
  reviewId: string, 
  updates: { is_visible?: boolean; is_featured?: boolean; admin_reply?: string | null }
): Promise<void> {
  const now = new Date().toISOString();
  const updatePayload: any = { updated_at: now };
  if (updates.is_visible !== undefined) updatePayload.is_visible = updates.is_visible;
  if (updates.is_featured !== undefined) updatePayload.is_featured = updates.is_featured;
  if (updates.admin_reply !== undefined) {
    updatePayload.admin_reply = updates.admin_reply;
    updatePayload.admin_replied_at = updates.admin_reply ? now : null;
  }

  try {
    await supabase.from('bootcamp_reviews').update(updatePayload).eq('id', reviewId);
  } catch {
    // fallback
  }

  const reviews = await fetchUserReviews();
  const idx = reviews.findIndex(r => r.id === reviewId);
  if (idx >= 0) {
    reviews[idx] = {
      ...reviews[idx],
      ...updatePayload
    };
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  }
}

export async function reportReview(reviewId: string, reporterUserId: string, reason: string, detail?: string): Promise<void> {
  const reportData = {
    id: `rep-${Date.now()}`,
    review_id: reviewId,
    reporter_user_id: reporterUserId,
    reason,
    detail: detail || null,
    status: 'pending',
    created_at: new Date().toISOString()
  };

  try {
    await supabase.from('bootcamp_review_reports').insert([reportData]);
  } catch {
    // fallback
  }

  const reportsRaw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
  const reports: BootcampReviewReport[] = reportsRaw ? JSON.parse(reportsRaw) : [];
  
  // check duplicate
  const exists = reports.find(r => r.review_id === reviewId && r.reporter_user_id === reporterUserId);
  if (!exists) {
    reports.push(reportData);
    localStorage.setItem(LOCAL_STORAGE_REPORTS_KEY, JSON.stringify(reports));
  }
}

export async function fetchReviewReports(): Promise<BootcampReviewReport[]> {
  try {
    const { data, error } = await supabase.from('bootcamp_review_reports').select('*').order('created_at', { ascending: false });
    if (!error && data) return data as BootcampReviewReport[];
  } catch {
    // fallback
  }
  const reportsRaw = localStorage.getItem(LOCAL_STORAGE_REPORTS_KEY);
  return reportsRaw ? JSON.parse(reportsRaw) : [];
}
