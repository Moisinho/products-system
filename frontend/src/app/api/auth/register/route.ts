import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { AUTH_COOKIE, authCookieOptions } from "@/lib/auth/cookies";
import type { BackendAuthResponse } from "@/types/auth";

export async function POST(req: Request) {
  const body = await req.text();

  const res = await fetch(`${serverEnv.internalApiUrl}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const auth = data as BackendAuthResponse;
  const maxAge =
    Math.floor((new Date(auth.expiresAt).getTime() - Date.now()) / 1000) || 3600;

  const out = NextResponse.json({ email: auth.email, nombre: auth.nombre });
  out.cookies.set(AUTH_COOKIE, auth.token, authCookieOptions(Math.max(60, maxAge)));
  return out;
}
