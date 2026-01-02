import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tap_id = searchParams.get("tap_id");

    if (!tap_id) {
      return NextResponse.json({ error: "Missing tap_id" }, { status: 400 });
    }

    // const cookieStore = cookies();
    // const agencyId = cookieStore.get("agencyId")?.value;

    // if (!agencyId) {
    //   return Response.json(
    //     { success: false, message: "Login to proceed!" },
    //     { status: 401 }
    //   );
    // }

    // Fetch payment status from Tap
    const res = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const payment = await res.json();
    console.log("Tap Payment Response:", payment);

    const paymentStatus = payment?.status;

    const agencyId = payment?.metadata?.id_agency;

    // ✅ PAYMENT SUCCESS
    if (paymentStatus === "CAPTURED") {
      console.log("Payment SUCCESS ✔ Wallet Topup");

      // const paymentString = encodeURIComponent(JSON.stringify(payment));

      try {
        /* -------------------- 1. GET WALLET -------------------- */
        const walletRes = await fetch(
          `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/${agencyId}`
        );

        if (!walletRes.ok) {
          return Response.json(
            { success: false, message: "Failed to fetch wallet." },
            { status: 500 }
          );
        }

        const wallet = await walletRes.json();

        if (!wallet) {
          return Response.json(
            { success: false, message: "Wallet not found." },
            { status: 404 }
          );
        }

        const oldBalance = wallet.availableBalance;
        const subtractCharge =  payment.amount - Number(payment?.metadata?.serviceCharge);

        const newBalance = oldBalance + subtractCharge;

        /* -------------------- 2. UPDATE WALLET -------------------- */
        const updateWalletPayload = {
          id: wallet.id,
          subAgencyId: wallet.subAgencyId,
          availableBalance: newBalance,
          creditBalance: wallet.creditBalance,
          debitBalance: wallet.debitBalance,
          createdAt: wallet.createdAt,
          updatedAt: new Date().toISOString(),
        };

        const updateWalletRes = await fetch(
          "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/update",
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateWalletPayload),
          }
        );

        if (!updateWalletRes.ok) {
          return Response.json(
            { success: false, message: "Wallet update failed." },
            { status: 500 }
          );
        }

        // return Response.json({
        //   success: true,
        //   message: "Wallet updated successfully.",
        //   oldBalance,
        //   newBalance,
        // });

        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/success`
        );
      } catch (error) {
        console.error("Wallet Error:", error);
        return Response.json(
          { success: false, message: "Server error." },
          { status: 500 }
        );
      }
    }

    // ❌ PAYMENT FAILED / CANCELED
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`
    );
  } catch (error) {
    console.error("Tap Callback Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
