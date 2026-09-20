import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { routing } from "./i18n/routing";

export default function proxy(request: NextRequest) {
  const localeCookieName =
    typeof routing.localeCookie === "object" && routing.localeCookie
      ? (routing.localeCookie.name ?? "NEXT_LOCALE")
      : "NEXT_LOCALE";
  const legacyMatch = request.nextUrl.pathname.match(/^\/(th|en)(\/.*)?$/);

  if (legacyMatch) {
    const cleanPath = legacyMatch[2] || "/";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = cleanPath;
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set(localeCookieName, legacyMatch[1], {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
    return response;
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/sign-in" &&
    !getSessionCookie(request)
  ) {
    return NextResponse.redirect(new URL("/admin/sign-in", request.url));
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = routing.locales.some((item) => item === cookieLocale)
    ? (cookieLocale as (typeof routing.locales)[number])
    : routing.defaultLocale;
  const headers = new Headers(request.headers);
  headers.set("X-NEXT-INTL-LOCALE", locale);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|opengraph-image|.*\\..*).*)"],
};
