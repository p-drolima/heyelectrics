"use client";

import { AlertCircle } from "lucide-react";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
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
      <h2 className="text-2xl font-semibold text-[#1a1a2e]">
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
              "min-w-16 h-14 text-lg font-semibold transition-all",
              formData.bedrooms === count
                ? "bg-[#2CBCB0] hover:bg-[#249e94] text-white"
                : ""
            )}
            onClick={() => handleSelect(count)}
          >
            {count}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn(
            "min-w-24 h-14 text-lg font-semibold transition-all border-[#F97316] text-[#F97316] hover:bg-[#F97316]/10",
            formData.bedrooms !== null && formData.bedrooms > 5
              ? "bg-[#F97316]/10 border-2"
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

      <div className="pt-4">
        <Button type="button" variant="outline" onClick={goBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
