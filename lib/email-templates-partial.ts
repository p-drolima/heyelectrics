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

export interface PartialBookingEmailData {
  bookingReference: string;
  serviceType?: string | null;
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
}

export function adminPartialBookingEmail(data: PartialBookingEmailData): {
  subject: string;
  html: string;
} {
  const dateDisplay = data.bookingDate
    ? formatDate(data.bookingDate)
    : "Not selected";

  const address = [
    data.addressLine1,
    data.addressLine2,
    data.city,
    data.county,
    data.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  const content = `
    <h2 style="color:${DARK_COLOR};margin:0 0 8px 0;font-size:20px;">Partial Booking &ndash; Awaiting Payment</h2>
    <p style="margin:0 0 20px 0;">${badge("PARTIAL", "#F97316")}</p>

    <p style="margin:0 0 20px 0;font-size:14px;color:#666666;background-color:#fff8f0;border:1px solid #fed7aa;border-radius:6px;padding:12px 16px;">
      This customer completed the booking form but has <strong>not yet paid the deposit</strong>. They may need a follow-up call or email.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${row("Reference", `<strong>${data.bookingReference}</strong>`)}
      ${row("Name", data.fullName)}
      ${data.companyName ? row("Company", data.companyName) : ""}
      ${row("Email", `<a href="mailto:${data.email}" style="color:${BRAND_COLOR};">${data.email}</a>`)}
      ${row("Phone", `<a href="tel:${data.phone}" style="color:${BRAND_COLOR};">${data.phone}</a>`)}
      ${data.propertyType ? row("Property Type", data.propertyType) : ""}
      ${data.propertySubtype ? row("Property", data.propertySubtype) : ""}
      ${data.bedrooms ? row("Bedrooms", String(data.bedrooms)) : ""}
      ${address ? row("Address", address) : ""}
      ${row("Booking Date", dateDisplay)}
      ${row("Deposit", `<span style="color:#dc2626;font-weight:bold;">Not paid &ndash; awaiting payment</span>`)}
    </table>
  `;

  const serviceLabel = data.serviceType?.toLowerCase() === "boiler"
    ? "Boiler Service"
    : "EICR";

  return {
    subject: `[PARTIAL] New ${serviceLabel} Lead \u2013 ${data.fullName} \u2013 ${dateDisplay}`,
    html: baseLayout(content),
  };
}
