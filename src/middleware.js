// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value;
//   const userId = req.cookies.get("userId")?.value;
//   const url = req.nextUrl.clone();
//   const userAgent = req.headers.get("user-agent") || "";

//   const isLoggedIn = token && userId;
//   const isLoginPage = url.pathname.startsWith("/authentication/login");
//   const isMobileWallet = url.pathname.startsWith("/mobilewallet");

//   // Detect if device is mobile using user-agent
//   // const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
//   //   userAgent
//   // );

//   const isProtectedRoute =
//     url.pathname.startsWith("/profile") ||
//     url.pathname.startsWith("/dsr") ||
//     url.pathname.startsWith("/bookingPage");

//   // ✅ Case 0: Inconsistent cookie state
//   if ((token && !userId) || (!token && userId)) {
//     const response = NextResponse.redirect(new URL("/authentication/login", req.url));
//     response.cookies.set("token", "", { maxAge: 0, path: "/" });
//     response.cookies.set("userId", "", { maxAge: 0, path: "/" });
//     return response;
//   }

//   // ✅ Case 1: Accessing mobile wallet route
//   if (url.pathname.startsWith("/mobilewallet")) {
//     // Not logged in → redirect to login
//     if (!isLoggedIn) {
//       const response = NextResponse.redirect(new URL("/authentication/login", req.url));
//       response.cookies.set("token", "", { maxAge: 0, path: "/" });
//       response.cookies.set("userId", "", { maxAge: 0, path: "/" });
//       return response;
//     }

//     // // Logged in but not on mobile → redirect to homepage
//     // if (isLoggedIn && !isMobile) {
//     //   return NextResponse.redirect(new URL("/", req.url));
//     // }

//     // Logged in and on mobile → allow access
//     return NextResponse.next();
//   }

//   // ✅ Case 2: Not logged in and trying to access protected route
//   if (!isLoggedIn && isProtectedRoute) {
//     const response = NextResponse.redirect(new URL("/authentication/login", req.url));
//     response.cookies.set("token", "", { maxAge: 0, path: "/" });
//     response.cookies.set("userId", "", { maxAge: 0, path: "/" });
//     return response;
//   }

//   // ✅ Case 3: Logged in but visiting login page → redirect to home
//   if (isLoggedIn && isLoginPage) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // ✅ Case 4: User deletes one cookie while browsing unprotected route
//   if (!isLoggedIn && !isProtectedRoute && (token || userId)) {
//     const response = NextResponse.next();
//     response.cookies.set("token", "", { maxAge: 0, path: "/" });
//     response.cookies.set("userId", "", { maxAge: 0, path: "/" });
    
//   }

//   // ✅ Default: allow
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/profile",
//     "/authentication/login",
//     "/dsr",
//     "/bookingPage",
//     "/mobilewallet",
//     "/((?!_next|favicon.ico).*)",
//   ],
// };


// import { NextResponse } from "next/server";

// function decodeJwt(token) {
//   try {
//     const payload = token.split(".")[1];
//     return JSON.parse(Buffer.from(payload, "base64").toString());
//   } catch {
//     return null;
//   }
// }

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value;
//   const url = req.nextUrl.clone();

//   const isLoginPage = url.pathname.startsWith("/authentication/login");

//   const isProtectedRoute =
//     url.pathname.startsWith("/profile") ||
//     url.pathname.startsWith("/dsr") ||
//     url.pathname.startsWith("/bookingPage") ||
//     url.pathname.startsWith("/mobilewallet");

//   // ❌ No token but protected route
//   if (!token && isProtectedRoute) {
//     return clearAndRedirect(req);
//   }

//   if (token) {
//     const decoded = decodeJwt(token);

//     // ❌ Invalid token
//     if (!decoded) {
//       return clearAndRedirect(req);
//     }

//     // ❌ Token expired
//     if (decoded.exp * 1000 < Date.now()) {
//       return clearAndRedirect(req);
//     }

//     // ✅ Logged in user accessing login page
//     if (isLoginPage) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// /* Helpers */

// function clearAndRedirect(req) {
//   const res = NextResponse.redirect(
//     new URL("/authentication/login", req.url)
//   );
//   res.cookies.set("token", "", { maxAge: 0, path: "/" });
//   res.cookies.set("userId", "", { maxAge: 0, path: "/" });
//   res.cookies.set("agencyId", "", { maxAge: 0, path: "/" });

//   return res;
// }

// export const config = {
//   matcher: [
//     "/profile/:path*",
//     "/dsr/:path*",
//     "/bookingPage/:path*",
//     "/mobilewallet/:path*",
//     "/authentication/login",
//   ],
// };


import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  const url = req.nextUrl;

  const isLoginPage = url.pathname.startsWith("/authentication/login");

  const isProtectedRoute =
    url.pathname.startsWith("/profile") ||
    url.pathname.startsWith("/dsr") ||
    url.pathname.startsWith("/bookingPage") ||
    url.pathname.startsWith("/mobilewallet");

  // Not logged in
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(
      new URL("/authentication/login", req.url)
    );
  }

  // Logged in user visiting login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dsr/:path*",
    "/bookingPage/:path*",
    "/mobilewallet/:path*",
    "/authentication/login",
  ],
};
