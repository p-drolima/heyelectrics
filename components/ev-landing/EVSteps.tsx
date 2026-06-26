import { cn } from "@/lib/utils";
import { ClipboardList, CalendarCheck, Zap } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: ClipboardList,
    title: "Tell Us About Your Property",
    description:
      "Complete our simple quote form with your property and vehicle details so we can understand the right setup for your home.",
  },
  {
    number: 2,
    icon: CalendarCheck,
    title: "Book Your Installation",
    description:
      "Our certified installer will confirm your requirements and arrange a convenient time to install your new EV charger.",
  },
  {
    number: 3,
    icon: Zap,
    title: "Start Charging at Home",
    description:
      "Once installed and tested, we'll walk you through the charger setup so you can start charging safely from your own driveway.",
  },
];

export function EVSteps() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-[1375px] mx-auto bg-[#F4F6FA] rounded-[17px] px-6 sm:px-10 lg:px-14 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black font-display">
            Quick &amp; Easy EV Charging in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className={cn(
                "flex flex-col items-start bg-white rounded-[17px] p-6",
                "shadow-sm hover:shadow-md transition-shadow"
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
