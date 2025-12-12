import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderAmount, bookingPayload } = body;

    const cookieStore = cookies();
    const agencyId = cookieStore.get("agencyId")?.value;

    if (!agencyId) {
      return Response.json(
        { success: false, message: "Login to proceed!" },
        { status: 400 }
      );
    }

    // 1. Get Wallet
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

    

    // 2. Check balance
    const oldBalance = wallet.availableBalance;

   

    if (oldBalance < orderAmount) {
      return Response.json({
        success: false,
        message: `Insufficient Wallet Balance. Please top up your wallet`
      });
    }

    const newBalance = oldBalance - orderAmount;

    // 3. Update wallet
    const updatePayload = {
      id: wallet.id,
      subAgencyId: wallet.subAgencyId,
      availableBalance: newBalance,
      creditBalance: wallet.creditBalance,
      debitBalance: wallet.debitBalance,
      createdAt: wallet.createdAt,
      updatedAt: new Date().toISOString(),   // ⭐ REQUIRED FIELD
    };

    const updateRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/update",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      }
    );

    if (!updateRes.ok) {
      return Response.json(
        { success: false, message: "Wallet update failed." },
        { status: 500 }
      );
    }

    // 4. Call booking confirm
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;

const bookingRes = await fetch(`${baseUrl}/api/bookingConfirm`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bookingPayload),
});

    const booking = await bookingRes.json();
    if(booking?.Error){
        return Response.json({
            success: true,
            message: booking?.Error?.Message,
            booking,
          });

    }


    return Response.json({
      success: true,
      message: "Payment deducted & booking confirmed!",
      booking,
    });

  } catch (error) {
    console.error("Wallet Deduct Error:", error);
    return Response.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
