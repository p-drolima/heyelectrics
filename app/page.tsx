"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Steps } from "@/components/landing/Steps";
import { Trusted } from "@/components/landing/Trusted";
import { Services } from "@/components/landing/Services";
import { Landlords } from "@/components/landing/Landlords";
import { FAQ } from "@/components/landing/FAQ";
import { PropertyTypes } from "@/components/landing/PropertyTypes";
import { Footer } from "@/components/landing/Footer";
import { QuoteModal } from "@/components/landing/QuoteModal";
import { QuoteFormStateProvider } from "@/components/landing/QuoteFormStateContext";

export default function Home() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const openQuoteModal = () => setQuoteModalOpen(true);

  return (
    <QuoteFormStateProvider>
      <Header />
      <main>
        <Hero />
        <Steps onGetQuote={openQuoteModal} />
        <Trusted onGetQuote={openQuoteModal} />
        <Services onGetQuote={openQuoteModal} />
        <Landlords onGetQuote={openQuoteModal} />
        <FAQ />
        <PropertyTypes onGetQuote={openQuoteModal} />
      </main>
      <Footer onGetQuote={openQuoteModal} />
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />
    </QuoteFormStateProvider>
  );
}
