import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PROPERTY_TYPES = [
  {
    title: "Commercial EICR",
    description:
      "We inspect and test electrical systems in offices, shops, restaurants, and warehouses. From assessing the existing wiring and socket outlets to evaluating the installation of lighting systems. Our electrical condition reports for commercial properties are detailed and actionable, including recommendations to create a safer environment for your customers.",
  },
  {
    title: "Industrial EICR",
    description:
      "Our professional services extend to inspections for factories, manufacturing plants, and industrial facilities. We'll check on the condition of high-powered machinery, wiring and cabling installation and test safety devices like RCDs and circuit breakers. By working with us, you protect your workforce and investment.",
  },
  {
    title: "Residential EICR",
    description:
      "Get peace of mind knowing that your family is protected from potential hazards with our residential inspections. We inspect all your wiring, sockets, switches, and more, detailing all findings in a clear report, so stay informed of any risks and required fixes to meet all necessary safety regulations.",
  },
];

interface PropertyTypesProps {
  onGetQuote?: () => void;
}

export function PropertyTypes({ onGetQuote }: PropertyTypesProps) {
  return (
    <section className="bg-[#1a1a2e] py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm font-medium text-[#2CBCB0] uppercase tracking-wide mb-2">
          Electrical Condition Reports:
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12">
          Powering Safety Across Every Property
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {PROPERTY_TYPES.map((item) => (
            <Card
              key={item.title}
              className={cn(
                "border-gray-700 bg-white/5 text-white",
                "hover:bg-white/10 transition-colors"
              )}
            >
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={onGetQuote} variant="orange" size="lg">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
}
