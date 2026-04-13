"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Check, X } from "lucide-react";
import { propertySubtypes, bedroomOptions } from "@/lib/validations";

// Shared interface — compatible with both EICR and Boiler FormData
export interface SummaryFormData {
  propertyType?: string | null;
  propertySubtype?: string;
  bedrooms?: number | null;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  postcode?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  bookingDate?: string;
}

type EditField = "property" | "address" | "contact" | null;

function SectionLabel({
  label,
  onEdit,
  isEditing,
}: {
  label: string;
  onEdit: () => void;
  isEditing: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400 tracking-wide">
        {label}
      </p>
      {!isEditing && (
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-[#44B4D7] hover:underline"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      )}
    </div>
  );
}

function PropertyEditForm({
  formData,
  onSave,
  onCancel,
}: {
  formData: SummaryFormData;
  onSave: (subtype: string, bedrooms: number) => void;
  onCancel: () => void;
}) {
  const [subtype, setSubtype] = useState(formData.propertySubtype || "");
  const [bedrooms, setBedrooms] = useState(String(formData.bedrooms ?? 1));
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!subtype) { setError("Please select a property type"); return; }
    onSave(subtype, Number(bedrooms));
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="space-y-1">
        <Label className="text-xs">Property type</Label>
        <select
          value={subtype}
          onChange={(e) => { setSubtype(e.target.value); setError(""); }}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#44B4D7]"
        >
          <option value="">Select type…</option>
          {propertySubtypes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Bedrooms</Label>
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#44B4D7]"
        >
          {bedroomOptions.map((n) => (
            <option key={n} value={String(n)}>{n} bedroom{n > 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="button" size="sm" className="text-xs h-7 px-3" onClick={handleSave}>
          <Check className="h-3 w-3 mr-1" /> Save
        </Button>
        <Button type="button" variant="outline" size="sm" className="text-xs h-7 px-3" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
}

type AddressFields = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  postcode: string;
};

function AddressEditForm({
  formData,
  onSave,
  onCancel,
}: {
  formData: SummaryFormData;
  onSave: (values: Partial<SummaryFormData>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<AddressFields>({
    addressLine1: formData.addressLine1 || "",
    addressLine2: formData.addressLine2 || "",
    city: formData.city || "",
    county: formData.county || "",
    postcode: formData.postcode || "",
  });
  const [errors, setErrors] = useState<Partial<AddressFields>>({});

  const validate = () => {
    const e: Partial<AddressFields> = {};
    if (!values.addressLine1.trim()) e.addressLine1 = "Required";
    if (!values.city.trim()) e.city = "Required";
    if (values.postcode.trim().length < 5) e.postcode = "Enter a valid postcode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-2 pt-1">
      {(
        [
          { key: "addressLine1", label: "Address line 1 *", placeholder: "123 Main Street" },
          { key: "addressLine2", label: "Address line 2", placeholder: "Apt / Flat" },
          { key: "city", label: "Town / City *", placeholder: "Manchester" },
          { key: "county", label: "County", placeholder: "Greater Manchester" },
          { key: "postcode", label: "Postcode *", placeholder: "M1 1AB" },
        ] as const
      ).map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-1">
          <Label className="text-xs">{label}</Label>
          <Input
            value={values[key]}
            onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            placeholder={placeholder}
            className="h-8 text-sm"
          />
          {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <Button type="button" size="sm" className="text-xs h-7 px-3" onClick={() => { if (validate()) onSave(values); }}>
          <Check className="h-3 w-3 mr-1" /> Save
        </Button>
        <Button type="button" variant="outline" size="sm" className="text-xs h-7 px-3" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
}

type ContactFields = { fullName: string; email: string; phone: string };

function ContactEditForm({
  formData,
  onSave,
  onCancel,
}: {
  formData: SummaryFormData;
  onSave: (values: Partial<SummaryFormData>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ContactFields>({
    fullName: formData.fullName || "",
    email: formData.email || "",
    phone: formData.phone || "",
  });
  const [errors, setErrors] = useState<Partial<ContactFields>>({});

  const validate = () => {
    const e: Partial<ContactFields> = {};
    if (values.fullName.trim().length < 2) e.fullName = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = "Enter a valid email";
    if (values.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-2 pt-1">
      {(
        [
          { key: "fullName", label: "Full name *", type: "text", placeholder: "John Smith" },
          { key: "email", label: "Email *", type: "email", placeholder: "john@example.com" },
          { key: "phone", label: "Phone *", type: "tel", placeholder: "07XXX XXXXXX" },
        ] as const
      ).map(({ key, label, type, placeholder }) => (
        <div key={key} className="space-y-1">
          <Label className="text-xs">{label}</Label>
          <Input
            type={type}
            value={values[key]}
            onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
            placeholder={placeholder}
            className="h-8 text-sm"
          />
          {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <Button type="button" size="sm" className="text-xs h-7 px-3" onClick={() => { if (validate()) onSave(values); }}>
          <Check className="h-3 w-3 mr-1" /> Save
        </Button>
        <Button type="button" variant="outline" size="sm" className="text-xs h-7 px-3" onClick={onCancel}>
          <X className="h-3 w-3 mr-1" /> Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Main BookingSummaryCard ───────────────────────────────────────────

interface BookingSummaryCardProps {
  formData: SummaryFormData;
  onUpdateFormData: (updates: Partial<SummaryFormData>) => void;
  onEditDate: () => void;
  serviceName: string;
  totalDisplay: string;
  depositDisplay: string;
  balanceDisplay?: string;
}

export function BookingSummaryCard({
  formData,
  onUpdateFormData,
  onEditDate,
  serviceName,
  totalDisplay,
  depositDisplay,
  balanceDisplay,
}: BookingSummaryCardProps) {
  const [editingField, setEditingField] = useState<EditField>(null);

  const formatDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const propertyLabel = formData.propertySubtype
    ? formData.propertySubtype
    : formData.propertyType === "residential"
      ? "Residential"
      : "Commercial";

  const addressLine = [formData.addressLine1, formData.city, formData.postcode]
    .filter(Boolean)
    .join(", ");

  const isDepositBooking = !!balanceDisplay;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking Summary</p>

      {/* Property */}
      <div>
        <SectionLabel
          label="Property"
          onEdit={() => setEditingField("property")}
          isEditing={editingField === "property"}
        />
        {editingField === "property" ? (
          <PropertyEditForm
            formData={formData}
            onSave={(subtype, bedrooms) => {
              onUpdateFormData({ propertySubtype: subtype, bedrooms });
              setEditingField(null);
            }}
            onCancel={() => setEditingField(null)}
          />
        ) : (
          <div className="mt-1">
            <p className="font-medium text-black">{propertyLabel}</p>
            {formData.bedrooms && (
              <p className="text-xs text-gray-500">
                {formData.bedrooms} bedroom{formData.bedrooms > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Address */}
      <div>
        <SectionLabel
          label="Address"
          onEdit={() => setEditingField("address")}
          isEditing={editingField === "address"}
        />
        {editingField === "address" ? (
          <AddressEditForm
            formData={formData}
            onSave={(vals) => {
              onUpdateFormData(vals);
              setEditingField(null);
            }}
            onCancel={() => setEditingField(null)}
          />
        ) : (
          <p className="mt-1 font-medium text-black">{addressLine}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 tracking-wide">
              Date
            </p>
          <button
            type="button"
            onClick={onEditDate}
            className="flex items-center gap-1 text-xs text-[#44B4D7] hover:underline"
          >
            <Pencil className="h-3 w-3" />
            Change
          </button>
        </div>
        <p className="mt-1 font-medium text-black">
          {formatDate(formData.bookingDate || "")}
        </p>
        <p className="text-xs text-amber-600 mt-0.5">
          Changing the date will release your current slot reservation.
        </p>
      </div>

      {/* Contact */}
      <div>
        <SectionLabel
          label="Contact"
          onEdit={() => setEditingField("contact")}
          isEditing={editingField === "contact"}
        />
        {editingField === "contact" ? (
          <ContactEditForm
            formData={formData}
            onSave={(vals) => {
              onUpdateFormData(vals);
              setEditingField(null);
            }}
            onCancel={() => setEditingField(null)}
          />
        ) : (
          <div className="mt-1">
            <p className="font-medium text-black">{formData.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{formData.email}</p>
            <p className="text-xs text-gray-500">{formData.phone}</p>
          </div>
        )}
      </div>

      {/* Price section */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        {/* Service line */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{serviceName}</span>
          <span className="text-sm text-gray-700">{totalDisplay}</span>
        </div>

        {/* Due today */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-black">
            {isDepositBooking ? "Due today (deposit)" : "Due today"}
          </span>
          <span className="text-2xl font-bold text-black">{depositDisplay}</span>
        </div>

        {/* Balance note */}
        {isDepositBooking && (
          <p className="text-xs text-gray-400 pt-1">
            Remaining balance of {balanceDisplay} due via invoice upon completion.
          </p>
        )}
      </div>
    </div>
  );
}
