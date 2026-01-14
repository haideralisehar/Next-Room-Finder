// import { cookies } from "next/headers";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { orderAmount, bookingPayload } = body;

//     const cookieStore = cookies();
//     const agencyId = cookieStore.get("agencyId")?.value;

//     if (!agencyId) {
//       return Response.json(
//         { success: false, message: "Login to proceed!" },
//         { status: 400 }
//       );
//     }

//     // 1. Get Wallet
//     const walletRes = await fetch(
//       `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/${agencyId}`
//     );

//     if (!walletRes.ok) {
//       return Response.json(
//         { success: false, message: "Failed to fetch wallet." },
//         { status: 500 }
//       );
//     }

//     const wallet = await walletRes.json();

//     if (!wallet) {
//       return Response.json(
//         { success: false, message: "Wallet not found." },
//         { status: 404 }
//       );
//     }

//     // 2. Check balance
//     const oldBalance = wallet.availableBalance;

//     if (oldBalance < orderAmount) {
//       return Response.json({
//         success: false,
//         message: `Insufficient Wallet Balance. Please top up your wallet`
//       });
//     }

//     const newBalance = oldBalance - orderAmount;

//     // 3. Update wallet
//     const updatePayload = {
//       id: wallet.id,
//       subAgencyId: wallet.subAgencyId,
//       availableBalance: newBalance,
//       creditBalance: wallet.creditBalance,
//       debitBalance: wallet.debitBalance,
//       createdAt: wallet.createdAt,
//       updatedAt: new Date().toISOString(),   // ⭐ REQUIRED FIELD
//     };

//     const updateRes = await fetch(
//       "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/update",
//       {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatePayload),
//       }
//     );

//     if (!updateRes.ok) {
//       return Response.json(
//         { success: false, message: "Wallet update failed." },
//         { status: 500 }
//       );
//     }

//     // 4. Call booking confirm
//     const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;

// const bookingRes = await fetch(`${baseUrl}/api/bookingConfirm`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(bookingPayload),
// });

//     const booking = await bookingRes.json();
//     if(booking?.Error){
//         return Response.json({
//             success: true,
//             message: booking?.Error?.Message,
//             booking,
//           });

//     }

//     return Response.json({
//       success: true,
//       message: "Payment deducted & booking confirmed!",
//       booking,
//     });

//   } catch (error) {
//     console.error("Wallet Deduct Error:", error);
//     return Response.json(
//       { success: false, message: "Server error." },
//       { status: 500 }
//     );
//   }
// }

import { cookies, headers } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderAmount, bookingPayload, agencyName, searchId } = body;

    const cookieStore = await cookies();   // 🔥 must await
    const agencyId = cookieStore.get("agencyId")?.value;
    const token = cookieStore.get("token")?.value;


    if (!agencyId) {
      return Response.json(
        { success: false, message: "Login to proceed!" },
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

    if (walletRes.status === 401) {
       return Response.json(
        { success: false, message: "Unauthorized! You can't go far." },
        { status: 401 }
      );
    }

    

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

    /* -------------------- 2. CREATE PENDING TRANSACTION -------------------- */
    const transactionPayload = {
      walletId: wallet.id,
      agencyId,
      agencyName: agencyName,
      searchId: searchId,
      bookingRef: bookingPayload?.clientReference || null,
      type: "DEBIT",
      amount: orderAmount,
      balanceBefore: oldBalance,
      balanceAfter: newBalance,
      // status: "PENDING",
      reason: "Hotel Booking",
    };

    const txnRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTrans/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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

    /* -------------------- 3. UPDATE WALLET -------------------- */
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateWalletPayload),
      }
    );

    if (!updateWalletRes.ok) {
      await fetch(
        "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTrans/update-status",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: transaction.id,
            status: "FAILED",
          }),
        }
      );

      return Response.json(
        { success: false, message: "Wallet update failed." },
        { status: 500 }
      );
    }

    /* -------------------- 4. CONFIRM BOOKING -------------------- */
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;

    const updatedBookingPayload = {
      ...bookingPayload,
      bookingMeta: {
        ...(bookingPayload.bookingMeta || {}),
        transactionId: transaction.id,
      },
    };

    const apiUrl =
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/dida/booking/confirm";

    const bookingRes = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(updatedBookingPayload),
    });


    const booking = await bookingRes.json();

    if (booking?.Error) {
      await fetch(
        "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTrans/update-status",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({
            transactionId: transaction.id,
            status: "FAILED",
          }),
        }
      );

      return Response.json({
        success: false,
        message: booking?.Error?.Message,
        booking,
      });
    }

    /* -------------------- 5. COMMIT TRANSACTION -------------------- */
    await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTrans/update-status",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          transactionId: transaction.id,
          status: "Paid",
        }),
      }
    );

    

    return Response.json({
      success: true,
      message: "Payment deducted & booking confirmed!",
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
