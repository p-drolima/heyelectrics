"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormProvider, type PropertyType } from "@/components/form/FormProvider";
import { StepWizard } from "@/components/form/StepWizard";
import { Header } from "@/components/landing/Header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function EICRFormContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as PropertyType | null;
  const initialType =
    typeParam === "residential" || typeParam === "commercial"
      ? typeParam
      : null;

  return (
    <FormProvider initialPropertyType={initialType}>
      <StepWizard />
    </FormProvider>
  );
}

export default function EICRPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F4F6FA]">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12 pb-32 sm:pb-12">
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-text hover:text-black transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-muted-text">Loading form...</div>
              </div>
            }
          >
            <EICRFormContent />
          </Suspense>
        </div>
      </main>
    </>
  );
}
