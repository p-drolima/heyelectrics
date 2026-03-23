import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boiler Servicing From £99 | Hey Electrics",
  description:
    "Professional boiler servicing for landlords and homeowners. Gas, LPG & oil boilers from just £99. Flexible availability, certified engineers.",
};

export default function BoilerServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
