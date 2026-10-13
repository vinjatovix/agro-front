import { describe, it, expect, vi } from 'vitest';
import { apiFetch } from '../../src/services/api';
import { ApiError } from '../../src/shared/errors/ApiError';
import { NetworkError } from '../../src/shared/errors/NetworkError';

type MockFetchResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  contentType: string | null;
  json: () => Promise<unknown>;
};

function createFetchMock(response: Partial<MockFetchResponse>) {
  const contentType =
    response.contentType === undefined
      ? 'application/json; charset=utf-8'
      : response.contentType;
  return vi.fn(() =>
    Promise.resolve({
      ok: response.ok ?? true,
      status: response.status ?? 200,
      statusText: response.statusText ?? '',
      headers: new Headers(
        contentType === null ? {} : { 'content-type': contentType }
      ),
      json: response.json ?? (() => Promise.resolve({}))
    })
  );
}

function stubFetchRejection(reason: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(reason))
  );
}

async function captureError(promise: Promise<unknown>) {
  return promise.catch((caughtError: unknown) => caughtError);
}

describe('apiFetch', () => {
  it('returns data on success', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        ok: true,
        json: () => Promise.resolve({ ok: true })
      })
    );

    const result = await apiFetch('/test');

    expect(result).toEqual({ ok: true });
  });

  it('throws ApiError with json message and errors', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () =>
          Promise.resolve({
            message: 'Invalid input',
            errors: { name: 'required' }
          })
      })
    );

    const error = await captureError(apiFetch('/test'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      message: 'Invalid input',
      status: 400,
      errors: { name: 'required' }
    });
  });

  it('handles a json error response whose body cannot be parsed', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: () => Promise.reject(new SyntaxError('fail'))
      })
    );

    const error = await captureError(apiFetch('/test'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      message: 'API error: 500 Server Error',
      status: 500
    });
  });

  it('does not read an html error body and keeps the status', async () => {
    const json = vi.fn(() => Promise.resolve({ message: 'ignored' }));
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        ok: false,
        status: 502,
        contentType: 'text/html',
        json
      })
    );

    const error = await captureError(apiFetch('/test'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: 'API error: 502', status: 502 });
    expect(json).not.toHaveBeenCalled();
  });

  it('keeps the status of an error response without body or content-type', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({ ok: false, status: 503, contentType: null })
    );

    const error = await captureError(apiFetch('/test'));
    expect(error).toMatchObject({ message: 'API error: 503', status: 503 });
  });

  it('throws ApiError with status 401', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' })
      })
    );

    const error = await captureError(apiFetch('/test'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 401 });
  });

  it('rethrows the same AbortError when the request is cancelled', async () => {
    const abortError = new DOMException('x', 'AbortError');
    stubFetchRejection(abortError);

    const error = await captureError(apiFetch('/test'));
    expect(error).toBe(abortError);
  });

  it('throws a NetworkError keeping the original cause when fetch rejects', async () => {
    const cause = new TypeError('Failed to fetch');
    stubFetchRejection(cause);

    const error = await captureError(apiFetch('/test'));
    expect(error).toBeInstanceOf(NetworkError);
    expect((error as NetworkError).cause).toBe(cause);
  });
});
