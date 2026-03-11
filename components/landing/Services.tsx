import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BULLET_POINTS = [
  "Flexible Availability & Nationwide Service",
  "EICR For Domestic & Commercial Properties",
  "EICR for Home Buyers & Sellers",
  "EICR for Landlords",
];

interface ServicesProps {
  onGetQuote?: () => void;
}

export function Services({ onGetQuote }: ServicesProps) {
  return (
    <section className="bg-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div
          className={cn(
            "flex flex-col lg:flex-row lg:items-center lg:justify-between",
            "gap-8 lg:gap-12"
          )}
        >
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-6">
              Ensure Electrical Safety Today with Professional EICR Services
            </h2>
            <ul className="space-y-3">
              {BULLET_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-gray-700 text-base md:text-lg"
                >
                  <span className="shrink-0 rounded-full bg-[#2CBCB0] p-0.5">
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
  );
}
