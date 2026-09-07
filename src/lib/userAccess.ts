import { supabase } from './supabase';

export interface UserAccessRow {
  user_id: string;
  app_role: 'member' | 'admin';
  membership_tier: 'free' | 'pro' | 'bootcamp';
  bootcamp_cohort?: string | null;
  membership_expires_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CombinedMember {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at?: string;
  app_role: 'member' | 'admin';
  membership_tier: 'free' | 'pro' | 'bootcamp';
  bootcamp_cohort?: string | null;
  membership_expires_at: string | null;
  isProActive: boolean;
  isProExpired: boolean;
}

/**
 * PRO / BOOTCAMP 상태 판별 공통 로직
 * - membership_tier in ['pro', 'bootcamp']
 * - membership_expires_at === null 또는 현재 시간보다 미래인 경우
 */
export function checkIsPro(
  membership_tier?: string | null,
  membership_expires_at?: string | null
): boolean {
  if (!membership_tier) return false;
  const normalizedTier = membership_tier.toLowerCase();
  if (!['pro', 'bootcamp'].includes(normalizedTier)) return false;
  if (membership_expires_at === null || membership_expires_at === undefined || membership_expires_at === '') return true;
  return new Date(membership_expires_at) > new Date();
}

export const hasProAccess = checkIsPro;

/**
 * 현재 로그인 유저 및 권한(user_access) 조회
 */
export async function getCurrentUserAccess() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, access: null, error: userError || new Error('비로그인 상태입니다.') };
  }

  const { data: access, error: accessError } = await supabase
    .from('user_access')
    .select('app_role, membership_tier, bootcamp_cohort, membership_expires_at')
    .eq('user_id', user.id)
    .single();

  return { user, access, error: accessError };
}
