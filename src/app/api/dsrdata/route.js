import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();

    const agencyId = cookieStore.get("agencyId")?.value;
    const token = cookieStore.get("token")?.value; // optional

    if (!agencyId) {
      return NextResponse.json(
        { success: false, message: "AgencyId not found in cookies" },
        { status: 401 }
      );
    }

    const res = await fetch(
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/WalletTrans/agency/${agencyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        cache: "no-store"
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch wallet transactions",
          error: text
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    // 🔁 Normalize data for UI
    const formatted = data.map((item) => ({
      id: item.id,
      agency: item.agencyName,
      status: item.status,
      bookingRef: item.bookingRef,
      price: item.amount,
      // searchId: item.searchId,
      bookingDate: item.createdAt,
      type: item.type,
      reason: item.reason,
      balanceBefore: item.balanceBefore,
      balanceAfter: item.balanceAfter
    }));

    return NextResponse.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    console.error("DSR API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error"
      },
      { status: 500 }
    );
  }
}
