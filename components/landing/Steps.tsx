import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileText, CalendarCheck, Award } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: FileText,
    title: "Fill Out Our Simple Form",
    description:
      "Submit your details in seconds, and we'll respond quickly with your detailed quote.",
  },
  {
    number: 2,
    icon: CalendarCheck,
    title: "Book Your Hassle-Free Survey",
    description:
      "Our local certified electrician will schedule a survey at your convenience, typically completed in just 2-4 hours, bringing you one step closer to electrical safety and reassurance.",
  },
  {
    number: 3,
    icon: Award,
    title: "Receive Your EICR Certificate",
    description:
      "Get your comprehensive compliant certificate within 5 business days, valid for up to 5 years. Landlords, ask about our block booking options!",
  },
];

interface StepsProps {
  onGetQuote?: () => void;
}

export function Steps({ onGetQuote }: StepsProps) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-[1375px] mx-auto bg-[#F4F6FA] rounded-[17px] px-6 sm:px-10 lg:px-14 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black font-[family-name:var(--font-display)]">
            Quick & Easy Electrical Safety in 3 Simple Steps
          </h2>
          <Button onClick={onGetQuote} className="shrink-0 w-fit">
            Start your quote now
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white font-bold text-lg font-[family-name:var(--font-display)]">
                  {step.number}
                </div>
                <step.icon className="h-8 w-8 text-black/40" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-black mb-2 font-[family-name:var(--font-display)]">
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
