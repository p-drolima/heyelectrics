"use client";

import { useState } from "react";
import { Home, Building2, AlertCircle } from "lucide-react";
import { useFormContext } from "../FormProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PropertyTypeStep() {
  const { formData, switchPropertyType, setCurrentStep } = useFormContext();
  const [pendingSwitchType, setPendingSwitchType] = useState<
    "residential" | "commercial" | null
  >(null);

  const hasExistingProgress = () => {
    // Check if user has filled any type-specific fields
    return !!(
      formData.postcode ||
      formData.addressLine1 ||
      formData.bedrooms ||
      formData.bookingDate ||
      formData.message ||
      formData.propertySubtype
    );
  };

  const handleSelect = (type: "residential" | "commercial") => {
    // If selecting the same type, just proceed
    if (type === formData.propertyType) {
      if (type === "residential") {
        setCurrentStep("residential-details");
      } else {
        setCurrentStep("commercial-enquiry");
      }
      return;
    }

    // If switching types and has existing progress, show warning
    if (formData.propertyType && hasExistingProgress()) {
      setPendingSwitchType(type);
    } else {
      // No existing progress, switch immediately
      switchPropertyType(type);
    }
  };

  const handleConfirmSwitch = () => {
    if (pendingSwitchType) {
      switchPropertyType(pendingSwitchType);
      setPendingSwitchType(null);
    }
  };

  const handleCancelSwitch = () => {
    setPendingSwitchType(null);
  };

  const currentTypeName =
    formData.propertyType === "residential" ? "Residential" : "Commercial";
  const pendingTypeName =
    pendingSwitchType === "residential" ? "Residential" : "Commercial";

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">
        What type of property is this for?
      </h2>

      {pendingSwitchType && (
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 space-y-3">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <p className="text-sm text-orange-900 font-medium">
                You have existing progress for your {currentTypeName}{" "}
                application.
              </p>
              <p className="text-sm text-orange-800">
                Switching to {pendingTypeName} will reset your progress. Your
                contact details will be kept.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row-reverse gap-3 justify-end">
            <Button
              onClick={handleConfirmSwitch}
              className="bg-orange-600 hover:bg-orange-700 text-sm w-full sm:w-auto"
            >
              Continue
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelSwitch}
              className="text-sm w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-[#44B4D7]/50",
            formData.propertyType === "residential"
              ? "border-2 border-[#44B4D7] bg-[#44B4D7]/5 shadow-md"
              : "border-gray-200"
          )}
          onClick={() => handleSelect("residential")}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-[#44B4D7]/20 p-4">
              <Home className="h-10 w-10 text-[#44B4D7]" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">
              Residential
            </h3>
            <p className="text-sm text-gray-600">
              Houses, flats, bungalows
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-[#44B4D7]/50",
            formData.propertyType === "commercial"
              ? "border-2 border-[#44B4D7] bg-[#44B4D7]/5 shadow-md"
              : "border-gray-200"
          )}
          onClick={() => handleSelect("commercial")}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-[#44B4D7]/20 p-4">
              <Building2 className="h-10 w-10 text-[#44B4D7]" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">
              Commercial
            </h3>
            <p className="text-sm text-gray-600">
              Offices, shops, warehouses
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
