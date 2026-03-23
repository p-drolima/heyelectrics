import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PROPERTY_TYPES = [
  {
    title: "Residential Boiler Servicing",
    description:
      "Ensure your home stays warm and safe with a professional boiler service. We inspect all key components, identify potential issues early, and help improve efficiency to reduce energy bills.",
  },
  {
    title: "Landlord Boiler Servicing",
    description:
      "Stay compliant and protect your tenants with annual servicing. We provide reliable inspections and can support with ongoing maintenance plans across multiple properties.",
  },
  {
    title: "Commercial Boiler Servicing",
    description:
      "From offices to retail spaces, we service commercial heating systems to ensure safe operation, minimise downtime, and maintain efficiency across your business premises.",
  },
];

interface BoilerPropertyTypesProps {
  onGetQuote?: () => void;
}

export function BoilerPropertyTypes({ onGetQuote }: BoilerPropertyTypesProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-[1375px] mx-auto bg-black rounded-[17px] px-6 sm:px-10 lg:px-14 py-16">
        <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-2 font-display">
          Boiler Servicing:
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 font-display">
          Boiler Servicing for Every Property Type
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {PROPERTY_TYPES.map((item) => (
            <div
              key={item.title}
              className={cn(
                "bg-white/5 border border-white/10 rounded-[17px] p-6",
                "hover:bg-white/10 transition-colors"
              )}
            >
              <h3 className="text-lg font-bold text-white mb-3 font-display">
                {item.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={onGetQuote} variant="white" size="lg">
            Book Your Boiler Service
          </Button>
        </div>
      </div>
    </section>
  );
}
