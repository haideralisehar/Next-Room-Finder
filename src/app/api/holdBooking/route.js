import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderAmount, bookingPayload, agencyName, searchId } = body;

    const cookieStore = cookies();
    const agencyId = cookieStore.get("agencyId")?.value;

    if (!agencyId) {
      return Response.json(
        { success: false, message: "Login to proceed!" },
        { status: 401 }
      );
    }

    /* -------------------- 1. CREATE TRANSACTION ONLY -------------------- */
    const transactionPayload = {
      agencyId,
      agencyName,
      searchId,
      bookingRef: bookingPayload?.clientReference || null,
      type: "DEBIT",
      amount: orderAmount,
      reason: "Hotel Booking",
    };

    const txnRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTrans/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionPayload),
      }
    );

    if (!txnRes.ok) {
      return Response.json(
        { success: false, message: "Failed to create transaction." },
        { status: 500 }
      );
    }

    const transaction = await txnRes.json();

    /* -------------------- 2. ATTACH transaction.id TO bookingMeta -------------------- */
    const updatedBookingPayload = {
      ...bookingPayload,
      bookingMeta: {
        ...(bookingPayload.bookingMeta || {}),
        transactionId: transaction.id,
        paymentMethod: "WALLET",
      },
    };

    /* -------------------- 3. CONFIRM BOOKING -------------------- */
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;

    const bookingRes = await fetch(`${baseUrl}/api/bookingConfirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBookingPayload),
    });

    const booking = await bookingRes.json();

    if (booking?.Error) {
      return Response.json({
        success: false,
        message: booking?.Error?.Message,
        booking,
      });
    }

    return Response.json({
      success: true,
      message: "Booking confirmed successfully!",
      booking,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error("Wallet Transaction Error:", error);
    return Response.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
