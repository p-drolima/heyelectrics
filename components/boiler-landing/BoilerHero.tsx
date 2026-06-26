"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { BoilerQuoteForm } from "./BoilerQuoteForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const USP_ITEMS = [
  "Boiler Servicing for Homeowners & Landlords",
  "Gas Safe Registered Engineers",
  "Fixed £99 Price — No Hidden Fees",
  "Flexible Booking & Nationwide Availability",
];

export function BoilerHero() {
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
                "font-display font-bold",
                "text-3xl sm:text-4xl lg:text-[50px] lg:leading-[97%]",
                "text-black mb-6"
              )}
            >
              Reliable Boiler Servicing — From Just £99
            </h1>
            <ul className="space-y-3 mb-8 w-fit mx-auto lg:mx-0 text-left">
              {USP_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-black text-base sm:text-lg"
                >
                  <span className="shrink-0 rounded-full bg-black p-0.5">
                    <Check className="h-4 w-4 text-[#FFEA60]" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              "w-full max-w-md shrink-0",
              "order-2 lg:order-2"
            )}
          >
            <Card className="rounded-[15px] shadow-xl border-0 overflow-hidden bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-black font-display">
                  Book Your Boiler Service Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BoilerQuoteForm idPrefix="hero-" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
