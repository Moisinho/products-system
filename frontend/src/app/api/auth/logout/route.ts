import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth/cookies";

export async function POST() {
  const out = NextResponse.json({ ok: true });
  out.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return out;
}
