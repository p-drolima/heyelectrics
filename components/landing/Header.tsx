"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="w-full bg-white">
      <div
        className={cn(
          "flex items-center justify-between",
          "max-w-[1375px] mx-auto px-4 sm:px-6 lg:px-0",
          "py-3 sm:py-6 lg:py-[42px]"
        )}
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/hey-logo.svg"
              alt="HEY"
              width={152}
              height={51}
              priority
              className="w-[100px] h-auto sm:w-[120px] lg:w-[152px]"
            />
          </Link>
          <span className="hidden md:block text-[21px] font-medium leading-[107%] text-black font-[family-name:var(--font-nav)] ml-[clamp(2rem,9.4vw,129px)]">
            Heating, plumbing,<br />electrics. Sorted.
          </span>
        </div>

        <div className="flex flex-col items-start">
          <span className="hidden sm:block text-[18px] leading-[102%] tracking-[-0.02em] text-black font-medium font-[family-name:var(--font-nav)]">
            Got a problem?
          </span>
          <a
            href="tel:01457868040"
            className="text-[16px] sm:text-[24px] leading-[102%] tracking-[-0.02em] text-black font-medium font-[family-name:var(--font-nav)] hover:opacity-70 transition-opacity"
          >
            01457 868 040
          </a>
        </div>
      </div>
    </header>
  );
}
