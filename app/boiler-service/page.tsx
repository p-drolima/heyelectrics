"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { BoilerHero } from "@/components/boiler-landing/BoilerHero";
import { BoilerSteps } from "@/components/boiler-landing/BoilerSteps";
import { BoilerTrusted } from "@/components/boiler-landing/BoilerTrusted";
import { BoilerServices } from "@/components/boiler-landing/BoilerServices";
import { BoilerLandlords } from "@/components/boiler-landing/BoilerLandlords";
import { BoilerFAQ } from "@/components/boiler-landing/BoilerFAQ";
import { BoilerPropertyTypes } from "@/components/boiler-landing/BoilerPropertyTypes";
import { BoilerQuoteModal } from "@/components/boiler-landing/BoilerQuoteModal";
import { BoilerQuoteFormStateProvider } from "@/components/boiler-landing/BoilerQuoteFormStateContext";

export default function BoilerServicePage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const openQuoteModal = () => setQuoteModalOpen(true);

  return (
    <BoilerQuoteFormStateProvider>
      <Header />
      <main>
        <BoilerHero />
        <BoilerSteps onGetQuote={openQuoteModal} />
        <BoilerTrusted onGetQuote={openQuoteModal} />
        <BoilerServices onGetQuote={openQuoteModal} />
        <BoilerLandlords onGetQuote={openQuoteModal} />
        <BoilerFAQ />
        <BoilerPropertyTypes onGetQuote={openQuoteModal} />
      </main>
      <Footer onGetQuote={openQuoteModal} />
      <BoilerQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </BoilerQuoteFormStateProvider>
  );
}
