"use client";

const EICR_STEPS = [
  {
    title: "Booking confirmed",
    description: "We'll confirm your date as soon as the deposit is paid",
  },
  {
    title: "Engineer attends",
    description: "A qualified electrician will carry out the inspection.",
  },
  {
    title: "Certificate issued",
    description: "You'll receive your EICR certificate and findings after the inspection",
  },
];

const BOILER_STEPS = [
  {
    title: "Booking confirmed",
    description: "We'll confirm your date as soon as the deposit is paid",
  },
  {
    title: "Engineer attends",
    description: "A qualified boiler technician will carry out the inspection.",
  },
  {
    title: "Boiler Serviced",
    description: "Your boiler is fully serviced by an accredited engineer.",
  },
];

interface NextStepsCardProps {
  variant?: "eicr" | "boiler";
}

export function NextStepsCard({ variant = "eicr" }: NextStepsCardProps) {
  const steps = variant === "boiler" ? BOILER_STEPS : EICR_STEPS;

  return (
    <div className="rounded-2xl bg-[#F4F6FA] py-6 space-y-5">
      <h3 className="text-lg font-bold text-black">What happens next?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="bg-white rounded-xl px-4 py-4 shadow-sm space-y-2"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold shrink-0">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-black">{step.title}</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
