import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth/cookies";
import { isExpired, readClaims } from "@/lib/auth/jwt";

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const claims = token ? readClaims(token) : null;

  if (!claims || isExpired(claims)) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  return NextResponse.json({
    email: claims.email ?? "",
    nombre: claims.nombre ?? "Usuario",
  });
}
