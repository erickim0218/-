import { supabase } from './supabase';

export interface SiteFeature {
  feature_key: string;
  display_name: string;
  is_enabled: boolean;
  updated_at?: string;
}

const STORAGE_KEY = 'reposition_site_features_cache';

export const DEFAULT_SITE_FEATURES: Record<string, boolean> = {
  bootcamp: true,
  repositioning_class: false,
  practical_tools: false
};

// Get all site features from Supabase or Local Storage fallback
export async function fetchSiteFeatures(): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {
    bootcamp: true,
    repositioning_class: false,
    practical_tools: false
  };

  // 1. Try local storage cache first if available
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      result.bootcamp = typeof parsed.bootcamp === 'boolean' ? parsed.bootcamp : true;
      result.repositioning_class = parsed.repositioning_class === true;
      result.practical_tools = parsed.practical_tools === true;
    }
  } catch (e) {
    console.warn('Failed to read site_features cache:', e);
  }

  // 2. Fetch directly from Supabase
  try {
    const { data, error } = await supabase.from('site_features').select('feature_key, is_enabled');
    if (!error && data && Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item.feature_key) {
          result[item.feature_key] = item.is_enabled === true;
        }
      });
      // Update cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    }
  } catch (e) {
    console.warn('Failed to fetch site_features from Supabase:', e);
  }

  return result;
}

// Update site feature state
export async function updateSiteFeature(featureKey: string, isEnabled: boolean): Promise<boolean> {
  // Update local cache first
  let cachedObj: Record<string, boolean> = { ...DEFAULT_SITE_FEATURES };
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      cachedObj = JSON.parse(cached);
    }
  } catch (e) {
    console.warn(e);
  }

  cachedObj[featureKey] = isEnabled;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedObj));

  // Dispatch custom event for real-time app update
  window.dispatchEvent(new CustomEvent('site_features_updated', { detail: { featureKey, isEnabled } }));

  // Try updating Supabase
  try {
    // Check if row exists
    const { data } = await supabase.from('site_features').select('feature_key').eq('feature_key', featureKey);
    
    if (data && data.length > 0) {
      const { error } = await supabase
        .from('site_features')
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .eq('feature_key', featureKey);

      if (error) {
        console.warn('Failed to update site_features on Supabase:', error);
      }
    } else {
      const { error } = await supabase
        .from('site_features')
        .insert([{
          feature_key: featureKey,
          display_name: featureKey === 'bootcamp' ? '부트캠프 모집 상태' : featureKey,
          is_enabled: isEnabled,
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        console.warn('Failed to insert site_features on Supabase:', error);
      }
    }
  } catch (e) {
    console.warn('Error updating site_features:', e);
  }

  return true;
}
