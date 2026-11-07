export type DominoAnalyticsEvent =
  | 'page_view_vertical'
  | 'cta_primary_click'
  | 'simulator_start'
  | 'simulator_complete'
  | 'whatsapp_click'
  | 'chat_open'
  | 'chat_lead_captured'
  | 'form_start'
  | 'form_submit';

export interface DominoAnalyticsParams {
  vertical: string;
  section?: string;
  scenario?: 'conservador' | 'referencia' | 'otimista';
  themeMode?: 'dark' | 'light';
  layoutStrategy?: string;
  estimatedMonthlyImpact?: number;
}

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetOrAction: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getSafeCampaignContext(): {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer_host: string;
} {
  if (typeof window === 'undefined') {
    return {
      utm_source: 'direct',
      utm_medium: 'none',
      utm_campaign: 'none',
      referrer_host: 'none',
    };
  }

  try {
    const params = new URLSearchParams(window.location.search);
    let referrerHost = 'direct';
    if (document.referrer) {
      try {
        referrerHost = new URL(document.referrer).hostname;
      } catch {
        referrerHost = 'external';
      }
    }

    return {
      utm_source: (params.get('utm_source') || 'direct').slice(0, 64),
      utm_medium: (params.get('utm_medium') || 'none').slice(0, 64),
      utm_campaign: (params.get('utm_campaign') || 'none').slice(0, 64),
      referrer_host: referrerHost.slice(0, 80),
    };
  } catch {
    return {
      utm_source: 'direct',
      utm_medium: 'none',
      utm_campaign: 'none',
      referrer_host: 'none',
    };
  }
}

/**
 * Dispatches structured conversion events to Google Analytics (gtag / dataLayer)
 * strictly excluding any PII (no names, emails, phones, or message bodies).
 */
export function trackDominoEvent(
  eventName: DominoAnalyticsEvent,
  params: DominoAnalyticsParams
): void {
  if (typeof window === 'undefined') return;

  const campaign = getSafeCampaignContext();
  const payload: Record<string, unknown> = {
    vertical: params.vertical,
    section: params.section || 'main',
    device_category: getDeviceCategory(),
    ...(params.scenario ? { roi_scenario: params.scenario } : {}),
    ...(params.themeMode ? { theme_mode: params.themeMode } : {}),
    ...(params.layoutStrategy ? { layout_strategy: params.layoutStrategy } : {}),
    ...(typeof params.estimatedMonthlyImpact === 'number'
      ? { value: Math.round(params.estimatedMonthlyImpact), currency: 'BRL' }
      : {}),
    ...campaign,
  };

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...payload });
    }
  } catch {
    // Non-blocking analytics
  }
}

