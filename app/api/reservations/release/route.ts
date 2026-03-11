import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { slotReservations } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "sessionToken is required" },
        { status: 400 }
      );
    }

    await db
      .delete(slotReservations)
      .where(eq(slotReservations.sessionToken, sessionToken));

    return NextResponse.json({ released: true });
  } catch (error) {
    console.error("Release reservation error:", error);
    return NextResponse.json(
      { message: "Failed to release reservation" },
      { status: 500 }
    );
  }
}
