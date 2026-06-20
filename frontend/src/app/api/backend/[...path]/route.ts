import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth/cookies";
import { serverEnv } from "@/lib/env";

/**
 * BFF proxy: el navegador llama a /api/backend/* (mismo origen, sin CORS) y aquí
 * reenviamos al backend .NET adjuntando el JWT de la cookie httpOnly como Bearer.
 * El token nunca se expone a JavaScript del cliente. Hace passthrough del cuerpo
 * y del Content-Type (incluido application/pdf para el reporte).
 */
async function proxy(req: NextRequest, path: string[]) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const target = `${serverEnv.internalApiUrl}/api/${path.join("/")}${req.nextUrl.search}`;

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  const contentType = req.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  let res: Response;
  try {
    res = await fetch(target, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "No se pudo contactar al servidor." },
      { status: 502 },
    );
  }

  const outHeaders = new Headers();
  const ct = res.headers.get("content-type");
  if (ct) outHeaders.set("content-type", ct);
  const cd = res.headers.get("content-disposition");
  if (cd) outHeaders.set("content-disposition", cd);

  return new NextResponse(res.body, { status: res.status, headers: outHeaders });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}
