import Mailjet from "node-mailjet";
import {
  adminBookingEmail,
  adminEnquiryEmail,
  customerBookingEmail,
  customerEnquiryEmail,
} from "./email-templates";
import type { SameDayBooking } from "./email-templates";
import { db } from "./db";
import { bookings } from "./db/schema";
import { eq } from "drizzle-orm";

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

async function getSameDayBookings(date: string): Promise<SameDayBooking[]> {
  try {
    const dateOnly = date.split("T")[0];
    const rows = await db
      .select({
        bookingReference: bookings.bookingReference,
        fullName: bookings.fullName,
        postcode: bookings.postcode,
        addressLine1: bookings.addressLine1,
        city: bookings.city,
        propertySubtype: bookings.propertySubtype,
        bedrooms: bookings.bedrooms,
        depositPaid: bookings.depositPaid,
        status: bookings.status,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .where(eq(bookings.bookingDate, dateOnly));

    return rows.map((r) => ({
      bookingReference: r.bookingReference,
      fullName: r.fullName,
      postcode: r.postcode,
      addressLine1: r.addressLine1,
      city: r.city,
      propertySubtype: r.propertySubtype,
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

export interface BookingEmailData {
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
  bookingDate?: string | null;
  depositPaid?: boolean;
  stripePaymentIntentId?: string | null;
}

export async function sendBookingEmails(data: BookingEmailData) {
  const adminRecipients = getAdminRecipients();

  const sameDayBookings = data.bookingDate
    ? await getSameDayBookings(data.bookingDate)
    : [];

  if (adminRecipients.length > 0) {
    const admin = adminBookingEmail({
      ...data,
      sameDayCount: sameDayBookings.length,
      maxPerDay: MAX_BOOKINGS_PER_DAY,
      sameDayBookings,
    });
    await sendEmail(adminRecipients, admin.subject, admin.html);
  }

  const customer = customerBookingEmail({
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
  await sendEmail({ email: data.email, name: data.fullName }, customer.subject, customer.html);
}

export interface EnquiryEmailData {
  enquiryType: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  postcode?: string | null;
  address?: string | null;
  message?: string | null;
}

export async function sendEnquiryEmails(data: EnquiryEmailData) {
  const adminRecipients = getAdminRecipients();

  if (adminRecipients.length > 0) {
    const admin = adminEnquiryEmail(data);
    await sendEmail(adminRecipients, admin.subject, admin.html);
  }

  const customer = customerEnquiryEmail({
    fullName: data.fullName,
    enquiryType: data.enquiryType,
  });
  await sendEmail({ email: data.email, name: data.fullName }, customer.subject, customer.html);
}
