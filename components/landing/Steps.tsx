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
    <section className="bg-[#f8f9fa] py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e]">
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
                "flex flex-col items-start bg-white rounded-lg p-6",
                "shadow-sm border border-gray-100",
                "hover:shadow-md transition-shadow"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2CBCB0] text-white font-bold text-lg">
                  {step.number}
                </div>
                <step.icon className="h-8 w-8 text-[#2CBCB0]" aria-hidden />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
