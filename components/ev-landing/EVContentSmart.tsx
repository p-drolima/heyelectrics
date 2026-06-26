import Image from "next/image";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const USP_ITEMS = [
  "Full EV charger installations from £879",
  "Brand new BG Sync EV charger included",
  "Wall mounted home charging solution",
  "Installed by certified electrical engineers",
  "Safe testing and setup included",
  "Clear advice before and after installation",
  "Suitable for homeowners, tenants and landlords",
  "Simple quote process with friendly support",
];

export function EVContentSmart() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1375px] mx-auto">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16",
            "items-center"
          )}
        >
          <div className="flex justify-center md:justify-start order-1 md:order-1">
            <div className="relative w-full max-w-[500px] aspect-4/3">
              <Image
                src="/images/ev-section-2.png"
                alt="Smart EV Home Charging"
                fill
                className="object-cover rounded-[17px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 order-2 md:order-2">
            <h2 className="text-2xl md:text-3xl font-bold text-black font-display">
              Smart Home Charging, Installed by Professionals
            </h2>
            <p className="text-muted-text leading-relaxed text-lg">
              A dedicated EV charger gives you a safer and more convenient way
              to charge your vehicle at home. Instead of relying on slower
              temporary charging methods, your wall mounted charger is fitted
              professionally and set up for everyday use.
            </p>
            <p className="text-muted-text leading-relaxed text-lg">
              From checking your electrical supply to installing, testing and
              commissioning your charger, our certified team takes care of the
              full process.
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
          </div>
        </div>
      </div>
    </section>
  );
}
