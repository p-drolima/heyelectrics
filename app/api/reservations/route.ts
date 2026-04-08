import { NextResponse } from "next/server";
import { eq, sql, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { slotReservations, bookings } from "@/lib/db/schema";
import { randomBytes } from "crypto";
import { isWeekend } from "@/lib/utils";

const MAX_BOOKINGS_PER_DAY = 7;
const RESERVATION_MINUTES = 10;

export async function POST(request: Request) {
  try {
    console.log("[reservations] ENV check:", {
      hasDATABASE_URL: !!process.env.DATABASE_URL,
      hasPOSTGRES_URL: !!process.env.POSTGRES_URL,
      hasSTORAGE_URL: !!process.env.STORAGE_URL,
    });

    const body = await request.json();
    const { bookingDate, existingToken } = body;
    console.log("[reservations] Request body:", { bookingDate, existingToken });

    if (!bookingDate) {
      return NextResponse.json(
        { message: "bookingDate is required" },
        { status: 400 }
      );
    }

    const dateOnly = bookingDate.includes("T")
      ? new Date(bookingDate).toISOString().split("T")[0]
      : bookingDate;
    const now = new Date();
    console.log("[reservations] Parsed date:", dateOnly);

    if (isWeekend(dateOnly)) {
      return NextResponse.json(
        {
          message: "Bookings are not available on weekends. Please choose a weekday.",
          code: "WEEKEND_NOT_ALLOWED",
        },
        { status: 400 }
      );
    }

    // Clean up expired reservations for this date
    await db
      .delete(slotReservations)
      .where(lt(slotReservations.expiresAt, now));

    // If user already has a reservation, release it first
    if (existingToken) {
      await db
        .delete(slotReservations)
        .where(eq(slotReservations.sessionToken, existingToken));
    }

    // Count confirmed bookings for this date
    const [bookingCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.bookingDate, dateOnly));

    // Count active (non-expired) reservations for this date
    const [reservationCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(slotReservations)
      .where(
        sql`${slotReservations.bookingDate} = ${dateOnly} AND ${slotReservations.expiresAt} > ${now}`
      );

    const totalHeld =
      Number(bookingCount.count) + Number(reservationCount.count);

    if (totalHeld >= MAX_BOOKINGS_PER_DAY) {
      return NextResponse.json(
        {
          message:
            "This date is no longer available. All slots are either booked or reserved by other users. Please choose another date.",
          code: "DATE_FULLY_BOOKED",
        },
        { status: 409 }
      );
    }

    // Create reservation
    const sessionToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(
      now.getTime() + RESERVATION_MINUTES * 60 * 1000
    );

    await db.insert(slotReservations).values({
      bookingDate: dateOnly,
      sessionToken,
      expiresAt,
    });

    return NextResponse.json({
      sessionToken,
      expiresAt: expiresAt.toISOString(),
      reservationMinutes: RESERVATION_MINUTES,
    });
  } catch (error) {
    console.error("[reservations] FULL ERROR:", error);
    console.error("[reservations] Error name:", (error as Error)?.name);
    console.error("[reservations] Error message:", (error as Error)?.message);
    console.error("[reservations] Error stack:", (error as Error)?.stack);
    return NextResponse.json(
      { message: "Failed to reserve slot", debug: (error as Error)?.message },
      { status: 500 }
    );
  }
}
