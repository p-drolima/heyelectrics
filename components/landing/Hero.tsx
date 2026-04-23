"use client";

import { cn } from "@/lib/utils";
import { QuoteForm } from "./QuoteForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Hero() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "max-w-[1375px] mx-auto",
          "bg-[#FFEA60] rounded-[17px]",
          "px-6 sm:px-10 lg:px-[180px] py-16 lg:py-20"
        )}
      >
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div
            className={cn(
              "flex flex-col max-w-xl lg:max-w-2xl flex-1",
              "order-1 lg:order-1 text-center lg:text-left"
            )}
          >
            <h1
              className={cn(
                "font-[family-name:var(--font-display)] font-bold",
                "text-3xl sm:text-4xl lg:text-[50px] lg:leading-[97%]",
                "text-black mb-4"
              )}
            >
              Local Electrical Installation Condition Report Experts
            </h1>
            <p className="text-black/80 text-lg sm:text-2xl leading-[116%] tracking-wide mb-8">
              Heating, plumbing and electrics, one phone call, fixes them all.
            </p>
            <div className="hidden lg:block">
              <p className="text-black/60 text-sm">Deposit today from only £29.99</p>
            </div>
          </div>

          <div
            className={cn(
              "w-full max-w-md shrink-0",
              "order-2 lg:order-2"
            )}
          >
            <Card className="rounded-[17px] shadow-xl border-0 overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-black font-[family-name:var(--font-display)]">
                  Start Your Quote Below
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuoteForm idPrefix="hero-" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
