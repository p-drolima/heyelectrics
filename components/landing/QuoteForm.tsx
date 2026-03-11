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
  /** Unique id prefix to avoid duplicate DOM ids when Hero + Modal both render */
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
            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium text-center transition-colors cursor-pointer",
            propertyType === "residential"
              ? "bg-[#2CBCB0] text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
          )}
        >
          Residential
        </button>
        <button
          type="button"
          onClick={() => handlePropertyTypeChange("commercial")}
          className={cn(
            "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium text-center transition-colors cursor-pointer",
            propertyType === "commercial"
              ? "bg-[#2CBCB0] text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400"
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
          className="text-sm text-gray-600 cursor-pointer leading-snug"
        >
          {previouslyConsented
            ? "Privacy policy and terms previously accepted"
            : "Yes, I agree with the privacy policy and terms and conditions."}
        </label>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isReady}
        className={cn(
          "w-full py-6 text-base font-semibold",
          "bg-[#2CBCB0] hover:bg-[#249e94]"
        )}
      >
        Get Your Quote
      </Button>
    </div>
  );
}
