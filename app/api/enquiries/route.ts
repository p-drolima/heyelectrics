import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { enquiries } from "@/lib/db/schema";
import { sendEnquiryEmails } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      enquiry_type,
      fullName,
      companyName,
      email,
      phone,
      postcode,
      address,
      message,
    } = body;

    const enquiryType =
      enquiry_type ||
      (body.propertyType === "commercial" ? "commercial" : "general");

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { message: "Missing required fields: fullName, email, phone" },
        { status: 400 }
      );
    }

    const [row] = await db
      .insert(enquiries)
      .values({
        enquiryType,
        fullName: String(fullName),
        companyName: companyName ? String(companyName) : null,
        email: String(email),
        phone: String(phone),
        postcode: postcode ? String(postcode) : null,
        address: address ? String(address) : null,
        message: message ? String(message) : null,
      })
      .returning();

    // Fire-and-forget: send emails without blocking the response
    sendEnquiryEmails({
      enquiryType,
      fullName: String(fullName),
      companyName: companyName || null,
      email: String(email),
      phone: String(phone),
      postcode: postcode || null,
      address: address || null,
      message: message || null,
    }).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json({
      id: row?.id,
      message: "Enquiry submitted successfully",
    });
  } catch (error) {
    console.error("Enquiry error:", error);
    return NextResponse.json(
      { message: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
