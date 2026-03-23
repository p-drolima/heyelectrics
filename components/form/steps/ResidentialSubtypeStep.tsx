"use client";

import { useState } from "react";
import { propertySubtypes } from "@/lib/validations";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { cn } from "@/lib/utils";

export function ResidentialSubtypeStep() {
  const { formData, updateFormData, setCurrentStep, goBack } = useFormContext();
  const [selected, setSelected] = useState<string>(
    formData.propertySubtype || ""
  );
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) {
      setError("Please select a property type");
      return;
    }
    updateFormData({ propertySubtype: selected });
    setCurrentStep("residential-details");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">
        What type of property is this for?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {propertySubtypes.map((subtype) => (
          <button
            key={subtype}
            type="button"
            onClick={() => {
              setSelected(subtype);
              setError(null);
            }}
            className={cn(
              "rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors",
              selected === subtype
                ? "border-[#44B4D7] bg-[#44B4D7]/10 text-[#44B4D7]"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            )}
          >
            {subtype}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <FormActions>
        <Button onClick={handleNext} className="w-full sm:w-auto">
          Next
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
      </FormActions>
    </div>
  );
}
