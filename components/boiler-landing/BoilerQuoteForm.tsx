"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { savePersistedState } from "@/lib/boiler-form-persistence";
import {
  useBoilerQuoteFormState,
  type FuelType,
} from "./BoilerQuoteFormStateContext";

const FUEL_OPTIONS: { value: FuelType; label: string; icon: string }[] = [
  {
    value: "gas",
    label: "Gas",
    icon: "/images/fire-utility-duo-semibold 1.svg",
  },
  {
    value: "lpg",
    label: "LPG",
    icon: "/images/tank-recovery-duotone-regular 1.svg",
  },
  {
    value: "oil",
    label: "Oil",
    icon: "/images/droplet-utility-duo-semibold 1.svg",
  },
];

interface BoilerQuoteFormProps {
  onSubmitted?: () => void;
  className?: string;
  idPrefix?: string;
}

export function BoilerQuoteForm({
  onSubmitted,
  className,
  idPrefix = "",
}: BoilerQuoteFormProps) {
  const consentId = `${idPrefix}boiler-consent`;
  const router = useRouter();
  const {
    fuelType,
    setFuelType,
    consentChecked,
    setConsentChecked,
    previouslyConsented,
    mounted,
  } = useBoilerQuoteFormState();

  const handleSubmit = () => {
    if (!consentChecked) return;

    savePersistedState({
      fuelType,
      consentAccepted: true,
      consentTimestamp: new Date().toISOString(),
    });

    onSubmitted?.();
    router.push(`/boiler-service/quote?fuel=${fuelType}`);
  };

  const isReady = mounted && consentChecked;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="grid grid-cols-3 gap-3">
        {FUEL_OPTIONS.map((option) => {
          const isSelected = fuelType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setFuelType(option.value)}
              className={cn(
                "flex flex-col overflow-hidden rounded-[10px] border-2 transition-all cursor-pointer",
                isSelected
                  ? "border-[#44B4D7] bg-[#44B4D7]/5"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-center pt-[30px] pb-4">
                <Image
                  src={option.icon}
                  alt={option.label}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div className="bg-black/5 px-2 py-2.5 rounded-b-[8px]">
                <span className="text-[18px] font-bold text-black font-display">
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-2 pt-1">
        <Checkbox
          id={consentId}
          checked={consentChecked}
          onCheckedChange={(checked) => setConsentChecked(!!checked)}
          className="mt-0.5"
          disabled={previouslyConsented}
        />
        <label
          htmlFor={consentId}
          className="text-sm text-muted-text cursor-pointer leading-snug"
        >
          {previouslyConsented
            ? "Privacy policy and terms previously accepted"
            : "Yes, I agree with the privacy policy and terms and conditions."}
        </label>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isReady}
        className="w-full py-6 text-base font-semibold"
      >
        Get Your Quote
      </Button>
    </div>
  );
}
