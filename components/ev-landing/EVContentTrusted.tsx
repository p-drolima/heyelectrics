import Image from "next/image";
import { cn } from "@/lib/utils";

export function EVContentTrusted() {
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
              Trusted EV Charger Installers for Safer Home Charging
            </h2>
            <p className="text-muted-text leading-relaxed text-lg">
              Charging your electric vehicle at home should feel simple, safe
              and reliable. With Hey Electrics, you get a complete installation
              service carried out by certified engineers who know how to fit
              your charger properly and leave everything working as it should.
            </p>
            <p className="text-muted-text leading-relaxed text-lg">
              Our team installs brand new BG Sync EV wall mounted chargers
              designed for smart, convenient home charging. Whether you&rsquo;ve
              just bought your first electric vehicle or you&rsquo;re upgrading from
              a standard socket, we&rsquo;ll help you get the right setup for your
              home.
            </p>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-full max-w-[500px] aspect-4/3">
              <Image
                src="/images/ev-section-1.png"
                alt="Hey Electrics EV Charger Installation"
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
