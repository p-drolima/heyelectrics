"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteForm } from "./QuoteForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BULLET_POINTS = [
  "Flexible Availability & Nationwide Service",
  "EICR For Domestic & Commercial Properties",
  "EICR for Home Buyers & Sellers",
  "EICR for Landlords",
];

export function Hero() {
  return (
    <section
      className={cn(
        "relative min-h-[600px] w-full",
        "bg-gradient-to-br from-[#1a1a2e] via-[#1a1a2e] to-[#16213e]",
        "flex flex-col lg:flex-row items-center justify-center gap-12",
        "px-4 py-16 lg:py-24"
      )}
    >
      <div
        className={cn(
          "flex flex-col max-w-xl lg:max-w-2xl",
          "order-2 lg:order-1 text-center lg:text-left"
        )}
      >
        <h1
          className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-bold text-white",
            "leading-tight mb-4"
          )}
        >
          Local Electrical Installation Condition Report Experts
        </h1>
        <p className="text-[#2CBCB0] text-xl font-semibold mb-8">
          Starting from only £79*
        </p>
        <ul className="space-y-3">
          {BULLET_POINTS.map((point) => (
            <li
              key={point}
              className="flex items-center gap-3 text-white/90 text-base sm:text-lg"
            >
              <span className="flex-shrink-0 rounded-full bg-[#2CBCB0] p-0.5">
                <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn(
          "w-full max-w-md flex-shrink-0",
          "order-1 lg:order-2"
        )}
      >
        <Card className="rounded-xl shadow-xl border-0 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-[#1a1a2e]">
              Start Your Quote Below
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QuoteForm idPrefix="hero-" />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
