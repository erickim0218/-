import { supabase } from './supabase';

export type AnalyticsEventName = 'page_view' | 'bootcamp_click' | 'bootcamp_detail_view' | 'inquiry_click';
export type ButtonLocation = 'home_bootcamp_cta' | 'home_inquiry' | 'bootcamp_detail_inquiry' | 'bottom_fixed_inquiry' | 'membership_inquiry';
export type DeviceType = 'pc' | 'mobile' | 'tablet';

interface AnalyticsPayload {
  event_name: AnalyticsEventName;
  page_path: string;
  referrer_path?: string;
  button_location?: ButtonLocation;
  bootcamp_cohort?: number;
}

// Generate or get persistent anonymous visitor ID
function getVisitorId(): string {
  try {
    let visitorId = localStorage.getItem('reposition_visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      localStorage.setItem('reposition_visitor_id', visitorId);
    }
    return visitorId;
  } catch {
    return '00000000-0000-0000-0000-000000000000';
  }
}

// Manage 30-min session ID in sessionStorage
function getSessionId(): string {
  try {
    const now = Date.now();
    const sessionData = sessionStorage.getItem('reposition_session_info');
    let sessionId = '';
    let lastActive = 0;

    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      sessionId = parsed.sessionId;
      lastActive = parsed.lastActive;
    }

    // 30 minutes inactivity timeout (30 * 60 * 1000 ms)
    const thirtyMinutes = 30 * 60 * 1000;
    if (!sessionId || !lastActive || now - lastActive > thirtyMinutes) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    sessionStorage.setItem('reposition_session_info', JSON.stringify({
      sessionId,
      lastActive: now
    }));

    return sessionId;
  } catch {
    return '00000000-0000-0000-0000-000000000000';
  }
}

// Capture and persist UTM & Referrer traffic source info in sessionStorage
function getTrafficSourceInfo() {
  try {
    let traffic = sessionStorage.getItem('reposition_traffic_source');
    if (!traffic) {
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get('utm_source');
      const utm_medium = urlParams.get('utm_medium');
      const utm_campaign = urlParams.get('utm_campaign');
      const utm_content = urlParams.get('utm_content');
      const referrer = document.referrer || null;

      const sourceInfo = {
        utm_source: utm_source || (referrer ? new URL(referrer).hostname : 'direct'),
        utm_medium: utm_medium || (referrer ? 'referral' : 'direct'),
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        referrer: referrer
      };

      sessionStorage.setItem('reposition_traffic_source', JSON.stringify(sourceInfo));
      return sourceInfo;
    }
    return JSON.parse(traffic);
  } catch {
    return { utm_source: 'direct', utm_medium: 'direct', utm_campaign: null, utm_content: null, referrer: null };
  }
}

// Detect device type
function getDeviceType(): DeviceType {
  const ua = navigator.userAgent;
  const width = window.innerWidth;
  if (/tablet|ipad|playbook|silk/i.test(ua) || (width >= 768 && width < 1024)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua) || width < 768) {
    return 'mobile';
  }
  return 'pc';
}

// Check if current environment should be excluded from analytics
async function shouldExcludeAnalytics(): Promise<boolean> {
  const hostname = window.location.hostname;
  if (/localhost|127\.0\.0\.1|ais-dev|ais-pre/.test(hostname)) {
    return true; // Exclude dev/preview/local as requested
  }

  // Also check if logged in user is admin
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: access } = await supabase
        .from('user_access')
        .select('app_role')
        .eq('user_id', user.id)
        .single();
      if (access?.app_role === 'admin') {
        return true; // Exclude admin visits
      }
    }
  } catch {
    // ignore
  }

  return false;
}

// Track event with duplicate prevention in session
const sentEventCache = new Set<string>();

export async function trackAnalyticsEvent(payload: AnalyticsPayload): Promise<void> {
  try {
    if (await shouldExcludeAnalytics()) {
      return;
    }

    const visitor_id = getVisitorId();
    const session_id = getSessionId();
    const traffic = getTrafficSourceInfo();
    const device_type = getDeviceType();

    // Prevent duplicate event firing for exact same action signature within session
    const uniqueKey = `${session_id}_${payload.event_name}_${payload.page_path}_${payload.button_location || ''}_${payload.bootcamp_cohort || ''}`;
    if (sentEventCache.has(uniqueKey) && payload.event_name === 'page_view') {
      return; // Skip duplicate page views in same session/path
    }
    sentEventCache.add(uniqueKey);

    const event_id = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

    const rpcArgs = {
      p_event_name: payload.event_name,
      p_visitor_id: visitor_id,
      p_session_id: session_id,
      p_page_path: payload.page_path,
      p_referrer_path: document.referrer || null,
      p_button_location: payload.button_location || null,
      p_bootcamp_cohort: payload.bootcamp_cohort || null,
      p_device_type: device_type,
      p_referrer: traffic.referrer,
      p_utm_source: traffic.utm_source,
      p_utm_medium: traffic.utm_medium,
      p_utm_campaign: traffic.utm_campaign,
      p_utm_content: traffic.utm_content,
      p_event_id: event_id
    };

    const { error } = await supabase.rpc('record_analytics_event', rpcArgs);
    if (error) {
      console.warn('Analytics record error:', error.message);
    }
  } catch (err) {
    console.warn('Analytics tracking error:', err);
  }
}

// Special handler for inquiry button clicks (Kakao / external links) using beacon or async non-blocking
export function trackInquiryClickAndNavigate(
  buttonLocation: ButtonLocation,
  cohort?: number,
  targetUrl?: string
) {
  const visitor_id = getVisitorId();
  const session_id = getSessionId();
  const traffic = getTrafficSourceInfo();
  const device_type = getDeviceType();
  const event_id = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  const payload = {
    p_event_name: 'inquiry_click',
    p_visitor_id: visitor_id,
    p_session_id: session_id,
    p_page_path: window.location.pathname || 'home',
    p_referrer_path: document.referrer || null,
    p_button_location: buttonLocation,
    p_bootcamp_cohort: cohort || 8,
    p_device_type: device_type,
    p_referrer: traffic.referrer,
    p_utm_source: traffic.utm_source,
    p_utm_medium: traffic.utm_medium,
    p_utm_campaign: traffic.utm_campaign,
    p_utm_content: traffic.utm_content,
    p_event_id: event_id
  };

  // Try sendBeacon or async call
  try {
    // If we want to call supabase rpc via fetch or sendBeacon
    const supabaseUrl = 'https://ftsmgwfwibehtrywqter.supabase.co/rest/v1/rpc/record_analytics_event';
    const supabaseKey = 'sb_publishable_rUYX3fevE0-pygmQnfdc5g_OtXG7K2M';
    
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(supabaseUrl, blob);
    } else {
      fetch(supabaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // ignore
  }

  if (targetUrl) {
    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }, 150);
  }
}
