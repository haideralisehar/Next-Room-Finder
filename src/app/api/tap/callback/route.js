// import { NextResponse } from "next/server";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const studentId = searchParams.get("studentId");
//   const logId = searchParams.get("logId");
//   const tap_id = searchParams.get("tap_id");

//   // Retrieve payment details
//   const res = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
//     headers: {
//       Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
//     },
//   });
//   const response = await res.json();

//   console.log(response);

//   // Simulate DB update (replace with real DB logic)
//   console.log("Payment Callback:", {
//     studentId,
//     logId,
//     status: response.status,
//   });

//   if (response.status === "CAPTURED") {
//     console.log(response);
//   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/success`);
// } else {
//   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`);
// }


// }

import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tap_id = searchParams.get("tap_id");

  if (!tap_id) {
    return NextResponse.json({ error: "Missing tap_id" }, { status: 400 });
  }

  // Fetch latest payment status from Tap API
  const res = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
    headers: { Authorization: `Bearer ${process.env.TAP_SECRET_KEY}` },
  });

  const payment = await res.json();

  // Log everything for debugging
  console.log("Tap Payment Response:", payment);
  // Redirect to UI and pass the entire payment object encoded
  return NextResponse.redirect(
  `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/status?data=${encodeURIComponent(
    JSON.stringify(payment)
  )}`
);

}
