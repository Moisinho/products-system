export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function toApiError(res: Response): Promise<ApiError> {
  let message = `Error ${res.status}`;
  let details: unknown;
  try {
    const data = await res.json();
    details = data;
    if (typeof data?.message === "string") message = data.message;
    else if (typeof data?.title === "string") message = data.title;
    else if (data?.errors && typeof data.errors === "object") {
      message = Object.values(data.errors as Record<string, string[]>)
        .flat()
        .join(" ");
    }
  } catch {
    // respuesta sin cuerpo JSON
  }
  return new ApiError(res.status, message, details);
}

/**
 * Wrapper de fetch para el navegador. Siempre apunta a nuestras Route Handlers
 * (mismo origen) con `credentials: include` para enviar la cookie httpOnly.
 */
export async function apiFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
