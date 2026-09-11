import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  Search,
  RefreshCw,
  Crown,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  UserCheck,
  UserX,
  Clock,
  ChevronRight,
  X,
  Edit3,
  Award,
  ToggleLeft,
  ToggleRight,
  Layers,
  Settings2,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CombinedMember, checkIsPro } from '../../lib/userAccess';
import { fetchSiteFeatures, updateSiteFeature } from '../../lib/siteFeatures';
import { adminAssignMemberships } from '../../lib/revenueService';
import { RevenueProduct } from '../../types';
import { AnalyticsAdminTab } from './AnalyticsAdminTab';
import { RevenueAdminTab } from './RevenueAdminTab';

interface AdminViewProps {
  onTabChange: (tab: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onTabChange }) => {
  const [adminActiveTab, setAdminActiveTab] = useState<'members' | 'analytics' | 'revenue'>('members');
  // Guard & Loading State
  const [authStatus, setAuthStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');
  const [currentAdminEmail, setCurrentAdminEmail] = useState<string>('');

  // Data States
  const [members, setMembers] = useState<CombinedMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>('');

  // Search & Filter States
  const [searchName, setSearchName] = useState<string>('');
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<'all' | 'free' | 'pro' | 'bootcamp' | 'expired'>('all');

  // Filtered members calculation
  const filteredMembers = members.filter((m) => {
    // Name search
    if (searchName.trim()) {
      const q = searchName.trim().toLowerCase();
      if (!m.full_name.toLowerCase().includes(q)) return false;
    }

    // Email search
    if (searchEmail.trim()) {
      const q = searchEmail.trim().toLowerCase();
      if (!m.email.toLowerCase().includes(q)) return false;
    }

    // Tier filter
    if (tierFilter === 'free') {
      if (m.membership_tier !== 'free') return false;
    } else if (tierFilter === 'pro') {
      if (m.membership_tier !== 'pro' || !m.isProActive) return false;
    } else if (tierFilter === 'bootcamp') {
      if (m.membership_tier !== 'bootcamp' || !m.isProActive) return false;
    } else if (tierFilter === 'expired') {
      if (!m.isProExpired) return false;
    }

    return true;
  });

  // Success Message State
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string>('');

  // Bulk Selection State
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());

  // Site Features States
  const [siteFeatures, setSiteFeatures] = useState<Record<string, boolean>>({
    bootcamp: true,
    repositioning_class: false,
    practical_tools: false
  });
  const [isUpdatingFeature, setIsUpdatingFeature] = useState<boolean>(false);

  const loadFeatures = async () => {
    const features = await fetchSiteFeatures();
    setSiteFeatures(features);
  };

  const handleToggleFeature = async (key: string, currentVal: boolean) => {
    setIsUpdatingFeature(true);
    const nextVal = !currentVal;
    
    // Optimistic UI update
    setSiteFeatures((prev) => ({ ...prev, [key]: nextVal }));

    await updateSiteFeature(key, nextVal);
    setIsUpdatingFeature(false);

    const displayNameMap: Record<string, string> = {
      bootcamp: '부트캠프 모집 상태',
      repositioning_class: '리포지셔닝 클래스',
      practical_tools: '리포지셔닝 실전활용'
    };
    
    const label = displayNameMap[key] || key;
    const statusText = nextVal ? '현재 모집 중 (켜짐)' : '모집 마감 (꺼짐)';
    setUpdateSuccessMsg(`[${label}] 상태가 '${statusText}'(으)로 변경되었습니다.`);
    setTimeout(() => setUpdateSuccessMsg(''), 4000);
  };

  // 1. Initial Permission Check
  useEffect(() => {
    let isMounted = true;

    async function verifyAdminPermission() {
      try {
        setAuthStatus('loading');

        // Check logged-in user
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (isMounted) {
            setAuthStatus('unauthorized');
            onTabChange('login');
          }
          return;
        }

        // Query user_access for role
        const { data: access, error: accessError } = await supabase
          .from('user_access')
          .select('app_role, membership_tier, membership_expires_at')
          .eq('user_id', user.id)
          .single();

        if (accessError || !access || access.app_role !== 'admin') {
          if (isMounted) {
            setAuthStatus('unauthorized');
            onTabChange('home');
          }
          return;
        }

        if (isMounted) {
          setCurrentAdminEmail(user.email || '');
          setAuthStatus('authorized');
          fetchMembersList();
          fetchProductsAndTransactions();
          loadFeatures();
        }
      } catch (err) {
        console.error('Admin verification error:', err);
        if (isMounted) {
          setAuthStatus('unauthorized');
          onTabChange('home');
        }
      }
    }

    verifyAdminPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  const getKoreaTodayDate = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const krTime = new Date(utc + (9 * 3600000));
    return krTime.toISOString().slice(0, 10);
  };

  const [productsList, setProductsList] = useState<RevenueProduct[]>([]);
  const [memberTransactionsMap, setMemberTransactionsMap] = useState<Record<string, { plan_name?: string; grant_type?: string }>>({});

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetUserIds, setAssignTargetUserIds] = useState<string[]>([]);
  const [assignRequestId, setAssignRequestId] = useState<string>(crypto.randomUUID());
  const [assignTier, setAssignTier] = useState<'free' | 'pro' | 'bootcamp'>('pro');
  const [assignPlanCode, setAssignPlanCode] = useState<string>('');
  const [assignGrantType, setAssignGrantType] = useState<'paid' | 'promotion' | 'access_only'>('paid');
  const [assignSaleDate, setAssignSaleDate] = useState<string>(getKoreaTodayDate());
  const [assignAmountOverride, setAssignAmountOverride] = useState<number>(0);
  const [assignPaymentMethod, setAssignPaymentMethod] = useState<'card' | 'bank_transfer' | 'cash' | 'other'>('card');
  const [assignMemo, setAssignMemo] = useState<string>('');
  const [assignCohort, setAssignCohort] = useState<string>('');
  const [assignExpireMode, setAssignExpireMode] = useState<'indefinite' | '1month' | '3month' | '6month' | '1year' | 'custom'>('1month');
  const [assignCustomExpireDate, setAssignCustomExpireDate] = useState<string>('');
  const [showAssignConfirmModal, setShowAssignConfirmModal] = useState<boolean>(false);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  const [assignError, setAssignError] = useState<string>('');

  const fetchProductsAndTransactions = async () => {
    try {
      const { data: prodData } = await supabase.from('revenue_products').select('*').order('sort_order', { ascending: true });
      if (prodData) {
        setProductsList(prodData);
        const activePro = prodData.find(p => p.product_group === 'pro_membership' && p.is_active);
        if (activePro && !assignPlanCode) {
          setAssignPlanCode(activePro.plan_code);
          setAssignAmountOverride(activePro.default_price);
        }
      }

      const { data: txData } = await supabase
        .from('revenue_transactions')
        .select('member_user_id, grant_type, revenue_products(plan_name)')
        .order('sale_date', { ascending: false });

      if (txData) {
        const map: Record<string, { plan_name?: string; grant_type?: string }> = {};
        txData.forEach((t: any) => {
          if (t.member_user_id && !map[t.member_user_id]) {
            map[t.member_user_id] = {
              plan_name: t.revenue_products?.plan_name || '-',
              grant_type: t.grant_type || 'paid'
            };
          }
        });
        setMemberTransactionsMap(map);
      }
    } catch (e) {
      console.error('fetchProductsAndTransactions error:', e);
    }
  };

  const handleOpenAssignModal = (userIds: string[], defaultTier: 'free' | 'pro' | 'bootcamp' = 'pro', defaultCohort?: string | null) => {
    if (userIds.length === 0) return;
    setAssignTargetUserIds(userIds);
    setAssignTier(defaultTier);
    setAssignGrantType('paid');
    setAssignSaleDate(getKoreaTodayDate());
    setAssignMemo('');
    setAssignCohort(defaultCohort || '');
    setAssignExpireMode('1month');
    setAssignCustomExpireDate('');
    setAssignError('');
    setShowAssignConfirmModal(false);

    const group = defaultTier === 'bootcamp' ? 'bootcamp' : 'pro_membership';
    const matchingProd = productsList.find(p => p.product_group === group && p.is_active) || productsList[0];
    if (matchingProd) {
      setAssignPlanCode(matchingProd.plan_code);
      setAssignAmountOverride(matchingProd.default_price);
    } else {
      setAssignPlanCode(defaultTier === 'bootcamp' ? 'bootcamp_standard' : 'pro_monthly');
      setAssignAmountOverride(defaultTier === 'bootcamp' ? 500000 : 99000);
    }

    setIsAssignModalOpen(true);
  };

  const handleAssignTierChange = (newTier: 'free' | 'pro' | 'bootcamp') => {
    setAssignTier(newTier);
    if (newTier === 'free') {
      setAssignPlanCode('');
      setAssignAmountOverride(0);
    } else {
      const group = newTier === 'bootcamp' ? 'bootcamp' : 'pro_membership';
      const matchingProd = productsList.find(p => p.product_group === group && p.is_active) || productsList[0];
      if (matchingProd) {
        setAssignPlanCode(matchingProd.plan_code);
        setAssignAmountOverride(matchingProd.default_price);
      } else {
        setAssignPlanCode(newTier === 'bootcamp' ? 'bootcamp_standard' : 'pro_monthly');
        setAssignAmountOverride(newTier === 'bootcamp' ? 500000 : 99000);
      }
    }
  };

  const handleAssignPlanChange = (planCode: string) => {
    setAssignPlanCode(planCode);
    const prod = productsList.find(p => p.plan_code === planCode);
    if (prod) {
      setAssignAmountOverride(prod.default_price);
    }
  };

  const calculateExpiresAtForAssign = (): string | null => {
    if (assignTier === 'free') return null;
    if (assignExpireMode === 'indefinite') return null;

    const now = new Date();
    if (assignExpireMode === '1month') {
      now.setMonth(now.getMonth() + 1);
      return now.toISOString();
    }
    if (assignExpireMode === '3month') {
      now.setMonth(now.getMonth() + 3);
      return now.toISOString();
    }
    if (assignExpireMode === '6month') {
      now.setMonth(now.getMonth() + 6);
      return now.toISOString();
    }
    if (assignExpireMode === '1year') {
      now.setFullYear(now.getFullYear() + 1);
      return now.toISOString();
    }
    if (assignExpireMode === 'custom' && assignCustomExpireDate) {
      const selected = new Date(`${assignCustomExpireDate}T23:59:59.999Z`);
      return selected.toISOString();
    }
    return null;
  };

  const handleExecuteAssign = async () => {
    if (isAssigning || assignTargetUserIds.length === 0) return;

    setIsAssigning(true);
    setAssignError('');

    try {
      const actualAmount = assignGrantType === 'promotion' ? 0 : (assignGrantType === 'access_only' ? 0 : Number(assignAmountOverride));
      const expiresAt = calculateExpiresAtForAssign();

      const result = await adminAssignMemberships({
        userIds: assignTargetUserIds,
        membershipTier: assignTier,
        requestId: assignRequestId,
        planCode: assignTier === 'free' ? null : assignPlanCode,
        expiresAt,
        bootcampCohort: assignTier === 'bootcamp' ? (assignCohort.trim() || null) : null,
        grantType: assignGrantType,
        amountOverride: actualAmount,
        paymentMethod: assignPaymentMethod,
        saleDate: assignSaleDate,
        memo: assignMemo.trim() || null
      });

      if (!result.success) {
        throw new Error(result.error || '멤버십 부여에 실패했습니다.');
      }

      setIsAssignModalOpen(false);
      setShowAssignConfirmModal(false);
      setSelectedMemberIds(new Set());
      setAssignRequestId(crypto.randomUUID());
      await fetchMembersList();
      await fetchProductsAndTransactions();
      setUpdateSuccessMsg('선택하신 회원의 멤버십 및 매출 정보가 성공적으로 반영되었습니다.');
      setTimeout(() => setUpdateSuccessMsg(''), 4000);
      window.dispatchEvent(new CustomEvent('bootcamp_stats_updated'));
    } catch (err: any) {
      console.error('handleExecuteAssign error:', err);
      setAssignError(err.message || '처리 중 오류가 발생했습니다.');
    } finally {
      setIsAssigning(false);
    }
  };

  // 2. Fetch Member List from profiles & user_access
  const fetchMembersList = async () => {
    setIsLoadingMembers(true);
    setFetchError('');

    try {
      let accessData: any[] = [];
      const profilesResult = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (profilesResult.error) {
        throw new Error(`profiles 조회 오류: ${profilesResult.error.message}`);
      }

      try {
        const accessResult = await supabase
          .from('user_access')
          .select('user_id, app_role, membership_tier, bootcamp_cohort, membership_expires_at, updated_at');
        if (!accessResult.error && accessResult.data) {
          accessData = accessResult.data;
        } else {
          const fallback = await supabase
            .from('user_access')
            .select('user_id, app_role, membership_tier, membership_expires_at, updated_at');
          accessData = fallback.data || [];
        }
      } catch {
        const fallback = await supabase
          .from('user_access')
          .select('user_id, app_role, membership_tier, membership_expires_at, updated_at');
        accessData = fallback.data || [];
      }

      const profilesData = profilesResult.data || [];

      const combined: CombinedMember[] = profilesData.map((p) => {
        const acc = accessData.find((a) => a.user_id === p.id);
        const rawTier = (acc?.membership_tier || 'free').toLowerCase();
        const tier = (['pro', 'bootcamp'].includes(rawTier) ? rawTier : 'free') as 'free' | 'pro' | 'bootcamp';
        const cohort = acc?.bootcamp_cohort ?? null;
        const expiresAt = acc?.membership_expires_at ?? null;

        const isProActive = checkIsPro(tier, expiresAt);
        const isProExpired = ['pro', 'bootcamp'].includes(tier) && !isProActive;

        return {
          id: p.id,
          email: p.email || '-',
          full_name: p.full_name && p.full_name.trim() !== '' ? p.full_name : '-',
          created_at: p.created_at,
          updated_at: p.updated_at,
          app_role: (acc?.app_role || 'member') as 'member' | 'admin',
          membership_tier: tier,
          bootcamp_cohort: cohort,
          membership_expires_at: expiresAt,
          isProActive,
          isProExpired
        };
      });

      setMembers(combined);
    } catch (err: any) {
      console.error('fetchMembersList error:', err);
      setFetchError(err.message || '회원 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const filteredMemberIds = filteredMembers.map((m) => m.id);
  const allFilteredSelected = filteredMemberIds.length > 0 && filteredMemberIds.every((id) => selectedMemberIds.has(id));

  const handleSelectAllFiltered = () => {
    const nextSet = new Set(selectedMemberIds);
    if (allFilteredSelected) {
      filteredMemberIds.forEach((id) => nextSet.delete(id));
    } else {
      filteredMemberIds.forEach((id) => nextSet.add(id));
    }
    setSelectedMemberIds(nextSet);
  };

  const handleToggleMember = (id: string) => {
    const nextSet = new Set(selectedMemberIds);
    if (nextSet.has(id)) {
      nextSet.delete(id);
    } else {
      nextSet.add(id);
    }
    setSelectedMemberIds(nextSet);
  };
  const totalCount = members.length;
  const freeCount = members.filter((m) => m.membership_tier === 'free').length;
  const activeProCount = members.filter((m) => m.membership_tier === 'pro' && m.isProActive).length;
  const activeBootcampCount = members.filter((m) => m.membership_tier === 'bootcamp' && m.isProActive).length;
  const expiredCount = members.filter((m) => m.isProExpired).length;

  // Format date helper
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return dateStr;
    }
  };

  // Render Loading Screen during verification
  if (authStatus === 'loading') {
    return (
      <div className="min-h-[75vh] bg-[#09090B] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600] mb-4">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">관리자 권한 확인 중...</h2>
        <p className="text-xs text-zinc-400">데이터베이스의 admin 권한을 검증하고 있습니다. 잠시만 기다려주세요.</p>
      </div>
    );
  }

  // If unauthorized, return null (redirection handled in useEffect)
  if (authStatus === 'unauthorized') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header Banner */}
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FFD600]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-black rounded-full">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SUPER ADMIN CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>관리자 대시보드</span>
              <span className="text-xs font-normal text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg">
                접속 계정: {currentAdminEmail}
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              전체 회원의 가입 정보 및 user_access 멤버십(FREE / PRO) 권한을 직접 관리할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMembersList}
              disabled={isLoadingMembers}
              className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMembers ? 'animate-spin text-[#FFD600]' : ''}`} />
              <span>회원 목록 새로고침</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {updateSuccessMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold">{updateSuccessMsg}</span>
          </div>
        )}

        {/* Global Fetch Error Banner */}
        {fetchError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="font-bold">{fetchError}</span>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setAdminActiveTab('members')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
              adminActiveTab === 'members'
                ? 'bg-[#FFD600] text-zinc-950 shadow-lg shadow-yellow-500/10'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>회원 및 사이트 관리</span>
          </button>
          
          <button
            onClick={() => setAdminActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
              adminActiveTab === 'analytics'
                ? 'bg-[#FFD600] text-zinc-950 shadow-lg shadow-yellow-500/10'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>방문·전환 통계</span>
          </button>

          <button
            onClick={() => setAdminActiveTab('revenue')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-2 shrink-0 ${
              adminActiveTab === 'revenue'
                ? 'bg-[#FFD600] text-zinc-950 shadow-lg shadow-yellow-500/10'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>매출 관리</span>
          </button>
        </div>

        {adminActiveTab === 'analytics' ? (
          <AnalyticsAdminTab />
        ) : adminActiveTab === 'revenue' ? (
          <RevenueAdminTab adminEmail={currentAdminEmail} />
        ) : (
          <>
            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. 전체 회원 수 */}
          <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold">전체 회원 수</span>
              <Users className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {totalCount.toLocaleString()} <span className="text-xs font-normal text-zinc-500">명</span>
            </div>
          </div>

          {/* 2. FREE 회원 수 */}
          <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold">FREE 회원 수</span>
              <UserCheck className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-300">
              {freeCount.toLocaleString()} <span className="text-xs font-normal text-zinc-500">명</span>
            </div>
          </div>

          {/* 3. PRO 회원 수 (활성) */}
          <div className="bg-[#121216] border border-[#FFD600]/30 rounded-2xl p-5 space-y-2 bg-gradient-to-br from-[#121216] to-[#FFD600]/5">
            <div className="flex items-center justify-between text-[#FFD600]">
              <span className="text-xs font-bold">PRO 회원 수</span>
              <Crown className="w-4 h-4 text-[#FFD600]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#FFD600]">
              {activeProCount.toLocaleString()} <span className="text-xs font-normal text-amber-500/80">명</span>
            </div>
          </div>

          {/* 4. BOOTCAMP 회원 수 (활성) */}
          <div className="bg-[#121216] border border-indigo-500/30 rounded-2xl p-5 space-y-2 bg-gradient-to-br from-[#121216] to-indigo-500/5">
            <div className="flex items-center justify-between text-indigo-400">
              <span className="text-xs font-bold">BOOTCAMP 회원 수</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-300">
              {activeBootcampCount.toLocaleString()} <span className="text-xs font-normal text-indigo-400/80">명</span>
            </div>
          </div>

          {/* 5. 만료 회원 수 */}
          <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs font-bold">만료 회원</span>
              <Clock className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-300">
              {expiredCount.toLocaleString()} <span className="text-xs font-normal text-zinc-500">명</span>
            </div>
          </div>
        </div>

        {/* Site Features Control Panel */}
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-black rounded-md">
                <Settings2 className="w-3.5 h-3.5" />
                <span>SITE FEATURES CONTROL</span>
              </div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>사이트 기능 및 모집 상태 제어</span>
              </h2>
              <p className="text-xs text-zinc-400">
                각 기능별 공개 및 모집 스위치를 실시간으로 관리합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Bootcamp Switch */}
            <div className={`p-5 rounded-2xl border transition-all ${
              siteFeatures.bootcamp
                ? 'bg-zinc-900/90 border-[#FFD600]/40 shadow-lg shadow-yellow-500/5'
                : 'bg-zinc-900/40 border-zinc-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-white">부트캠프 모집 상태</span>
                <button
                  type="button"
                  onClick={() => handleToggleFeature('bootcamp', siteFeatures.bootcamp)}
                  disabled={isUpdatingFeature}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    siteFeatures.bootcamp ? 'bg-[#FFD600]' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#09090B] shadow ring-0 transition duration-200 ease-in-out ${
                      siteFeatures.bootcamp ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                  siteFeatures.bootcamp
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {siteFeatures.bootcamp ? '현재 모집 중' : '모집 마감'}
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                스위치를 꺼도 부트캠프 상세페이지는 계속 공개되며 신청 버튼만 다음 기수 예약 문의로 변경됩니다.
              </p>
            </div>

            {/* 2. Repositioning Class Switch */}
            <div className={`p-5 rounded-2xl border transition-all ${
              siteFeatures.repositioning_class
                ? 'bg-zinc-900/90 border-emerald-500/40'
                : 'bg-zinc-900/40 border-zinc-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-white">리포지셔닝 클래스</span>
                <button
                  type="button"
                  onClick={() => handleToggleFeature('repositioning_class', siteFeatures.repositioning_class)}
                  disabled={isUpdatingFeature}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    siteFeatures.repositioning_class ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      siteFeatures.repositioning_class ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                  siteFeatures.repositioning_class
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {siteFeatures.repositioning_class ? '공개 중' : '비공개'}
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                리포지셔닝 VOD 클래스 메뉴 및 페이지 전체 접근 권한을 제어합니다.
              </p>
            </div>

            {/* 3. Practical Tools Switch */}
            <div className={`p-5 rounded-2xl border transition-all ${
              siteFeatures.practical_tools
                ? 'bg-zinc-900/90 border-indigo-500/40'
                : 'bg-zinc-900/40 border-zinc-800'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-white">리포지셔닝 실전활용</span>
                <button
                  type="button"
                  onClick={() => handleToggleFeature('practical_tools', siteFeatures.practical_tools)}
                  disabled={isUpdatingFeature}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    siteFeatures.practical_tools ? 'bg-indigo-500' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      siteFeatures.practical_tools ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-black ${
                  siteFeatures.practical_tools
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {siteFeatures.practical_tools ? '공개 중' : '비공개'}
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                실전 워크북 및 활용 도구 페이지 전체 접근 권한을 제어합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Inputs (Name & Email) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="이름으로 검색..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                />
                {searchName && (
                  <button
                    onClick={() => setSearchName('')}
                    className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="이메일 주소로 검색..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600] transition"
                />
                {searchEmail && (
                  <button
                    onClick={() => setSearchEmail('')}
                    className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs (Tier) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 shrink-0">
              <button
                onClick={() => setTierFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  tierFilter === 'all'
                    ? 'bg-[#FFD600] text-zinc-950 shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                전체 ({totalCount})
              </button>

              <button
                onClick={() => setTierFilter('free')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  tierFilter === 'free'
                    ? 'bg-zinc-200 text-zinc-950 shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                FREE ({freeCount})
              </button>

              <button
                onClick={() => setTierFilter('pro')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  tierFilter === 'pro'
                    ? 'bg-amber-400 text-zinc-950 shadow-md'
                    : 'bg-zinc-900 text-amber-400 hover:bg-amber-400/10 border border-amber-500/30'
                }`}
              >
                PRO ({activeProCount})
              </button>

              <button
                onClick={() => setTierFilter('bootcamp')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  tierFilter === 'bootcamp'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'bg-zinc-900 text-indigo-400 hover:bg-indigo-500/10 border border-indigo-500/30'
                }`}
              >
                BOOTCAMP ({activeBootcampCount})
              </button>

              <button
                onClick={() => setTierFilter('expired')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  tierFilter === 'expired'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-zinc-900 text-rose-400 hover:bg-rose-500/10 border border-rose-500/30'
                }`}
              >
                만료 ({expiredCount})
              </button>
            </div>

          </div>
        </div>

        {/* Member List Section (Mobile Card View & Desktop Table View) */}
        {selectedMemberIds.size > 0 && (
          <div className="bg-[#121216] border border-[#FFD600]/40 rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 sticky top-4 z-40 animate-fade-in mb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#FFD600] text-zinc-950 font-black flex items-center justify-center text-xs">
                {selectedMemberIds.size}
              </span>
              <span className="text-xs font-bold text-white">
                {selectedMemberIds.size}명 선택됨
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMemberIds(new Set())}
                className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                선택 해제
              </button>
              <button
                onClick={() => handleOpenAssignModal(Array.from(selectedMemberIds), 'pro')}
                className="px-4 py-2 bg-[#FFD600] hover:bg-[#ffe033] text-zinc-950 text-xs font-black rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>멤버십 및 매출 일괄 부여</span>
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#121216] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Mobile Member Cards View (< 768px) */}
          <div className="block md:hidden p-4 space-y-4">
            {isLoadingMembers ? (
              <div className="py-12 text-center text-zinc-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FFD600]" />
                <span>회원 목록을 불러오는 중입니다...</span>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                검색 조건에 해당되는 회원이 없습니다.
              </div>
            ) : (
              filteredMembers.map((m) => (
                <div key={m.id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-3 font-sans">
                  {/* Top row: Checkbox & Name */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.has(m.id)}
                        onChange={() => handleToggleMember(m.id)}
                        className="rounded bg-zinc-900 border-zinc-700 text-[#FFD600] focus:ring-0 cursor-pointer w-4 h-4"
                      />
                      <span className="text-xs text-zinc-400 font-medium">선택</span>
                    </div>
                    <span className="text-sm font-bold text-white">{m.full_name}</span>
                  </div>

                  {/* 2. 이메일 */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs text-zinc-400 font-medium">이메일</span>
                    <span className="text-xs font-mono text-zinc-300 break-all text-right ml-2">{m.email}</span>
                  </div>

                  {/* 3. 관리자 여부 */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs text-zinc-400 font-medium">관리자 여부</span>
                    {m.app_role === 'admin' ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black rounded-md text-[11px]">
                        관리자 (admin)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 font-medium rounded-md text-[11px]">
                        일반회원 (member)
                      </span>
                    )}
                  </div>

                  {/* 4. 회원 등급 */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs text-zinc-400 font-medium">회원 등급</span>
                    {m.isProActive ? (
                      m.membership_tier === 'bootcamp' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-black rounded-full text-[11px]">
                          <Award className="w-3 h-3 text-indigo-400" />
                          {m.bootcamp_cohort ? `BOOTCAMP (${m.bootcamp_cohort})` : 'BOOTCAMP'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-[#FFD600] font-black rounded-full text-[11px]">
                          <Crown className="w-3 h-3 text-[#FFD600]" />
                          PRO
                        </span>
                      )
                    ) : m.isProExpired ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold rounded-full text-[11px]">
                        <Clock className="w-3 h-3 text-rose-400" />
                        만료됨
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 font-medium rounded-full text-[11px]">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* 4.5 현재 플랜 / 부여 방식 */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs text-zinc-400 font-medium">현재 플랜 / 부여 방식</span>
                    <span className="text-xs font-mono text-zinc-300 text-right">
                      {(() => {
                        const txInfo = memberTransactionsMap[m.id];
                        const tierStr = m.membership_tier.toUpperCase();
                        const planStr = txInfo?.plan_name || (m.membership_tier === 'free' ? '-' : '직접 부여');
                        const grantStr = txInfo?.grant_type === 'promotion' ? '프로모션' : txInfo?.grant_type === 'paid' ? '유료 결제' : txInfo?.grant_type === 'manual' ? '수기 등록' : m.membership_tier === 'free' ? '무료 회원' : '권한 변경';
                        return `${tierStr} / ${planStr} / ${grantStr}`;
                      })()}
                    </span>
                  </div>

                  {/* 5. 만료일 */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-xs text-zinc-400 font-medium">PRO 만료일</span>
                    <span className="text-xs font-mono">
                      {['pro', 'bootcamp'].includes(m.membership_tier) ? (
                        m.membership_expires_at === null ? (
                          <span className="text-amber-400 font-bold">무기한 (제한없음)</span>
                        ) : (
                          <span className={m.isProExpired ? 'text-rose-400 line-through' : 'text-zinc-300'}>
                            {formatDate(m.membership_expires_at)}
                          </span>
                        )
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </span>
                  </div>

                  {/* 6. 등급 변경 버튼 */}
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => handleOpenAssignModal([m.id], m.membership_tier, m.bootcamp_cohort)}
                      className="w-full py-2 bg-zinc-800 hover:bg-[#FFD600] hover:text-zinc-950 text-zinc-200 font-bold text-xs rounded-xl transition border border-zinc-700 cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>멤버십 / 매출 부여</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={handleSelectAllFiltered}
                      className="rounded bg-zinc-900 border-zinc-700 text-[#FFD600] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">이름</th>
                  <th className="py-3.5 px-4">이메일 주소</th>
                  <th className="py-3.5 px-4">가입일</th>
                  <th className="py-3.5 px-4">역할</th>
                  <th className="py-3.5 px-4">멤버십 상태</th>
                  <th className="py-3.5 px-4">현재 플랜 / 부여 방식</th>
                  <th className="py-3.5 px-4">PRO 만료일</th>
                  <th className="py-3.5 px-4 text-right">멤버십 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {isLoadingMembers ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-zinc-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FFD600]" />
                      <span>회원 목록을 불러오는 중입니다...</span>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-zinc-500">
                      검색 조건에 해당되는 회원이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-900/50 transition">
                      
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedMemberIds.has(m.id)}
                          onChange={() => handleToggleMember(m.id)}
                          className="rounded bg-zinc-900 border-zinc-700 text-[#FFD600] focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* 이름 */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        {m.full_name}
                      </td>

                      {/* 이메일 */}
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {m.email}
                      </td>

                      {/* 가입일 */}
                      <td className="py-3.5 px-4 text-zinc-400 font-mono">
                        {formatDate(m.created_at)}
                      </td>

                      {/* 역할 */}
                      <td className="py-3.5 px-4">
                        {m.app_role === 'admin' ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black rounded-md text-[11px]">
                            관리자 (admin)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 font-medium rounded-md text-[11px]">
                            일반회원 (member)
                          </span>
                        )}
                      </td>

                      {/* 멤버십 상태 */}
                      <td className="py-3.5 px-4">
                        {m.isProActive ? (
                          m.membership_tier === 'bootcamp' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-black rounded-full text-[11px]">
                              <Award className="w-3 h-3 text-indigo-400" />
                              {m.bootcamp_cohort ? `BOOTCAMP (${m.bootcamp_cohort})` : 'BOOTCAMP'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-[#FFD600] font-black rounded-full text-[11px]">
                              <Crown className="w-3 h-3 text-[#FFD600]" />
                              PRO
                            </span>
                          )
                        ) : m.isProExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold rounded-full text-[11px]">
                            <Clock className="w-3 h-3 text-rose-400" />
                            만료됨
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 font-medium rounded-full text-[11px]">
                            FREE
                          </span>
                        )}
                      </td>

                      {/* 현재 플랜 / 부여 방식 */}
                      <td className="py-3.5 px-4 font-mono text-xs text-zinc-300">
                        {(() => {
                          const txInfo = memberTransactionsMap[m.id];
                          const tierStr = m.membership_tier.toUpperCase();
                          const planStr = txInfo?.plan_name || (m.membership_tier === 'free' ? '-' : '직접 부여');
                          const grantStr = txInfo?.grant_type === 'promotion' ? '프로모션' : txInfo?.grant_type === 'paid' ? '유료 결제' : txInfo?.grant_type === 'manual' ? '수기 등록' : m.membership_tier === 'free' ? '무료 회원' : '권한 변경';
                          return `${tierStr} / ${planStr} / ${grantStr}`;
                        })()}
                      </td>

                      {/* 만료일 */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {['pro', 'bootcamp'].includes(m.membership_tier) ? (
                          m.membership_expires_at === null ? (
                            <span className="text-amber-400 font-bold">무기한 (제한없음)</span>
                          ) : (
                            <span className={m.isProExpired ? 'text-rose-400 line-through' : 'text-zinc-300'}>
                              {formatDate(m.membership_expires_at)}
                            </span>
                          )
                        ) : (
                          <span className="text-zinc-600">-</span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenAssignModal([m.id], m.membership_tier, m.bootcamp_cohort)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-[#FFD600] hover:text-zinc-950 text-zinc-200 font-bold rounded-lg transition border border-zinc-700 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>등급 및 매출</span>
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between items-center">
            <span>표시 중: {filteredMembers.length}명 / 전체 {totalCount}명</span>
            <span>최신 가입순 정렬됨</span>
          </div>
        </div>

        {/* Mobile Fixed Bottom Bar for Bulk Action */}
        {selectedMemberIds.size > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#121216] border-t border-[#FFD600]/40 p-4 shadow-2xl flex items-center justify-between gap-3 md:hidden">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FFD600] text-zinc-950 font-black flex items-center justify-center text-xs">
                {selectedMemberIds.size}
              </span>
              <span className="text-xs font-bold text-white">
                {selectedMemberIds.size}명 선택됨
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMemberIds(new Set())}
                className="px-3 py-2 bg-zinc-900 text-zinc-300 border border-zinc-700 text-xs font-bold rounded-xl"
              >
                선택 해제
              </button>
              <button
                onClick={() => handleOpenAssignModal(Array.from(selectedMemberIds), 'pro')}
                className="px-4 py-2 bg-[#FFD600] text-zinc-950 text-xs font-black rounded-xl shadow-md"
              >
                멤버십 일괄 부여
              </button>
            </div>
          </div>
        )}
          </>
        )}

      </div>

      {/* Unified Membership & Revenue Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl relative animate-fade-in text-white my-8">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#FFD600]" />
                <h3 className="text-lg font-black text-white">
                  멤버십 및 매출 부여 ({assignTargetUserIds.length}명 선택됨)
                </h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="font-bold">{assignError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              
              {/* 1. Membership Tier */}
              <div className="space-y-2">
                <label className="block font-bold text-zinc-300">1. 회원 등급 선택:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAssignTierChange('free')}
                    className={`py-3 px-3 rounded-xl font-bold border transition text-center cursor-pointer ${
                      assignTier === 'free'
                        ? 'bg-zinc-800 text-white border-zinc-500 shadow-md'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    FREE 회원
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAssignTierChange('pro')}
                    className={`py-3 px-3 rounded-xl font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                      assignTier === 'pro'
                        ? 'bg-[#FFD600] text-zinc-950 border-[#FFD600] shadow-md'
                        : 'bg-zinc-900 text-amber-500/80 border-amber-500/30 hover:bg-amber-500/10'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>PRO 회원</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAssignTierChange('bootcamp')}
                    className={`py-3 px-3 rounded-xl font-bold border transition flex items-center justify-center gap-1 cursor-pointer ${
                      assignTier === 'bootcamp'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-zinc-900 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>BOOTCAMP</span>
                  </button>
                </div>
              </div>

              {/* 2. Plan Selection (if not free) */}
              {assignTier !== 'free' && (
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="block font-bold text-zinc-300">2. 상품 플랜 선택:</label>
                  <select
                    value={assignPlanCode}
                    onChange={(e) => handleAssignPlanChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-bold focus:outline-none focus:border-[#FFD600]"
                  >
                    {productsList
                      .filter(p => (assignTier === 'bootcamp' ? p.product_group === 'bootcamp' : p.product_group === 'pro_membership') && p.is_active)
                      .map(p => (
                        <option key={p.id} value={p.plan_code}>
                          {p.plan_name} ({p.default_price.toLocaleString()}원)
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* 3. Grant Type */}
              {assignTier !== 'free' && (
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="block font-bold text-zinc-300">3. 부여 방식 (Grant Type):</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAssignGrantType('paid')}
                      className={`py-2.5 px-2 rounded-xl font-bold border text-[11px] transition cursor-pointer flex flex-col items-center gap-1 ${
                        assignGrantType === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-black">신규 결제 (paid)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignGrantType('promotion')}
                      className={`py-2.5 px-2 rounded-xl font-bold border text-[11px] transition cursor-pointer flex flex-col items-center gap-1 ${
                        assignGrantType === 'promotion'
                          ? 'bg-amber-500/20 text-[#FFD600] border-[#FFD600] shadow-md'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-black">프로모션 제공</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignGrantType('access_only')}
                      className={`py-2.5 px-2 rounded-xl font-bold border text-[11px] transition cursor-pointer flex flex-col items-center gap-1 ${
                        assignGrantType === 'access_only'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500 shadow-md'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-black">권한만 변경</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-[11px] text-zinc-400">
                    {assignGrantType === 'paid' && '✅ 회원 권한을 부여하고 선택한 상품의 가격을 매출에 반영합니다.'}
                    {assignGrantType === 'promotion' && '🎁 회원 권한은 부여하지만 실제 매출은 0원으로 기록합니다 (통계 반영, 매출 0원).'}
                    {assignGrantType === 'access_only' && '⚡ 회원 정보만 변경하며 새로운 매출 내역은 만들지 않습니다.'}
                  </div>
                </div>
              )}

              {/* 4. Payment Info (Only if grantType === 'paid' && tier !== 'free') */}
              {assignTier !== 'free' && assignGrantType === 'paid' && (
                <div className="space-y-3 pt-2 border-t border-zinc-800 bg-zinc-900/50 p-3 rounded-xl">
                  <div className="font-bold text-emerald-400 text-xs">결제 및 매출 정보 설정</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">매출 발생일:</label>
                      <input
                        type="date"
                        value={assignSaleDate}
                        onChange={(e) => setAssignSaleDate(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">실제 결제 금액 (원):</label>
                      <input
                        type="number"
                        value={assignAmountOverride}
                        onChange={(e) => setAssignAmountOverride(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white font-bold font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 mb-1">결제 수단:</label>
                      <select
                        value={assignPaymentMethod}
                        onChange={(e) => setAssignPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      >
                        <option value="card">카드 결제</option>
                        <option value="bank_transfer">무통장 입금</option>
                        <option value="cash">현금</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">관리자 메모:</label>
                      <input
                        type="text"
                        value={assignMemo}
                        onChange={(e) => setAssignMemo(e.target.value)}
                        placeholder="예: 런칭 기념 특가 적용"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Cohort (if bootcamp) */}
              {assignTier === 'bootcamp' && (
                <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                  <label className="block font-bold text-zinc-300">부트캠프 기수 입력:</label>
                  <input
                    type="text"
                    value={assignCohort}
                    onChange={(e) => setAssignCohort(e.target.value)}
                    placeholder="예: 8기"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              )}

              {/* 6. Expiry setting (if pro or bootcamp) */}
              {assignTier !== 'free' && (
                <div className="space-y-3 pt-2 border-t border-zinc-800">
                  <label className="block font-bold text-zinc-300 flex items-center justify-between">
                    <span>만료일 설정:</span>
                    <span className="text-[11px] font-normal text-amber-400">
                      {assignExpireMode === 'indefinite' ? '무기한 (만료일 없음)' : calculateExpiresAtForAssign() ? formatDate(calculateExpiresAtForAssign()!) : ''}
                    </span>
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAssignExpireMode('indefinite')}
                      className={`py-2 px-2 rounded-lg font-bold border text-[11px] transition cursor-pointer ${
                        assignExpireMode === 'indefinite'
                          ? 'bg-amber-500/20 text-[#FFD600] border-[#FFD600]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      무기한 (제한없음)
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignExpireMode('1month')}
                      className={`py-2 px-2 rounded-lg font-bold border text-[11px] transition cursor-pointer ${
                        assignExpireMode === '1month'
                          ? 'bg-amber-500/20 text-[#FFD600] border-[#FFD600]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      1개월 후
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignExpireMode('3month')}
                      className={`py-2 px-2 rounded-lg font-bold border text-[11px] transition cursor-pointer ${
                        assignExpireMode === '3month'
                          ? 'bg-amber-500/20 text-[#FFD600] border-[#FFD600]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      3개월 후
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignExpireMode('6month')}
                      className={`py-2 px-2 rounded-lg font-bold border text-[11px] transition cursor-pointer ${
                        assignExpireMode === '6month'
                          ? 'bg-amber-500/20 text-[#FFD600] border-[#FFD600]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      6개월 후
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignExpireMode('1year')}
                      className={`py-2 px-2 rounded-lg font-bold border text-[11px] transition cursor-pointer ${
                        assignExpireMode === '1year'
                          ? 'bg-amber-500/20 text-[#FFD600] border-[#FFD600]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      1년 후
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssignExpireMode('custom')}
                      className={`py-2 px-2 rounded-lg font-bold border text-[11px] transition cursor-pointer ${
                        assignExpireMode === 'custom'
                          ? 'bg-amber-500/20 text-[#FFD600] border-[#FFD600]'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      직접 날짜 선택
                    </button>
                  </div>

                  {assignExpireMode === 'custom' && (
                    <div className="pt-2">
                      <input
                        type="date"
                        value={assignCustomExpireDate}
                        onChange={(e) => setAssignCustomExpireDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#FFD600]"
                      />
                    </div>
                  )}
                </div>
              )}

            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl cursor-pointer"
              >
                취소
              </button>

              <button
                type="button"
                onClick={() => setShowAssignConfirmModal(true)}
                className="flex-1 py-3 bg-[#FFD600] hover:bg-[#FFE033] text-zinc-950 font-black rounded-xl shadow-lg shadow-yellow-500/10 cursor-pointer"
              >
                최종 확인 및 반영
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Assignment Final Confirmation Modal */}
      {showAssignConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl animate-fade-in text-white text-center">
            
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#FFD600] flex items-center justify-center mx-auto text-2xl font-black">
              ⚠️
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-white">멤버십 및 매출 부여 최종 확인</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                선택된 <strong className="text-white">{assignTargetUserIds.length}명</strong>의 회원에게 멤버십을 부여하고 매출 내역을 처리하시겠습니까?
              </p>
            </div>

            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">변경 대상:</span>
                <span className="font-bold text-white">{assignTargetUserIds.length}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">부여 등급:</span>
                <span className="font-black text-[#FFD600] uppercase">{assignTier}</span>
              </div>
              {assignTier !== 'free' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">선택 상품:</span>
                    <span className="font-bold text-white">
                      {productsList.find(p => p.plan_code === assignPlanCode)?.plan_name || assignPlanCode || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">부여 방식:</span>
                    <span className="font-bold text-emerald-400">
                      {assignGrantType === 'paid' ? '신규 결제 (매출 발생)' : assignGrantType === 'promotion' ? '프로모션 제공 (0원)' : '권한만 변경 (매출 없음)'}
                    </span>
                  </div>
                  {assignGrantType === 'paid' && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">예상 총매출:</span>
                      <span className="font-black text-amber-300">
                        {(assignAmountOverride * assignTargetUserIds.length).toLocaleString()}원 ({assignTargetUserIds.length}명 × {assignAmountOverride.toLocaleString()}원)
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">만료일:</span>
                <span className="font-mono text-zinc-200">
                  {assignTier === 'free' ? 'null (FREE)' : calculateExpiresAtForAssign() ? formatDate(calculateExpiresAtForAssign()!) : 'null (무기한)'}
                </span>
              </div>
              {assignTier === 'bootcamp' && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">부트캠프 기수:</span>
                  <span className="font-bold text-indigo-300">{assignCohort || '-'}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isAssigning}
                onClick={() => setShowAssignConfirmModal(false)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                돌아가기
              </button>

              <button
                type="button"
                disabled={isAssigning}
                onClick={handleExecuteAssign}
                className="flex-1 py-3 bg-[#FFD600] hover:bg-[#FFE033] text-zinc-950 font-black rounded-xl shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAssigning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>처리 중...</span>
                  </>
                ) : (
                  <span>최종 승인 및 반영</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
