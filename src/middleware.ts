import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // 🔒 Allow login only if not authenticated
  if (pathname === "/login") {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 🔒 For all protected paths, validate token
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/accounts")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role;

      // 🛑 Block "User" from accessing /accounts
      if (pathname.startsWith("/accounts") && role === "User") {
        return NextResponse.redirect(new URL("/unauthorized", req.url)); // or /dashboard
      }

      // 🛑 Block "User" from creating products
      if (pathname === "/products/create-product" && role === "User") {
        return NextResponse.redirect(new URL("/unauthorized", req.url)); // or /products
      }

      // ✅ All other authenticated requests go through
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ✅ Public routes go through
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/accounts/:path*",
    "/login",
  ],
};
