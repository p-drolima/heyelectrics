"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/landing/Header";
import { CheckCircle } from "lucide-react";
import { DEPOSIT_NUMERIC } from "@/lib/pricing";


declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const isNew = searchParams.get("new") !== "false";

  useEffect(() => {
    if (ref && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-16776158728/x7XGCJ2cg4gcEIi8v78-",
        value: DEPOSIT_NUMERIC,
        currency: "GBP",
        transaction_id: ref,
        new_customer: isNew,
      });
    }
  }, [ref, isNew]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-[#44B4D7]/10 p-4">
            <CheckCircle className="h-16 w-16 text-[#44B4D7]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-black">
          Your booking is confirmed
        </h1>
        <p className="text-gray-600">
          We&apos;ve received your deposit payment and confirmed your EICR inspection. Check your email for full details.
        </p>
        {ref && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Your booking reference</p>
            <p className="font-mono font-bold text-lg text-black">{ref}</p>
          </div>
        )}
        <Button asChild variant="default" size="lg">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        }
      >
        <ThankYouContent />
      </Suspense>
    </>
  );
}
