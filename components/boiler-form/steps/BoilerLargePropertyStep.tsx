"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { largePropertySchema, type LargeProperty } from "@/lib/validations";
import { useBoilerFormContext } from "../BoilerFormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BoilerLargePropertyStep() {
  const router = useRouter();
  const {
    formData,
    goBack,
    isSubmitting,
    setIsSubmitting,
  } = useBoilerFormContext();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LargeProperty>({
    resolver: zodResolver(largePropertySchema),
    defaultValues: {
      fullName: formData.fullName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      message: formData.message || "",
    },
  });

  const onSubmit = async (data: LargeProperty) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/boiler-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiry_type: "boiler_large_property",
          propertySubtype: formData.propertySubtype,
          postcode: formData.postcode,
          bedrooms: formData.bedrooms,
          fuelType: formData.fuelType,
          companyName: formData.companyName,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          message: data.message ?? "",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit enquiry");
      }

      router.push("/boiler-service/thank-you");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-black">
          Properties with more than 5 bedrooms
        </h2>
        <p className="mt-2 text-gray-600">
          For larger properties, please submit your details and we&apos;ll
          provide a custom quote.
        </p>
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

        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Tell us about your property..."
            rows={4}
          />
        </div>
      </div>

      {submitError && <p className="text-sm text-red-500">{submitError}</p>}

      <FormActions>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Submit Enquiry"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
      </FormActions>
    </form>
  );
}
