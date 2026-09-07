import { createClient } from '@supabase/supabase-js';

// Remove legacy localStorage keys if present (only 'reposition_supabase_url' and 'reposition_supabase_key')
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('reposition_supabase_url');
    localStorage.removeItem('reposition_supabase_key');
  } catch {
    // ignore
  }
}

// Single source of truth for Supabase connection
const SUPABASE_URL = 'https://ftsmgwfwibehtrywqter.supabase.co';
const SUPABASE_KEY = 'sb_publishable_rUYX3fevE0-pygmQnfdc5g_OtXG7K2M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const supabaseApi = {
  async signUpWithEmail(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  },

  async verifyEmailOtp(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
    if (error) throw error;
    return data;
  },

  async resendSignUpOtp(email: string) {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email
    });
    if (error) throw error;
    return data;
  },

  async sendPasswordResetEmail(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    if (error) throw error;
    return data;
  },

  async verifyRecoveryOtp(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'recovery'
    });
    if (error) throw error;
    return data;
  },

  async updateUserPassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    if (error) throw error;
    return data;
  },

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOutAuth() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
