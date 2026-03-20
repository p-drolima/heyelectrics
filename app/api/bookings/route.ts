import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, slotReservations } from "@/lib/db/schema";
import { generateBookingReference } from "@/lib/utils";
import { sendBookingEmails } from "@/lib/email";
import { DEPOSIT_PENCE } from "@/lib/pricing";

const MAX_BOOKINGS_PER_DAY = 7;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      propertyType = "residential",
      propertySubtype,
      fullName,
      email,
      phone,
      postcode,
      addressLine1,
      addressLine2,
      city,
      county,
      bedrooms,
      bookingDate,
      stripePaymentIntentId,
      depositPaid,
      reservationToken,
    } = body;

    if (!fullName || !email || !phone || !postcode) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedDate = bookingDate
      ? new Date(bookingDate).toISOString().split("T")[0]
      : null;

    // Server-side availability guard (only count confirmed bookings -- the user's own reservation is valid)
    if (normalizedDate) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(eq(bookings.bookingDate, normalizedDate));

      if (Number(count) >= MAX_BOOKINGS_PER_DAY) {
        return NextResponse.json(
          {
            message: `Sorry, ${normalizedDate} is fully booked (maximum ${MAX_BOOKINGS_PER_DAY} per day). Please choose another date.`,
            code: "DATE_FULLY_BOOKED",
          },
          { status: 409 }
        );
      }
    }

    const bookingReference = generateBookingReference();

    const [row] = await db
      .insert(bookings)
      .values({
        bookingReference,
        propertyType: String(propertyType),
        propertySubtype: propertySubtype ? String(propertySubtype) : null,
        fullName: String(fullName),
        companyName: body.companyName ? String(body.companyName) : null,
        email: String(email),
        phone: String(phone),
        postcode: String(postcode),
        addressLine1: addressLine1 ? String(addressLine1) : null,
        addressLine2: addressLine2 ? String(addressLine2) : null,
        city: city ? String(city) : null,
        county: county ? String(county) : null,
        bedrooms: bedrooms != null ? Number(bedrooms) : null,
        bookingDate: normalizedDate,
        depositPaid: depositPaid === true,
        depositAmount: (DEPOSIT_PENCE / 100).toFixed(2),
        stripePaymentIntentId: stripePaymentIntentId
          ? String(stripePaymentIntentId)
          : null,
        status: depositPaid ? "confirmed" : "pending",
      })
      .returning();

    const ref = row?.bookingReference ?? bookingReference;

    // Check if this is a returning customer (has previous bookings with same email)
    const [{ count: prevCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.email, String(email)));
    const isNewCustomer = Number(prevCount) <= 1;

    // Release the slot reservation now that the booking is confirmed
    if (reservationToken) {
      db.delete(slotReservations)
        .where(eq(slotReservations.sessionToken, String(reservationToken)))
        .catch((err) => console.error("Failed to release reservation:", err));
    }

    sendBookingEmails({
      bookingReference: ref,
      propertyType: String(propertyType),
      propertySubtype: propertySubtype || null,
      fullName: String(fullName),
      companyName: body.companyName || null,
      email: String(email),
      phone: String(phone),
      postcode: String(postcode),
      addressLine1: addressLine1 || null,
      addressLine2: addressLine2 || null,
      city: city || null,
      county: county || null,
      bedrooms: bedrooms != null ? Number(bedrooms) : null,
      bookingDate: normalizedDate,
      depositPaid: depositPaid === true,
      stripePaymentIntentId: stripePaymentIntentId || null,
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({
      bookingReference: ref,
      id: row?.id,
      isNewCustomer,
    });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}
