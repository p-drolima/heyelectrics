import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BULLET_POINTS = [
  "Flexible Availability & Nationwide Service",
  "EICR For Domestic & Commercial Properties",
  "EICR for Home Buyers & Sellers",
  "EICR for Landlords",
];

interface FooterProps {
  onGetQuote?: () => void;
}

export function Footer({ onGetQuote }: FooterProps) {
  return (
    <footer>
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-[1375px] mx-auto bg-[#F4F6FA] rounded-[17px] px-6 sm:px-10 lg:px-14 py-12">
          <div
            className={cn(
              "flex flex-col lg:flex-row lg:items-center lg:justify-between",
              "gap-8 lg:gap-12"
            )}
          >
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 font-[family-name:var(--font-display)]">
                Ensure Electrical Safety Today with Professional EICR Services
              </h2>
              <ul className="space-y-3">
                {BULLET_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-muted-text text-base md:text-lg"
                  >
                    <span className="shrink-0 rounded-full bg-black p-0.5">
                      <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 lg:shrink-0">
              <Button
                onClick={onGetQuote}
                variant="default"
                size="lg"
                className="w-full lg:w-auto"
              >
                Get your quote
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full lg:w-auto"
              >
                <a href="tel:01457868040">01457 868 040</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1375px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/hey-logo.svg"
                alt="HEY"
                width={113}
                height={38}
              />
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="text-black font-medium leading-7">
                  Saving homes money,<br />and headaches.
                </p>
              </div>
              <div>
                <p className="text-black font-medium leading-7">
                  24 Hour Emergency call out<br />
                  Call - 01457 868 040
                </p>
              </div>
              <div>
                <p className="text-black font-medium leading-7">
                  Office open 9am-5pm<br />Monday - Friday
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-[#828A93] text-xs leading-5 tracking-wide">
              HEY HOMES GROUP LTD. Legal copy including the address, legal entity,
              insurance details and company numbers will go here.
              &copy; Copyright 2026 Hey Homes Group Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
