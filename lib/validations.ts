import { z } from "zod";

export const propertyTypes = [
  "residential",
  "commercial",
] as const;

export const propertySubtypes = [
  "Mid Terrace House",
  "End Terrace / Semi-Detached",
  "Detached House",
  "Detached Bungalow",
  "Semi-Detached Bungalow",
  "Flat / Maisonette",
  "Other",
] as const;

export const bedroomOptions = [1, 2, 3, 4, 5] as const;

export const residentialDetailsSchema = z.object({
  propertySubtype: z.enum(propertySubtypes, {
    required_error: "Please select a property type",
  }),
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number"),
});

export const commercialEnquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number"),
  postcode: z.string().min(3, "Please enter a postcode"),
  address: z.string().optional(),
  message: z.string().optional(),
});

export const bedroomsSchema = z.object({
  bedrooms: z.number().min(1).max(5),
});

export const largePropertySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[\d\s+()-]+$/, "Please enter a valid phone number"),
  message: z.string().optional(),
});

export const addressSchema = z.object({
  postcode: z.string().min(5, "Please enter a valid UK postcode"),
  addressLine1: z.string().min(1, "Please select an address"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  county: z.string().optional(),
});

export const calendarSchema = z.object({
  bookingDate: z.string().min(1, "Please select a date"),
});

export const paymentSchema = z.object({
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

export type ResidentialDetails = z.infer<typeof residentialDetailsSchema>;
export type CommercialEnquiry = z.infer<typeof commercialEnquirySchema>;
export type Bedrooms = z.infer<typeof bedroomsSchema>;
export type LargeProperty = z.infer<typeof largePropertySchema>;
export type Address = z.infer<typeof addressSchema>;
export type Calendar = z.infer<typeof calendarSchema>;
export type Payment = z.infer<typeof paymentSchema>;
