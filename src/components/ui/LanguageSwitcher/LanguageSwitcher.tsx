"use client";

import { useSyncExternalStore } from "react";

// Drives the hidden GoogleTranslateWidget's actual <select class="goog-te-
// combo"> programmatically instead of showing Google's own boxed
// "Select Language" dropdown (see GoogleTranslateWidget.tsx) — same
// interim-solution reasoning as that component, just with a custom UI
// matching the site's own nav styling instead of Google's default chrome.
//
// Switching TO French: set the googtrans cookie Google's script reads,
// then nudge its own <select> + dispatch a change event — this applies
// instantly, no reload.
//
// Switching BACK to English: resetting the <select> alone is unreliable
// across Google Translate script versions (a well-documented pain point
// with this widget) — clearing the cookie and reloading is the
// consistently-working approach, so that's what this does for "En".
//
// Reads via useSyncExternalStore, not useEffect + setState — same
// reasoning as CollaborationsSliderSection's identical choice: the
// cookie doesn't exist during SSR, and this project's stricter
// react-hooks/set-state-in-effect rule flags the effect+setState
// pattern anyway. `emitChange()` is called manually after the one-way
// write, since cookies don't dispatch their own change events.
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return document.cookie.includes("googtrans=/en/fr");
}

function getServerSnapshot() {
  return false;
}

function setGoogTransCookie(value: string) {
  const host = window.location.hostname;
  document.cookie = `googtrans=${value}; path=/;`;
  document.cookie = `googtrans=${value}; path=/; domain=${host}`;
  document.cookie = `googtrans=${value}; path=/; domain=.${host}`;
}

function clearGoogTransCookie() {
  const host = window.location.hostname;
  const expired = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = expired;
  document.cookie = `${expired} domain=${host}`;
  document.cookie = `${expired} domain=.${host}`;
}

export default function LanguageSwitcher() {
  const isFrench = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function switchToFrench() {
    if (isFrench) return;
    setGoogTransCookie("/en/fr");

    const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    if (select) {
      select.value = "fr";
      select.dispatchEvent(new Event("change"));
      emitChange();
    } else {
      // Widget script hasn't finished initializing yet — the cookie is
      // already set, so a reload picks it up on the way back in.
      window.location.reload();
    }
  }

  function switchToEnglish() {
    if (!isFrench) return;
    clearGoogTransCookie();
    window.location.reload();
  }

  const activeClass = "text-stone-900";
  const inactiveClass = "text-stone-400 hover:text-stone-900";

  return (
    <div className="flex items-center gap-2 font-heading text-[14px] tracking-[0.06em]" translate="no">
      <button
        type="button"
        onClick={switchToEnglish}
        aria-current={!isFrench}
        className={`notranslate cursor-pointer transition-colors duration-200 ${!isFrench ? activeClass : inactiveClass}`}
      >
        En
      </button>
      <span className="text-stone-300" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={switchToFrench}
        aria-current={isFrench}
        className={`notranslate cursor-pointer transition-colors duration-200 ${isFrench ? activeClass : inactiveClass}`}
      >
        Fr
      </button>
    </div>
  );
}
