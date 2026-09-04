"use client";

import { useEffect } from "react";
import { UTM_KEYS, UTM_COOKIE_MAX_AGE_DAYS, setCookie, utmCookieName } from "@/lib/utm";

/**
 * Captures utm_source / utm_medium / utm_campaign / utm_term from the URL on
 * any /ev-charger page and persists them in cookies for 30 days.
 *
 * Ad campaigns land on /ev-charger, but the enquiry form lives on a separate
 * route (/ev-charger/get-a-quote). Cookies survive that navigation — and any
 * amount of browsing in between — so the params aren't lost by the time the
 * form is submitted and passed on to ActiveCampaign.
 *
 * If the current URL has no UTM params (e.g. someone landed on the quote
 * page directly, or navigated internally), whatever was previously captured
 * is left untouched rather than being overwritten with blanks.
 */
export function UtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasAnyUtm = UTM_KEYS.some((key) => params.get(key));
    if (!hasAnyUtm) return;

    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) {
        setCookie(utmCookieName(key), value, UTM_COOKIE_MAX_AGE_DAYS);
      }
    });
  }, []);

  return null;
}
