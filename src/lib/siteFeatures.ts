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
  practical_tools: true
};

// Get all site features from Supabase or Local Storage fallback
export async function fetchSiteFeatures(): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = { ...DEFAULT_SITE_FEATURES };

  // Supabase is the source of truth. Protected features must fail closed instead
  // of being reopened by an old browser cache value.
  try {
    const { data, error } = await supabase.from('site_features').select('feature_key, is_enabled');
    if (error) throw error;
    if (!data || !Array.isArray(data)) throw new Error('site_features 응답이 올바르지 않습니다.');
    data.forEach((item: any) => {
      if (item.feature_key) result[item.feature_key] = item.is_enabled === true;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch (e) {
    console.warn('Failed to fetch site_features from Supabase:', e);
    // Keep the class closed on any fetch failure. Non-gated operational values
    // may use the last cache so a temporary outage does not hide the whole site.
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        result.bootcamp = typeof parsed.bootcamp === 'boolean' ? parsed.bootcamp : result.bootcamp;
        result.practical_tools = typeof parsed.practical_tools === 'boolean' ? parsed.practical_tools : result.practical_tools;
      }
    } catch (cacheError) {
      console.warn('Failed to read site_features cache:', cacheError);
    }
    result.repositioning_class = false;
  }

  return result;
}

// Update site feature state
export async function updateSiteFeature(featureKey: string, isEnabled: boolean): Promise<boolean> {
  // Persist first. A failed database write must never look successful locally.
  try {
    const { data, error: lookupError } = await supabase.from('site_features').select('feature_key').eq('feature_key', featureKey);
    if (lookupError) throw lookupError;
    
    if (data && data.length > 0) {
      const { error } = await supabase
        .from('site_features')
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .eq('feature_key', featureKey);

      if (error) {
        throw error;
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
        throw error;
      }
    }

    let cachedObj: Record<string, boolean> = { ...DEFAULT_SITE_FEATURES };
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) cachedObj = JSON.parse(cached);
    } catch (cacheError) {
      console.warn('Failed to read site_features cache:', cacheError);
    }
    cachedObj[featureKey] = isEnabled;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedObj));
    window.dispatchEvent(new CustomEvent('site_features_updated', { detail: { featureKey, isEnabled } }));
    return true;
  } catch (e) {
    console.warn('Error updating site_features:', e);
    return false;
  }
}
