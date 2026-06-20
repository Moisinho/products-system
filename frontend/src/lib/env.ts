/**
 * Acceso centralizado a variables de entorno.
 *
 * - INTERNAL_API_URL: solo servidor. URL del backend .NET alcanzable desde el
 *   contenedor de Next (en Docker: http://backend:8080; en local: http://localhost:5080).
 *   Las Route Handlers (BFF) la usan para reenviar peticiones server-to-server.
 *   El navegador NUNCA la ve.
 */
export const serverEnv = {
  internalApiUrl:
    process.env.INTERNAL_API_URL?.replace(/\/$/, "") ?? "http://localhost:5080",
};

/** Nombre de la cookie httpOnly que guarda el JWT. */
export const AUTH_COOKIE = "pm_token";
