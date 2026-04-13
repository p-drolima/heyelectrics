import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { generateBookingReference } from "@/lib/utils";
import { sendPartialBookingEmail } from "@/lib/email";

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
      existingPartialId,
      serviceType = "eicr",
    } = body;

    if (!fullName || !email || !phone) {
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

    // Idempotency: if caller supplies an existing partial ID, update it
    if (existingPartialId) {
      const updatePayload: Record<string, unknown> = {
          propertyType: String(propertyType),
          propertySubtype: propertySubtype ? String(propertySubtype) : null,
          fullName: String(fullName),
          companyName: body.companyName ? String(body.companyName) : null,
          email: String(email),
          phone: String(phone),
          addressLine1: addressLine1 ? String(addressLine1) : null,
          addressLine2: addressLine2 ? String(addressLine2) : null,
          city: city ? String(city) : null,
          county: county ? String(county) : null,
          bedrooms: bedrooms != null ? Number(bedrooms) : null,
          updatedAt: new Date(),
        };
      if (postcode) updatePayload.postcode = String(postcode);
      if (normalizedDate) updatePayload.bookingDate = normalizedDate;

      const [updated] = await db
        .update(bookings)
        .set(updatePayload)
        .where(eq(bookings.id, Number(existingPartialId)))
        .returning();

      if (updated) {
        return NextResponse.json({
          bookingReference: updated.bookingReference,
          id: updated.id,
          updated: true,
        });
      }
    }

    // Idempotency fallback: check for existing partial by email + serviceType (booking date may not exist yet)
    const existing = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.email, String(email)),
          eq(bookings.serviceType, String(serviceType)),
          eq(bookings.submissionType, "partial"),
          eq(bookings.status, "pending")
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const existingRow = existing[0];
      const fallbackPayload: Record<string, unknown> = {
          propertyType: String(propertyType),
          propertySubtype: propertySubtype ? String(propertySubtype) : null,
          fullName: String(fullName),
          companyName: body.companyName ? String(body.companyName) : null,
          phone: String(phone),
          addressLine1: addressLine1 ? String(addressLine1) : null,
          addressLine2: addressLine2 ? String(addressLine2) : null,
          city: city ? String(city) : null,
          county: county ? String(county) : null,
          bedrooms: bedrooms != null ? Number(bedrooms) : null,
          updatedAt: new Date(),
        };
      if (postcode) fallbackPayload.postcode = String(postcode);
      if (normalizedDate) fallbackPayload.bookingDate = normalizedDate;

      await db
        .update(bookings)
        .set(fallbackPayload)
        .where(eq(bookings.id, existingRow.id));

      return NextResponse.json({
        bookingReference: existingRow.bookingReference,
        id: existingRow.id,
        updated: true,
      });
    }

    // New partial booking
    const bookingReference = generateBookingReference();

    const [row] = await db
      .insert(bookings)
      .values({
        bookingReference,
        serviceType: String(serviceType),
        propertyType: String(propertyType),
        propertySubtype: propertySubtype ? String(propertySubtype) : null,
        fullName: String(fullName),
        companyName: body.companyName ? String(body.companyName) : null,
        email: String(email),
        phone: String(phone),
        postcode: postcode ? String(postcode) : "",
        addressLine1: addressLine1 ? String(addressLine1) : null,
        addressLine2: addressLine2 ? String(addressLine2) : null,
        city: city ? String(city) : null,
        county: county ? String(county) : null,
        bedrooms: bedrooms != null ? Number(bedrooms) : null,
        bookingDate: normalizedDate || null,
        depositPaid: false,
        status: "pending",
        submissionType: "partial",
        partialSubmittedAt: new Date(),
      })
      .returning();

    // Send admin notification email (only on first creation)
    sendPartialBookingEmail({
      bookingReference: row.bookingReference,
      serviceType: String(serviceType),
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
    }).catch((err) => console.error("Partial booking email failed:", err));

    return NextResponse.json({
      bookingReference: row.bookingReference,
      id: row.id,
      updated: false,
    });
  } catch (error) {
    console.error("Partial booking error:", error);
    return NextResponse.json(
      { message: "Failed to save partial booking" },
      { status: 500 }
    );
  }
}
