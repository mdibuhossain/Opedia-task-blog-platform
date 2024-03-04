import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/signup";
  const token = request.cookies?.get("jwt")?.value;
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/blog/new"],
};
