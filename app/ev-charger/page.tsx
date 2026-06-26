"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { EVHero } from "@/components/ev-landing/EVHero";
import { EVSteps } from "@/components/ev-landing/EVSteps";
import { EVContentTrusted } from "@/components/ev-landing/EVContentTrusted";
import { EVServices } from "@/components/ev-landing/EVServices";
import { EVContentSmart } from "@/components/ev-landing/EVContentSmart";
import { EVFAQ } from "@/components/ev-landing/EVFAQ";
import { EVQuoteModal } from "@/components/ev-landing/EVQuoteModal";

export default function EVChargerPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />
      <main>
        <div id="ev-hero">
          <EVHero />
        </div>
        <EVSteps />
        <EVContentTrusted />
        <EVServices onGetQuote={() => setModalOpen(true)} />
        <EVContentSmart />
        <EVFAQ />
      </main>
      <Footer onGetQuote={() => setModalOpen(true)} serviceType="ev" />
      <EVQuoteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
