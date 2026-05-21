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
    const statusMessage = `API error: ${response.status}${
      response.statusText ? ` ${response.statusText}` : ''
    }`;

    let message = statusMessage;

    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        message = `(${statusMessage}) ${errorBody.message}`;
      }
    } catch {
      // intentionally ignored: non-json error body
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}
