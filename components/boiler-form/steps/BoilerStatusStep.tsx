"use client";

import Image from "next/image";
import { useBoilerFormContext, type FuelType } from "../BoilerFormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { cn } from "@/lib/utils";

const FUEL_OPTIONS: { value: FuelType; label: string; icon: string }[] = [
  { value: "gas", label: "Gas", icon: "/images/fire-utility-duo-semibold 1.svg" },
  { value: "lpg", label: "LPG", icon: "/images/tank-recovery-duotone-regular 1.svg" },
  { value: "oil", label: "Oil", icon: "/images/droplet-utility-duo-semibold 1.svg" },
];

export function BoilerStatusStep() {
  const { formData, updateFormData, setCurrentStep, goBack } = useBoilerFormContext();

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
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-black text-center">
          Selected fuel type
        </h2>
        <div className="flex justify-center gap-3">
          {FUEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateFormData({ fuelType: opt.value })}
              className={cn(
                "flex flex-col items-center w-[100px] rounded-[10px] border-2 overflow-hidden transition-all",
                formData.fuelType === opt.value
                  ? "border-[#44B4D7] bg-[#44B4D7]/5"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-center h-16 pt-4">
                <Image src={opt.icon} alt={opt.label} width={32} height={38} />
              </div>
              <div className="w-full bg-black/5 py-2">
                <span className="text-sm font-bold text-black">{opt.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
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
      </div>

      <FormActions>
        <Button type="button" variant="outline" onClick={goBack} className="w-full sm:w-auto">
          Back
        </Button>
      </FormActions>
    </div>
  );
}
