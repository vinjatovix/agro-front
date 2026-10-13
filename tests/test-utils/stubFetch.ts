type FetchCall = [url: string, init?: RequestInit];

type FetchFn = (...args: FetchCall) => Promise<unknown>;

export type FetchMock = ReturnType<typeof vi.fn<FetchFn>>;

export const API_URL = import.meta.env.VITE_API_URL;

export const JSON_HEADERS = { 'Content-Type': 'application/json' };

function fetchResponse(ok: boolean, status: number, body: unknown) {
  return Promise.resolve({
    ok,
    status,
    statusText: '',
    headers: new Headers({ 'content-type': 'application/json' }),
    json: () => Promise.resolve(body)
  });
}

function stubFetch(ok: boolean, status: number, body: unknown): FetchMock {
  const fetchMock = vi.fn<FetchFn>(() => fetchResponse(ok, status, body));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

type StubResponse = {
  readonly ok: boolean;
  readonly status: number;
  readonly body: unknown;
};

export function okResponse(body: unknown): StubResponse {
  return { ok: true, status: 200, body };
}

export function errorResponse(status: number, body: unknown): StubResponse {
  return { ok: false, status, body };
}

export function stubFetchSequence(...responses: StubResponse[]): FetchMock {
  const fetchMock = responses.reduce<FetchMock>(
    (mock, { ok, status, body }) =>
      mock.mockImplementationOnce(() => fetchResponse(ok, status, body)),
    vi.fn<FetchFn>()
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

export function requestUrls(fetchMock: FetchMock): string[] {
  return fetchMock.mock.calls.map(([url]) => decodeURIComponent(url));
}
