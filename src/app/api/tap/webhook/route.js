import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const payload = await req.json();

    console.log("🔔 Tap Webhook Payload:", payload);

    // Tap sends event type
    const event = payload?.event;
    const charge = payload?.data;

    if (!charge) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const paymentStatus = charge.status;
    const agencyId = charge?.metadata?.id_agency;
    const serviceCharge = Number(charge?.metadata?.serviceCharge || 0);
    const amount = Number(charge.amount);

    // ✅ Only handle successful payment
    if (event === "charge.captured" && paymentStatus === "CAPTURED") {
      console.log("✅ Payment Captured via Webhook");

      /* ------------------ GET WALLET ------------------ */
      const walletRes = await fetch(
        `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/${agencyId}`
      );

      if (!walletRes.ok) {
        console.error("❌ Wallet fetch failed");
        return NextResponse.json({ success: false }, { status: 500 });
      }

      const wallet = await walletRes.json();

      const netAmount = amount - serviceCharge;
      const newBalance = wallet.availableBalance + netAmount;

      /* ------------------ UPDATE WALLET ------------------ */
      const updatePayload = {
        id: wallet.id,
        subAgencyId: wallet.subAgencyId,
        availableBalance: newBalance,
        creditBalance: wallet.creditBalance,
        debitBalance: wallet.debitBalance,
        createdAt: wallet.createdAt,
        updatedAt: new Date().toISOString(),
      };

      await fetch(
        "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ ignored: true });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
