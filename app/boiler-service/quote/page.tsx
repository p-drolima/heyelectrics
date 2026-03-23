"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  BoilerFormProvider,
  type FuelType,
} from "@/components/boiler-form/BoilerFormProvider";
import { BoilerStepWizard } from "@/components/boiler-form/BoilerStepWizard";
import { Header } from "@/components/landing/Header";

function BoilerFormContent() {
  const searchParams = useSearchParams();
  const fuelParam = searchParams.get("fuel") as FuelType | null;
  const initialFuel =
    fuelParam === "gas" || fuelParam === "lpg" || fuelParam === "oil"
      ? fuelParam
      : null;

  return (
    <BoilerFormProvider initialFuelType={initialFuel}>
      <BoilerStepWizard />
    </BoilerFormProvider>
  );
}

export default function BoilerQuotePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F4F6FA]">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12 pb-32 sm:pb-12">
          <div className="mb-6 sm:mb-8">
            <Link
              href="/boiler-service"
              className="inline-flex items-center gap-1.5 text-sm text-muted-text hover:text-black transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Boiler Service
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-muted-text">Loading form...</div>
              </div>
            }
          >
            <BoilerFormContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
