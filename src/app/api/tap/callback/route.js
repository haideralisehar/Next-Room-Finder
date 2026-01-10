// // app/api/tap/callback/route.js
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const tap_id = searchParams.get("tap_id");

//     if (!tap_id) {
//       return NextResponse.json({ error: "Missing tap_id" }, { status: 400 });
//     }

//     const res = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
//       },
//     });

//     const payment = await res.json();

//     if (payment?.status === "CAPTURED") {

//       //--save the tap_id, walletStatus ="pending", Amount

      
      
//       return NextResponse.redirect(
//         `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/success?tap_id=${tap_id}`
//       );
//     }

//     return NextResponse.redirect(
//       `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`
//     );
  
//   } catch (err) {
//     console.error("Tap Callback Error:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }


// app/api/tap/callback/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tap_id = searchParams.get("tap_id");

    if (!tap_id) {
      return NextResponse.json({ error: "Missing tap_id" }, { status: 400 });
    }

    const res = await fetch(`https://api.tap.company/v2/charges/${tap_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
      },
    });

    const payment = await res.json();


    if (payment?.status === "CAPTURED") {
      //--save the tap_id, walletStatus ="pending", Amount

      const agencyId = payment?.metadata?.id_agency;
    const serviceCharge = Number(payment?.metadata?.serviceCharge || 0);
    const netAmount = payment.amount - serviceCharge;

      const walletPayload = {
        subAgencyId: agencyId,
        transactionDate: new Date().toISOString(),
        transactionType: "Payement",
        transactionSubType: "Deposite",
        amount: netAmount,
        topupAmount: netAmount,
        tapId: tap_id,
        walletStatus: "Pending",
        paymentMode: "CreditCard",
        documentNumbers: payment.id,
        description: "Wallet top-up via Tap payment",
      };

      // 3️⃣ Try creating transaction
      try {
        const walletRes = await fetch(
          "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTransactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
            },
            body: JSON.stringify(walletPayload),
          }
        );

        if (!walletRes.ok) {
          console.error("Wallet transaction failed:", await walletRes.text());

          // Payment already captured — do NOT fail the payment
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/success?tap_id=${tap_id}`
          );
        }

        return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/success?tap_id=${tap_id}`
      );


      } catch (e) {
        console.error("Transaction creation failed:", e);

        // ⚠️ Payment captured but wallet transaction NOT created
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/pending?tap_id=${tap_id}`
        );
      }

    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_DOMAIN}/TapPayment/failure`
    );
  } catch (err) {
    console.error("Tap Callback Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
