import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const logId = searchParams.get("logId");
  const tap_id = searchParams.get("tap_id");

  // Retrieve payment details
  const res = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
    },
  });
  const response = await res.json();

  // Simulate DB update (replace with real DB logic)
  console.log("Payment Callback:", {
    studentId,
    logId,
    status: response.status,
  });

  if (response.status === "CAPTURED") {
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/success`);
} else {
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`);
}


}
