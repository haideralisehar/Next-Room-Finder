// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { userName, password } = await req.json();

//     const response = await fetch(
//       "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Auth/login",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userName, password }),
//       }
//     );

//     // Try parsing response safely
//     const data = await response.json().catch(() => ({}));

//     // 🟥 Handle invalid credentials or backend 400/401 errors a
//     if (!response.ok) {
//       const errorMessage =
//         data.message;
//       return NextResponse.json({ error: errorMessage }, { status: 401 });
//     }

//     // ✅ Extract userId and token from API response
//     const userId = data.user?.id;
//     const token = data.token;
//     const agId = data.user?.agencyId;

    

//     if (!userId || !token) {
//       return NextResponse.json(
//         { error: "Invalid response from server." },
//         { status: 500 }
//       );
//     }

//     // ✅ Prepare success response
//     const res = NextResponse.json({
//       success: true,
//       userId,
//       token,
//     });

//     // ✅ Set secure cookies
//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24, // 1 day
//     });

//     res.cookies.set("userId", userId, {
//       httpOnly: false,
//       secure: true,
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24,
//     });

//     res.cookies.set("agencyId", agId,{
//       httpOnly: false,
//       secure: true,
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24,

//     });

//     console.log("✅ Login successful, cookies set");
//     return res;
//   } catch (error) {
//     console.error("❌ Login error:", error);
//     return NextResponse.json(
//       { error: "Server connection failed. Please try again later." },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userName, password } = await req.json();

    const response = await fetch(
      "https://cityinbookingapi20251018160614-fxgqdkc6d4hwgjf8.canadacentral-01.azurewebsites.net/api/Auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
        
      }
    );

    const data = await response.json().catch(() => ({}));

    // 🟥 Check if backend returned success = false
    if (!data.success) {
      return NextResponse.json(
        { error: data.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🟩 Extract token & user info
    const userId = data.user?.id;
    const token = data.token;
    const agencyId = data.user?.agencyId;

    if (!userId || !token) {
      return NextResponse.json(
        { error: "Invalid server response." },
        { status: 500 }
      );
    }

    if(data.success){

    // 🟩 Prepare response
    const res = NextResponse.json({
      success: data.success,
      userId,
      token,
      agencyId,
    });

    // 🟩 Set cookies only if success is true
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    res.cookies.set("userId", userId, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    res.cookies.set("agencyId", agencyId, {
      httpOnly: false,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 86400,
    });

    console.log("Cookies set successfully");
    return res;

     }

  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Server connection failed." },
      { status: 500 }
    );
  }
}
