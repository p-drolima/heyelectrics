"use client";

import { useBoilerFormContext } from "../BoilerFormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";

export function BoilerStatusStep() {
  const { updateFormData, setCurrentStep, goBack } = useBoilerFormContext();

  const handleYes = () => {
    updateFormData({ boilerWorks: true });
    setCurrentStep("boiler-property-type");
  };

  const handleNo = () => {
    updateFormData({ boilerWorks: false });
    setCurrentStep("broken-boiler-enquiry");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-black text-center">
        Does your boiler work?
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          onClick={handleYes}
          className="flex-1 max-w-xs rounded-xl border-2 border-green-300 bg-green-50 px-8 py-6 text-lg font-semibold text-green-700 transition-all hover:border-green-500 hover:bg-green-100 hover:shadow-md"
        >
          Yes, it works
        </button>
        <button
          type="button"
          onClick={handleNo}
          className="flex-1 max-w-xs rounded-xl border-2 border-red-300 bg-red-50 px-8 py-6 text-lg font-semibold text-red-700 transition-all hover:border-red-500 hover:bg-red-100 hover:shadow-md"
        >
          No, it&apos;s broken
        </button>
      </div>

      <FormActions>
        <Button type="button" variant="outline" onClick={goBack} className="w-full sm:w-auto">
          Back
        </Button>
      </FormActions>
    </div>
  );
}
