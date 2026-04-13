import Image from "next/image";

const EICR_TRUST_ITEMS = [
  "Fully qualified and insured electricians",
  "Secure online payment with Stripe",
  "Fixed pricing",
];

const BOILER_TRUST_ITEMS = [
  "Fully qualified and insured engineers",
  "Secure online payment with Stripe",
  "Fixed pricing",
];

interface TrustReassurancePanelProps {
  variant?: "eicr" | "boiler";
}

export function TrustReassurancePanel({ variant = "eicr" }: TrustReassurancePanelProps) {
  const items = variant === "boiler" ? BOILER_TRUST_ITEMS : EICR_TRUST_ITEMS;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 sm:gap-6">
      {items.map((text) => (
        <div key={text} className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/circle-check-sharp-solid.svg"
            alt="Check"
            width={24}
            height={24}
            className="shrink-0"
            unoptimized
          />
          <span className="text-sm font-medium text-black leading-snug whitespace-nowrap">{text}</span>
        </div>
      ))}
    </div>
  );
}
