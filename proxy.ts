import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, readSessionToken } from "@/lib/auth";

/*
 * Keeps the dashboard behind sign-in: any /admin page without a valid session cookie is sent to
 * /admin/login, and writers can't open admin-only pages (/admin/users).
 * This only checks the cookie's signature; every page and server action re-checks the account in
 * the database (lib/session.ts), so it's the first line, not the only one.
 */
const ADMIN_ONLY = ["/admin/users"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const session = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const onLogin = pathname === "/admin/login";

  if (!session && !onLogin) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (session && onLogin) return NextResponse.redirect(new URL("/admin", request.url));
  if (session && session.role !== "ADMIN" && ADMIN_ONLY.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.redirect(new URL("/admin?denied=1", request.url));
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow"); // keep the dashboard out of search engines
  res.headers.set("Cache-Control", "no-store"); // never cache dashboard pages in shared caches
  res.headers.set("X-Frame-Options", "DENY"); // can't be framed by another site (clickjacking)
  res.headers.set("Content-Security-Policy", "frame-ancestors 'none'");
  res.headers.set("Referrer-Policy", "same-origin"); // dashboard URLs don't leak to other sites
  res.headers.set("X-Content-Type-Options", "nosniff");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
