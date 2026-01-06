import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;


  const isPublicPath = path === "/login" || path.startsWith("/public") || path.startsWith("/api/auth");

  if (path.startsWith("/_next") || path.includes("favicon.ico")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value || "";

  let isValidToken = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jwtVerify(token, secret);
      isValidToken = true;
    } catch (error) {
      isValidToken = false;
    }
  }

  
  if (isPublicPath && isValidToken && path === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !isValidToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/jobs/:path*",
    "/settings/:path*",
    "/reports/:path*",
    
  ],
};