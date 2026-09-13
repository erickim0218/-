import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/Views/HomeView';
import { PhilosophyView } from './components/Views/PhilosophyView';
import { ClassesView } from './components/Views/ClassesView';
import { BootcampView } from './components/Views/BootcampView';
import { PracticalView } from './components/Views/PracticalView';
import { MyLmsView } from './components/Views/MyLmsView';
import { AdminView } from './components/Views/AdminView';
import { ProPaymentView } from './components/Views/ProPaymentView';
import { AuthView } from './components/Views/AuthView';
import { TermsView } from './components/Views/TermsView';
import { PrivacyView } from './components/Views/PrivacyView';
import { PolicyView } from './components/Views/PolicyView';
import { COURSES } from './data/mockData';
import { BOOTCAMP_REVIEWS, BootcampReview } from './data/bootcampReviews';
import { INITIAL_PAYMENTS, INITIAL_MANAGED_USERS } from './data/adminMockData';
import { MemberTier, UserProfile, Course, PaymentRecord, ManagedUser } from './types';
import { supabase, supabaseApi } from './lib/supabase';
import { checkIsPro } from './lib/userAccess';
import { fetchSiteFeatures } from './lib/siteFeatures';
import { trackAnalyticsEvent } from './lib/analytics';

const STORAGE_USERS_KEY = 'reposition_db_managed_users';
const STORAGE_PAYMENTS_KEY = 'reposition_db_payments';
const STORAGE_AUTH_KEY = 'reposition_db_auth_session';

