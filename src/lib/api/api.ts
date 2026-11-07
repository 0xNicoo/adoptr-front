import 'server-only';
import { getAccessToken } from "@/lib/auth/session";

export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'

export interface ApiResponse<T> {
  data: T | null;
  headers: {
    totalCount: string | null;
    contentType: string | null;
  };
}

/** `code` cuando la respuesta de error no trae el formato `{ code, message }` del back (proxy, caída, HTML). */
export const UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR';

/**
 * Error de la API. Decidir por `status` y `code`, que son estables según el contrato
 * del back (`docs/arquitectura/api.md`); `message` puede cambiar de redacción.
 * Solo existe del lado servidor: una server action que necesite informar el motivo
 * al cliente debe devolver el `code`, no relanzar el error.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function isErrorBody(value: unknown): value is { code: string; message: string } {
  if (typeof value !== 'object' || value === null) return false;
  const body = value as Record<string, unknown>;
  return typeof body.code === 'string' && typeof body.message === 'string';
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  method: HttpMethod = 'GET',
  body: unknown = null,
  contentType: string = 'application/json',
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {

  let token: string | null = null;

  if (requiresAuth) {
    token = await getAccessToken();
  }

  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    throw new Error('Falta configurar API_URL en el servidor');
  }
  const url = new URL(endpoint, baseUrl);

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (contentType === 'application/json') {
    headers['Content-Type'] = 'application/json';
  }

  const options: RequestInit = { method, headers };

  if (body !== null && body !== undefined) {
    options.body = contentType === 'application/json' ? JSON.stringify(body) : (body as BodyInit);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await res.json();
    } catch {
      // El cuerpo no es JSON: se informa como error desconocido.
    }
    if (isErrorBody(errorBody)) {
      throw new ApiError(res.status, errorBody.code, errorBody.message);
    }
    throw new ApiError(res.status, UNKNOWN_ERROR_CODE, 'Error inesperado al consultar la API');
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? ((await res.json()) as T) : null;

  return {
    data,
    headers: {
      totalCount: res.headers.get('x-total-count'),
      contentType: res.headers.get('content-type'),
    }
  };
}
