import Mailjet from "node-mailjet";
import {
  adminBoilerBookingEmail,
  adminBoilerEnquiryEmail,
  customerBoilerBookingEmail,
  customerBoilerEnquiryEmail,
} from "./boiler-email-templates";
import type { SameDayBoilerBooking } from "./boiler-email-templates";
import { db } from "./db";
import { bookings } from "./db/schema";
import { and, eq } from "drizzle-orm";

const MAX_BOOKINGS_PER_DAY = 7;

function getMailjetClient() {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;

  if (!apiKey || !secretKey) {
    console.warn("Mailjet API keys not configured, emails will not be sent");
    return null;
  }

  return Mailjet.apiConnect(apiKey, secretKey);
}

async function sendEmail(
  to: { email: string; name?: string } | { email: string; name?: string }[],
  subject: string,
  htmlContent: string
) {
  const client = getMailjetClient();
  if (!client) return;

  const fromEmail = process.env.FROM_EMAIL || "noreply@heyelectrics.co.uk";
  const fromName = process.env.FROM_NAME || "Hey Electrics";
  const recipients = Array.isArray(to) ? to : [to];

  try {
    await client.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: fromEmail, Name: fromName },
          To: recipients.map((r) => ({ Email: r.email, Name: r.name || r.email })),
          Subject: subject,
          HTMLPart: htmlContent,
        },
      ],
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

function getAdminRecipients(): { email: string; name: string }[] {
  const adminName = process.env.ADMIN_NAME || "Hey Electrics Admin";
  const csv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return csv
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean)
    .map((email) => ({ email, name: adminName }));
}

async function getSameDayBoilerBookings(
  date: string
): Promise<SameDayBoilerBooking[]> {
  try {
    const dateOnly = date.split("T")[0];
    const rows = await db
      .select({
        bookingReference: bookings.bookingReference,
        fullName: bookings.fullName,
        postcode: bookings.postcode,
        addressLine1: bookings.addressLine1,
        city: bookings.city,
        fuelType: bookings.fuelType,
        bedrooms: bookings.bedrooms,
        depositPaid: bookings.depositPaid,
        status: bookings.status,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.bookingDate, dateOnly),
          eq(bookings.serviceType, "boiler")
        )
      );

    return rows.map((r) => ({
      bookingReference: r.bookingReference,
      fullName: r.fullName,
      postcode: r.postcode,
      addressLine1: r.addressLine1,
      city: r.city,
      fuelType: r.fuelType,
      bedrooms: r.bedrooms,
      depositPaid: r.depositPaid ?? false,
      status: r.status ?? "pending",
      createdAt: r.createdAt ? r.createdAt.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

// ── Public API ──────────────────────────────────────────────────────

export interface BoilerBookingEmailData {
  bookingReference: string;
  propertyType: string;
  propertySubtype?: string | null;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  postcode: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  county?: string | null;
  bedrooms?: number | null;
  fuelType?: string | null;
  boilerWorks?: boolean | null;
  bookingDate?: string | null;
  depositPaid?: boolean;
  stripePaymentIntentId?: string | null;
}

export async function sendBoilerBookingEmails(data: BoilerBookingEmailData) {
  const adminRecipients = getAdminRecipients();

  const sameDayBookings = data.bookingDate
    ? await getSameDayBoilerBookings(data.bookingDate)
    : [];

  if (adminRecipients.length > 0) {
    const admin = adminBoilerBookingEmail({
      ...data,
      sameDayCount: sameDayBookings.length,
      maxPerDay: MAX_BOOKINGS_PER_DAY,
      sameDayBookings,
    });
    await sendEmail(adminRecipients, admin.subject, admin.html);
  }

  const customer = customerBoilerBookingEmail({
    bookingReference: data.bookingReference,
    fullName: data.fullName,
    propertySubtype: data.propertySubtype,
    addressLine1: data.addressLine1,
    city: data.city,
    postcode: data.postcode,
    bedrooms: data.bedrooms,
    bookingDate: data.bookingDate,
    depositPaid: data.depositPaid ?? false,
  });
  await sendEmail(
    { email: data.email, name: data.fullName },
    customer.subject,
    customer.html
  );
}

export interface BoilerEnquiryEmailData {
  enquiryType: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  fuelType?: string | null;
  postcode?: string | null;
  address?: string | null;
  message?: string | null;
}

export async function sendBoilerEnquiryEmails(data: BoilerEnquiryEmailData) {
  const adminRecipients = getAdminRecipients();

  if (adminRecipients.length > 0) {
    const admin = adminBoilerEnquiryEmail(data);
    await sendEmail(adminRecipients, admin.subject, admin.html);
  }

  const customer = customerBoilerEnquiryEmail({
    fullName: data.fullName,
    enquiryType: data.enquiryType,
  });
  await sendEmail(
    { email: data.email, name: data.fullName },
    customer.subject,
    customer.html
  );
}
