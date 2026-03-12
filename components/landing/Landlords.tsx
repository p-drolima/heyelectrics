import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LandlordsProps {
  onGetQuote?: () => void;
}

export function Landlords({ onGetQuote }: LandlordsProps) {
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
              EICR Inspections for Landlords & Homeowners
            </h2>
            <p className="text-muted-text leading-relaxed text-lg">
              Safety at home or work demands the skilled hands of a professional
              to take the lead. Our experienced team proudly provides an
              exemplary service to nationwide clients of all sizes, from large
              commercial landlords to single-property owners.
            </p>
            <p className="text-muted-text leading-relaxed text-lg">
              Rest assured, we guarantee full compliance with England&apos;s
              private rented sector regulations and are proactively alerted to
              legislative changes to keep your properties aligned with most
              recent regulations.
            </p>
            <p className="text-muted-text leading-relaxed text-lg">
              Don&apos;t wait, act now. Request your EICR inspection now to feel
              confident in the safety of your property.
            </p>
            <Button onClick={onGetQuote} className="w-fit">
              Get Started Today
            </Button>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative w-full max-w-[500px] aspect-[4/3]">
              <Image
                src="/images/section_2.png"
                alt="EICR Inspection for Landlords"
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
