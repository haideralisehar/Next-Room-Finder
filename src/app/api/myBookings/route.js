// app/api/myBookings/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get("agencyId");
    const hold = searchParams.get("paymentstatus");
    const cookies = req.cookies;

    
    const token = cookies.get("token")?.value;
    

    if (!agencyId) {
      return NextResponse.json(
        { success: false, message: "agencyId is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/dida/booking/by-agency/${agencyId}/payment-status/${hold}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (json.status === 401) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 500 }
      );
    }

    if (!json.success) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch bookings" },
        { status: 500 }
      );
    }

    // 🔹 Normalize data for frontend table
    const formatted = json.data.map((item) => ({
      data: item,
      id: item.bookingID,
      paymentstatus: item.paymentStatus,

      leader:
  (
    item.fullResponse?.Success?.BookingDetails?.GuestList?.[0]
      ?.GuestInfo?.[0]?.Name?.First &&
    item.fullResponse?.Success?.BookingDetails?.GuestList?.[0]
      ?.GuestInfo?.[0]?.Name?.Last
  )
    ? `${item.fullResponse.Success.BookingDetails.GuestList[0].GuestInfo[0].Name.First}
       ${item.fullResponse.Success.BookingDetails.GuestList[0].GuestInfo[0].Name.Last}`
    : "Not Available",

      status:
        item.status === "2"
          ? "Confirmed"
          : item.status === "1"
          ? "Pending"
          : item.status === "CANCELLED" ? "CANCELLED" : item.status === "FAILED" ? "FAILED" : "" ,
      agencys: item.agencyId,

      getstatus: item.status,
      finalPrice: item?.extraInfo?.finalPrice,
      service: "Hotel",
      agencyName: item?.extraInfo?.data?.agencyName,
      cancelationDate:item?.fullResponse?.Success?.BookingDetails?.Hotel?.CancellationPolicyList?.[0]?.FromDate ,
      TotalPrice: item?.fullResponse?.Success?.BookingDetails?.TotalPrice,
      date: item.bookingDate?.split("T")[0],
    }));

    

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
