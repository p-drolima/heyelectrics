import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BoilerTrustedProps {
  onGetQuote?: () => void;
}

export function BoilerTrusted({ onGetQuote }: BoilerTrustedProps) {
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
              Hey Electrics — Trusted Nationwide for Boiler Servicing
            </h2>
            <p className="text-muted-text leading-relaxed text-lg">
              A well-maintained boiler is key to a safe and efficient home. At
              Hey Electrics, our Gas Safe registered engineers deliver thorough
              boiler services for homeowners and landlords across the UK, giving
              you confidence that your heating system is running safely and
              reliably.
            </p>
            <p className="text-muted-text leading-relaxed text-lg">
              We guarantee a transparent, fairly-priced, and friendly service
              with the flexibility to fit your schedule. Our comprehensive
              inspections detect potential issues early, helping you avoid costly
              breakdowns and keeping your household warm all year round.
            </p>
            <Button onClick={onGetQuote} className="w-fit">
              Book Your £99 Boiler Service
            </Button>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-full max-w-[500px] aspect-[4/3]">
              <Image
                src="/images/section_1.png"
                alt="Hey Electrics Boiler Servicing"
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
