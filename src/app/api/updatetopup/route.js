// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function POST(req) {
//   try {
//     const { tap_id } = await req.json();

//     // ✅ MUST await cookies()
//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;

//     if (!tap_id || !token) {
//       return NextResponse.json(
//         { error: "Unauthorized or missing tap_id" },
//         { status: 401 }
//       );
//     }

//     /* 1️⃣ Verify payment */
//     const tapRes = await fetch(
//       `https://api.tap.company/v2/charges/${tap_id}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
//         },
//       }
//     );

//     const payment = await tapRes.json();

//     if (payment?.status !== "CAPTURED") {
//       return NextResponse.json(
//         { error: "Payment not captured" },
//         { status: 400 }
//       );
//     }



//     const agencyId = payment?.metadata?.id_agency;
//     const serviceCharge = Number(payment?.metadata?.serviceCharge || 0);
//     const netAmount = payment.amount - serviceCharge;

//     /* 2️⃣ Get wallet */
//     const walletRes = await fetch(
//       "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/my",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!walletRes.ok) {
//       return NextResponse.json(
//         { error: "Wallet fetch failed" },
//         { status: 500 }
//       );
//     }

//     const wallet = await walletRes.json();

//     /* 🔐 Agency validation */
//     if (wallet.subAgencyId !== agencyId) {
//       return NextResponse.json(
//         { error: "Agency mismatch" },
//         { status: 403 }
//       );
//     }

//     /* 3️⃣ Update wallet */
//     const updatePayload = {
      
//       id: wallet.id,
//       subAgencyId: wallet.subAgencyId,
//       availableBalance: wallet.availableBalance + netAmount,
//       creditBalance: wallet.creditBalance,
//       debitBalance: wallet.debitBalance,
//       createdAt: wallet.createdAt,
//       updatedAt: new Date().toISOString(),
//     };

//     const updateRes = await fetch(
//       "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/update",
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatePayload),
//       }
//     );

//     if (!updateRes.ok) {
//       return NextResponse.json(
//         { error: "Wallet update failed" },
//         { status: 500 }
//       );
//     }

    

//     return NextResponse.json({
//       success: true,
//       message: "Wallet updated successfully",
//     });
//   } catch (err) {
//     console.error("Wallet Processing Error:", err);
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { tap_id } = await req.json();

    // ✅ MUST await cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized or missing tap_id" },
        { status: 401 }
      );
    }


        //if wallet updated then run the below code
    const getRes = await fetch(
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTransactions/by-tapid/${tap_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );

    // const getTransaction = await getRes.json();

    if (!getRes.ok) {
      return NextResponse.json({
        success: false,
        message: "checking failed...", // just for checking purposes
      });
    }

    const getTransaction = await getRes.json();

    // 🔐 CRITICAL: Idempotency protection
    if (getTransaction.walletStatus === "Completed" || getTransaction.walletStatus === "Processing") {
      return NextResponse.json({
        success: true,
        message: "Transaction already processed",
      });
    }

    /* 1️⃣ Verify payment */
    const tapRes = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
      },
    });

    const payment = await tapRes.json();

    if (payment?.status !== "CAPTURED") {
      return NextResponse.json(
        { error: "Payment not captured" },
        { status: 400 }
      );
    }

    const t_ids = getTransaction?.id;

    const updatedWalletStatus = {
      subAgencyId: getTransaction?.subAgencyId,
      transactionDate: new Date().toISOString(),
      transactionType: getTransaction?.transactionType,
      transactionSubType: getTransaction?.transactionSubType,
      amount: getTransaction?.amount,
      topupAmount: getTransaction?.topupAmount,
      tapId: getTransaction?.tapId,
      walletStatus: "Processing",
      paymentMode: getTransaction?.paymentMode,
      documentNumbers: getTransaction?.documentNumbers,
      description: getTransaction?.description,
    };

    const updatedStatus = await fetch(
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTransactions/${t_ids}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedWalletStatus),
      }
    );

    if(!updatedStatus.ok){
      return NextResponse.json({
      success: true,
      message: "Wallet Processed.",
    });
    }






    const agencyId = payment?.metadata?.id_agency;
    const serviceCharge = Number(payment?.metadata?.serviceCharge || 0);
    const netAmount = payment.amount - serviceCharge;

    /* 2️⃣ Get wallet */
    const walletRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/my",
      {
        headers: {
          "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        },
      }
    );

    if (!walletRes.ok) {
      return NextResponse.json(
        { error: "Wallet fetch failed" },
        { status: 500 }
      );
    }

    const wallet = await walletRes.json();

    /* 🔐 Agency validation */
    if (wallet.subAgencyId !== agencyId) {
      return NextResponse.json({ error: "Agency mismatch" }, { status: 403 });
    }

    

    /* 3️⃣ Update wallet */
    const updatePayload = {
      id: wallet.id,
      subAgencyId: wallet.subAgencyId,
      availableBalance: wallet.availableBalance + netAmount,
      creditBalance: wallet.creditBalance,
      debitBalance: wallet.debitBalance,
      createdAt: wallet.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const updateRes = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Wallet/update",
      {
        method: "PUT",
        headers: {
         "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload),
      }
    );

    if (!updateRes.ok) {
      return NextResponse.json(
        { error: "Wallet update failed" },
        { status: 500 }
      );
    }


    //update user wallet status
    const t_id = getTransaction?.id;

    const updateWalletStatus = {
      subAgencyId: getTransaction?.subAgencyId,
      transactionDate: new Date().toISOString(),
      transactionType: getTransaction?.transactionType,
      transactionSubType: getTransaction?.transactionSubType,
      amount: getTransaction?.amount,
      topupAmount: getTransaction?.topupAmount,
      tapId: getTransaction?.tapId,
      walletStatus: "Completed",
      paymentMode: getTransaction?.paymentMode,
      documentNumbers: getTransaction?.documentNumbers,
      description: getTransaction?.description,
    };

    const updateStatus = await fetch(
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTransactions/${t_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateWalletStatus),
      }
    );

    if(!updateStatus.ok){
      return NextResponse.json({
      success: true,
      message: "Wallet updated successfully but status not",
    });
    }



    return NextResponse.json({
      success: true,
      message: "Wallet updated successfully",
    });
  } catch (err) {
    console.error("Wallet Processing Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
