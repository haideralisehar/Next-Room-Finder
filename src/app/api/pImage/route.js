// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const token = request.cookies.get("token")?.value;

//     if (!token) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const formData = await request.formData();

//     const res = await fetch(
//       "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Users/upload-profile-image",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     return NextResponse.json(data, { status: res.status });

//   } catch (err) {
//     return NextResponse.json(
//       { error: "Upload failed", message: err.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const res = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Users/upload-profile-image",
      {
        method: "POST",
        body: formData, // forward file as-is
      }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    return NextResponse.json(
      { error: "Upload failed", message: err.message },
      { status: 500 }
    );
  }
}
