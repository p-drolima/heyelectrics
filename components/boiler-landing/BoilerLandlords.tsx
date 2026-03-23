import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const USP_ITEMS = [
  "Prevent unexpected breakdowns",
  "Improve energy efficiency",
  "Extend the lifespan of your boiler",
  "Ensure safe operation",
];

interface BoilerLandlordsProps {
  onGetQuote?: () => void;
}

export function BoilerLandlords({ onGetQuote }: BoilerLandlordsProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1375px] mx-auto">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16",
            "items-center"
          )}
        >
          <div className="flex flex-col gap-6 order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-black font-display">
              Boiler Servicing for Landlords &amp; Homeowners
            </h2>
            <p className="text-muted-text leading-relaxed text-lg">
              Whether you&apos;re a landlord managing a portfolio of rental
              properties or a homeowner wanting peace of mind, regular boiler
              servicing is essential. Our experienced Gas Safe engineers provide
              a comprehensive service that keeps your heating system running
              efficiently and safely.
            </p>
            <p className="text-muted-text leading-relaxed text-lg">
              An annual boiler service helps you:
            </p>
            <ul className="space-y-3">
              {USP_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-black text-base md:text-lg"
                >
                  <span className="shrink-0 rounded-full bg-black p-0.5">
                    <Check className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button onClick={onGetQuote} className="w-fit">
              Book Your Boiler Service
            </Button>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-full max-w-[500px] aspect-[4/3]">
              <Image
                src="/images/section_2.png"
                alt="Boiler Servicing for Landlords"
                fill
                className="object-cover rounded-[17px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
