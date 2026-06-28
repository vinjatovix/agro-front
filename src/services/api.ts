import { ApiError } from '../shared/errors/ApiError';

const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    const status = response.status;

    const baseMessage = `API error: ${status}${
      response.statusText ? ` ${response.statusText}` : ''
    }`;

    let message = baseMessage;
    let errors: Record<string, string> | undefined;

    try {
      const errorBody: unknown = await response.json();

      if (
        typeof errorBody === 'object' &&
        errorBody !== null &&
        'message' in errorBody
      ) {
        const msg = (errorBody as { message?: string }).message;
        if (msg) message = msg;
      }

      if (
        typeof errorBody === 'object' &&
        errorBody !== null &&
        'errors' in errorBody
      ) {
        errors = (errorBody as { errors?: Record<string, string> }).errors;
      }
    } catch {
      // intentionally ignored: non-json error body
    }

    throw new ApiError(message, status, errors);
  }

  return (await response.json()) as T;
}
