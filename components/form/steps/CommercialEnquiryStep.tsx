"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  commercialEnquirySchema,
  type CommercialEnquiry,
} from "@/lib/validations";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export function CommercialEnquiryStep() {
  const { formData, goBack, setIsSubmitting, isSubmitting } = useFormContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommercialEnquiry>({
    resolver: zodResolver(commercialEnquirySchema),
    defaultValues: {
      fullName: formData.fullName || "",
      companyName: formData.companyName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      postcode: formData.postcode || "",
      address: formData.addressLine1 || "",
      message: formData.message || "",
    },
  });

  const onSubmit = async (data: CommercialEnquiry) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Something went wrong");
      }

      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      // In a real app you might show a toast or inline error
      alert(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">
        Commercial enquiry
      </h2>

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

        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            {...register("message")}
            placeholder="Tell us about your project..."
            rows={4}
          />
        </div>
      </div>

      <FormActions>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Submitting..." : "Submit Enquiry"}
        </Button>
        <Button type="button" variant="outline" onClick={goBack} disabled={isSubmitting} className="w-full sm:w-auto">
          Back
        </Button>
      </FormActions>
    </form>
  );
}
