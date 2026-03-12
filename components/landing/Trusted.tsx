import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TrustedProps {
  onGetQuote?: () => void;
}

export function Trusted({ onGetQuote }: TrustedProps) {
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
              Hey Electrics – Trusted Nationwide for EICRs
            </h2>
            <p className="text-muted-text leading-relaxed text-lg">
              With over 20,000 electrical accidents occurring annually in the
              UK, don&apos;t let yours be one of them. Stay safe with Hey
              Electrics. Whether you&apos;re a homeowner or landlord, you&apos;re
              in professional and capable hands with our qualified team.
            </p>
            <p className="text-muted-text leading-relaxed text-lg">
              We guarantee a verified, fairly-priced, and friendly service, with the
              flexibility to fit your schedule. Our thorough inspections detect
              potential electrical hazards, keeping your family or tenants safe.
            </p>
            <Button onClick={onGetQuote} className="w-fit">
              Get Started Today
            </Button>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-full max-w-[500px] aspect-[4/3]">
              <Image
                src="/images/section_1.png"
                alt="Hey Electrics Professional Service"
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
