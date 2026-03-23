import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Wrench, ShieldCheck } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: CalendarCheck,
    title: "Book Your Service Online",
    description:
      "Choose a time that suits you and secure your boiler service in minutes with our simple booking system.",
  },
  {
    number: 2,
    icon: Wrench,
    title: "Engineer Visit at Your Convenience",
    description:
      "A Gas Safe registered engineer will attend your property, carry out a full boiler inspection, and ensure everything is working safely and efficiently.",
  },
  {
    number: 3,
    icon: ShieldCheck,
    title: "Service Complete & Peace of Mind",
    description:
      "We\u2019ll confirm your boiler is operating safely, highlight any issues, and provide recommendations to keep your system running smoothly all year round.",
  },
];

interface BoilerStepsProps {
  onGetQuote?: () => void;
}

export function BoilerSteps({ onGetQuote }: BoilerStepsProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-[1375px] mx-auto bg-[#F4F6FA] rounded-[17px] px-6 sm:px-10 lg:px-14 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black font-display">
            Quick &amp; Easy Boiler Servicing in 3 Simple Steps
          </h2>
          <Button onClick={onGetQuote} className="shrink-0 w-fit">
            Book your service now
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className={cn(
                "flex flex-col items-start bg-white rounded-[17px] p-6",
                "shadow-sm",
                "hover:shadow-md transition-shadow"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white font-bold text-lg font-display">
                  {step.number}
                </div>
                <step.icon className="h-8 w-8 text-black/40" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-black mb-2 font-display">
                {step.title}
              </h3>
              <p className="text-muted-text text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
