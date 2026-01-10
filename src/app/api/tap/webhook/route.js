
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("🔥 TAP WEBHOOK RECEIVED:", body);

    // Extract essential fields
    const payload = {
      tapId: body?.id,
      status: body?.status,
      amount: body?.amount,
      currency: body?.currency,
      order: body?.reference?.order,
      transaction: body?.reference?.transaction,

      customer: {
        name: body?.customer?.first_name + " " + body?.customer?.last_name,
        email: body?.customer?.email,
        phone: body?.customer?.phone?.number,
      },

      // save the full body for logs or debugging
      raw: body,
    };

    // IMPORTANT → Forward to your save API
    await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/tap/payment/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log(body);

    // Tap requires 200 OK to stop retrying
// <<<<<<< HEAD
//    return new Response("OK", { status: 200 }, {body}); // VERY IMPORTANT
// =======
//    return new Response("OK", { status: 200, "Body":body }); // VERY IMPORTANT
// >>>>>>> 9c4bdaa0bcbfb8858d60e7c273198dafd78e957f
  } catch (error) {
    console.log("Webhook error:", error);
    return new Response("OK", { status: 200 }); // STILL RETURN 200
  }
}
