import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getRedirectTarget,
  getSessionCookieOptions,
  hasConfiguredAccessKey,
  isValidAccessKey,
} from "@/lib/auth";

function redirectToLogin(
  request: NextRequest,
  reason: "config" | "invalid",
  next?: FormDataEntryValue | string | null,
) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", reason);

  const redirectTarget = getRedirectTarget(next);
  if (redirectTarget !== "/dashboard") {
    url.searchParams.set("next", redirectTarget);
  }

  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: NextRequest) {
  if (!hasConfiguredAccessKey()) {
    return redirectToLogin(request, "config");
  }

  const formData = await request.formData();
  const secretKey = String(formData.get("secretKey") ?? "");
  const next = formData.get("next");

  if (!isValidAccessKey(secretKey)) {
    return redirectToLogin(request, "invalid", next);
  }

  const redirectTarget = getRedirectTarget(next);
  const response = NextResponse.redirect(new URL(redirectTarget, request.url), {
    status: 303,
  });

  response.cookies.set(
    AUTH_COOKIE_NAME,
    createSessionToken(),
    getSessionCookieOptions(),
  );

  return response;
}
