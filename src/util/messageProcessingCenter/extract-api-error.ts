import { HttpErrorResponse } from "@angular/common/http";

/**
 * Saca el texto de error más útil que traiga la respuesta del backend, y si no
 * hay ninguno devuelve el `fallback` recibido.
 */
export function extractApiError(
  err: unknown,
  fallback = "Error de conexión con el servidor",
): string {
  if (!(err instanceof HttpErrorResponse)) {
    return fallback;
  }
  const body = err.error;
  if (!body) return fallback;

  if (typeof body.message === "object" && body.message !== null) {
    return Object.values(body.message as Record<string, string>).join(", ");
  }
  if (typeof body.message === "string") return body.message;
  if (typeof body.error === "string" && body.error !== "Bad Request") {
    return body.error;
  }
  if (typeof body === "string") return body;
  return fallback;
}
