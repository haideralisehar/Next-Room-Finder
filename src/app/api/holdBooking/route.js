import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const { bookingPayload } = body;

    if (!bookingPayload) {
      return Response.json(
        { success: false, message: "bookingPayload is required." },
        { status: 400 }
      );
    }

    // Optional: check login (remove if not needed)
    const cookieStore = cookies();
    const agencyId = cookieStore.get("agencyId")?.value;

    if (!agencyId) {
      return Response.json(
        { success: false, message: "Login to proceed!" },
        { status: 401 }
      );
    }

    /* -------------------- CONFIRM BOOKING ONLY -------------------- */
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;

    const bookingRes = await fetch(`${baseUrl}/api/bookingConfirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
      cache: "no-store",
    });

    const booking = await bookingRes.json();

    if (!bookingRes.ok || booking?.Error) {
      return Response.json(
        {
          success: false,
          message: booking?.Error?.Message || "Booking confirmation failed.",
          booking,
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Booking confirmed successfully!",
      booking,
    });
  } catch (error) {
    console.error("Booking Confirm Error:", error);
    return Response.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
