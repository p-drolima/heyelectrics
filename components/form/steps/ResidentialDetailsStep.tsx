"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
import { FormActions } from "@/components/form/FormActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number"),
  postcode: z.string().min(5, "Please enter a valid UK postcode"),
  addressLine1: z.string().min(1, "Please select or enter an address"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  county: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: "You must consent to continue",
  }),
});

type FormValues = z.infer<typeof schema>;

interface AddressOption {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
}

export function ResidentialDetailsStep() {
  const { formData, updateFormData, setCurrentStep, goBack, partialBookingId, setPartialBookingId } = useFormContext();

  const [addressPhase, setAddressPhase] = useState<"idle" | "found" | "manual">(
    formData.addressLine1 ? "found" : "idle"
  );
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: formData.fullName || "",
      companyName: formData.companyName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      postcode: formData.postcode || "",
      addressLine1: formData.addressLine1 || "",
      addressLine2: formData.addressLine2 || "",
      city: formData.city || "",
      county: formData.county || "",
      gdprConsent: formData.gdprConsent === true,
    },
  });

  const postcode = watch("postcode");
  const selectedAddress = watch("addressLine1");

  const handleFindAddress = async () => {
    setLookupError(null);
    const trimmed = postcode?.trim() || "";

    if (!trimmed) {
      setLookupError("Please enter a postcode.");
      return;
    }

    const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    if (!ukPostcodeRegex.test(trimmed)) {
      setLookupError("Please enter a valid UK postcode (e.g. M1 1AA, PR1 1AD).");
      return;
    }

    setLookupLoading(true);
    try {
      const validateRes = await fetch("/api/postcodes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode: trimmed }),
      });
      const validateData = await validateRes.json();

      if (!validateRes.ok || !validateData?.valid) {
        setLookupError("That doesn't appear to be a valid UK postcode. Please check and try again.");
        setLookupLoading(false);
        return;
      }

      if (!validateData?.allowed) {
        setLookupError("Sorry, we don't currently cover your area. Please contact us on 0161 566 0197.");
        setLookupLoading(false);
        return;
      }

      const lookupRes = await fetch(`/api/postcodes/lookup?postcode=${encodeURIComponent(trimmed)}`);
      const lookupData = await lookupRes.json();

      if (!lookupRes.ok || !lookupData?.addresses?.length) {
        setAddressPhase("manual");
      } else {
        setAddresses(lookupData.addresses);
        setAddressPhase("found");
      }
    } catch {
      setLookupError("Unable to lookup address. Please try again.");
      setAddressPhase("manual");
    } finally {
      setLookupLoading(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    updateFormData({
      fullName: data.fullName,
      companyName: data.companyName ?? "",
      email: data.email,
      phone: data.phone,
      postcode: data.postcode,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 ?? "",
      city: data.city,
      county: data.county ?? "",
      gdprConsent: true,
    });

    // Fire partial booking now that we have full contact + address
    fetch("/api/bookings/partial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        fullName: data.fullName,
        companyName: data.companyName ?? "",
        email: data.email,
        phone: data.phone,
        postcode: data.postcode,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 ?? "",
        city: data.city,
        county: data.county ?? "",
        existingPartialId: partialBookingId,
      }),
    })
      .then((res) => res.ok && res.json())
      .then((json) => { if (json?.id) setPartialBookingId(json.id); })
      .catch(() => { /* non-fatal */ });

    setCurrentStep("bedrooms");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-semibold text-black">Your contact details</h2>

      {/* Contact fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" {...register("fullName")} placeholder="John Smith" />
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name (optional)</Label>
          <Input id="companyName" {...register("companyName")} placeholder="Acme Ltd" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" type="tel" {...register("phone")} placeholder="07XXX XXXXXX" />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Address finder */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-black">Property address</h3>

        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="postcode">Postcode *</Label>
            <Input
              id="postcode"
              {...register("postcode")}
              placeholder="e.g. M1 1AA"
              onChange={(e) => {
                register("postcode").onChange(e);
                setAddressPhase("idle");
                setAddresses([]);
                setLookupError(null);
              }}
            />
            {errors.postcode && <p className="text-sm text-red-500">{errors.postcode.message}</p>}
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleFindAddress}
              disabled={lookupLoading}
              className="whitespace-nowrap"
            >
              {lookupLoading ? "Finding..." : "Find Address"}
            </Button>
          </div>
        </div>

        {lookupError && <p className="text-sm text-red-500">{lookupError}</p>}

        {addressPhase === "found" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select your address *</Label>
              <button
                type="button"
                onClick={() => { setAddressPhase("manual"); setAddresses([]); }}
                className="text-xs text-[#44B4D7] hover:underline"
              >
                Enter manually
              </button>
            </div>
            <Select
              onValueChange={(val) => {
                const idx = parseInt(val, 10);
                const addr = addresses[idx];
                if (addr) {
                  setValue("addressLine1", addr.addressLine1, { shouldValidate: true });
                  setValue("addressLine2", addr.addressLine2 ?? "");
                  setValue("city", addr.city, { shouldValidate: true });
                  setValue("county", addr.county ?? "");
                }
              }}
              value={(() => {
                const idx = addresses.findIndex(
                  (a) => a.addressLine1 === selectedAddress && a.city === watch("city")
                );
                return idx >= 0 ? String(idx) : undefined;
              })()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((addr, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {`${addr.addressLine1}${addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, ${addr.city}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1.message}</p>}
          </div>
        )}

        {addressPhase === "manual" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input id="addressLine1" {...register("addressLine1")} placeholder="House number and street" />
              {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2 (optional)</Label>
              <Input id="addressLine2" {...register("addressLine2")} placeholder="Flat, suite, etc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city")} placeholder="e.g. Manchester" />
              {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="county">County (optional)</Label>
              <Input id="county" {...register("county")} placeholder="e.g. Greater Manchester" />
            </div>
          </div>
        )}
      </div>

      {/* GDPR consent */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("gdprConsent")}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-black cursor-pointer"
          />
          <span className="text-sm text-gray-600 leading-snug">
            I consent to Hey Electrics storing and processing my personal data to handle my booking request. My data will not be shared with third parties for marketing purposes.{" "}
            <a href="/privacy-policy" target="_blank" className="text-[#44B4D7] hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {errors.gdprConsent && <p className="text-sm text-red-500">{errors.gdprConsent.message}</p>}
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
