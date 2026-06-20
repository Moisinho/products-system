import { AUTH_COOKIE } from "@/lib/env";

export { AUTH_COOKIE };

/** Opciones de la cookie httpOnly que guarda el JWT (XSS-safe). */
export function authCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
