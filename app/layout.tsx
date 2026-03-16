import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ADS_ID = "AW-16776158728";

export const metadata: Metadata = {
  title: "Hey Electrics - Nationwide EICRs | Electrical Installation Condition Reports",
  description:
    "Professional EICR inspections for landlords and homeowners. Starting from £79. Flexible availability, nationwide service, certified electricians.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
      </head>
      <body>{children}</body>
    </html>
  );
}
