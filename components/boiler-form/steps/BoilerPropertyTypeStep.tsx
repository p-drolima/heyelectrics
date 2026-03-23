"use client";

import { useBoilerFormContext } from "../BoilerFormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { boilerPropertySubtypes } from "@/lib/validations";
import { cn } from "@/lib/utils";

export function BoilerPropertyTypeStep() {
  const { formData, updateFormData, setCurrentStep, goBack } =
    useBoilerFormContext();

  const handleSelect = (subtype: string) => {
    updateFormData({ propertySubtype: subtype });
    setCurrentStep("boiler-details");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">
        What type of property is it?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {boilerPropertySubtypes.map((subtype) => (
          <button
            key={subtype}
            type="button"
            onClick={() => handleSelect(subtype)}
            className={cn(
              "rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors",
              formData.propertySubtype === subtype
                ? "border-[#44B4D7] bg-[#44B4D7]/10 text-[#44B4D7]"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            )}
          >
            {subtype}
          </button>
        ))}
      </div>

      <FormActions>
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
