"use client";

import * as React from "react";
import type { SidebarMode } from "./sidebar";

const STORAGE_KEY = "inv.sidebar";
const EVENT = "inv-sidebar-change";
const WIDE = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// The person's choice is remembered on this device only. Storage can be blocked (private windows,
// site data cleared), so every access is guarded and the shell works without it.
function read(): SidebarMode {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "collapsed" || saved === "expanded") return saved;
  } catch {
    // Storage unavailable.
  }
  return "auto";
}

function subscribeWide(onChange: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** The sidebar mode, whether it is currently expanded, and a toggle. */
export function useSidebarMode() {
  const mode = React.useSyncExternalStore<SidebarMode>(
    subscribe,
    read,
    () => "auto",
  );
  const wide = React.useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
  const expanded = mode === "auto" ? wide : mode === "expanded";

  const toggle = React.useCallback(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        expanded ? "collapsed" : "expanded",
      );
    } catch {
      // Not remembered, but the page still reacts below.
    }
    window.dispatchEvent(new Event(EVENT));
  }, [expanded]);

  return { mode, expanded, toggle };
}
