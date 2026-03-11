import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
