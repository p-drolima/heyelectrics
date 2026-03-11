"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { savePersistedState } from "@/lib/form-persistence";
import { useQuoteFormState } from "./QuoteFormStateContext";

interface QuoteFormProps {
  onSubmitted?: () => void;
  className?: string;
  idPrefix?: string;
}

export function QuoteForm({ onSubmitted, className, idPrefix = "" }: QuoteFormProps) {
  const consentId = `${idPrefix}quote-consent`;
  const router = useRouter();
  const {
    propertyType,
    setPropertyType,
    consentChecked,
    setConsentChecked,
    previouslyConsented,
    showSwitchWarning,
    persistedTypeName,
    selectedTypeName,
    mounted,
  } = useQuoteFormState();

  const handlePropertyTypeChange = (type: "residential" | "commercial") => {
    setPropertyType(type);
  };

  const handleSubmit = () => {
    if (!consentChecked) return;

    savePersistedState({
      propertyType,
      consentAccepted: true,
      consentTimestamp: new Date().toISOString(),
    });

    onSubmitted?.();
    router.push(`/eicr?type=${propertyType}`);
  };

  const isReady = mounted && consentChecked;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handlePropertyTypeChange("residential")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-full text-sm font-medium text-center transition-all cursor-pointer",
            propertyType === "residential"
              ? "bg-black text-white"
              : "bg-[#F4F6FA] text-black hover:bg-gray-200"
          )}
        >
          Residential
        </button>
        <button
          type="button"
          onClick={() => handlePropertyTypeChange("commercial")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-full text-sm font-medium text-center transition-all cursor-pointer",
            propertyType === "commercial"
              ? "bg-black text-white"
              : "bg-[#F4F6FA] text-black hover:bg-gray-200"
          )}
        >
          Commercial
        </button>
      </div>

      {showSwitchWarning && (
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 flex gap-2">
          <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-sm text-orange-900">
            You have an in-progress {persistedTypeName} application. Switching to{" "}
            {selectedTypeName} will reset your form progress. Your contact details
            will be kept.
          </p>
        </div>
      )}

      <div className="flex items-start gap-2 pt-2">
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
