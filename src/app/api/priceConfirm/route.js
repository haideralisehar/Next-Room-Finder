import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const body = await request.json();

    // Get agencyId from cookies
  const agencyId = cookies().get("agencyId")?.value || "undefined";
  console.log("Cookie agencyId:", agencyId);

  // Add agencyId to request body to get Markuped and Discounted prices
  const requestBody = {
    ...body
  };

    const apiUrl =
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/PriceConfirm/confirm";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "API error", error: error.message },
      { status: 500 }
    );
  }
}



//   try {
//     setLoading(true);

//     const body = {
//       AgencyId: "",
//       PreBook: true,
//       CheckInDate: "2025-12-06",
//       CheckOutDate: "2025-12-07",
//       NumOfRooms: 1,
//       HotelID: 263741,
//       OccupancyDetails: [
//         {
//           AdultCount: 2,
//           ChildCount: 0,
//           RoomNum: 1,
//           ChildAgeDetails: []
//         }
//       ],
//       Currency: "USD",
//       Nationality: "PK",
//       RatePlanID: "-1938627403566343839",
//       IsNeedOnRequest: false,
//       Metadata:
//         "bsRSDNMUAykXp/8Pt+jXj8Tqz+tbeV92v63FxPIwDiRWz9wVypJ5BpLRodaEo+NXZKNG8+q22c8xdBEl0lpUq6sH3tpqH3pZf8RRi94tXI0="
//     };

//     const res = await fetch("/api/priceConfirm", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(body)
//     });

//     // If response is not 200
//     if (!res.ok) {
//       alert("API Error: Something went wrong!");
//       return;
//     }

//     const data = await res.json();

//     // If backend returned success: false
//     if (!data.success) {
//       alert(`Error: ${data.error || "Unknown error"}`);
//       return;
//     }

//     // 200 OK → Route to next page
//     router.push("/booking-success"); // change to your page
//   } catch (err) {
//     console.error(err);
//     alert("Network error! Please try again.");
//   } finally {
//     setLoading(false);
//   }

