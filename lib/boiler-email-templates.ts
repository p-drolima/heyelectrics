import { BOILER_SERVICE_DISPLAY } from "@/lib/boiler-pricing";

const BRAND_COLOR = "#2CBCB0";
const DARK_COLOR = "#1a1a2e";

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Hey Electrics</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">
  <tr>
    <td style="background-color:${DARK_COLOR};padding:24px;text-align:center;">
      <span style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;font-weight:bold;font-size:14px;padding:6px 16px;border-radius:20px;">HEY</span>
    </td>
  </tr>
  <tr>
    <td style="padding:32px 24px;">
      ${content}
    </td>
  </tr>
  <tr>
    <td style="background-color:#f9f9f9;padding:20px 24px;text-align:center;font-size:12px;color:#999999;">
      <p style="margin:0;">Hey Electrics &bull; 0161 566 0197</p>
      <p style="margin:4px 0 0 0;">&copy; ${new Date().getFullYear()} Hey Electrics. All rights reserved.</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function badge(text: string, color: string): string {
  return `<span style="display:inline-block;background-color:${color};color:#ffffff;font-size:12px;font-weight:bold;padding:4px 12px;border-radius:4px;text-transform:uppercase;">${text}</span>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#666666;font-size:14px;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;color:${DARK_COLOR};font-size:14px;font-weight:500;">${value}</td>
  </tr>`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "Not selected";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function paymentBadge(paid: boolean): string {
  if (paid) {
    return `<span style="color:#16a34a;font-weight:bold;">${BOILER_SERVICE_DISPLAY} &ndash; Paid</span>`;
  }
  return `<span style="color:#dc2626;font-weight:bold;">${BOILER_SERVICE_DISPLAY} &ndash; Pending</span>`;
}

// ── Same-day booking type ───────────────────────────────────────────

export interface SameDayBoilerBooking {
  bookingReference: string;
  fullName: string;
  postcode: string;
  addressLine1?: string | null;
  city?: string | null;
  fuelType?: string | null;
  bedrooms?: number | null;
  depositPaid: boolean;
  status: string;
  createdAt?: string | null;
}

function sameDayBookingRow(booking: SameDayBoilerBooking): string {
  const address = [booking.addressLine1, booking.city, booking.postcode]
    .filter(Boolean)
    .join(", ");
  const statusColor = booking.depositPaid ? "#16a34a" : "#F97316";
  const statusText = booking.depositPaid ? "Paid" : "Pending";

  return `<tr>
    <td style="padding:8px;border-bottom:1px solid #f0f0f0;font-size:13px;color:${DARK_COLOR};">
      <strong>${booking.fullName}</strong>
      <br/><span style="color:#666666;">${booking.bookingReference}</span>
    </td>
    <td style="padding:8px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666666;">
      ${address || "&mdash;"}
      ${booking.bedrooms ? `<br/>${booking.bedrooms} bed` : ""}
    </td>
    <td style="padding:8px;border-bottom:1px solid #f0f0f0;font-size:13px;text-align:center;">
      <span style="color:${statusColor};font-weight:bold;">${statusText}</span>
    </td>
  </tr>`;
}

function sameDayBookingsTable(
  allBookings: SameDayBoilerBooking[],
  currentRef: string,
  dateDisplay: string,
  slotsRemaining: number,
  maxPerDay: number
): string {
  const otherBookings = allBookings.filter(
    (b) => b.bookingReference !== currentRef
  );
  const totalCount = allBookings.length;

  const capacityColor =
    slotsRemaining <= 0
      ? "#dc2626"
      : slotsRemaining <= 2
        ? "#F97316"
        : "#16a34a";

  let html = `
    <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:16px;margin-bottom:16px;">
      <p style="margin:0 0 4px 0;font-size:15px;font-weight:bold;color:${DARK_COLOR};">
        Daily Summary &mdash; ${dateDisplay}
      </p>
      <p style="margin:0 0 12px 0;font-size:14px;color:#666666;">
        <strong style="color:${capacityColor};">${totalCount} of ${maxPerDay}</strong> slots booked.
        ${slotsRemaining > 0 ? `${slotsRemaining} slot${slotsRemaining === 1 ? "" : "s"} remaining.` : `<strong style="color:#dc2626;">This date is now fully booked.</strong>`}
      </p>`;

  if (otherBookings.length > 0) {
    html += `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:4px;border:1px solid #e2e8f0;">
        <tr>
          <td style="padding:8px;font-size:12px;font-weight:bold;color:#666666;text-transform:uppercase;border-bottom:2px solid #e2e8f0;">Customer</td>
          <td style="padding:8px;font-size:12px;font-weight:bold;color:#666666;text-transform:uppercase;border-bottom:2px solid #e2e8f0;">Address</td>
          <td style="padding:8px;font-size:12px;font-weight:bold;color:#666666;text-transform:uppercase;border-bottom:2px solid #e2e8f0;text-align:center;">Payment</td>
        </tr>
        ${otherBookings.map(sameDayBookingRow).join("")}
      </table>`;
  } else {
    html += `<p style="margin:0;font-size:13px;color:#999999;font-style:italic;">This is the first booking for this date.</p>`;
  }

  html += `</div>`;
  return html;
}

// ── Admin notification for a new boiler booking ─────────────────────

interface AdminBoilerBookingData {
  bookingReference: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  fuelType?: string | null;
  boilerWorks?: boolean | null;
  propertyType: string;
  propertySubtype?: string | null;
  postcode: string;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  county?: string | null;
  bedrooms?: number | null;
  bookingDate?: string | null;
  depositPaid?: boolean;
  stripePaymentIntentId?: string | null;
  sameDayCount: number;
  maxPerDay: number;
  sameDayBookings: SameDayBoilerBooking[];
}

export function adminBoilerBookingEmail(data: AdminBoilerBookingData): {
  subject: string;
  html: string;
} {
  const dateDisplay = data.bookingDate
    ? formatDate(data.bookingDate)
    : "Not selected";
  const slotsRemaining = data.maxPerDay - data.sameDayCount;

  const address = [
    data.addressLine1,
    data.addressLine2,
    data.city,
    data.county,
    data.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  const paid = data.depositPaid ?? false;

  const content = `
    <h2 style="color:${DARK_COLOR};margin:0 0 8px 0;font-size:20px;">New Boiler Service Booking</h2>
    <p style="margin:0 0 20px 0;">${badge("Boiler Service", "#3B82F6")}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${row("Reference", `<strong>${data.bookingReference}</strong>`)}
      ${row("Name", data.fullName)}
      ${data.companyName ? row("Company", data.companyName) : ""}
      ${row("Email", `<a href="mailto:${data.email}" style="color:${BRAND_COLOR};">${data.email}</a>`)}
      ${row("Phone", `<a href="tel:${data.phone}" style="color:${BRAND_COLOR};">${data.phone}</a>`)}
      ${data.fuelType ? row("Fuel Type", data.fuelType) : ""}
      ${data.boilerWorks != null ? row("Boiler Working", data.boilerWorks ? "Yes" : "No") : ""}
      ${data.propertySubtype ? row("Property Type", data.propertySubtype) : ""}
      ${data.bedrooms ? row("Bedrooms", String(data.bedrooms)) : ""}
      ${address ? row("Address", address) : ""}
      ${row("Booking Date", dateDisplay)}
      ${row("Payment", paymentBadge(paid))}
      ${data.stripePaymentIntentId ? row("Stripe Ref", `<span style="font-family:monospace;font-size:12px;">${data.stripePaymentIntentId}</span>`) : ""}
    </table>

    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:16px;margin-bottom:16px;">
      <p style="margin:0 0 8px 0;font-size:14px;font-weight:bold;color:${DARK_COLOR};">Cost Breakdown</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="padding:4px 0;color:${DARK_COLOR};font-weight:bold;">Boiler Service ${paid ? "(paid)" : "(pending)"}</td>
          <td style="padding:4px 0;text-align:right;color:${paid ? "#16a34a" : "#dc2626"};font-weight:bold;">${BOILER_SERVICE_DISPLAY}</td>
        </tr>
      </table>
    </div>

    ${
      data.bookingDate
        ? sameDayBookingsTable(
            data.sameDayBookings,
            data.bookingReference,
            dateDisplay,
            slotsRemaining,
            data.maxPerDay
          )
        : ""
    }
  `;

  const urgencyPrefix =
    slotsRemaining <= 0
      ? "[FULL] "
      : slotsRemaining <= 2
        ? "[NEARLY FULL] "
        : "";

  return {
    subject: `${urgencyPrefix}New Boiler Service Booking \u2013 ${dateDisplay} \u2013 ${data.fullName} (${data.sameDayCount}/${data.maxPerDay})`,
    html: baseLayout(content),
  };
}

// ── Customer boiler booking confirmation ────────────────────────────

interface CustomerBoilerBookingData {
  bookingReference: string;
  fullName: string;
  propertySubtype?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  postcode: string;
  bedrooms?: number | null;
  bookingDate?: string | null;
  depositPaid?: boolean;
}

export function customerBoilerBookingEmail(data: CustomerBoilerBookingData): {
  subject: string;
  html: string;
} {
  const dateDisplay = data.bookingDate
    ? formatDate(data.bookingDate)
    : "To be confirmed";
  const address = [data.addressLine1, data.city, data.postcode]
    .filter(Boolean)
    .join(", ");

  const paid = data.depositPaid ?? false;

  const content = `
    <h2 style="color:${DARK_COLOR};margin:0 0 16px 0;font-size:20px;">Booking Confirmed</h2>
    <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
      Hi ${data.fullName},<br/><br/>
      Thank you for booking your boiler service with Hey Electrics. Here&rsquo;s a summary of your booking:
    </p>

    <div style="background-color:#f9f9f9;border-radius:6px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${row("Reference", `<strong>${data.bookingReference}</strong>`)}
        ${data.propertySubtype ? row("Property", data.propertySubtype) : ""}
        ${data.bedrooms ? row("Bedrooms", String(data.bedrooms)) : ""}
        ${address ? row("Address", address) : ""}
        ${row("Date", dateDisplay)}
        ${row("Payment", paymentBadge(paid))}
      </table>
    </div>

    <h3 style="color:${DARK_COLOR};font-size:16px;margin:0 0 12px 0;">What happens next?</h3>
    <ol style="color:#333333;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 24px 0;">
      <li>Our team will review your booking and confirm the appointment.</li>
      <li>A Gas Safe registered engineer will attend your property and carry out a full boiler inspection.</li>
      <li>You&rsquo;ll receive confirmation that your boiler is operating safely.</li>
    </ol>

    <p style="color:#333333;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
      Need to change your booking? Contact us:
    </p>
    <p style="margin:0;">
      <a href="tel:01615660197" style="color:${BRAND_COLOR};font-weight:bold;font-size:15px;text-decoration:none;">0161 566 0197</a>
    </p>
  `;

  return {
    subject: `Your Boiler Service Booking Confirmation \u2013 ${data.bookingReference}`,
    html: baseLayout(content),
  };
}

// ── Admin notification for a boiler enquiry ─────────────────────────

interface AdminBoilerEnquiryData {
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

export function adminBoilerEnquiryEmail(data: AdminBoilerEnquiryData): {
  subject: string;
  html: string;
} {
  const typeLabel =
    data.enquiryType === "broken_boiler"
      ? "Broken Boiler"
      : "Large Property (5+ Bedrooms)";
  const typeBadge = badge(typeLabel, "#F97316");

  const content = `
    <h2 style="color:${DARK_COLOR};margin:0 0 8px 0;font-size:20px;">New Boiler Enquiry</h2>
    <p style="margin:0 0 20px 0;">${typeBadge}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${row("Enquiry Type", typeLabel)}
      ${row("Name", data.fullName)}
      ${data.companyName ? row("Company", data.companyName) : ""}
      ${row("Email", `<a href="mailto:${data.email}" style="color:${BRAND_COLOR};">${data.email}</a>`)}
      ${row("Phone", `<a href="tel:${data.phone}" style="color:${BRAND_COLOR};">${data.phone}</a>`)}
      ${data.fuelType ? row("Fuel Type", data.fuelType) : ""}
      ${data.postcode ? row("Postcode", data.postcode) : ""}
      ${data.address ? row("Address", data.address) : ""}
      ${data.message ? row("Message", data.message) : ""}
    </table>
  `;

  return {
    subject: `New Boiler Enquiry \u2013 ${data.fullName}`,
    html: baseLayout(content),
  };
}

// ── Customer boiler enquiry confirmation ────────────────────────────

interface CustomerBoilerEnquiryData {
  fullName: string;
  enquiryType: string;
}

export function customerBoilerEnquiryEmail(data: CustomerBoilerEnquiryData): {
  subject: string;
  html: string;
} {
  const content = `
    <h2 style="color:${DARK_COLOR};margin:0 0 16px 0;font-size:20px;">Enquiry Received</h2>
    <p style="color:#333333;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
      Hi ${data.fullName},<br/><br/>
      Thank you for your enquiry with Hey Electrics. We&rsquo;ve received your details and a member of our team will be in touch within 24 hours to discuss your requirements.
    </p>

    <p style="color:#333333;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
      In the meantime, if you have any questions, don&rsquo;t hesitate to get in touch:
    </p>
    <p style="margin:0;">
      <a href="tel:01615660197" style="color:${BRAND_COLOR};font-weight:bold;font-size:15px;text-decoration:none;">0161 566 0197</a>
    </p>
  `;

  return {
    subject: "Your Enquiry \u2013 Hey Electrics",
    html: baseLayout(content),
  };
}
