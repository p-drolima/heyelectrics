"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  residentialDetailsSchema,
  type ResidentialDetails,
  propertySubtypes,
} from "@/lib/validations";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";

export function ResidentialDetailsStep() {
  const { formData, updateFormData, setCurrentStep, goBack } = useFormContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResidentialDetails>({
    resolver: zodResolver(residentialDetailsSchema),
    defaultValues: {
      propertySubtype: propertySubtypes.includes(formData.propertySubtype as (typeof propertySubtypes)[number])
        ? (formData.propertySubtype as ResidentialDetails["propertySubtype"])
        : undefined,
      fullName: formData.fullName || "",
      companyName: formData.companyName || "",
      email: formData.email || "",
      phone: formData.phone || "",
    },
  });

  const onSubmit = (data: ResidentialDetails) => {
    updateFormData({
      propertySubtype: data.propertySubtype,
      fullName: data.fullName,
      companyName: data.companyName ?? "",
      email: data.email,
      phone: data.phone,
    });
    setCurrentStep("bedrooms");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">
        Tell us about your property
      </h2>

      <div className="space-y-4">
        <Label>Property type</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Controller
            name="propertySubtype"
            control={control}
            render={({ field }) => (
              <>
                {propertySubtypes.map((subtype) => (
                  <button
                    key={subtype}
                    type="button"
                    onClick={() => field.onChange(subtype)}
                    className={cn(
                      "rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors",
                      field.value === subtype
                        ? "border-[#44B4D7] bg-[#44B4D7]/10 text-[#44B4D7]"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    )}
                  >
                    {subtype}
                  </button>
                ))}
              </>
            )}
          />
        </div>
        {errors.propertySubtype && (
          <p className="text-sm text-red-500">{errors.propertySubtype.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="John Smith"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name (optional)</Label>
          <Input
            id="companyName"
            {...register("companyName")}
            placeholder="Acme Ltd"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="07XXX XXXXXX"
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <FormActions>
        <Button type="submit" className="w-full sm:w-auto">Next</Button>
        <Button type="button" variant="outline" onClick={goBack} className="w-full sm:w-auto">
          Back
        </Button>
      </FormActions>
    </form>
  );
}
