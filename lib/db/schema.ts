import {
  pgTable,
  bigserial,
  varchar,
  integer,
  date,
  boolean,
  decimal,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  bookingReference: varchar("booking_reference", { length: 20 })
    .notNull()
    .unique(),
  propertyType: varchar("property_type", { length: 50 })
    .notNull()
    .default("residential"),
  propertySubtype: varchar("property_subtype", { length: 100 }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  postcode: varchar("postcode", { length: 20 }).notNull(),
  addressLine1: varchar("address_line_1", { length: 255 }),
  addressLine2: varchar("address_line_2", { length: 255 }),
  city: varchar("city", { length: 255 }),
  county: varchar("county", { length: 255 }),
  bedrooms: integer("bedrooms"),
  bookingDate: date("booking_date"),
  depositPaid: boolean("deposit_paid").default(false),
  depositAmount: decimal("deposit_amount", {
    precision: 8,
    scale: 2,
  }).default("60.00"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const slotReservations = pgTable("slot_reservations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  bookingDate: date("booking_date").notNull(),
  sessionToken: varchar("session_token", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const enquiries = pgTable("enquiries", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  enquiryType: varchar("enquiry_type", { length: 50 })
    .notNull()
    .default("commercial"),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  postcode: varchar("postcode", { length: 20 }),
  address: text("address"),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
