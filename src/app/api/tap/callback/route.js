import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tap_id = searchParams.get("tap_id");

    if (!tap_id) {
      return NextResponse.json(
        { error: "Missing tap_id" },
        { status: 400 }
      );
    }

    // Fetch payment status from Tap
    const res = await fetch(
      `https://api.tap.company/v2/charges/${tap_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = await res.json();
    console.log("Tap Callback Payment:", payment);

    const paymentStatus = payment?.status;

    // ✅ PAYMENT SUCCESS → Redirect only
    if (paymentStatus === "CAPTURED") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/success`
      );
    }

    // ❌ FAILED / CANCELLED / DECLINED
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`
    );
  } catch (error) {
    console.error("Tap Callback Error:", error);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`
    );
  }
}
