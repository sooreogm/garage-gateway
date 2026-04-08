import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "garage_gateway_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12;
const DEFAULT_REDIRECT_PATH = "/dashboard";

function getAccessKey(): string {
  return process.env.GARAGE_GATEWAY_ACCESS_KEY?.trim() ?? "";
}

function secureCompare(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value: string): string {
  return createHmac("sha256", getAccessKey()).update(value).digest("hex");
}

export function hasConfiguredAccessKey(): boolean {
  return getAccessKey().length > 0;
}

export function isValidAccessKey(candidate: string): boolean {
  const configuredKey = getAccessKey();
  if (!configuredKey || !candidate) {
    return false;
  }

  return secureCompare(candidate, configuredKey);
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifySessionToken(token: string | null | undefined): boolean {
  if (!hasConfiguredAccessKey() || !token) {
    return false;
  }

  const [expiresAt, signature, ...rest] = token.split(".");
  if (!expiresAt || !signature || rest.length > 0 || !/^\d+$/.test(expiresAt)) {
    return false;
  }

  if (Number(expiresAt) <= Date.now()) {
    return false;
  }

  return secureCompare(signature, sign(expiresAt));
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function getRedirectTarget(
  nextValue: FormDataEntryValue | string | null | undefined,
): string {
  const value =
    typeof nextValue === "string"
      ? nextValue
      : typeof nextValue?.toString === "function"
        ? nextValue.toString()
        : "";

  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_REDIRECT_PATH;
  }

  if (value.startsWith("/login")) {
    return DEFAULT_REDIRECT_PATH;
  }

  return value;
}
