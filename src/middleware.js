import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const userId = req.cookies.get("userId")?.value;
  const url = req.nextUrl.clone();
  const userAgent = req.headers.get("user-agent") || "";

  const isLoggedIn = token && userId;
  const isLoginPage = url.pathname.startsWith("/authentication/login");
  const isMobileWallet = url.pathname.startsWith("/mobilewallet");

  // Detect if device is mobile using user-agent
  // const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
  //   userAgent
  // );

  const isProtectedRoute =
    url.pathname.startsWith("/profile") ||
    url.pathname.startsWith("/dsr") ||
    url.pathname.startsWith("/bookingPage");

  // ✅ Case 0: Inconsistent cookie state
  if ((token && !userId) || (!token && userId)) {
    const response = NextResponse.redirect(new URL("/authentication/login", req.url));
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    response.cookies.set("userId", "", { maxAge: 0, path: "/" });
    return response;
  }

  // ✅ Case 1: Accessing mobile wallet route
  if (url.pathname.startsWith("/mobilewallet")) {
    // Not logged in → redirect to login
    if (!isLoggedIn) {
      const response = NextResponse.redirect(new URL("/authentication/login", req.url));
      response.cookies.set("token", "", { maxAge: 0, path: "/" });
      response.cookies.set("userId", "", { maxAge: 0, path: "/" });
      return response;
    }

    // // Logged in but not on mobile → redirect to homepage
    // if (isLoggedIn && !isMobile) {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }

    // Logged in and on mobile → allow access
    return NextResponse.next();
  }

  // ✅ Case 2: Not logged in and trying to access protected route
  if (!isLoggedIn && isProtectedRoute) {
    const response = NextResponse.redirect(new URL("/authentication/login", req.url));
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    response.cookies.set("userId", "", { maxAge: 0, path: "/" });
    return response;
  }

  // ✅ Case 3: Logged in but visiting login page → redirect to home
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Case 4: User deletes one cookie while browsing unprotected route
  if (!isLoggedIn && !isProtectedRoute && (token || userId)) {
    const response = NextResponse.next();
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    response.cookies.set("userId", "", { maxAge: 0, path: "/" });
    
  }

  // ✅ Default: allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/authentication/login",
    "/dsr",
    "/bookingPage",
    "/mobilewallet",
    "/((?!_next|favicon.ico).*)",
  ],
};
