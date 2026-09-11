import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  RefreshCw,
  Calendar,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Edit3,
  Trash2,
  MoreVertical,
  Settings,
  TrendingUp,
  CreditCard,
  Receipt,
  Tag,
  ChevronDown,
  Layers,
  Award,
  Crown
} from 'lucide-react';
import {
  RevenueProduct,
  RevenueTransaction,
  ProductGroup,
  TransactionStatus,
  PaymentMethod
} from '../../types';
import {
  fetchRevenueProducts,
  fetchRevenueTransactions,
  saveRevenueProduct,
  toggleOrDeleteProduct,
  saveRevenueTransaction,
  updateTransactionStatusAction,
  deleteRevenueTransaction,
  formatCurrency,
  getKoreaTodayDate
} from '../../lib/revenueService';

interface RevenueAdminTabProps {
  adminEmail: string;
}

export const RevenueAdminTab: React.FC<RevenueAdminTabProps> = ({ adminEmail }) => {
  const [products, setProducts] = useState<RevenueProduct[]>([]);
  const [transactions, setTransactions] = useState<RevenueTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Search & Filters for Transaction Table
  const [dateFilterMode, setDateFilterMode] = useState<'all' | 'today' | 'this_month' | 'this_year' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [filterProductGroup, setFilterProductGroup] = useState<string>('all');
  const [filterProductId, setFilterProductId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Month / Year for Charts & Analytics
  const [analyticsYear, setAnalyticsYear] = useState<string>(new Date().getFullYear().toString());
  const [analyticsMonth, setAnalyticsMonth] = useState<string>(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  );

  // Modals state
  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<RevenueTransaction | null>(null);
  const [isSavingTransaction, setIsSavingTransaction] = useState<boolean>(false);

  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<RevenueProduct | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  const [showProductSettingsModal, setShowProductSettingsModal] = useState<boolean>(false);
  const [activeMenuTxId, setActiveMenuTxId] = useState<string | null>(null);

  // Transaction Form State
  const [txForm, setTxForm] = useState({
    sale_date: getKoreaTodayDate(),
    product_group: 'pro_membership' as ProductGroup,
    product_id: '',
    customer_name: '',
    customer_email: '',
    gross_amount: 0,
    refund_amount: 0,
    status: 'paid' as TransactionStatus,
    payment_method: 'card' as PaymentMethod,
    memo: '',
    member_user_id: ''
  });

  // Product Form State
  const [productForm, setProductForm] = useState({
    product_group: 'pro_membership' as ProductGroup,
    plan_name: '',
    default_price: 0,
    is_active: true,
    sort_order: 1
  });

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [prods, txs] = await Promise.all([
        fetchRevenueProducts(),
        fetchRevenueTransactions()
      ]);
      setProducts(prods);
      setTransactions(txs);
    } catch (err: any) {
      console.error('Failed to load revenue data:', err);
      setErrorMessage(err.message || '매출 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Fixed Summary Calculations (Independent of Table Filters) ---
  const todayStr = getKoreaTodayDate();
  const [currentYear, currentMonthStr] = todayStr.split('-');
  const thisMonthPrefix = `${currentYear}-${currentMonthStr}`;

  const computeSummaryForList = (txList: RevenueTransaction[]) => {
    const revenueTxs = txList.filter(t => t.grant_type !== 'promotion' && (t.status === 'paid' || t.status === 'partially_refunded'));
    const totalGross = revenueTxs.reduce((sum, t) => sum + (t.gross_amount || 0), 0);
    const totalRefund = txList.filter(t => t.grant_type !== 'promotion').reduce((sum, t) => sum + (t.refund_amount || 0), 0);
    const totalNet = revenueTxs.reduce((sum, t) => sum + (t.net_amount || 0), 0);
    const count = revenueTxs.length;

    return {
      gross: totalGross,
      refund: totalRefund,
      net: totalNet,
      count
    };
  };

  const todayTxs = transactions.filter(t => t.sale_date === todayStr);
  const monthTxs = transactions.filter(t => t.sale_date && t.sale_date.startsWith(thisMonthPrefix));
  const yearTxs = transactions.filter(t => t.sale_date && t.sale_date.startsWith(currentYear));

  const todaySummary = computeSummaryForList(todayTxs);
  const monthSummary = computeSummaryForList(monthTxs);
  const yearSummary = computeSummaryForList(yearTxs);

  // --- Filtered Transactions for Table & Table Summary ---
  const filteredTransactions = transactions.filter(t => {
    // Date filter
    if (dateFilterMode === 'today') {
      if (t.sale_date !== todayStr) return false;
    } else if (dateFilterMode === 'this_month') {
      if (!t.sale_date || !t.sale_date.startsWith(thisMonthPrefix)) return false;
    } else if (dateFilterMode === 'this_year') {
      if (!t.sale_date || !t.sale_date.startsWith(currentYear)) return false;
    } else if (dateFilterMode === 'custom') {
      if (customStartDate && t.sale_date < customStartDate) return false;
      if (customEndDate && t.sale_date > customEndDate) return false;
    }

    // Product Group filter
    if (filterProductGroup !== 'all') {
      if (t.revenue_products?.product_group !== filterProductGroup) return false;
    }

    // Product ID filter
    if (filterProductId !== 'all') {
      if (t.product_id !== filterProductId) return false;
    }

    // Status filter
    if (filterStatus !== 'all') {
      if (t.status !== filterStatus) return false;
    }

    // Search query (customer name or email)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const nameMatch = t.customer_name?.toLowerCase().includes(q) || false;
      const emailMatch = t.customer_email?.toLowerCase().includes(q) || false;
      if (!nameMatch && !emailMatch) return false;
    }

    return true;
  });

  const filteredTableSummary = computeSummaryForList(filteredTransactions);

  // --- Handle Transaction Form Modal ---
  const handleOpenAddTxModal = () => {
    setEditingTransaction(null);
    const activeProds = products.filter(p => p.is_active);
    const defaultProd = activeProds[0];
    setTxForm({
      sale_date: getKoreaTodayDate(),
      product_group: defaultProd?.product_group || 'pro_membership',
      product_id: defaultProd?.id || '',
      customer_name: '',
      customer_email: '',
      gross_amount: defaultProd?.default_price || 0,
      refund_amount: 0,
      status: 'paid',
      payment_method: 'card',
      memo: '',
      member_user_id: ''
    });
    setShowTransactionModal(true);
  };

  const handleOpenEditTxModal = (tx: RevenueTransaction) => {
    setEditingTransaction(tx);
    const prod = products.find(p => p.id === tx.product_id);
    setTxForm({
      sale_date: tx.sale_date || getKoreaTodayDate(),
      product_group: prod?.product_group || 'pro_membership',
      product_id: tx.product_id,
      customer_name: tx.customer_name || '',
      customer_email: tx.customer_email || '',
      gross_amount: tx.gross_amount || 0,
      refund_amount: tx.refund_amount || 0,
      status: tx.status || 'paid',
      payment_method: tx.payment_method || 'card',
      memo: tx.memo || '',
      member_user_id: tx.member_user_id || ''
    });
    setShowTransactionModal(true);
  };

  const handleProductChangeInTxForm = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    setTxForm(prev => ({
      ...prev,
      product_id: productId,
      product_group: prod ? prod.product_group : prev.product_group,
      gross_amount: prod ? prod.default_price : prev.gross_amount
    }));
  };

  const handleSaveTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingTransaction) return;

    if (!txForm.product_id) {
      alert('상품을 선택해주세요.');
      return;
    }
    if (!txForm.customer_name.trim()) {
      alert('고객명을 입력해주세요.');
      return;
    }

    setIsSavingTransaction(true);
    setErrorMessage('');

    try {
      const res = await saveRevenueTransaction(
        {
          sale_date: txForm.sale_date,
          product_id: txForm.product_id,
          customer_name: txForm.customer_name.trim(),
          customer_email: txForm.customer_email.trim(),
          gross_amount: Number(txForm.gross_amount),
          refund_amount: Number(txForm.refund_amount),
          status: txForm.status,
          payment_method: txForm.payment_method,
          memo: txForm.memo.trim(),
          member_user_id: txForm.member_user_id.trim() || undefined
        },
        !!editingTransaction,
        editingTransaction?.id,
        adminEmail
      );

      if (!res.success) {
        throw new Error(res.error || '저장에 실패했습니다.');
      }

      setSuccessMessage('매출 내역이 성공적으로 저장되었습니다.');
      setShowTransactionModal(false);
      await loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      console.error('Save transaction error:', err);
      setErrorMessage(err.message || '매출 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingTransaction(false);
    }
  };

  // --- Handle Product Settings Modal ---
  const handleOpenAddProdModal = () => {
    setEditingProduct(null);
    setProductForm({
      product_group: 'pro_membership',
      plan_name: '',
      default_price: 100000,
      is_active: true,
      sort_order: products.length + 1
    });
    setShowProductModal(true);
  };

  const handleOpenEditProdModal = (prod: RevenueProduct) => {
    setEditingProduct(prod);
    setProductForm({
      product_group: prod.product_group,
      plan_name: prod.plan_name,
      default_price: prod.default_price,
      is_active: prod.is_active,
      sort_order: prod.sort_order
    });
    setShowProductModal(true);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingProduct) return;
    if (!productForm.plan_name.trim()) {
      alert('상품명을 입력해주세요.');
      return;
    }

    setIsSavingProduct(true);
    setErrorMessage('');

    try {
      const res = await saveRevenueProduct(
        {
          product_group: productForm.product_group,
          plan_name: productForm.plan_name.trim(),
          default_price: Number(productForm.default_price),
          is_active: productForm.is_active,
          sort_order: Number(productForm.sort_order)
        },
        !!editingProduct,
        editingProduct?.id
      );

      if (!res.success) throw new Error(res.error);

      setSuccessMessage('상품 설정이 성공적으로 저장되었습니다.');
      setShowProductModal(false);
      await loadData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      console.error('Save product error:', err);
      setErrorMessage(err.message || '상품 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleToggleProductActive = async (prod: RevenueProduct) => {
    const nextState = !prod.is_active;
    const res = await toggleOrDeleteProduct(prod.id, nextState);
    if (!res.success) {
      alert(res.error || '상품 상태 변경 실패');
    } else {
      loadData();
    }
  };

  // --- Status change / Refund / Cancel / Delete ---
  const handleUpdateStatus = async (tx: RevenueTransaction, newStatus: TransactionStatus) => {
    let confirmMsg = `해당 거래 상태를 [${newStatus}]로 변경하시겠습니까?`;
    if (newStatus === 'refunded') confirmMsg = '전액 환불 처리하시겠습니까? 순매출이 0원으로 변경됩니다.';
    if (newStatus === 'cancelled') confirmMsg = '결제 취소 처리하시겠습니까? 순매출이 0원으로 변경됩니다.';
    
    if (!window.confirm(confirmMsg)) return;

    const res = await updateTransactionStatusAction(tx.id, newStatus, tx.gross_amount, tx.refund_amount);
    if (!res.success) {
      alert(res.error || '상태 변경 실패');
    } else {
      setSuccessMessage('거래 상태가 변경되었습니다.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteTx = async (txId: string) => {
    setActiveMenuTxId(null);
    if (!window.confirm('정말 이 매출 거래 내역을 삭제하시겠습니까? 복구할 수 없습니다.')) return;

    const res = await deleteRevenueTransaction(txId);
    if (!res.success) {
      alert(res.error || '삭제 실패');
    } else {
      setSuccessMessage('매출 거래가 삭제되었습니다.');
      loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // --- Analytics & Charts Data Calculation ---
  // 1. Monthly Daily Trend for analyticsMonth (e.g. '2026-09')
  const [targetYear, targetMonthNum] = analyticsMonth.split('-');
  const daysInMonth = new Date(Number(targetYear), Number(targetMonthNum), 0).getDate();
  const dailyTrendData = Array.from({ length: daysInMonth }, (_, i) => {
    const dayStr = String(i + 1).padStart(2, '0');
    const dateKey = `${analyticsMonth}-${dayStr}`;
    const dayTxs = transactions.filter(t => t.sale_date === dateKey && (t.status === 'paid' || t.status === 'partially_refunded'));
    const net = dayTxs.reduce((sum, t) => sum + (t.net_amount || 0), 0);
    return { day: i + 1, dateKey, net };
  });
  const maxDailyNet = Math.max(...dailyTrendData.map(d => d.net), 100000);

  // 2. Yearly Monthly Trend for analyticsYear (e.g. '2026')
  const monthlyTrendData = Array.from({ length: 12 }, (_, i) => {
    const mStr = String(i + 1).padStart(2, '0');
    const prefix = `${analyticsYear}-${mStr}`;
    const monthTxs = transactions.filter(t => t.sale_date && t.sale_date.startsWith(prefix) && (t.status === 'paid' || t.status === 'partially_refunded'));
    const net = monthTxs.reduce((sum, t) => sum + (t.net_amount || 0), 0);
    return { month: i + 1, prefix, net };
  });
  const maxMonthlyNet = Math.max(...monthlyTrendData.map(d => d.net), 1000000);

  // 3. Product-level Aggregations
  const productStatsMap: Record<string, { name: string; group: string; count: number; gross: number; refund: number; net: number }> = {};
  products.forEach(p => {
    productStatsMap[p.id] = {
      name: p.plan_name,
      group: p.product_group,
      count: 0,
      gross: 0,
      refund: 0,
      net: 0
    };
  });

  transactions.forEach(t => {
    const pId = t.product_id;
    if (!productStatsMap[pId]) {
      productStatsMap[pId] = {
        name: t.plan_name || '기타 상품',
        group: t.revenue_products?.product_group || 'pro_membership',
        count: 0,
        gross: 0,
        refund: 0,
        net: 0
      };
    }
    if (t.status === 'paid' || t.status === 'partially_refunded') {
      productStatsMap[pId].count += 1;
      productStatsMap[pId].gross += (t.gross_amount || 0);
    }
    productStatsMap[pId].refund += (t.refund_amount || 0);
    productStatsMap[pId].net += (t.net_amount || 0);
  });

  const productStatsList = Object.values(productStatsMap);

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'paid':
        return <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-lg text-[11px]">결제 완료</span>;
      case 'partially_refunded':
        return <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold rounded-lg text-[11px]">부분 환불</span>;
      case 'refunded':
        return <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold rounded-lg text-[11px]">전액 환불</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold rounded-lg text-[11px]">결제 취소</span>;
    }
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'bank_transfer': return '계좌이체';
      case 'card': return '카드';
      case 'cash': return '현금';
      case 'other': return '기타';
      default: return method;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFD600]/10 border border-[#FFD600]/30 text-[#FFD600] text-xs font-black rounded-lg mb-2">
            <DollarSign className="w-3.5 h-3.5" />
            <span>REVENUE MANAGEMENT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">매출 관리 및 정산 대시보드</h2>
          <p className="text-xs text-zinc-400 mt-1">부트캠프 및 PRO 멤버십 매출 현황을 실시간으로 집계하고 수기 결제를 관리합니다.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProductSettingsModal(true)}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#FFD600]" />
            <span>상품 설정</span>
          </button>

          <button
            onClick={handleOpenAddTxModal}
            className="px-4 py-2.5 bg-[#FFD600] hover:bg-[#FFE033] text-zinc-950 text-xs font-black rounded-xl shadow-lg shadow-yellow-500/10 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>매출 등록</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      {/* [1. 매출 요약 Cards] - Independent of filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* 오늘 매출 */}
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD600]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">오늘 매출 ({todayStr})</span>
            <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-[#FFD600] flex items-center justify-center font-black text-xs">
              Today
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white">{formatCurrency(todaySummary.net)}</div>
            <div className="text-xs text-zinc-400">순매출 (총 결제 {formatCurrency(todaySummary.gross)})</div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[11px]">환불액</span>
              <span className="font-bold text-rose-400">{formatCurrency(todaySummary.refund)}</span>
            </div>
            <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[11px]">결제 건수</span>
              <span className="font-bold text-white">{todaySummary.count}건</span>
            </div>
          </div>
        </div>

        {/* 이번 달 매출 */}
        <div className="bg-[#121216] border border-[#FFD600]/30 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden bg-gradient-to-br from-[#121216] to-[#FFD600]/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD600]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">이번 달 매출 ({thisMonthPrefix})</span>
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#FFD600] flex items-center justify-center font-black text-xs">
              Month
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-[#FFD600]">{formatCurrency(monthSummary.net)}</div>
            <div className="text-xs text-amber-500/80">순매출 (총 결제 {formatCurrency(monthSummary.gross)})</div>
          </div>

          <div className="pt-3 border-t border-amber-500/20 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[11px]">환불액</span>
              <span className="font-bold text-rose-400">{formatCurrency(monthSummary.refund)}</span>
            </div>
            <div className="bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[11px]">결제 건수</span>
              <span className="font-bold text-white">{monthSummary.count}건</span>
            </div>
          </div>
        </div>

        {/* 올해 매출 */}
        <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">올해 매출 ({currentYear}년)</span>
            <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-indigo-400 flex items-center justify-center font-black text-xs">
              Year
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black text-white">{formatCurrency(yearSummary.net)}</div>
            <div className="text-xs text-zinc-400">순매출 (총 결제 {formatCurrency(yearSummary.gross)})</div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[11px]">환불액</span>
              <span className="font-bold text-rose-400">{formatCurrency(yearSummary.refund)}</span>
            </div>
            <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
              <span className="text-zinc-500 block text-[11px]">결제 건수</span>
              <span className="font-bold text-white">{yearSummary.count}건</span>
            </div>
          </div>
        </div>

      </div>

      {/* [6. 차트 및 상품별 집계 Analytics Section] */}
      <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[11px] font-black rounded-md mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>REVENUE ANALYTICS</span>
            </div>
            <h3 className="text-lg font-black text-white">매출 트렌드 및 상품별 성과 분석</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-400 font-bold">월별 선택:</span>
              <input
                type="month"
                value={analyticsMonth}
                onChange={(e) => setAnalyticsMonth(e.target.value)}
                className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
              <span className="text-zinc-400 font-bold">연도 선택:</span>
              <select
                value={analyticsYear}
                onChange={(e) => setAnalyticsYear(e.target.value)}
                className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
              >
                {['2025', '2026', '2027', '2028'].map(y => (
                  <option key={y} value={y} className="bg-zinc-900 text-white">{y}년</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Daily Net Revenue Trend for Selected Month */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wider">
                {analyticsMonth} 일별 순매출 추이
              </h4>
              <span className="text-[11px] font-mono text-[#FFD600]">
                총 {formatCurrency(dailyTrendData.reduce((s, d) => s + d.net, 0))}
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-48 flex items-end gap-1 pt-4 pb-2 border-b border-zinc-800 px-1 overflow-x-auto">
              {dailyTrendData.map((d) => {
                const heightPercent = Math.max(8, Math.round((d.net / maxDailyNet) * 100));
                return (
                  <div key={d.dateKey} className="flex-1 flex flex-col items-center gap-1 group relative min-w-[12px]">
                    <div
                      className={`w-full rounded-t transition-all ${
                        d.net > 0 ? 'bg-[#FFD600] group-hover:bg-[#ffe033]' : 'bg-zinc-800'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {d.day % 5 === 0 && (
                      <span className="text-[9px] text-zinc-500 absolute -bottom-5 font-mono">{d.day}일</span>
                    )}
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-zinc-950 border border-zinc-700 text-white text-[10px] p-2 rounded shadow-xl z-20 whitespace-nowrap">
                      <span className="font-bold text-[#FFD600]">{d.dateKey}</span>
                      <span>순매출: {formatCurrency(d.net)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[11px] text-zinc-500 text-right">1일 ~ {daysInMonth}일</div>
          </div>

          {/* Monthly Net Revenue Trend for Selected Year */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wider">
                {analyticsYear}년 월별 순매출 추이
              </h4>
              <span className="text-[11px] font-mono text-indigo-400">
                총 {formatCurrency(monthlyTrendData.reduce((s, m) => s + m.net, 0))}
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-48 flex items-end gap-3 pt-4 pb-2 border-b border-zinc-800 px-2">
              {monthlyTrendData.map((m) => {
                const heightPercent = Math.max(8, Math.round((m.net / maxMonthlyNet) * 100));
                return (
                  <div key={m.prefix} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className={`w-full rounded-t transition-all ${
                        m.net > 0 ? 'bg-indigo-500 group-hover:bg-indigo-400' : 'bg-zinc-800'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-zinc-400 absolute -bottom-5 font-mono">{m.month}월</span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-zinc-950 border border-zinc-700 text-white text-[10px] p-2 rounded shadow-xl z-20 whitespace-nowrap">
                      <span className="font-bold text-indigo-400">{m.month}월 순매출</span>
                      <span>{formatCurrency(m.net)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[11px] text-zinc-500 text-right">1월 ~ 12월</div>
          </div>

        </div>

        {/* Product-level Aggregation Table */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black text-zinc-300 uppercase tracking-wider">상품별 결제 건수 및 매출 집계</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                  <th className="py-3 px-4">상품 구분</th>
                  <th className="py-3 px-4">상품명 (플랜)</th>
                  <th className="py-3 px-4 text-center">결제 건수</th>
                  <th className="py-3 px-4 text-right">총 결제액</th>
                  <th className="py-3 px-4 text-right">환불액</th>
                  <th className="py-3 px-4 text-right">순매출</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {productStatsList.map((stat, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition">
                    <td className="py-3 px-4">
                      {stat.group === 'bootcamp' ? (
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-black">부트캠프</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-[10px] font-black">PRO 멤버십</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{stat.name}</td>
                    <td className="py-3 px-4 text-center font-mono">{stat.count}건</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(stat.gross)}</td>
                    <td className="py-3 px-4 text-right font-mono text-rose-400">{formatCurrency(stat.refund)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#FFD600]">{formatCurrency(stat.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* [3. & 4. 매출 내역 테이블 & 검색/필터 Toolbar] */}
      <div className="bg-[#121216] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white">매출 거래 내역 목록</h3>
            <p className="text-xs text-zinc-400">조건별 필터링 결과 순매출: <strong className="text-[#FFD600]">{formatCurrency(filteredTableSummary.net)}</strong> ({filteredTransactions.length}건)</p>
          </div>

          {/* Search Query */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="고객명 또는 이메일 검색..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFD600]"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 text-xs">
          
          {/* Date Filter Mode */}
          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold">기간 필터</label>
            <select
              value={dateFilterMode}
              onChange={(e: any) => setDateFilterMode(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
            >
              <option value="all">전체 기간</option>
              <option value="today">오늘</option>
              <option value="this_month">이번 달</option>
              <option value="this_year">올해</option>
              <option value="custom">기간 직접 선택</option>
            </select>
          </div>

          {/* Product Group Filter */}
          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold">상품 구분</label>
            <select
              value={filterProductGroup}
              onChange={(e) => {
                setFilterProductGroup(e.target.value);
                setFilterProductId('all');
              }}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
            >
              <option value="all">전체 구분</option>
              <option value="bootcamp">부트캠프</option>
              <option value="pro_membership">PRO 멤버십</option>
            </select>
          </div>

          {/* Product Plan Filter */}
          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold">세부 플랜</label>
            <select
              value={filterProductId}
              onChange={(e) => setFilterProductId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
            >
              <option value="all">전체 플랜</option>
              {products
                .filter(p => filterProductGroup === 'all' || p.product_group === filterProductGroup)
                .map(p => (
                  <option key={p.id} value={p.id}>{p.plan_name}</option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="block text-zinc-400 font-bold">결제 상태</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
            >
              <option value="all">전체 상태</option>
              <option value="paid">결제 완료</option>
              <option value="partially_refunded">부분 환불</option>
              <option value="refunded">전액 환불</option>
              <option value="cancelled">결제 취소</option>
            </select>
          </div>

        </div>

        {dateFilterMode === 'custom' && (
          <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs animate-fade-in">
            <span className="text-zinc-400 font-bold">직접 기간:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono"
            />
            <span>~</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-white font-mono"
            />
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-x-auto shadow-inner">
          <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
             <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-bold uppercase">
                <th className="py-3.5 px-4">구매일</th>
                <th className="py-3.5 px-4 text-center">발생 구분</th>
                <th className="py-3.5 px-4">상품 구분</th>
                <th className="py-3.5 px-4">플랜</th>
                <th className="py-3.5 px-4">고객명</th>
                <th className="py-3.5 px-4">이메일</th>
                <th className="py-3.5 px-4 text-right">결제액</th>
                <th className="py-3.5 px-4 text-right">환불액</th>
                <th className="py-3.5 px-4 text-right">순매출</th>
                <th className="py-3.5 px-4 text-center">결제수단</th>
                <th className="py-3.5 px-4 text-center">상태</th>
                <th className="py-3.5 px-4">메모</th>
                <th className="py-3.5 px-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {isLoading ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-zinc-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#FFD600]" />
                    <span>매출 내역을 불러오는 중입니다...</span>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-zinc-500">
                    조건에 해당하는 매출 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-900/60 transition">
                    <td className="py-3.5 px-4 font-mono text-zinc-300">{tx.sale_date}</td>
                    <td className="py-3.5 px-4 text-center">
                      {tx.grant_type === 'promotion' ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold">프로모션</span>
                      ) : tx.grant_type === 'paid' ? (
                        <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 rounded text-[10px] font-bold">유료 결제</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded text-[10px] font-bold">수기 등록</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {tx.product_group === 'bootcamp' ? (
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-bold">부트캠프</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-[10px] font-bold">PRO</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">{tx.plan_name}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{tx.customer_name}</td>
                    <td className="py-3.5 px-4 font-mono text-zinc-400">{tx.customer_email || '-'}</td>
                    <td className="py-3.5 px-4 text-right font-mono">{tx.grant_type === 'promotion' ? '0원' : formatCurrency(tx.gross_amount)}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-rose-400">{tx.grant_type === 'promotion' ? '0원' : formatCurrency(tx.refund_amount)}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-[#FFD600]">{tx.grant_type === 'promotion' ? '0원' : formatCurrency(tx.net_amount)}</td>
                    <td className="py-3.5 px-4 text-center">{getPaymentMethodLabel(tx.payment_method)}</td>
                    <td className="py-3.5 px-4 text-center">{getStatusBadge(tx.status)}</td>
                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate" title={tx.memo}>{tx.memo || '-'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 relative">
                        <button
                          onClick={() => handleOpenEditTxModal(tx)}
                          className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] font-bold transition cursor-pointer"
                          title="수정"
                        >
                          수정
                        </button>
                        
                        {tx.status !== 'refunded' && (
                          <button
                            onClick={() => handleUpdateStatus(tx, 'refunded')}
                            className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded text-[11px] font-bold transition cursor-pointer"
                            title="환불 처리"
                          >
                            환불
                          </button>
                        )}

                        {tx.status !== 'cancelled' && (
                          <button
                            onClick={() => handleUpdateStatus(tx, 'cancelled')}
                            className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded text-[11px] font-bold transition cursor-pointer"
                            title="결제 취소"
                          >
                            취소
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteTx(tx.id)}
                          className="p-1 bg-zinc-950 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded transition cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* --- MODAL 1: 매출 등록 / 수정 Modal --- */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-fade-in text-white max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#FFD600]" />
                <h3 className="text-lg font-black text-white">
                  {editingTransaction ? '매출 내역 수정' : '수기 매출 등록'}
                </h3>
              </div>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransactionSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 구매일 */}
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">구매일 *</label>
                  <input
                    type="date"
                    required
                    value={txForm.sale_date}
                    onChange={(e) => setTxForm({ ...txForm, sale_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#FFD600]"
                  />
                </div>

                {/* 상품 구분 */}
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">상품 구분 *</label>
                  <select
                    value={txForm.product_group}
                    onChange={(e) => {
                      const group = e.target.value as ProductGroup;
                      const matchingProd = products.find(p => p.product_group === group && p.is_active);
                      setTxForm({
                        ...txForm,
                        product_group: group,
                        product_id: matchingProd ? matchingProd.id : '',
                        gross_amount: matchingProd ? matchingProd.default_price : 0
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                  >
                    <option value="pro_membership">PRO 멤버십</option>
                    <option value="bootcamp">부트캠프</option>
                  </select>
                </div>
              </div>

              {/* 플랜 선택 */}
              <div className="space-y-1">
                <label className="block font-bold text-zinc-300">세부 플랜 선택 *</label>
                <select
                  required
                  value={txForm.product_id}
                  onChange={(e) => handleProductChangeInTxForm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                >
                  <option value="">-- 플랜을 선택하세요 --</option>
                  {products
                    .filter(p => p.product_group === txForm.product_group && (p.is_active || p.id === txForm.product_id))
                    .map(p => (
                      <option key={p.id} value={p.id}>
                        {p.plan_name} ({formatCurrency(p.default_price)})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 고객명 */}
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">고객명 *</label>
                  <input
                    type="text"
                    required
                    value={txForm.customer_name}
                    onChange={(e) => setTxForm({ ...txForm, customer_name: e.target.value })}
                    placeholder="예: 홍길동"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                  />
                </div>

                {/* 고객 이메일 */}
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">고객 이메일</label>
                  <input
                    type="email"
                    value={txForm.customer_email}
                    onChange={(e) => setTxForm({ ...txForm, customer_email: e.target.value })}
                    placeholder="example@email.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 실제 결제액 */}
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">실제 결제액 (원) *</label>
                  <input
                    type="number"
                    required
                    value={txForm.gross_amount}
                    onChange={(e) => setTxForm({ ...txForm, gross_amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#FFD600]"
                  />
                </div>

                {/* 환불액 */}
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">환불액 (원)</label>
                  <input
                    type="number"
                    value={txForm.refund_amount}
                    onChange={(e) => setTxForm({ ...txForm, refund_amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#FFD600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 결제 수단 */}
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">결제 수단</label>
                  <select
                    value={txForm.payment_method}
                    onChange={(e: any) => setTxForm({ ...txForm, payment_method: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                  >
                    <option value="card">카드</option>
                    <option value="bank_transfer">계좌이체</option>
                    <option value="cash">현금</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                {/* 결제 상태 */}
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">결제 상태</label>
                  <select
                    value={txForm.status}
                    onChange={(e: any) => setTxForm({ ...txForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                  >
                    <option value="paid">결제 완료</option>
                    <option value="partially_refunded">부분 환불</option>
                    <option value="refunded">전액 환불</option>
                    <option value="cancelled">결제 취소</option>
                  </select>
                </div>
              </div>

              {/* 메모 */}
              <div className="space-y-1">
                <label className="block font-bold text-zinc-300">메모</label>
                <textarea
                  rows={2}
                  value={txForm.memo}
                  onChange={(e) => setTxForm({ ...txForm, memo: e.target.value })}
                  placeholder="특이사항 또는 할인 사유 등 입력"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowTransactionModal(false)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSavingTransaction}
                  className="flex-1 py-3 bg-[#FFD600] hover:bg-[#FFE033] text-zinc-950 font-black rounded-xl shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSavingTransaction ? '저장 중...' : '저장하기'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- MODAL 2: 상품 설정 관리 Modal --- */}
      {showProductSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative animate-fade-in text-white max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#FFD600]" />
                <h3 className="text-lg font-black text-white">매출 상품 및 가격 설정</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddProdModal}
                  className="px-3.5 py-2 bg-[#FFD600] text-zinc-950 text-xs font-black rounded-xl cursor-pointer shadow"
                >
                  + 상품 추가
                </button>
                <button
                  onClick={() => setShowProductSettingsModal(false)}
                  className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                부트캠프 및 PRO 멤버십 상품과 기본 가격을 관리합니다. 기존 거래가 존재하는 상품은 비활성화(<code className="text-rose-400">is_active = false</code>) 처리됩니다.
              </p>

              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p.id} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {p.product_group === 'bootcamp' ? (
                          <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-black">부트캠프</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-[10px] font-black">PRO</span>
                        )}
                        <h4 className="text-sm font-bold text-white">{p.plan_name}</h4>
                        {!p.is_active && (
                          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded text-[10px] font-medium">비활성</span>
                        )}
                      </div>
                      <div className="text-xs font-mono text-zinc-400">
                        기본가: <strong className="text-[#FFD600]">{formatCurrency(p.default_price)}</strong> (정렬순서: {p.sort_order})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditProdModal(p)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>수정</span>
                      </button>

                      <button
                        onClick={() => handleToggleProductActive(p)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          p.is_active
                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {p.is_active ? '비활성화' : '활성화'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 text-right">
              <button
                onClick={() => setShowProductSettingsModal(false)}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 3: 개별 상품 추가/수정 Modal --- */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-fade-in text-white">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-base font-black text-white">
                {editingProduct ? '상품 정보 수정' : '신규 상품 추가'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="block font-bold text-zinc-300">상품 구분 *</label>
                <select
                  value={productForm.product_group}
                  onChange={(e: any) => setProductForm({ ...productForm, product_group: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                >
                  <option value="pro_membership">PRO 멤버십</option>
                  <option value="bootcamp">부트캠프</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-zinc-300">상품명 (플랜명) *</label>
                <input
                  type="text"
                  required
                  value={productForm.plan_name}
                  onChange={(e) => setProductForm({ ...productForm, plan_name: e.target.value })}
                  placeholder="예: PRO MASTER 12개월"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-zinc-300">기본 판매가 (원) *</label>
                <input
                  type="number"
                  required
                  value={productForm.default_price}
                  onChange={(e) => setProductForm({ ...productForm, default_price: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#FFD600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">정렬 순서</label>
                  <input
                    type="number"
                    value={productForm.sort_order}
                    onChange={(e) => setProductForm({ ...productForm, sort_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#FFD600]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-zinc-300">활성 여부</label>
                  <select
                    value={productForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setProductForm({ ...productForm, is_active: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-[#FFD600]"
                  >
                    <option value="true">활성</option>
                    <option value="false">비활성</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="flex-1 py-3 bg-[#FFD600] hover:bg-[#FFE033] text-zinc-950 font-black rounded-xl shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSavingProduct ? '저장 중...' : '상품 저장'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
