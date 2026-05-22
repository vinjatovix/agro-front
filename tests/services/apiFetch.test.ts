import { describe, it, expect, vi } from 'vitest';
import { apiFetch } from '../../src/services/api';
import { ApiError } from '../../src/shared/errors/ApiError';

type MockFetchResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<unknown>;
};

function createFetchMock(response: Partial<MockFetchResponse>) {
  return vi.fn(() =>
    Promise.resolve({
      ok: response.ok ?? true,
      status: response.status ?? 200,
      statusText: response.statusText ?? '',
      json: response.json ?? (() => Promise.resolve({}))
    })
  );
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

    const error = await apiFetch('/test').catch((caughtError) => caughtError);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      message: 'Invalid input',
      status: 400,
      errors: { name: 'required' }
    });
  });

  it('handles non-json error response', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: () => Promise.reject(new Error('fail'))
      })
    );

    await expect(apiFetch('/test')).rejects.toBeInstanceOf(ApiError);
  });
});
