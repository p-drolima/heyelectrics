"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/landing/Header";
import { CheckCircle } from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-[#2CBCB0]/10 p-4">
            <CheckCircle className="h-16 w-16 text-[#2CBCB0]" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#1a1a2e]">
          Thank You!
        </h1>
        <p className="text-gray-600">
          We&apos;ve received your details and will be in touch soon.
        </p>
        {ref && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Your booking reference</p>
            <p className="font-mono font-bold text-lg text-[#1a1a2e]">{ref}</p>
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
