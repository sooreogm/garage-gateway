import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  hasConfiguredAccessKey,
  verifySessionToken,
} from "@/lib/auth";

const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/buckets",
  "/keys",
  "/permissions",
  "/tokens",
  "/activity",
  "/settings",
];

function isProtectedPath(pathname: string): boolean {
  if (pathname === "/") {
    return true;
  }

  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAccessKey = hasConfiguredAccessKey();
  const isAuthenticated = verifySessionToken(
    request.cookies.get(AUTH_COOKIE_NAME)?.value,
  );

  if (pathname === "/login") {
    if (hasAccessKey && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!hasAccessKey) {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
