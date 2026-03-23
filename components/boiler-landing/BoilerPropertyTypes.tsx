import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PROPERTY_TYPES = [
  {
    title: "Residential",
    description:
      "Keep your home warm and safe with an annual boiler service. Our Gas Safe engineers carry out a comprehensive inspection of your boiler, ensuring it operates efficiently and meets all current safety standards. Ideal for homeowners who want peace of mind.",
  },
  {
    title: "Landlord",
    description:
      "Stay compliant with your legal obligations as a landlord. We provide annual boiler services and Gas Safety Certificates (CP12) to keep your rental properties safe for tenants, helping you meet all regulatory requirements with minimal hassle.",
  },
  {
    title: "Commercial",
    description:
      "Protect your business premises with professional boiler servicing. From offices and shops to restaurants and warehouses, our engineers ensure your commercial heating systems run reliably and efficiently, minimising downtime and keeping your team comfortable.",
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
