import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  const isAuthPage = path.startsWith("/auth");
  const isProtected = path.startsWith("/admin");

  // 1️⃣ IF LOGGED IN → BLOCK ACCESS TO LOGIN & SIGNUP
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 2️⃣ IF NOT LOGGED IN → BLOCK ACCESS TO ADMIN
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*", // include auth pages so middleware can check logged-in users
  ],
};
