export interface SessionUser {
  email: string;
  nombre: string;
}

/** Respuesta del backend .NET en login/register. */
export interface BackendAuthResponse {
  token: string;
  expiresAt: string;
  email: string;
  nombre: string;
}
