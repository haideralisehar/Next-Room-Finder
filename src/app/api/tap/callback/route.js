import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tap_id = searchParams.get("tap_id");

  if (!tap_id) {
    return NextResponse.json({ error: "Missing tap_id" }, { status: 400 });
  }

  // Fetch payment status from Tap
  const res = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
    headers: { Authorization: `Bearer ${process.env.TAP_SECRET_KEY}` },
  });

  const payment = await res.json();

  console.log("Tap Payment Response:", payment);

  // Check payment status
  const paymentStatus = payment?.status;

  if (paymentStatus === "CAPTURED") {
    console.log("Payment SUCCESS ✔ Creating Booking...");

    try {
      // ⭐ Make booking confirmation request
      const bookingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/bookingConfirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkInDate: "2025-12-10",
            checkOutDate: "2025-12-15",
            numOfRooms: 1,
            guestList: [
              {
                roomNum: 1,
                guestInfo: [
                  {
                    name: {
                      first: "John",
                      last: "Doe"
                    },
                    isAdult: true,
                    age: 30
                  }
                ]
              }
            ],
            contact: {
              name: {
                first: "John",
                last: "Doe"
              },
              email: "johndoe@example.com",
              phone: "+923001234567"
            },
            clientReference: `client-${Date.now()}`,
            referenceNo: payment?.metadata?.referenceNo
          }),
        }
      );

      const bookingResult = await bookingResponse.json();
      console.log("Booking Confirm Result:", bookingResult);

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/success`
      );

    } catch (err) {
      console.error("Booking API Error:", err);

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`
      );
    }
  }

  // If payment FAILED or CANCELED
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`
  );
}
