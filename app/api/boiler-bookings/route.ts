import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, slotReservations } from "@/lib/db/schema";
import { generateBookingReference } from "@/lib/utils";
import { sendBoilerBookingEmails } from "@/lib/boiler-email";

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
      fuelType,
      boilerWorks,
      stripePaymentIntentId,
      fullPaymentPaid,
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
        serviceType: "boiler",
        fuelType: fuelType ? String(fuelType) : null,
        boilerWorks: boilerWorks === true,
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
        depositPaid: fullPaymentPaid === true,
        depositAmount: "99.00",
        stripePaymentIntentId: stripePaymentIntentId
          ? String(stripePaymentIntentId)
          : null,
        status: fullPaymentPaid ? "confirmed" : "pending",
      })
      .returning();

    const ref = row?.bookingReference ?? bookingReference;

    const [{ count: prevCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.email, String(email)));
    const isNewCustomer = Number(prevCount) <= 1;

    if (reservationToken) {
      db.delete(slotReservations)
        .where(eq(slotReservations.sessionToken, String(reservationToken)))
        .catch((err: unknown) =>
          console.error("Failed to release reservation:", err)
        );
    }

    await sendBoilerBookingEmails({
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
      fuelType: fuelType || null,
      boilerWorks: boilerWorks === true,
      bookingDate: normalizedDate,
      depositPaid: fullPaymentPaid === true,
      stripePaymentIntentId: stripePaymentIntentId || null,
    }).catch((err: unknown) => console.error("Email send failed:", err));

    return NextResponse.json({
      bookingReference: ref,
      id: row?.id,
      isNewCustomer,
    });
  } catch (error) {
    console.error("Boiler booking error:", error);
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}
