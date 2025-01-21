// @ts-nocheck
interface AnalyticsEvent {
    event_category: string;
    event_label: string;
    value: number;
}
export const trackEvent = (action: string, event: AnalyticsEvent) => {
    if (typeof window.gtag === 'function') {
        window.gtag('event', action, event);
    }
}