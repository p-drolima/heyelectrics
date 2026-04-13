import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, slotReservations } from "@/lib/db/schema";
import { generateBookingReference, isWeekend } from "@/lib/utils";
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
      partialBookingId,
    } = body;

    if (!fullName || !email || !phone || !postcode) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const normalizedDate = bookingDate
      ? bookingDate.includes("T")
        ? new Date(bookingDate).toISOString().split("T")[0]
        : bookingDate
      : null;

    if (normalizedDate && isWeekend(normalizedDate)) {
      return NextResponse.json(
        {
          message: "Bookings are not available on weekends. Please choose a weekday.",
          code: "WEEKEND_NOT_ALLOWED",
        },
        { status: 400 }
      );
    }

    // Release the slot reservation early so it doesn't count against availability
    if (reservationToken) {
      db.delete(slotReservations)
        .where(eq(slotReservations.sessionToken, String(reservationToken)))
        .catch((err) => console.error("Failed to release reservation:", err));
    }

    // ── Partial → full upgrade path ───────────────────────────────────
    if (partialBookingId) {
      // Server-side availability guard (excludes this booking's own date since
      // it already exists as a partial row — count only other confirmed rows)
      if (normalizedDate) {
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(bookings)
          .where(
            sql`${bookings.bookingDate} = ${normalizedDate}
                AND ${bookings.id} != ${Number(partialBookingId)}
                AND (${bookings.submissionType} = 'full' OR ${bookings.depositPaid} = true)`
          );

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

      const [updatedRow] = await db
        .update(bookings)
        .set({
          stripePaymentIntentId: stripePaymentIntentId
            ? String(stripePaymentIntentId)
            : null,
          depositPaid: true,
          depositAmount: (DEPOSIT_PENCE / 100).toFixed(2),
          status: "confirmed",
          submissionType: "full",
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, Number(partialBookingId)))
        .returning();

      const ref = updatedRow?.bookingReference;

      // Check if returning customer
      const [{ count: prevCount }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(bookings)
        .where(eq(bookings.email, String(email)));
      const isNewCustomer = Number(prevCount) <= 1;

      await sendBookingEmails({
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
        depositPaid: true,
        stripePaymentIntentId: stripePaymentIntentId || null,
      }).catch((err) => console.error("Email send failed:", err));

      return NextResponse.json({
        bookingReference: ref,
        id: updatedRow?.id,
        isNewCustomer,
      });
    }

    // ── Fresh full-submission path (no partial record) ─────────────────
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
        submissionType: "full",
        completedAt: depositPaid ? new Date() : null,
      })
      .returning();

    const ref = row?.bookingReference ?? bookingReference;

    const [{ count: prevCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.email, String(email)));
    const isNewCustomer = Number(prevCount) <= 1;

    await sendBookingEmails({
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