const GUEST_PROFILE: UserProfile = {
  name: '',
  email: '',
  tier: 'NON_MEMBER',
  targetJob: '',
  positioningVersions: [],
  enrolledCourseIds: [],
  completedLessonIds: [],
  isAdmin: false
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [practicalSubTab, setPracticalSubTab] = useState<'realneeds' | 'persuasion' | 'interview'>('realneeds');
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [siteFeatures, setSiteFeatures] = useState<Record<string, boolean>>({
    bootcamp: true,
    repositioning_class: false,
    practical_tools: false
  });

  // Fetch site features on mount and sync on event
  useEffect(() => {
    const loadFeatures = async () => {
      const features = await fetchSiteFeatures();
      setSiteFeatures({
        bootcamp: features.bootcamp !== false,
        repositioning_class: features.repositioning_class === true,
        practical_tools: features.practical_tools === true
      });
    };
    loadFeatures();

    const handleUpdate = () => {
      loadFeatures();
    };
    window.addEventListener('site_features_updated', handleUpdate);
    return () => {
      window.removeEventListener('site_features_updated', handleUpdate);
    };
  }, []);
  
  // Dynamic persistent database states
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(() => {
    try {
      localStorage.removeItem('reposition_supabase_cloud_users');
      localStorage.removeItem(STORAGE_USERS_KEY);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MANAGED_USERS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PAYMENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const filtered = parsed.filter((p: any) => p.id !== 'pay-001' && p.id !== 'pay-002' && p.id !== 'pay-003' && p.id !== 'pay-004' && p.id !== 'pay-005' && p.id !== 'pay-006' && p.id !== 'pay-007');
        if (filtered.length > 0) return filtered;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PAYMENTS;
  });

  // Sync user profile & access from Supabase
  const syncUserAccess = async (user: any) => {
    if (!user) {
      setUserProfile(GUEST_PROFILE);
      setCurrentTier('NON_MEMBER');
      return null;
    }

    try {
      let access: any = null;
      try {
        const { data } = await supabase
          .from('user_access')
          .select('app_role, membership_tier, bootcamp_cohort, membership_expires_at')
          .eq('user_id', user.id)
          .single();
        access = data;
      } catch {
        const { data } = await supabase
          .from('user_access')
          .select('app_role, membership_tier, membership_expires_at')
          .eq('user_id', user.id)
          .single();
        access = data;
      }

      const isAdmin = access?.app_role === 'admin';
      const rawTier = (access?.membership_tier || 'free').toLowerCase();
      const hasPro = checkIsPro(rawTier, access?.membership_expires_at);

      let effectiveTier: MemberTier = 'FREE';
      if (hasPro) {
        if (rawTier === 'bootcamp') {
          effectiveTier = 'BOOTCAMP';
        } else {
          effectiveTier = 'PRO';
        }
      } else {
        effectiveTier = 'FREE';
      }

      const displayName =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split('@')[0] ||
        '수강생';

      const profile: UserProfile = {
        id: user.id,
        name: displayName,
        email: user.email || '',
        tier: effectiveTier,
        bootcampCohort: access?.bootcamp_cohort || undefined,
        targetJob: '리포지셔닝 수강생',
        positioningVersions: [],
        enrolledCourseIds: ['course-01', 'course-02'],
        completedLessonIds: [],
        isAdmin: isAdmin
      };

      setUserProfile(profile);
      setCurrentTier(effectiveTier);
      return { profile, access, isAdmin, isPro: hasPro };
    } catch (e) {
      console.error('syncUserAccess error:', e);
      return null;
    }
  };

  // Check Supabase session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (user) {
          setSupabaseConnected(true);
          await syncUserAccess(user);
        }
      } catch (e) {
        console.error(e);
      }
    }
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setSupabaseConnected(true);
        await syncUserAccess(session.user);
      } else {
        setUserProfile(GUEST_PROFILE);
        setCurrentTier('NON_MEMBER');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // User auth state (Session restored from localStorage DB)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return GUEST_PROFILE;
  });

  const [currentTier, setCurrentTier] = useState<MemberTier>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.tier || 'NON_MEMBER';
      }
    } catch (e) {
      console.error(e);
    }
    return 'NON_MEMBER';
  });

  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [reviews, setReviews] = useState<BootcampReview[]>(BOOTCAMP_REVIEWS);

  // Sync DB to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(managedUsers));
  }, [managedUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const isBootcampDetailPage = currentTab === 'bootcamp';
    trackAnalyticsEvent({
      eventName: isBootcampDetailPage
        ? 'bootcamp_detail_view'
        : 'page_view'
    });
  }, [currentTab, practicalSubTab]);

  // Guard against navigating to disabled features
  useEffect(() => {
    if (currentTab === 'classes' && siteFeatures.repositioning_class !== true) {
      setCurrentTab('home');
    } else if (currentTab === 'practical' && siteFeatures.practical_tools !== true) {
      setCurrentTab('home');
    }
  }, [currentTab, siteFeatures]);

  // Check initial path on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/terms' || path === '/terms.html') {
      setCurrentTab('terms');
      document.title = 'REPOSITION 이용약관';
    } else if (path === '/privacy' || path === '/privacy.html') {
      setCurrentTab('privacy');
      document.title = 'REPOSITION 개인정보처리방침';
    } else if (path === '/policy' || path === '/policy.html') {
      setCurrentTab('policy');
      document.title = 'REPOSITION 서비스 운영방침';
    }
  }, []);

  const handleTabChange = (tab: string, subTab?: 'realneeds' | 'persuasion' | 'interview') => {
    if (tab === 'classes' && siteFeatures.repositioning_class !== true) {
      alert('현재 리포지셔닝 클래스 서비스는 비활성화 상태입니다.');
      return;
    }
    if (tab === 'practical' && siteFeatures.practical_tools !== true) {
      alert('현재 리포지셔닝 실전활용 서비스는 비활성화 상태입니다.');
      return;
    }
    setCurrentTab(tab);
    if (subTab) {
      setPracticalSubTab(subTab);
    }

    try {
      const path = tab === 'home' ? '/' : `/${tab}`;
      window.history.pushState({}, '', path);
    } catch {
      // ignore
    }

    if (tab === 'terms') {
      document.title = 'REPOSITION 이용약관';
    } else if (tab === 'privacy') {
      document.title = 'REPOSITION 개인정보처리방침';
    } else if (tab === 'policy') {
      document.title = 'REPOSITION 서비스 운영방침';
    } else {
      document.title = 'REPOSITION | 스펙은 바꾸지 않습니다. 읽히는 방식을 바꿉니다.';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddReview = (newReview: BootcampReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // Sign up success handler
  const handleSignUpSuccess = async (newUser: ManagedUser) => {
    setManagedUsers((prev) => [newUser, ...prev]);

    const newProfile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      username: newUser.username,
      careerLevel: newUser.careerLevel,
      targetJob: newUser.targetJob || '리포지셔닝 수강생',
      tier: 'FREE',
      positioningVersions: [],
      enrolledCourseIds: ['course-01', 'course-02'],
      completedLessonIds: [],
      isAdmin: false
    };

    setUserProfile(newProfile);
    setCurrentTier('FREE');
    setCurrentTab('classes');
  };

  // Login success handler (DB matching)
  const handleLoginSuccess = async (_loggedInUser: ManagedUser) => {
    try {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const res = await syncUserAccess(user);
        if (res?.isAdmin) {
          setCurrentTab('admin');
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setCurrentTab('classes');
  };

  const handleProPaymentSuccess = async (newPayment: PaymentRecord) => {
    setPayments((prev) => [newPayment, ...prev]);

    if (newPayment.status === '결제완료') {
      setCurrentTier('PRO');
      setUserProfile((prev) => ({ ...prev, tier: 'PRO' }));
    }

    setManagedUsers((prev) => {
      const existingUserIdx = prev.findIndex((u) => u.email === newPayment.userEmail);
      let updatedUser: any;
      if (existingUserIdx >= 0) {
        const updated = [...prev];
        updated[existingUserIdx] = {
          ...updated[existingUserIdx],
          tier: newPayment.status === '결제완료' ? 'PRO' : updated[existingUserIdx].tier,
          notes: `신청 내역: ${newPayment.productName} (${newPayment.status}) - ${newPayment.amount.toLocaleString()}원`
        };
        updatedUser = updated[existingUserIdx];
        return updated;
      }
      updatedUser = {
        id: `usr-${Date.now()}`,
        name: newPayment.userName,
        email: newPayment.userEmail,
        phone: userProfile.phone || '010-3849-1920',
        tier: newPayment.status === '결제완료' ? 'PRO' : currentTier,
        joinedDate: new Date().toISOString().slice(0, 10),
        lastLoginDate: '방금 전',
        targetJob: 'PRO 멤버십 신청자',
        totalSpent: newPayment.status === '결제완료' ? newPayment.amount : 0,
        status: '활성',
        notes: `신청 플랜: ${newPayment.productName} [${newPayment.status}] (${newPayment.amount.toLocaleString()}원, 주문번호: ${newPayment.orderNumber})`
      };
      return [updatedUser, ...prev];
    });
  };

  const handleLogout = () => {
    setUserProfile(GUEST_PROFILE);
    setCurrentTier('NON_MEMBER');
    localStorage.removeItem(STORAGE_AUTH_KEY);
    setCurrentTab('home');
  };

  const renderCurrentView = () => {
    // Auth View (Login & Sign Up unified tab view)
    if (currentTab === 'login' || currentTab === 'signup' || currentTab === 'auth') {
      return (
        <AuthView
          initialMode={currentTab === 'signup' ? 'signup' : 'login'}
          onLoginSuccess={handleLoginSuccess}
          onSignUpSuccess={handleSignUpSuccess}
          onTabChange={handleTabChange}
          managedUsers={managedUsers}
        />
      );
    }

    // Admin View (Protected via Supabase user_access table in AdminView)
    if (currentTab === 'admin') {
      return <AdminView onTabChange={handleTabChange} />;
    }

    // PRO payment preview is accessible to view membership tiers
    if (currentTab === 'pro-payment') {
      return (
        <ProPaymentView
          currentTier={currentTier}
          userProfile={userProfile}
          onPaymentComplete={handleProPaymentSuccess}
          onTabChange={handleTabChange}
        />
      );
    }

    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            onTabChange={handleTabChange}
            onSelectCourse={() => setCurrentTab('classes')}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        );
      case 'repositioning':
        return (
          <PhilosophyView
            onTabChange={handleTabChange}
          />
        );
      case 'classes':
        if (siteFeatures.repositioning_class !== true) {
          return (
            <HomeView
              onTabChange={handleTabChange}
              onSelectCourse={() => handleTabChange('classes')}
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          );
        }
        return (
          <ClassesView
            currentTier={currentTier}
            onTabChange={handleTabChange}
            courses={courses}
          />
        );
      case 'bootcamp':
        return (
          <BootcampView
            currentTier={currentTier}
            onTabChange={handleTabChange}
            reviews={reviews}
            onAddReview={handleAddReview}
            onApplicationSubmitted={() => {
              setUserProfile((prev) => ({
                ...prev,
                bootcampApplicationStatus: '심사중'
              }));
              const newPayment: PaymentRecord = {
                id: `pay-${Date.now()}`,
                orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
                userName: userProfile.name || '수강생',
                userEmail: userProfile.email || 'user@example.com',
                productType: 'BOOTCAMP',
                productName: '1:1 리포지셔닝 부트캠프 8기 (프로 플랜)',
                amount: 1490000,
                status: '결제완료',
                paidAt: new Date().toISOString().slice(0, 10),
                paymentMethod: '카드결제'
              };
              setPayments((prev) => [newPayment, ...prev]);
            }}
          />
        );
      case 'practical':
        if (siteFeatures.practical_tools !== true) {
          return (
            <HomeView
              onTabChange={handleTabChange}
              onSelectCourse={() => handleTabChange('classes')}
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          );
        }
        return (
          <PracticalView
            currentTier={currentTier}
            activeSubTab={practicalSubTab}
            onSubTabChange={(sub) => setPracticalSubTab(sub)}
            onTabChange={handleTabChange}
            onChangeTier={(tier) => setCurrentTier(tier)}
          />
        );
      case 'mylms':
        return (
          <MyLmsView
            user={userProfile}
            currentTier={currentTier}
            onUpdateUser={(updated) => setUserProfile(updated)}
            onTabChange={handleTabChange}
          />
        );
      case 'terms':
        return <TermsView onTabChange={handleTabChange} />;
      case 'privacy':
        return <PrivacyView onTabChange={handleTabChange} />;
      case 'policy':
        return <PolicyView onTabChange={handleTabChange} />;
      default:
        return (
          <HomeView
            onTabChange={handleTabChange}
            onSelectCourse={() => setCurrentTab('classes')}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col font-sans selection:bg-[#FFD600] selection:text-[#09090B]">
      {/* Header Bar */}
      <Header
        currentTab={currentTab}
        practicalSubTab={practicalSubTab}
        onTabChange={handleTabChange}
        currentTier={currentTier}
        isAdmin={Boolean(userProfile.isAdmin)}
        userName={userProfile.name}
        onLogout={handleLogout}
        siteFeatures={siteFeatures}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer
        onTabChange={handleTabChange}
        siteFeatures={siteFeatures}
      />
    </div>
  );
}
