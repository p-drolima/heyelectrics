import type { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { EVQuoteForm } from "@/components/ev-landing/EVQuoteForm";

export const metadata: Metadata = {
  title: "Get a Free EV Charger Quote | Hey Electrics",
  description:
    "Request your free EV charger installation quote. Brand new BG Sync EV wall mounted chargers from £879, fitted by certified engineers.",
};

export default function EVGetAQuotePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F4F6FA]">
        <section className="px-4 sm:px-6 lg:px-8 pt-[78px] pb-[68px]">
          <div className="max-w-[1375px] mx-auto">
            <EVQuoteForm />
          </div>
        </section>
      </main>
      <Footer serviceType="ev" />
    </>
  );
}
