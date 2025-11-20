// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     console.log("🔥 TAP WEBHOOK RECEIVED:", JSON.stringify(body, null, 2));

//     // Webhook event name (e.g. charge.captured)
//     const eventType = body.type;

//     // All Tap charge data is inside: data.object.charge
//     const charge = body.data?.object?.charge;

//     if (!charge) {
//       console.error("❌ Invalid Tap Webhook: Missing charge object");
//       return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
//     }

//     // Extract charge fields
//     const paymentData = {
//       tap_id: charge.id,
//       amount: charge.amount,
//       currency: charge.currency,
//       status: charge.status,               // CAPTURED / FAILED / REFUNDED / AUTHORIZED
//       is_captured: charge.status === "CAPTURED" ? 1 : 0,

//       reference_transaction: charge.reference?.transaction || null,
//       reference_order: charge.reference?.order || null,

//       customer_name:
//         `${charge.customer?.first_name || ""} ${charge.customer?.last_name || ""}`.trim(),
//       customer_email: charge.customer?.email || null,
//       customer_phone: charge.customer?.phone?.number || null,
//       customer_country: charge.customer?.phone?.country_code || null,

//       created_at: charge.transaction?.date?.created || null,
//       completed_at: charge.transaction?.date?.completed || null,

//       event_type: eventType,               // charge.captured, charge.failed, etc.
//     };

//     // 🔄 Save to your DB via your internal API
//     await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/payment/save`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(paymentData),
//     });

//     console.log("✅ Webhook Saved to DB:", paymentData);

//     // Always reply 200 to Tap
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("❌ Webhook Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export const dynamic = "force-dynamic";


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

    // Tap requires 200 OK to stop retrying
   return NextResponse.json({ success: true, "Data:" :body }); // VERY IMPORTANT
  } catch (error) {
    console.log("Webhook error:", error);
    return new Response("OK", { status: 200 }); // STILL RETURN 200
  }
}
