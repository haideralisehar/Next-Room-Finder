import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const cookieStore = cookies();

    const token = cookieStore.get("token")?.value;
    const {
      agencyId,
      orderAmount,
      bookingID,
      agencyname,
      searchId,
      BookingID,
    } = body;

    if (!agencyId && !token) {
      return Response.json(
        { success: false, message: "Login required" },
        { status: 401 }
      );
    }

    /* -------------------- 1. GET WALLET -------------------- */
    const walletRes = await fetch(
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/my`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
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

    if (oldBalance < orderAmount) {
      return Response.json({
        success: false,
        message: "Insufficient Wallet Balance. Please top up your wallet.",
      });
    }

    const newBalance = oldBalance - orderAmount;

    /* -------------------- 1. CREATE TRANSACTION ONLY -------------------- */
    const transactionPayload = {
      walletId: wallet.id,
      balanceBefore: oldBalance,
      balanceAfter: newBalance,
      agencyId: agencyId,
      agencyName: agencyname,
      searchId,
      bookingRef: BookingID || null,
      type: "DEBIT",
      amount: orderAmount,
      reason: "Hotel Booking",
    };

    const txnRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTrans/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json",
           "Authorization": `Bearer ${token}` },
        body: JSON.stringify(transactionPayload),
      }
    );

    if (!txnRes.ok) {
      return Response.json(
        {
          success: false,
          message: "Failed to create transaction.",
          datas: transactionPayload,
        },
        { status: 500 }
      );
    }

    const transaction = await txnRes.json();

    /* ---------- 2. UPDATE WALLET ---------- */
    const updateWalletPayload = {
      id: wallet.id,
      subAgencyId: wallet.subAgencyId,
      availableBalance: newBalance,
      creditBalance: wallet.creditBalance,
      debitBalance: wallet.debitBalance,
      createdAt: wallet.createdAt,
    };

    const updateWalletRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/update",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateWalletPayload),
      }
    );

    if (!updateWalletRes.ok) {
      const err = await updateWalletRes.text();
      console.error("Wallet Update Error:", err);

      return Response.json(
        { success: false, message: `${wallet.id}Wallet update failed` },
        { status: 500 }
      );
    }

    /* ---------- 4. UPDATE TRANSACTION ---------- */
    const transUpdate = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTrans/update-status",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json",

          "Authorization": `Bearer ${token}`
         },
        body: JSON.stringify({
          transactionId: transaction.id,
          status: "paid",
        }),
      }
    );

    if (!transUpdate.ok) {
      return Response.json(
        {
          success: false,
          message: "Transaction updated failed",
        },
        { status: 500 }
      );
    }

    /* ---------- 3. UPDATE PAYMENT STATUS ---------- */
    const paymentRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/dida/booking/payment-status",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          bookingID,
          paymentStatus: "paid",
        }),
      }
    );

    if (!paymentRes.ok) {
      return Response.json(
        { success: false, message: "Payment status update failed" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Booking issued successfully!",
    });
  } catch (error) {
    console.error("Payment Error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
