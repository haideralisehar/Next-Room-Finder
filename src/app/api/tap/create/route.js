import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { studentId, logId, amount, customer } = await req.json();

    const payment = {
      amount: parseFloat(amount),
      currency:"USD",
      description: "Student Fees",
      customer: {
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: {
          country_code: "IN",
          number: customer.phone,
        },
      },
      source: { id: "src_all" },
      redirect: {
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/api/tap/callback?studentId=${studentId}&logId=${logId}`,
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

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ url: data.transaction.url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
