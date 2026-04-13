"use client";

import {
  useBoilerFormContext,
  MAIN_STEPS,
  type StepId,
  type FuelType,
} from "./BoilerFormProvider";
import type { ComponentType } from "react";
import { BoilerStatusStep } from "./steps/BoilerStatusStep";
import { BoilerPropertyTypeStep } from "./steps/BoilerPropertyTypeStep";
import { BoilerDetailsStep } from "./steps/BoilerDetailsStep";
import { BoilerBedroomsStep } from "./steps/BoilerBedroomsStep";
import { BoilerLargePropertyStep } from "./steps/BoilerLargePropertyStep";
import { BoilerAddressFinderStep } from "./steps/BoilerAddressFinderStep";
import { BoilerCalendarStep } from "./steps/BoilerCalendarStep";
import { BoilerPaymentStep } from "./steps/BoilerPaymentStep";
import { BrokenBoilerEnquiryStep } from "./steps/BrokenBoilerEnquiryStep";
import { cn } from "@/lib/utils";
import { RotateCcw, Check } from "lucide-react";

const INDICATOR_STEPS = MAIN_STEPS;

const stepLabels: Record<StepId, string> = {
  "boiler-status": "Boiler",
  "boiler-property-type": "Property",
  "boiler-details": "Details",
  "boiler-bedrooms": "Size",
  "boiler-large-property": "Large property",
  "boiler-address-finder": "Address",
  "boiler-calendar": "Date",
  "boiler-payment": "Checkout",
  "broken-boiler-enquiry": "Enquiry",
};

function fuelLabel(fuel: FuelType) {
  switch (fuel) {
    case "gas":
      return "Gas";
    case "lpg":
      return "LPG";
    case "oil":
      return "Oil";
    default:
      return fuel;
  }
}

function ReturningUserBanner() {
  const { isReturningUser, resetForm } = useBoilerFormContext();

  if (!isReturningUser) return null;

  return (
    <div className="mb-6 rounded-xl bg-[#FFEA60]/20 border border-[#FFEA60]/40 px-5 py-3.5 flex items-center justify-between gap-4">
      <p className="text-sm text-black">
        Welcome back! You can continue where you left off.
      </p>
      <button
        onClick={resetForm}
        className="flex items-center gap-1.5 text-sm text-black hover:opacity-70 font-medium whitespace-nowrap transition-opacity cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Start over
      </button>
    </div>
  );
}

function FuelTypeIndicator() {
  const { formData, setCurrentStep, currentStep } = useBoilerFormContext();

  if (currentStep === "boiler-status" || !formData.fuelType) return null;

  return (
    <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-text">
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rounded-full bg-black" />
        {fuelLabel(formData.fuelType)} Boiler Service
      </span>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => setCurrentStep("boiler-status")}
        className="text-black hover:opacity-70 text-xs font-medium transition-opacity cursor-pointer"
      >
        Change
      </button>
    </div>
  );
}

function StepIndicator() {
  const { currentStep } = useBoilerFormContext();

  if (currentStep === "boiler-large-property") return null;
  if (currentStep === "broken-boiler-enquiry") return null;
  if (currentStep === "boiler-payment") return null;

  const currentIndex = INDICATOR_STEPS.indexOf(currentStep);

  if (currentIndex < 0) return null;

  return (
    <div className="mb-10">
      {/* Desktop */}
      <div className="hidden sm:block">
        <div className="flex items-center">
          {INDICATOR_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition-all duration-300 font-display",
                      isCompleted &&
                        "border-[#44B4D7] bg-[#44B4D7] text-white",
                      isCurrent &&
                        "border-[#44B4D7] bg-white text-[#44B4D7] shadow-[0_0_0_4px_rgba(68,180,215,0.15)]",
                      !isCompleted &&
                        !isCurrent &&
                        "border-gray-200 bg-white text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" strokeWidth={2.5} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium whitespace-nowrap",
                      isCompleted && "text-black",
                      isCurrent && "text-black",
                      !isCompleted && !isCurrent && "text-gray-400"
                    )}
                  >
                    {stepLabels[step]}
                  </span>
                </div>

                {index < INDICATOR_STEPS.length - 1 && (
                  <div className="flex-1 mx-2 self-start mt-5">
                    <div className="h-0.5 w-full relative bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 bg-[#44B4D7] rounded-full transition-all duration-500",
                          isCompleted ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-black">
            Step {currentIndex + 1} of {INDICATOR_STEPS.length}
          </span>
          <span className="text-sm font-semibold text-black">
            {stepLabels[currentStep]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {INDICATOR_STEPS.map((step, index) => (
            <div
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                index <= currentIndex ? "bg-[#44B4D7]" : "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const stepComponents: Record<StepId, ComponentType> = {
  "boiler-status": BoilerStatusStep,
  "boiler-property-type": BoilerPropertyTypeStep,
  "boiler-details": BoilerDetailsStep,
  "boiler-bedrooms": BoilerBedroomsStep,
  "boiler-large-property": BoilerLargePropertyStep,
  "boiler-address-finder": BoilerAddressFinderStep,
  "boiler-calendar": BoilerCalendarStep,
  "boiler-payment": BoilerPaymentStep,
  "broken-boiler-enquiry": BrokenBoilerEnquiryStep,
};

export function BoilerStepWizard() {
  const { currentStep, hydrated } = useBoilerFormContext();
  const StepComponent = stepComponents[currentStep];
  const isPaymentStep = currentStep === "boiler-payment";

  if (!hydrated) {
    return (
      <div className="w-full max-w-2xl mx-auto flex justify-center py-12">
        <div className="animate-pulse text-muted-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!isPaymentStep && (
        <>
          <ReturningUserBanner />
          <FuelTypeIndicator />
          <StepIndicator />
        </>
      )}
      <StepComponent />
    </div>
  );
}
