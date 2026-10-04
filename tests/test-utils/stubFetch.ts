type FetchCall = [url: string, init?: RequestInit];

type FetchFn = (...args: FetchCall) => Promise<unknown>;

export type FetchMock = ReturnType<typeof vi.fn<FetchFn>>;

export const API_URL = import.meta.env.VITE_API_URL;

export const JSON_HEADERS = { 'Content-Type': 'application/json' };

function stubFetch(ok: boolean, status: number, body: unknown): FetchMock {
  const fetchMock = vi.fn<FetchFn>(() =>
    Promise.resolve({
      ok,
      status,
      statusText: '',
      json: () => Promise.resolve(body)
    })
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export function stubFetchOk(body: unknown): FetchMock {
  return stubFetch(true, 200, body);
}

export function stubFetchError(status: number, body: unknown): FetchMock {
  return stubFetch(false, status, body);
}

export function lastRequest(fetchMock: FetchMock): {
  url: string;
  init?: RequestInit;
} {
  const [url, init] = fetchMock.mock.lastCall as FetchCall;
  return { url: decodeURIComponent(url), init };
}
