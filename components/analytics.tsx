"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const VISITOR_KEY = "mb_last_visit";

// Today's date in the visitor's local time; used only to count a visitor once per day.
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function isNewVisitorToday() {
  try {
    if (localStorage.getItem(VISITOR_KEY) === today()) return false;
    localStorage.setItem(VISITOR_KEY, today());
  } catch {
    // Storage blocked: count every view as a visit rather than losing it.
  }
  return true;
}

export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || navigator.webdriver) return;
    const params = new URLSearchParams(location.search);
    const payload = JSON.stringify({
      path: pathname,
      // Only the landing page has a meaningful external referrer.
      referrer: first.current ? document.referrer : "",
      source: first.current ? (params.get("utm_source") ?? params.get("ref") ?? undefined) : undefined,
      newVisitor: isNewVisitorToday(),
    });
    first.current = false;
    if (!navigator.sendBeacon?.("/api/track", payload)) {
      fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
