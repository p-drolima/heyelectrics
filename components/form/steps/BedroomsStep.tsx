"use client";

import { AlertCircle } from "lucide-react";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { SERVICE_PRICE_DISPLAY } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const BEDROOM_COUNTS = [1, 2, 3, 4, 5] as const;

export function BedroomsStep() {
  const { formData, updateFormData, setCurrentStep, goBack } = useFormContext();

  const handleSelect = (count: number) => {
    updateFormData({ bedrooms: count });
    setCurrentStep("address-finder");
  };

  const handleMoreThanFive = () => {
    updateFormData({ bedrooms: 6 });
    setCurrentStep("large-property");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">
        How many bedrooms does the property have?
      </h2>

      <div className="flex flex-wrap gap-3">
        {BEDROOM_COUNTS.map((count) => (
          <Button
            key={count}
            type="button"
            variant={formData.bedrooms === count ? "default" : "outline"}
            size="lg"
            className={cn(
              "min-w-20 h-auto py-3 flex flex-col items-center gap-0.5 transition-all",
              formData.bedrooms === count
                ? "bg-[#44B4D7] hover:bg-[#3a9cbc] text-white"
                : ""
            )}
            onClick={() => handleSelect(count)}
          >
            <span className="text-lg font-semibold">{count}</span>
            <span className="text-xs font-normal opacity-80">{SERVICE_PRICE_DISPLAY}</span>
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            "min-w-24 h-auto py-3 text-lg font-semibold transition-all border-[#44B4D7] text-[#44B4D7] hover:bg-[#44B4D7]/10",
            formData.bedrooms !== null && formData.bedrooms > 5
              ? "bg-[#44B4D7]/10 border-2"
              : ""
          )}
          onClick={handleMoreThanFive}
        >
          <AlertCircle className="h-5 w-5 mr-1" />
          5+
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        Select &quot;5+&quot; for properties with more than 5 bedrooms (e.g. large houses, HMOs).
      </p>

      <FormActions>
        <Button type="button" variant="outline" onClick={goBack} className="w-full sm:w-auto">
          Back
        </Button>
      </FormActions>
    </div>
  );
}
