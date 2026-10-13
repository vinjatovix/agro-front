import { ApiError } from '../shared/errors/ApiError';
import { NetworkError } from '../shared/errors/NetworkError';

const API_URL = import.meta.env.VITE_API_URL;

type ErrorBody = {
  message?: string;
  errors?: Record<string, string>;
};

function isAbortError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  );
}

function isJsonResponse(response: Response): boolean {
  return (
    response.headers.get('content-type')?.includes('application/json') ?? false
  );
}

async function readErrorBody(response: Response): Promise<ErrorBody> {
  if (!isJsonResponse(response)) return {};
  try {
    const body: unknown = await response.json();
    return typeof body === 'object' && body !== null ? body : {};
  } catch {
    return {};
  }
}

function baseErrorMessage(response: Response): string {
  const statusText = response.statusText ? ` ${response.statusText}` : '';
  return `API error: ${response.status}${statusText}`;
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = await readErrorBody(response);
  return new ApiError(
    body.message || baseErrorMessage(response),
    response.status,
    body.errors
  );
}

async function request(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new NetworkError(error);
  }
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await request(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  return (await response.json()) as T;
}
