export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];

/** Cookie names are prefixed to avoid clashing with anything else on the domain. */
export const utmCookieName = (key: UtmKey) => `ev_${key}`;

export const UTM_COOKIE_MAX_AGE_DAYS = 30;

export function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

export function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : "";
}
