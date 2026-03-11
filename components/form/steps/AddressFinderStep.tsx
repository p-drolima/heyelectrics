"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type Address } from "@/lib/validations";
import { useFormContext } from "../FormProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AddressOption {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
}

export function AddressFinderStep() {
  const { formData, updateFormData, setCurrentStep, goBack } = useFormContext();

  const [phase, setPhase] = useState<"postcode" | "address">("postcode");
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [useManualEntry, setUseManualEntry] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      postcode: formData.postcode || "",
      addressLine1: formData.addressLine1 || "",
      addressLine2: formData.addressLine2 || "",
      city: formData.city || "",
      county: formData.county || "",
    },
  });

  const postcode = watch("postcode");
  const selectedAddress = watch("addressLine1");

  const handleFindAddress = async () => {
    setValidationError(null);
    const trimmed = postcode?.trim() || "";

    if (!trimmed) {
      setValidationError("Please enter a postcode.");
      return;
    }

    const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    if (!ukPostcodeRegex.test(trimmed)) {
      setValidationError(
        "Please enter a valid UK postcode (e.g. M1 1AA, PR1 1AD)."
      );
      return;
    }

    setLoading(true);
    try {
      const validateRes = await fetch("/api/postcodes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode: trimmed }),
      });

      const validateData = await validateRes.json();

      if (!validateRes.ok || !validateData?.valid) {
        setValidationError(
          "That doesn't appear to be a valid UK postcode. Please check and try again."
        );
        setLoading(false);
        return;
      }

      if (!validateData?.allowed) {
        setValidationError(
          "Sorry, we don't currently cover your area. Please contact us on 01457 868 040 for assistance."
        );
        setLoading(false);
        return;
      }

      const lookupRes = await fetch(
        `/api/postcodes/lookup?postcode=${encodeURIComponent(trimmed)}`
      );
      const lookupData = await lookupRes.json();

      if (!lookupRes.ok || !lookupData?.addresses?.length) {
        setUseManualEntry(true);
        setPhase("address");
      } else {
        setAddresses(lookupData.addresses);
        setUseManualEntry(false);
        setPhase("address");
      }
    } catch {
      setValidationError("Unable to lookup address. Please try again.");
      setUseManualEntry(true);
      setPhase("address");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePostcode = () => {
    setPhase("postcode");
    setAddresses([]);
    setUseManualEntry(false);
    setValidationError(null);
  };

  const onSubmit = (data: Address) => {
    updateFormData({
      postcode: data.postcode,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 ?? "",
      city: data.city,
      county: data.county ?? "",
    });
    setCurrentStep("calendar");
  };

  if (phase === "postcode") {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-[#1a1a2e]">
          Find your address
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFindAddress();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <div className="flex gap-2">
              <Input
                id="postcode"
                {...register("postcode")}
                placeholder="e.g. M1 1AA"
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Finding..." : "Find Address"}
              </Button>
            </div>
          </div>

          {validationError && (
            <p className="text-sm text-red-500">{validationError}</p>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={goBack}>
              Back
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-semibold text-[#1a1a2e]">
        Select your address
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">
            Postcode: <span className="font-medium">{postcode}</span>
          </p>
          <button
            type="button"
            onClick={handleChangePostcode}
            className="text-sm text-[#2CBCB0] hover:underline"
          >
            Change
          </button>
        </div>

        {useManualEntry ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                {...register("addressLine1")}
                placeholder="House number and street"
              />
              {errors.addressLine1 && (
                <p className="text-sm text-red-500">
                  {errors.addressLine1.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2 (optional)</Label>
              <Input
                id="addressLine2"
                {...register("addressLine2")}
                placeholder="Flat, suite, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register("city")} placeholder="e.g. Manchester" />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="county">County (optional)</Label>
              <Input
                id="county"
                {...register("county")}
                placeholder="e.g. Greater Manchester"
              />
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Label>Select your address</Label>
            <Select
              onValueChange={(val) => {
                const idx = parseInt(val, 10);
                const addr = addresses[idx];
                if (addr) {
                  setValue("addressLine1", addr.addressLine1);
                  setValue("addressLine2", addr.addressLine2 ?? "");
                  setValue("city", addr.city);
                  setValue("county", addr.county ?? "");
                }
              }}
              value={(() => {
                const idx = addresses.findIndex(
                  (a) =>
                    a.addressLine1 === selectedAddress &&
                    a.city === watch("city")
                );
                return idx >= 0 ? String(idx) : undefined;
              })()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose an address" />
              </SelectTrigger>
              <SelectContent>
                {addresses.map((addr, i) => {
                  const display = `${addr.addressLine1}${addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, ${addr.city}`;
                  return (
                    <SelectItem key={i} value={String(i)}>
                      {display}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.addressLine1 && (
              <p className="text-sm text-red-500">
                {errors.addressLine1.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={goBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
