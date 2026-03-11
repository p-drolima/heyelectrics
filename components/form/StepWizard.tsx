"use client";

import { useFormContext, type StepId } from "./FormProvider";
import { PropertyTypeStep } from "./steps/PropertyTypeStep";
import { ResidentialDetailsStep } from "./steps/ResidentialDetailsStep";
import { CommercialEnquiryStep } from "./steps/CommercialEnquiryStep";
import { BedroomsStep } from "./steps/BedroomsStep";
import { LargePropertyStep } from "./steps/LargePropertyStep";
import { AddressFinderStep } from "./steps/AddressFinderStep";
import { CalendarStep } from "./steps/CalendarStep";
import { PaymentStep } from "./steps/PaymentStep";
import { cn } from "@/lib/utils";
import { RotateCcw, Check } from "lucide-react";

const RESIDENTIAL_STEPS: StepId[] = [
  "property-type",
  "residential-details",
  "bedrooms",
  "address-finder",
  "calendar",
  "payment",
];

const stepLabels: Record<StepId, string> = {
  "property-type": "Type",
  "residential-details": "Details",
  "commercial-enquiry": "Enquiry",
  bedrooms: "Property",
  "large-property": "Contact",
  "address-finder": "Address",
  calendar: "Date",
  payment: "Payment",
};

function ReturningUserBanner() {
  const { isReturningUser, resetForm } = useFormContext();

  if (!isReturningUser) return null;

  return (
    <div className="mb-6 rounded-xl bg-[#2CBCB0]/10 border border-[#2CBCB0]/20 px-5 py-3.5 flex items-center justify-between gap-4">
      <p className="text-sm text-[#1a1a2e]">
        Welcome back! You can continue where you left off.
      </p>
      <button
        onClick={resetForm}
        className="flex items-center gap-1.5 text-sm text-[#2CBCB0] hover:text-[#249e94] font-medium whitespace-nowrap transition-colors cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Start over
      </button>
    </div>
  );
}

function PropertyTypeIndicator() {
  const { formData, setCurrentStep, currentStep } = useFormContext();

  if (currentStep === "property-type" || !formData.propertyType) return null;

  return (
    <div className="mb-2 flex items-center justify-center gap-2 text-sm text-gray-500">
      <span className="inline-flex items-center gap-1.5">
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            formData.propertyType === "residential"
              ? "bg-[#2CBCB0]"
              : "bg-orange-500"
          )}
        />
        {formData.propertyType === "residential"
          ? "Residential"
          : "Commercial"}{" "}
        EICR
      </span>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => setCurrentStep("property-type")}
        className="text-[#2CBCB0] hover:text-[#249e94] text-xs font-medium transition-colors cursor-pointer"
      >
        Change
      </button>
    </div>
  );
}

function StepIndicator() {
  const { currentStep, formData } = useFormContext();

  const isCommercial = formData.propertyType === "commercial";
  if (isCommercial) return null;
  if (currentStep === "large-property") return null;

  const currentIndex = RESIDENTIAL_STEPS.indexOf(currentStep);

  return (
    <div className="mb-10">
      {/* Desktop */}
      <div className="hidden sm:block">
        <div className="flex items-center">
          {RESIDENTIAL_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                {/* Step node */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition-all duration-300",
                      isCompleted &&
                        "border-[#2CBCB0] bg-[#2CBCB0] text-white",
                      isCurrent &&
                        "border-[#2CBCB0] bg-white text-[#2CBCB0] shadow-[0_0_0_4px_rgba(44,188,176,0.15)]",
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
                      isCompleted && "text-[#2CBCB0]",
                      isCurrent && "text-[#1a1a2e]",
                      !isCompleted && !isCurrent && "text-gray-400"
                    )}
                  >
                    {stepLabels[step]}
                  </span>
                </div>

                {/* Connector line */}
                {index < RESIDENTIAL_STEPS.length - 1 && (
                  <div className="flex-1 mx-2 self-start mt-5">
                    <div className="h-0.5 w-full relative bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 bg-[#2CBCB0] rounded-full transition-all duration-500",
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
          <span className="text-sm font-medium text-[#1a1a2e]">
            Step {currentIndex + 1} of {RESIDENTIAL_STEPS.length}
          </span>
          <span className="text-sm font-semibold text-[#2CBCB0]">
            {stepLabels[currentStep]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {RESIDENTIAL_STEPS.map((step, index) => (
            <div
              key={step}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                index < currentIndex && "bg-[#2CBCB0]",
                index === currentIndex && "bg-[#2CBCB0]",
                index > currentIndex && "bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const stepComponents: Record<StepId, React.ComponentType> = {
  "property-type": PropertyTypeStep,
  "residential-details": ResidentialDetailsStep,
  "commercial-enquiry": CommercialEnquiryStep,
  bedrooms: BedroomsStep,
  "large-property": LargePropertyStep,
  "address-finder": AddressFinderStep,
  calendar: CalendarStep,
  payment: PaymentStep,
};

export function StepWizard() {
  const { currentStep, hydrated } = useFormContext();
  const StepComponent = stepComponents[currentStep];

  if (!hydrated) {
    return (
      <div className="w-full max-w-2xl mx-auto flex justify-center py-12">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ReturningUserBanner />
      <PropertyTypeIndicator />
      <StepIndicator />
      <StepComponent />
    </div>
  );
}
