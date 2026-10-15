import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  MousePointerClick,
  Eye,
  RefreshCw,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsEventRow {
  id: number;
  event_name: string;
  visitor_id: string;
  session_id: string;
  page_path: string;
  referrer_path?: string;
  button_location?: string;
  bootcamp_cohort?: number;
  device_type: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  created_at: string;
}

export const AnalyticsAdminTab: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'yesterday' | '7days' | '30days' | 'custom'>('7days');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  
  const [events, setEvents] = useState<AnalyticsEventRow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      let query = supabase.from('analytics_events').select('*');

      const now = new Date();
      let startDate = new Date();

      if (period === 'today') {
        startDate.setHours(0, 0, 0, 0);
        query = query.gte('created_at', startDate.toISOString());
      } else if (period === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd.setHours(23, 59, 59, 999);
        query = query.gte('created_at', yesterday.toISOString()).lte('created_at', yesterdayEnd.toISOString());
      } else if (period === '7days') {
        startDate.setDate(startDate.getDate() - 7);
        query = query.gte('created_at', startDate.toISOString());
      } else if (period === '30days') {
        startDate.setDate(startDate.getDate() - 30);
        query = query.gte('created_at', startDate.toISOString());
      } else if (period === 'custom' && customStart && customEnd) {
        query = query.gte('created_at', `${customStart}T00:00:00Z`).lte('created_at', `${customEnd}T23:59:59Z`);
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(5000);

      if (error) {
        throw error;
      }

      setEvents(data || []);
      setLastUpdated(new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }));
    } catch (err: any) {
      console.error('Fetch analytics error:', err);
      setErrorMsg(err.message || '통계 데이터를 불러오지 못했습니다. analytics_events 테이블이 존재하는지 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period, customStart, customEnd]);

  // Calculations
  const uniqueVisitors = new Set(events.map((e) => e.visitor_id)).size;
  const totalVisits = new Set(events.map((e) => e.session_id)).size;
  const pageViews = events.filter((e) => e.event_name === 'page_view').length;
  const homeBootcampClicks = events.filter((e) => e.event_name === 'bootcamp_click').length;
  const bootcampDetailViews = events.filter((e) => e.event_name === 'bootcamp_detail_view').length;
  const inquiryClicks = events.filter((e) => e.event_name === 'inquiry_click').length;

  // Session-based conversion rate calculation
  const homeVisitSessions = new Set(events.filter((e) => e.page_path === 'home' || !e.page_path).map((e) => e.session_id)).size;
  const bootcampClickSessions = new Set(events.filter((e) => e.event_name === 'bootcamp_click').map((e) => e.session_id)).size;
  const detailViewSessions = new Set(events.filter((e) => e.event_name === 'bootcamp_detail_view').map((e) => e.session_id)).size;
  const inquiryClickSessions = new Set(events.filter((e) => e.event_name === 'inquiry_click').map((e) => e.session_id)).size;

  const bootcampClickRate = homeVisitSessions > 0 ? ((bootcampClickSessions / homeVisitSessions) * 100).toFixed(1) : null;
  const detailReachRate = bootcampClickSessions > 0 ? ((detailViewSessions / bootcampClickSessions) * 100).toFixed(1) : null;
  const inquiryClickRate = detailViewSessions > 0 ? ((inquiryClickSessions / detailViewSessions) * 100).toFixed(1) : null;
  const totalInquiryConversionRate = totalVisits > 0 ? ((inquiryClickSessions / totalVisits) * 100).toFixed(1) : null;

  // Button locations breakdown
  const buttonLocationCounts: Record<string, number> = {};
  events.filter((e) => e.button_location).forEach((e) => {
    const loc = e.button_location || '기타';
    buttonLocationCounts[loc] = (buttonLocationCounts[loc] || 0) + 1;
  });

  // Device type breakdown
  const deviceCounts = { pc: 0, mobile: 0, tablet: 0 };
  const deviceInquiryCounts = { pc: 0, mobile: 0, tablet: 0 };
  events.forEach((e) => {
    if (e.device_type === 'mobile') {
      deviceCounts.mobile++;
      if (e.event_name === 'inquiry_click') deviceInquiryCounts.mobile++;
    } else if (e.device_type === 'tablet') {
      deviceCounts.tablet++;
      if (e.event_name === 'inquiry_click') deviceInquiryCounts.tablet++;
    } else {
      deviceCounts.pc++;
      if (e.event_name === 'inquiry_click') deviceInquiryCounts.pc++;
    }
  });

  // Traffic source breakdown
  const trafficCounts: Record<string, number> = {};
  events.forEach((e) => {
    const source = e.utm_source || '직접 방문·출처 미확인';
    trafficCounts[source] = (trafficCounts[source] || 0) + 1;
  });

  // Poster performance comparison (poster1, poster2, poster3)
  const posterStats: Record<string, { visits: number; bootcampClicks: number; detailViews: number; inquiryClicks: number; inquirySessions: Set<string> }> = {
    poster1: { visits: 0, bootcampClicks: 0, detailViews: 0, inquiryClicks: 0, inquirySessions: new Set() },
    poster2: { visits: 0, bootcampClicks: 0, detailViews: 0, inquiryClicks: 0, inquirySessions: new Set() },
    poster3: { visits: 0, bootcampClicks: 0, detailViews: 0, inquiryClicks: 0, inquirySessions: new Set() }
  };

  events.forEach((e) => {
    const content = e.utm_content;
    if (content && posterStats[content]) {
      if (e.event_name === 'page_view') posterStats[content].visits++;
      if (e.event_name === 'bootcamp_click') posterStats[content].bootcampClicks++;
      if (e.event_name === 'bootcamp_detail_view') posterStats[content].detailViews++;
      if (e.event_name === 'inquiry_click') {
        posterStats[content].inquiryClicks++;
        posterStats[content].inquirySessions.add(e.session_id);
      }
    }
  });

  // Top pages
  const pageCounts: Record<string, number> = {};
  events.filter((e) => e.event_name === 'page_view').forEach((e) => {
    const p = e.page_path || 'home';
    pageCounts[p] = (pageCounts[p] || 0) + 1;
  });

  const popupVariantLabels: Record<string, string> = {
    bootcamp_popup_1: '1안 · 단 3주 최정예 리포지셔너',
    bootcamp_popup_2: '2안 · 아직도 혼자 준비하세요?',
    bootcamp_popup_3: '3안 · 자소서만 고치세요?',
    bootcamp_popup_4: '4안 · 수많은 후기가 증명한 3주'
  };
  const popupStats = Object.entries(popupVariantLabels).map(([key, label]) => {
    const variantEvents = events.filter((event) => event.button_location === key);
    const views = variantEvents.filter((event) => event.event_name === 'bootcamp_popup_view').length;
    const clicks = variantEvents.filter((event) => event.event_name === 'bootcamp_popup_click').length;
    const closes = variantEvents.filter((event) => event.event_name === 'bootcamp_popup_close').length;
    const snoozes = variantEvents.filter((event) => event.event_name === 'bootcamp_popup_snooze').length;
    return {
      key,
      label,
      views,
      clicks,
      closes,
      snoozes,
      clickRate: views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0'
    };
  });
  const totalPopupViews = popupStats.reduce((sum, item) => sum + item.views, 0);
  const totalPopupClicks = popupStats.reduce((sum, item) => sum + item.clicks, 0);
  const totalPopupClickRate = totalPopupViews > 0
    ? ((totalPopupClicks / totalPopupViews) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header & Period Filter Controls */}
      <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-black rounded-full">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>VISIT & CONVERSION ANALYTICS</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">방문·전환 통계 대시보드</h2>
          <p className="text-xs text-zinc-400">
            사이트 방문부터 부트캠프 클릭, 상세페이지 조회, 문의 클릭에 이르는 전환 퍼널과 유입 성과를 실시간으로 확인합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl p-1">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${period === 'today' ? 'bg-[#FFD600] text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
            >
              오늘
            </button>
            <button
              onClick={() => setPeriod('yesterday')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${period === 'yesterday' ? 'bg-[#FFD600] text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
            >
              어제
            </button>
            <button
              onClick={() => setPeriod('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${period === '7days' ? 'bg-[#FFD600] text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
            >
              최근 7일
            </button>
            <button
              onClick={() => setPeriod('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${period === '30days' ? 'bg-[#FFD600] text-zinc-950' : 'text-zinc-400 hover:text-white'}`}
            >
              최근 30일
            </button>
          </div>

          <button
            onClick={fetchAnalyticsData}
            disabled={isLoading}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50 text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FFD600]' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300">
          <span className="font-bold">통계 로드 오류:</span> {errorMsg}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* 1. 고유 방문자 */}
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold">고유 방문자 수</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {uniqueVisitors.toLocaleString()} <span className="text-xs font-normal text-zinc-500">명</span>
          </div>
        </div>

        {/* 2. 방문 수 (세션) */}
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold">총 방문 수</span>
            <Globe className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalVisits.toLocaleString()} <span className="text-xs font-normal text-zinc-500">회</span>
          </div>
        </div>

        {/* 3. 페이지 조회수 */}
        <div className="bg-[#121216] border border-[#27272A] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold">페이지 조회수</span>
            <Eye className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {pageViews.toLocaleString()} <span className="text-xs font-normal text-zinc-500">회</span>
          </div>
        </div>

        {/* 4. 홈 부트캠프 클릭 */}
        <div className="bg-[#121216] border border-[#FFD600]/30 rounded-2xl p-5 space-y-2 bg-gradient-to-br from-[#121216] to-[#FFD600]/5">
          <div className="flex items-center justify-between text-[#FFD600]">
            <span className="text-xs font-bold">부트캠프 클릭</span>
            <Sparkles className="w-4 h-4 text-[#FFD600]" />
          </div>
          <div className="text-2xl font-black text-[#FFD600]">
            {homeBootcampClicks.toLocaleString()} <span className="text-xs font-normal text-amber-500/80">회</span>
          </div>
        </div>

        {/* 5. 상세페이지 조회 */}
        <div className="bg-[#121216] border border-indigo-500/30 rounded-2xl p-5 space-y-2 bg-gradient-to-br from-[#121216] to-indigo-500/5">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold">상세페이지 조회</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300">
            {bootcampDetailViews.toLocaleString()} <span className="text-xs font-normal text-indigo-400/80">회</span>
          </div>
        </div>

        {/* 6. 문의 클릭 */}
        <div className="bg-[#121216] border border-emerald-500/30 rounded-2xl p-5 space-y-2 bg-gradient-to-br from-[#121216] to-emerald-500/5">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold">문의 클릭</span>
            <MousePointerClick className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">
            {inquiryClicks.toLocaleString()} <span className="text-xs font-normal text-emerald-400/80">회</span>
          </div>
        </div>
      </div>

      {/* Conversion Funnel Flow */}
      <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FFD600]" />
            <span>전환 퍼널 흐름 및 전환율 (고유 세션 기준)</span>
          </h3>
          <span className="text-xs text-zinc-400">분모가 0일 경우 '계산할 데이터 없음'으로 표시됩니다.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 text-center">
            <span className="text-xs text-zinc-400 font-bold">1단계: 홈 방문</span>
            <div className="text-xl font-black text-white">{homeVisitSessions} 세션</div>
            <div className="text-[11px] text-zinc-500">기준 방문</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 text-center relative">
            <span className="text-xs text-zinc-400 font-bold">2단계: 부트캠프 클릭</span>
            <div className="text-xl font-black text-[#FFD600]">{bootcampClickSessions} 세션</div>
            <div className="text-xs font-black text-amber-400">
              클릭률: {bootcampClickRate !== null ? `${bootcampClickRate}%` : '계산할 데이터 없음'}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 text-center">
            <span className="text-xs text-zinc-400 font-bold">3단계: 상세페이지 조회</span>
            <div className="text-xl font-black text-indigo-300">{detailViewSessions} 세션</div>
            <div className="text-xs font-black text-indigo-400">
              도달률: {detailReachRate !== null ? `${detailReachRate}%` : '계산할 데이터 없음'}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 text-center">
            <span className="text-xs text-zinc-400 font-bold">4단계: 문의 클릭</span>
            <div className="text-xl font-black text-emerald-300">{inquiryClickSessions} 세션</div>
            <div className="text-xs font-black text-emerald-400">
              문의 클릭률: {inquiryClickRate !== null ? `${inquiryClickRate}%` : '계산할 데이터 없음'}
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-300">
          <div>
            <span className="font-bold text-white">전체 문의 전환율 (문의 클릭 세션 ÷ 총 방문 세션): </span>
            <span className="text-[#FFD600] font-black text-sm">
              {totalInquiryConversionRate !== null ? `${totalInquiryConversionRate}%` : '계산할 데이터 없음'}
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">※ '문의 클릭'은 상담/신청 완료가 아닌 외부 링크(카카오톡 등) 이동 직전 클릭 기준입니다.</span>
        </div>
      </div>

      {/* Bootcamp Popup Ad Performance */}
      <div className="bg-[#121216] border border-[#FFD600]/25 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col gap-3 border-b border-zinc-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFD600]" />
              <span>부트캠프 팝업광고 성과</span>
            </h3>
            <p className="mt-2 text-xs text-zinc-500">팝업을 본 횟수 중 본문 또는 버튼을 눌러 부트캠프 상세페이지로 들어온 비율입니다.</p>
          </div>
          <div className="rounded-xl border border-[#FFD600]/25 bg-[#FFD600]/5 px-4 py-3 text-right">
            <div className="text-[10px] font-bold text-zinc-500">전체 팝업 클릭률</div>
            <div className="mt-1 text-xl font-black text-[#FFD600]">{totalPopupClickRate}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {popupStats.map((item) => (
            <div key={item.key} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black text-[#FFD600]">{item.key.replace('bootcamp_popup_', '')}번 광고</span>
                  <h4 className="mt-1 text-sm font-black text-white">{item.label}</h4>
                </div>
                <span className="shrink-0 rounded-lg bg-[#FFD600]/10 px-2.5 py-1.5 text-xs font-black text-[#FFD600]">
                  클릭률 {item.clickRate}%
                </span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                {[
                  ['노출', item.views],
                  ['상세 이동', item.clicks],
                  ['닫기', item.closes],
                  ['6시간 숨김', item.snoozes]
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-xl bg-zinc-950 px-2 py-3">
                    <div className="text-[10px] text-zinc-500">{label}</div>
                    <div className="mt-1 text-sm font-black text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Poster Performance Comparison & Button Location Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Poster 1, 2, 3 Performance Comparison */}
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 space-y-6 shadow-xl">
          <h3 className="text-md font-black text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
            <Award className="w-4 h-4 text-[#FFD600]" />
            <span>포스터별 (1안·2안·3안) 성과 비교</span>
          </h3>

          <div className="space-y-4">
            {(['poster1', 'poster2', 'poster3'] as const).map((posterKey) => {
              const st = posterStats[posterKey];
              const convRate = st.visits > 0 ? ((st.inquirySessions.size / st.visits) * 100).toFixed(1) : '0.0';
              return (
                <div key={posterKey} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#FFD600] uppercase">{posterKey} 성과</span>
                    <span className="text-xs font-bold text-emerald-400">문의 전환율: {convRate}%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-zinc-950 p-2 rounded-xl">
                      <div className="text-zinc-500 text-[10px]">방문 수</div>
                      <div className="font-black text-white">{st.visits}</div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded-xl">
                      <div className="text-zinc-500 text-[10px]">캠프 클릭</div>
                      <div className="font-black text-white">{st.bootcampClicks}</div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded-xl">
                      <div className="text-zinc-500 text-[10px]">상세 조회</div>
                      <div className="font-black text-white">{st.detailViews}</div>
                    </div>
                    <div className="bg-zinc-950 p-2 rounded-xl">
                      <div className="text-zinc-500 text-[10px]">문의 클릭</div>
                      <div className="font-black text-white">{st.inquiryClicks}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Button Location Breakdown */}
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 space-y-6 shadow-xl">
          <h3 className="text-md font-black text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
            <MousePointerClick className="w-4 h-4 text-indigo-400" />
            <span>버튼 위치별 클릭수 (Button Location)</span>
          </h3>

          <div className="space-y-3">
            {Object.keys(buttonLocationCounts).length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">집계된 버튼 클릭 데이터가 없습니다.</div>
            ) : (
              Object.entries(buttonLocationCounts).map(([loc, cnt]) => (
                <div key={loc} className="flex items-center justify-between p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <span className="text-xs font-bold text-zinc-300 font-mono">{loc}</span>
                  <span className="text-xs font-black text-[#FFD600]">{cnt} 회</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Device & Traffic Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Device Type Breakdown */}
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 space-y-6 shadow-xl">
          <h3 className="text-md font-black text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
            <Smartphone className="w-4 h-4 text-[#FFD600]" />
            <span>기기 유형별 방문수 및 문의 클릭</span>
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-2">
              <Monitor className="w-5 h-5 mx-auto text-zinc-400" />
              <div className="text-xs text-zinc-400 font-bold">PC</div>
              <div className="text-lg font-black text-white">{deviceCounts.pc} 회</div>
              <div className="text-[11px] text-emerald-400">문의 {deviceInquiryCounts.pc}회</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-2">
              <Smartphone className="w-5 h-5 mx-auto text-[#FFD600]" />
              <div className="text-xs text-zinc-400 font-bold">모바일</div>
              <div className="text-lg font-black text-white">{deviceCounts.mobile} 회</div>
              <div className="text-[11px] text-emerald-400">문의 {deviceInquiryCounts.mobile}회</div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center space-y-2">
              <Tablet className="w-5 h-5 mx-auto text-indigo-400" />
              <div className="text-xs text-zinc-400 font-bold">태블릿</div>
              <div className="text-lg font-black text-white">{deviceCounts.tablet} 회</div>
              <div className="text-[11px] text-emerald-400">문의 {deviceInquiryCounts.tablet}회</div>
            </div>
          </div>
        </div>

        {/* Traffic Source Breakdown */}
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 space-y-6 shadow-xl">
          <h3 className="text-md font-black text-white flex items-center gap-2 border-b border-zinc-800 pb-4">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>유입 경로별 (UTM Source) 방문수</span>
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto">
            {Object.keys(trafficCounts).length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">유입 경로 데이터가 없습니다.</div>
            ) : (
              Object.entries(trafficCounts).map(([src, cnt]) => (
                <div key={src} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <span className="text-xs font-bold text-zinc-300 truncate max-w-[200px]">{src}</span>
                  <span className="text-xs font-black text-indigo-300">{cnt} 회</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Footer status */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-2">
        <span>마지막 데이터 갱신 시각: {lastUpdated || '방금 전'}</span>
        <span>수집된 총 이벤트 수: {events.length.toLocaleString()} 건</span>
      </div>

    </div>
  );
};
