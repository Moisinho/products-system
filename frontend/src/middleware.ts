import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/env";
import { isValidToken } from "@/lib/auth/jwt";

const PUBLIC_ROUTES = ["/login", "/register"];

/**
 * Guardia de rutas (solo UX): si no hay sesión válida redirige a /login.
 * El backend .NET es el guardián real y responde 401 ante cualquier token
 * ausente, manipulado o expirado, sin confiar en este middleware.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const authed = isValidToken(token);
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  if (!authed && !isPublic) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  if (authed && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
