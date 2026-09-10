import { supabase } from './supabase';

interface TrackEventParams {
  eventName: string;
  buttonLocation?: string | null;
  bootcampCohort?: number | null;
}

// Validate UUID format
function isValidUUID(uuid: string | null): boolean {
  if (!uuid) return false;
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

// Get or create persistent anonymous visitor ID (UUID)
function getOrCreateVisitorId(): string {
  try {
    let visitorId = localStorage.getItem('reposition_visitor_id');
    if (!isValidUUID(visitorId)) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('reposition_visitor_id', visitorId);
    }
    return visitorId;
  } catch {
    return crypto.randomUUID();
  }
}

// Get or create session ID with 30-min inactivity timeout
function getOrCreateSessionId(): string {
  try {
    const now = Date.now();
    const sessionData = sessionStorage.getItem('reposition_session_info');
    let sessionId = '';
    let lastActive = 0;

    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        sessionId = parsed.sessionId;
        lastActive = parsed.lastActive;
      } catch {}
    }

    const thirtyMinutes = 30 * 60 * 1000;
    if (!isValidUUID(sessionId) || !lastActive || now - lastActive > thirtyMinutes) {
      sessionId = crypto.randomUUID();
    }

    sessionStorage.setItem('reposition_session_info', JSON.stringify({
      sessionId,
      lastActive: now
    }));

    return sessionId;
  } catch {
    return crypto.randomUUID();
  }
}

function getPreviousPath(): string | null {
  try {
    return sessionStorage.getItem('reposition_prev_path') || null;
  } catch {
    return null;
  }
}

function setPreviousPath(path: string) {
  try {
    sessionStorage.setItem('reposition_prev_path', path);
  } catch {}
}

function getStoredUtm(key: string): string | null {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    let val = searchParams.get(key);
    if (val) {
      sessionStorage.setItem(`reposition_${key}`, val);
      return val;
    }
    return sessionStorage.getItem(`reposition_${key}`) || null;
  } catch {
    return null;
  }
}

function getDeviceType(): string {
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

// Exclude only localhost, 127.0.0.1, and ais-dev (Cloudflare production & re-position.co.kr are tracked)
function shouldExcludeEnvironment(): boolean {
  const hostname = window.location.hostname;
  if (/localhost|127\.0\.0\.1|ais-dev/.test(hostname)) {
    return true;
  }
  return false;
}

// Check if confirmed logged in as admin (never block while loading or for non-admins)
async function isConfirmedAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: access } = await supabase
      .from('user_access')
      .select('app_role')
      .eq('user_id', user.id)
      .single();

    return access?.app_role === 'admin';
  } catch {
    return false;
  }
}

// Main trackAnalyticsEvent function as requested
export async function trackAnalyticsEvent({
  eventName,
  buttonLocation = null,
  bootcampCohort = null
}: TrackEventParams) {
  try {
    if (shouldExcludeEnvironment()) {
      return;
    }

    if (await isConfirmedAdmin()) {
      return;
    }

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const prevPath = getPreviousPath();

    setPreviousPath(window.location.pathname);

    // React StrictMode / fast re-render deduplication window (3 seconds for page views)
    const now = Date.now();
    const dedupKey = `reposition_dedup_${eventName}_${window.location.pathname}_${buttonLocation || ''}`;
    const lastTime = Number(sessionStorage.getItem(dedupKey) || 0);
    if ((eventName === 'page_view' || eventName === 'bootcamp_detail_view') && now - lastTime < 3000) {
      return;
    }
    sessionStorage.setItem(dedupKey, String(now));

    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_id: crypto.randomUUID(),
        event_name: eventName,
        visitor_id: visitorId,
        session_id: sessionId,
        page_path: window.location.pathname,
        referrer_path: prevPath,
        button_location: buttonLocation,
        bootcamp_cohort: bootcampCohort,
        device_type: getDeviceType(),
        referrer: document.referrer || null,
        utm_source: getStoredUtm('utm_source'),
        utm_medium: getStoredUtm('utm_medium'),
        utm_campaign: getStoredUtm('utm_campaign'),
        utm_content: getStoredUtm('utm_content')
      });

    if (error) {
      console.error('[Analytics insert failed]', {
        eventName,
        code: error.code,
        message: error.message
      });
    }
  } catch (err) {
    console.error('[Analytics error]', err);
  }
}

// Safe inquiry click helper for external links (KakaoTalk etc.)
export function trackInquiryClickAndOpen(
  buttonLocation: 'home_inquiry' | 'bootcamp_detail_inquiry' | 'bottom_fixed_inquiry' | 'kakao_inquiry',
  targetUrl: string = 'https://open.kakao.com/o/sEgVEi0h'
) {
  trackAnalyticsEvent({
    eventName: 'inquiry_click',
    buttonLocation,
    bootcampCohort: 8
  }).catch(() => {});

  setTimeout(() => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }, 100);
}
