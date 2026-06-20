import { decodeJwt } from "jose";

export interface JwtClaims {
  sub?: string;
  email?: string;
  nombre?: string;
  exp?: number;
}

/**
 * Decodifica el payload del JWT SIN verificar la firma. Es seguro para uso de
 * UI (mostrar nombre, comprobar expiración) porque el token vive en una cookie
 * httpOnly de nuestro propio dominio; la verificación real de la firma la hace
 * el backend .NET en cada petición a la API.
 */
export function readClaims(token: string): JwtClaims | null {
  try {
    return decodeJwt(token) as JwtClaims;
  } catch {
    return null;
  }
}

export function isExpired(claims: JwtClaims | null): boolean {
  if (!claims?.exp) return true;
  return Date.now() >= claims.exp * 1000;
}

export function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  return !isExpired(readClaims(token));
}
