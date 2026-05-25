import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "qbt_admin";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET env var must be set to at least 16 chars. Add it to .env.local."
    );
  }
  return new TextEncoder().encode(secret);
}

export function getPasscode() {
  return process.env.PASSCODE ?? "524862";
}

export async function signSession() {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(getSecret());
  return token;
}

export async function verifySession(token: string | undefined | null) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function isAuthenticated() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  return verifySession(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
