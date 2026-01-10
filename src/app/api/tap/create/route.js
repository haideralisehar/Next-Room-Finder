// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { studentId, logId, amount, customer, metadata  } = await req.json();

//     const payment = {
//       amount: parseFloat(amount),
//       currency: "BHD",
//       threeDSecure: true,
//       save_card: false,
//       description: "Hotel",
//       customer: {
//         first_name: customer.firstName,
//         last_name: customer.lastName,
//         email: customer.email,
//         phone: {
//           country_code: customer.country_Code, // ✔ FIXED (INDIA numeric code)
//           number: customer.phone,
//         },
//       },
//       metadata: {
//         referenceNo: metadata?.booking_reference,
//       },

//       receipt: {
//         email: true,
//         sms: true,
//       },

//       reference: {
//         transaction: "ref" + Date.now() + Math.floor(Math.random() * 1000000),
//         order: "ord" + Date.now() + Math.floor(Math.random() * 100),
//         invoice: "inv" + Date.now() + Math.floor(Math.random() * 1000000)
//       },
//       retry_for_captured: true,
//       source: { id: "src_all" },

//       post: {
//         url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/tap/webhook`,
//       },

//       redirect: {
//         url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/tap/callback?studentId=${studentId}&logId=${logId}`,
//       },
//     };

//     const response = await fetch("https://api.tap.company/v2/charges", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payment),
//     });

//     const data = await response.json();

//     // console.log(data.reference?.transaction);

//     // Handle Tap errors
//     if (!response.ok) {
//       return NextResponse.json(
//         { error: data, message: "Tap API Error" },
//         { status: response.status }
//       );
//     }

//     // Protect against undefined data.transaction
//     if (!data.transaction || !data.transaction.url) {
//       return NextResponse.json(
//         { error: "Invalid Tap response", raw: data },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ url: data.transaction.url });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error.message, type: "Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { amount, metadata, customer  } = await req.json();
     const baseAmount = Number(amount);
  const SERVICE_PERCENT = 1; // 1%

  const serviceCharge = (baseAmount * SERVICE_PERCENT) / 100;
  const finalAmount = baseAmount + serviceCharge;

  // optional rounding
  const roundedFinalAmount = Number(finalAmount.toFixed(2));

    const payment = {
      amount: parseFloat(finalAmount),
      currency: "BHD",
      threeDSecure: true,
      save_card: false,
      description: "Hotel",
      customer: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: {
          country_code: customer.country_Code, // ✔ FIXED (INDIA numeric code)
          number: customer.phone,
        },
      },
      metadata: {
        date: metadata?.created_at,
        id_agency: metadata?.ag_id,
        serviceCharge : serviceCharge
      },

      receipt: {
        email: true,
        sms: true,
      },

      reference: {
        transaction: "ref" + Date.now() + Math.floor(Math.random() * 1000000),
        order: "ord" + Date.now() + Math.floor(Math.random() * 100),
        invoice: "inv" + Date.now() + Math.floor(Math.random() * 1000000)
      },
      retry_for_captured: true,
      source: { id: "src_all" },

      post: {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/tap/webhook`,
      },
        
      redirect: {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/tap/callback`,
      },
    };

    const response = await fetch("https://api.tap.company/v2/charges", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TAP_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payment),
    });

    const data = await response.json();

    // console.log(data.reference?.transaction);

    // Handle Tap errors
    if (!response.ok) {
      return NextResponse.json(
        { error: data, message: "Tap API Error" },
        { status: response.status }
      );
    }

    // Protect against undefined data.transaction
    if (!data.transaction || !data.transaction.url) {
      return NextResponse.json(
        { error: "Invalid Tap response", raw: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.transaction.url });
  } catch (error) {
    return NextResponse.json(
      { error: error.message, type: "Server Error" },
      { status: 500 }
    );
  }
}

