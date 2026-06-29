import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const USP_ITEMS = [
  "Brand new BG Sync EV wall mounted charger",
  "Fully certified installers and engineers",
  "Smart home charging setup",
  "Safe, compliant installation",
];

export function EVHero() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div
        className={cn(
          "max-w-[1375px] mx-auto",
          "bg-[#FFEA60] rounded-[17px] overflow-hidden"
        )}
      >
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Left — headline + USPs + CTA */}
          <div
            className={cn(
              "flex flex-col flex-1 min-w-0",
              "px-6 sm:px-10 lg:pl-[180px] lg:pr-14",
              "py-14 lg:py-20",
              "order-2 lg:order-1",
              "text-center lg:text-left"
            )}
          >
            <h1
              className={cn(
                "font-display font-bold",
                "text-3xl sm:text-4xl lg:text-[50px] lg:leading-[97%]",
                "text-black mb-5"
              )}
            >
              Home EV Charger Installation Made Simple
            </h1>

            <p className="font-text font-normal text-lg lg:text-[24px] leading-[117%] tracking-[0.01em] text-black/80 mb-7 text-center lg:text-left">
              Get a brand new <strong>BG Sync EV</strong> wall mounted charger installed
              at your home by fully certified Hey Electrics installers.
            </p>

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

            <div className="flex justify-center lg:justify-start">
              <Link
                href="/ev-charger/get-a-quote"
                className={cn(
                  "inline-flex items-center justify-center",
                  "bg-black text-white font-bold text-sm tracking-widest uppercase",
                  "rounded-full px-8 py-4",
                  "hover:bg-white hover:text-black transition-colors"
                )}
              >
                Get Your Free Quote
              </Link>
            </div>
          </div>

          {/* Right — hero image */}
          <div
            className={cn(
              "relative w-full h-[280px]",
              "lg:w-[635px] lg:h-auto lg:self-stretch",
              "shrink-0 order-1 lg:order-2"
            )}
          >
            {/* Price stamp — desktop: hangs off left edge of image column */}
            <div className="hidden lg:block absolute top-[87px] -left-[96px] z-10 w-[158px] h-[156px] drop-shadow-lg pointer-events-none">
              <Image
                src="/images/price-stamp-ev.svg"
                alt="Full installations from £879"
                fill
                className="object-contain"
              />
            </div>

            {/* Price stamp — mobile: top-centre within the image */}
            <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[88px] h-[88px] drop-shadow-lg pointer-events-none">
              <Image
                src="/images/price-stamp-ev.svg"
                alt="Full installations from £879"
                fill
                className="object-contain"
              />
            </div>

            <Image
              src="/images/hero-ev.png"
              alt="Hey Electrics engineer installing an EV charger at a home"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 635px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
