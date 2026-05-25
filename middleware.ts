import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "qbt_admin";

async function verify(token: string | undefined, secret: string) {
  if (!token || !secret) return false;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET ?? "";

  // Skip login page and login API itself
  if (pathname === "/admin/login" || pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await verify(cookie, secret);

  if (!ok) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (pathname.startsWith("/admin")) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
