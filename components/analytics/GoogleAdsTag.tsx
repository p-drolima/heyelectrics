"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ADS_ID = "AW-16776158728";

/**
 * Google Ads gtag.js — loaded site-wide except on /ev-charger routes,
 * which run their own Google Tag Manager container instead (set up
 * directly by the client) to avoid double-firing conversions.
 */
export function GoogleAdsTag() {
  const pathname = usePathname();
  const isEVCharger = pathname?.startsWith("/ev-charger");

  if (isEVCharger) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ADS_ID}');
        `}
      </Script>
    </>
  );
}
