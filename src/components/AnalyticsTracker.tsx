import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Helper to get or create a persistent sessionId in sessionStorage
export function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem("autoscale_analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem("autoscale_analytics_session_id", sessionId);
  }
  return sessionId;
}

// Global function to track a custom event manually
export async function trackEvent(type: "pageview" | "click" | "chat" | "booking", details?: any) {
  try {
    const sessionId = getOrCreateSessionId();
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        path: window.location.pathname,
        referrer: document.referrer || "Direct Traffic",
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        sessionId,
        details,
      }),
    });
  } catch (err) {
    console.warn("Analytics tracking failed:", err);
  }
}

export default function AnalyticsTracker() {
  const location = useLocation();

  // 1. Page View Tracker (triggers on route change)
  useEffect(() => {
    trackEvent("pageview");
  }, [location.pathname]);

  // 2. Global Event Listener for CTA Clicks
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Look up tree to find button or anchor tags or items with interactive attributes
      const interactiveEl = target.closest("a, button, [role='button'], [id^='cta-'], [id^='btn-']");
      if (interactiveEl) {
        const text = interactiveEl.textContent?.trim() || "";
        const id = interactiveEl.id || "";
        const href = (interactiveEl as HTMLAnchorElement).href || "";

        // Filter out very short texts or meaningless clicks
        if (text.length > 0 || id) {
          trackEvent("click", {
            elementId: id || undefined,
            elementText: text.substring(0, 60),
            href: href ? href.substring(0, 120) : undefined,
          });
        }
      }
    };

    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return null; // pure behavior, no visual element
}
