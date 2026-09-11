import { supabase } from './supabase';
import { RevenueProduct, RevenueTransaction, ProductGroup, TransactionStatus, PaymentMethod } from '../types';

export const DEFAULT_REVENUE_PRODUCTS: Omit<RevenueProduct, 'id' | 'created_at' | 'updated_at'>[] = [
  // Bootcamp
  {
    product_group: 'bootcamp',
    plan_code: 'bootcamp_core',
    plan_name: '부트캠프 코어 플랜',
    default_price: 350000,
    is_active: true,
    sort_order: 1
  },
  {
    product_group: 'bootcamp',
    plan_code: 'bootcamp_pro',
    plan_name: '부트캠프 프로 플랜',
    default_price: 650000,
    is_active: true,
    sort_order: 2
  },
  {
    product_group: 'bootcamp',
    plan_code: 'bootcamp_firstclass',
    plan_name: '부트캠프 퍼스트클래스 플랜',
    default_price: 1200000,
    is_active: true,
    sort_order: 3
  },
  // Pro Membership
  {
    product_group: 'pro_membership',
    plan_code: 'pro_start_30',
    plan_name: 'PRO START 30',
    default_price: 99000,
    is_active: true,
    sort_order: 1
  },
  {
    product_group: 'pro_membership',
    plan_code: 'pro_position_90',
    plan_name: 'PRO POSITION 90',
    default_price: 249000,
    is_active: true,
    sort_order: 2
  },
  {
    product_group: 'pro_membership',
    plan_code: 'pro_career_180',
    plan_name: 'PRO CAREER 180',
    default_price: 450000,
    is_active: true,
    sort_order: 3
  }
];

export const formatCurrency = (amount: number): string => {
  return `${Math.round(amount || 0).toLocaleString()}원`;
};

// Get Korea Time (Asia/Seoul) YYYY-MM-DD
export const getKoreaTodayDate = (): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
};

