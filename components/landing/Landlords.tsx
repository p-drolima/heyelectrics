import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LandlordsProps {
  onGetQuote?: () => void;
}

export function Landlords({ onGetQuote }: LandlordsProps) {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16",
            "items-center"
          )}
        >
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">
              EICR Inspections for Landlords & Homeowners
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Safety at home or work demands the skilled hands of a professional
              to take the lead. Our experienced team proudly provides an
              exemplary service to nationwide clients of all sizes, from large
              commercial landlords to single-property owners.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Rest assured, we guarantee full compliance with England&apos;s
              private rented sector regulations and are proactively alerted to
              legislative changes to keep your properties aligned with most
              recent regulations.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Don&apos;t wait, act now.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Request your EICR inspection now to feel confident in the safety
              of your property.
            </p>
            <Button onClick={onGetQuote} variant="orange" className="w-fit">
              Get Started Today
            </Button>
          </div>

          <div className="flex justify-center md:justify-end">
            <div
              className="w-full max-w-[400px] rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium aspect-4/3"
              aria-label="Image placeholder"
            >
              Image Placeholder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
