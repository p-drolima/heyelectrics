"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoilerFormContext } from "../BoilerFormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number"),
  postcode: z.string().min(3, "Please enter a postcode"),
});

type ContactDetails = z.infer<typeof contactSchema>;

export function BoilerDetailsStep() {
  const { formData, updateFormData, setCurrentStep, goBack } =
    useBoilerFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactDetails>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: formData.fullName || "",
      companyName: formData.companyName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      postcode: formData.postcode || "",
    },
  });

  const onSubmit = (data: ContactDetails) => {
    updateFormData({
      fullName: data.fullName,
      companyName: data.companyName ?? "",
      email: data.email,
      phone: data.phone,
      postcode: data.postcode,
    });
    setCurrentStep("boiler-bedrooms");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">Your details</h2>

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
      </div>

      <FormActions>
        <Button type="submit" className="w-full sm:w-auto">
          Next
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          className="w-full sm:w-auto"
        >
          Back
        </Button>
      </FormActions>
    </form>
  );
}
