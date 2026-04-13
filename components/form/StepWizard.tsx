"use client";

import { useFormContext, type StepId } from "./FormProvider";
import { PropertyTypeStep } from "./steps/PropertyTypeStep";
import { ResidentialSubtypeStep } from "./steps/ResidentialSubtypeStep";
import { ResidentialDetailsStep } from "./steps/ResidentialDetailsStep";
import { CommercialEnquiryStep } from "./steps/CommercialEnquiryStep";
import { BedroomsStep } from "./steps/BedroomsStep";
import { LargePropertyStep } from "./steps/LargePropertyStep";
import { AddressFinderStep } from "./steps/AddressFinderStep";
import { CalendarStep } from "./steps/CalendarStep";
import { PaymentStep } from "./steps/PaymentStep";
import { TopResumeNotice } from "@/components/form/checkout/TopResumeNotice";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const RESIDENTIAL_STEPS: StepId[] = [
  "property-type",
  "residential-subtype",
  "residential-details",
  "bedrooms",
  "calendar",
  "payment",
];

const stepLabels: Record<StepId, string> = {
  "property-type": "Type",
  "residential-subtype": "Property",
  "residential-details": "Details",
  "commercial-enquiry": "Enquiry",
  bedrooms: "Bedrooms",
  "large-property": "Contact",
  "address-finder": "Address",
  calendar: "Date",
  payment: "Checkout",
};

function PropertyTypeIndicator() {
  const { formData, setCurrentStep, currentStep } = useFormContext();

  if (currentStep === "property-type" || !formData.propertyType) return null;

  return (
    <div className="mb-2 flex items-center justify-center gap-2 text-sm text-muted-text">
      <span className="inline-flex items-center gap-1.5">
        <span
          className={cn(
            "inline-block h-2 w-2 rounded-full",
            formData.propertyType === "residential"
              ? "bg-black"
              : "bg-muted-text"
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
        className="text-black hover:opacity-70 text-xs font-medium transition-opacity cursor-pointer"
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
  if (currentStep === "payment") return null;

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

                {index < RESIDENTIAL_STEPS.length - 1 && (
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
            Step {currentIndex + 1} of {RESIDENTIAL_STEPS.length}
          </span>
          <span className="text-sm font-semibold text-black">
            {stepLabels[currentStep]}
          </span>
        </div>
        <div className="flex gap-1.5">
          {RESIDENTIAL_STEPS.map((step, index) => (
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

const stepComponents: Record<StepId, React.ComponentType> = {
  "property-type": PropertyTypeStep,
  "residential-subtype": ResidentialSubtypeStep,
  "residential-details": ResidentialDetailsStep,
  "commercial-enquiry": CommercialEnquiryStep,
  bedrooms: BedroomsStep,
  "large-property": LargePropertyStep,
  "address-finder": AddressFinderStep,
  calendar: CalendarStep,
  payment: PaymentStep,
};

export function StepWizard() {
  const { currentStep, hydrated, isReturningUser, resetForm } = useFormContext();
  const StepComponent = stepComponents[currentStep];
  const isPaymentStep = currentStep === "payment";

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
          <TopResumeNotice isReturningUser={isReturningUser} onReset={resetForm} />
          <PropertyTypeIndicator />
          <StepIndicator />
        </>
      )}
      <StepComponent />
    </div>
  );
}
