import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const BULLET_POINTS = [
  "Brand new BG Sync EV wall mounted charger",
  "Fully certified installers and engineers",
  "Smart home charging setup",
  "Safe, compliant installation",
];

interface EVServicesProps {
  onGetQuote?: () => void;
}

export function EVServices({ onGetQuote }: EVServicesProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-[1375px] mx-auto bg-[#4EB4DA] rounded-[17px] px-6 sm:px-10 lg:px-14 py-12">
        <div
          className={cn(
            "flex flex-col lg:flex-row lg:items-center lg:justify-between",
            "gap-8 lg:gap-12"
          )}
        >
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 font-display">
              Professional EV Charger Installation for Every Property
            </h2>
            <ul className="space-y-3">
              {BULLET_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-black text-base md:text-lg"
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
            <button
              onClick={onGetQuote}
              className={cn(
                "inline-flex items-center justify-center",
                "bg-white text-black font-bold text-base",
                "rounded-full px-8 py-4",
                "hover:bg-black hover:text-white transition-colors",
                "w-full lg:w-auto text-center"
              )}
            >
              Get a Free Quote
            </button>
            <a
              href="tel:01615660197"
              className={cn(
                "inline-flex items-center justify-center",
                "border-2 border-white text-white font-bold text-base",
                "rounded-full px-8 py-4 bg-transparent",
                "hover:bg-white hover:text-[#4EB4DA] transition-colors",
                "w-full lg:w-auto text-center"
              )}
            >
              Call Hey Electrics
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
