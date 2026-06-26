import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EV Charger Installation From £879 | Hey Electrics",
  description:
    "Professional home EV charger installation from £879. Brand new BG Sync EV wall mounted chargers fitted by certified engineers. Get a free quote today.",
};

export default function EVChargerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
