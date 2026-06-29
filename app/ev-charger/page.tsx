import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { EVHero } from "@/components/ev-landing/EVHero";
import { EVSteps } from "@/components/ev-landing/EVSteps";
import { EVContentTrusted } from "@/components/ev-landing/EVContentTrusted";
import { EVServices } from "@/components/ev-landing/EVServices";
import { EVContentSmart } from "@/components/ev-landing/EVContentSmart";
import { EVFAQ } from "@/components/ev-landing/EVFAQ";

export default function EVChargerPage() {
  return (
    <>
      <Header />
      <main>
        <div id="ev-hero">
          <EVHero />
        </div>
        <EVSteps />
        <EVContentTrusted />
        <EVServices />
        <EVContentSmart />
        <EVFAQ />
      </main>
      <Footer serviceType="ev" />
    </>
  );
}
