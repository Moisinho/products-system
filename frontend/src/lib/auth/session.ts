import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/env";
import { isExpired, readClaims } from "./jwt";
import type { SessionUser } from "@/types/auth";

/** Lee el usuario autenticado desde la cookie en Server Components. */
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const claims = readClaims(token);
  if (!claims || isExpired(claims)) return null;

  return {
    email: claims.email ?? "",
    nombre: claims.nombre ?? "Usuario",
  };
}