export const fetchRevenueProducts = async (): Promise<RevenueProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('revenue_products')
      .select('*')
      .order('product_group')
      .order('sort_order');

    if (error) {
      console.error('Error fetching revenue_products:', error);
      // If table doesn't exist or error, return defaults in memory
      return [];
    }

    if (!data || data.length === 0) {
      // Seed default products
      for (const p of DEFAULT_REVENUE_PRODUCTS) {
        await supabase.from('revenue_products').insert([{
          ...p,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      }
      const { data: seeded } = await supabase
        .from('revenue_products')
        .select('*')
        .order('product_group')
        .order('sort_order');
      return seeded || [];
    }

    return data;
  } catch (err) {
    console.error('fetchRevenueProducts exception:', err);
    return [];
  }
};

export const saveRevenueProduct = async (
  productData: Partial<RevenueProduct>,
  isEditing: boolean,
  id?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (isEditing && id) {
      const { error } = await supabase
        .from('revenue_products')
        .update({
          product_group: productData.product_group,
          plan_code: productData.plan_code || productData.plan_name?.toLowerCase().replace(/\s+/g, '_'),
          plan_name: productData.plan_name,
          default_price: productData.default_price,
          is_active: productData.is_active,
          sort_order: productData.sort_order ?? 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('revenue_products')
        .insert([{
          product_group: productData.product_group || 'pro_membership',
          plan_code: productData.plan_code || productData.plan_name?.toLowerCase().replace(/\s+/g, '_') || 'plan_' + Date.now(),
          plan_name: productData.plan_name,
          default_price: productData.default_price || 0,
          is_active: productData.is_active ?? true,
          sort_order: productData.sort_order ?? 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error('saveRevenueProduct error:', err);
    return { success: false, error: err.message || '상품 저장에 실패했습니다.' };
  }
};

export const toggleOrDeleteProduct = async (
  productId: string,
  newActiveState: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if transactions exist for this product
    const { count, error: countErr } = await supabase
      .from('revenue_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', productId);

    if (!countErr && count && count > 0) {
      // Transactions exist -> perform soft delete (is_active = false)
      const { error } = await supabase
        .from('revenue_products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', productId);
      if (error) throw error;
      return { success: true };
    }

    if (!newActiveState && (!count || count === 0)) {
      // If toggling inactive and no transactions, we can set inactive or delete. Let's set inactive or delete based on newActiveState.
      const { error } = await supabase
        .from('revenue_products')
        .update({ is_active: newActiveState, updated_at: new Date().toISOString() })
        .eq('id', productId);
      if (error) throw error;
      return { success: true };
    }

    const { error } = await supabase
      .from('revenue_products')
      .update({ is_active: newActiveState, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('toggleOrDeleteProduct error:', err);
    return { success: false, error: err.message || '상품 상태 변경에 실패했습니다.' };
  }
};

export const fetchRevenueTransactions = async (): Promise<RevenueTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('revenue_transactions')
      .select(`
        *,
        revenue_products (
          id,
          product_group,
          plan_name,
          plan_code
        )
      `)
      .order('sale_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching revenue_transactions:', error);
      return [];
    }

    return (data || []).map((t: any) => ({
      ...t,
      product_group: t.revenue_products?.product_group || 'pro_membership',
      plan_name: t.revenue_products?.plan_name || '알 수 없는 상품'
    }));
  } catch (err) {
    console.error('fetchRevenueTransactions exception:', err);
    return [];
  }
};

export const calculateNetAmount = (status: TransactionStatus, gross: number, refund: number): number => {
  if (status === 'refunded' || status === 'cancelled') {
    return 0;
  }
  if (status === 'partially_refunded') {
    return Math.max(0, gross - refund);
  }
  return gross; // paid
};

export const saveRevenueTransaction = async (
  txData: {
    sale_date: string;
    product_id: string;
    customer_name: string;
    customer_email: string;
    gross_amount: number;
    refund_amount: number;
    status: TransactionStatus;
    payment_method: PaymentMethod;
    memo?: string;
    member_user_id?: string;
  },
  isEditing: boolean,
  id?: string,
  adminEmail?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const net_amount = calculateNetAmount(txData.status, txData.gross_amount, txData.refund_amount);

    if (isEditing && id) {
      const { error } = await supabase
        .from('revenue_transactions')
        .update({
          sale_date: txData.sale_date,
          product_id: txData.product_id,
          customer_name: txData.customer_name,
          customer_email: txData.customer_email,
          gross_amount: txData.gross_amount,
          refund_amount: txData.refund_amount,
          status: txData.status,
          net_amount,
          payment_method: txData.payment_method,
          memo: txData.memo || null,
          member_user_id: txData.member_user_id || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('revenue_transactions')
        .insert([{
          sale_date: txData.sale_date || getKoreaTodayDate(),
          product_id: txData.product_id,
          customer_name: txData.customer_name,
          customer_email: txData.customer_email,
          gross_amount: txData.gross_amount,
          refund_amount: txData.refund_amount,
          status: txData.status,
          net_amount,
          payment_method: txData.payment_method,
          memo: txData.memo || null,
          member_user_id: txData.member_user_id || null,
          created_by: adminEmail || 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error('saveRevenueTransaction error:', err);
    return { success: false, error: err.message || '매출 거래 저장에 실패했습니다.' };
  }
};

export const updateTransactionStatusAction = async (
  id: string,
  newStatus: TransactionStatus,
  currentGross: number,
  currentRefund: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    let refund = currentRefund;
    if (newStatus === 'refunded') {
      refund = currentGross;
    } else if (newStatus === 'cancelled') {
      refund = 0;
    }
    const net_amount = calculateNetAmount(newStatus, currentGross, refund);

    const { error } = await supabase
      .from('revenue_transactions')
      .update({
        status: newStatus,
        refund_amount: refund,
        net_amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('updateTransactionStatusAction error:', err);
    return { success: false, error: err.message || '상태 변경에 실패했습니다.' };
  }
};

export const adminAssignMemberships = async (params: {
  userIds: string[];
  membershipTier: 'free' | 'pro' | 'bootcamp';
  requestId: string;
  planCode?: string | null;
  expiresAt?: string | null;
  bootcampCohort?: string | null;
  grantType: 'paid' | 'promotion' | 'access_only';
  amountOverride: number;
  paymentMethod: 'card' | 'bank_transfer' | 'cash' | 'other';
  saleDate: string;
  memo?: string | null;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.rpc('admin_assign_memberships', {
      p_user_ids: params.userIds,
      p_membership_tier: params.membershipTier,
      p_request_id: params.requestId,
      p_plan_code: params.planCode || null,
      p_expires_at: params.expiresAt || null,
      p_bootcamp_cohort: params.bootcampCohort || null,
      p_grant_type: params.grantType,
      p_amount_override: params.amountOverride,
      p_payment_method: params.paymentMethod,
      p_sale_date: params.saleDate,
      p_memo: params.memo || null
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('adminAssignMemberships error:', err);
    return { success: false, error: err.message || '멤버십 일괄 부여 및 매출 생성에 실패했습니다.' };
  }
};

export const deleteRevenueTransaction = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('revenue_transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('deleteRevenueTransaction error:', err);
    return { success: false, error: err.message || '거래 내역 삭제에 실패했습니다.' };
  }
};
