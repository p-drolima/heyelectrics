"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div
        className={cn(
          "flex items-center justify-between",
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"
        )}
      >
        <Link href="/" className="flex items-center">
          <span
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-full px-4 py-1.5 text-sm font-bold text-white",
              "bg-[#1a1a2e]"
            )}
          >
            HEY
          </span>
        </Link>

        <a
          href="tel:01457868040"
          className={cn(
            "flex items-center gap-2",
            "text-[#1a1a2e] font-medium hover:text-[#2CBCB0]",
            "transition-colors"
          )}
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">01457 868 040</span>
        </a>
      </div>
    </header>
  );
}
