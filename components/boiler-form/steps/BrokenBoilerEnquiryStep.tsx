"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  brokenBoilerEnquirySchema,
  type BrokenBoilerEnquiry,
} from "@/lib/validations";
import { useBoilerFormContext } from "../BoilerFormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function BrokenBoilerEnquiryStep() {
  const { formData, goBack, setIsSubmitting, isSubmitting } =
    useBoilerFormContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrokenBoilerEnquiry>({
    resolver: zodResolver(brokenBoilerEnquirySchema),
    defaultValues: {
      fullName: formData.fullName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      postcode: formData.postcode || "",
      address: formData.addressLine1 || "",
    },
  });

  const onSubmit = async (data: BrokenBoilerEnquiry) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/boiler-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryType: "broken_boiler",
          ...data,
          fuelType: formData.fuelType,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Something went wrong");
      }

      router.push("/boiler-service/thank-you");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-black">
          Your boiler needs attention
        </h2>
        <p className="mt-2 text-gray-600">
          Please provide your details and we&apos;ll get back to you with a
          solution.
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
          <Label htmlFor="postcode">Postcode *</Label>
          <Input
            id="postcode"
            {...register("postcode")}
            placeholder="SW1A 1AA"
          />
          {errors.postcode && (
            <p className="text-sm text-red-500">{errors.postcode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address (optional)</Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="123 High Street"
          />
        </div>
      </div>

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
