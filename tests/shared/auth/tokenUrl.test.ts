import { beforeEach, describe, expect, it, vi } from 'vitest';

import { extractAndSanitizeActivationToken } from '../../../src/shared/auth/tokenUrl';

describe('extractAndSanitizeActivationToken', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('extracts token from hash fragment and sanitizes history', () => {
    window.history.pushState(null, '', '/activate#token=test-hash-token-value');
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    const token = extractAndSanitizeActivationToken();

    expect(token).toBe('test-hash-token-value');
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/activate');
  });

  it('extracts token from search query fallback and sanitizes history', () => {
    window.history.pushState(
      null,
      '',
      '/activate?token=test-query-token-value'
    );
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    const token = extractAndSanitizeActivationToken();

    expect(token).toBe('test-query-token-value');
    expect(replaceStateSpy).toHaveBeenCalledWith(null, '', '/activate');
  });

  it('returns null and does not replace history when no token is present', () => {
    window.history.pushState(null, '', '/activate');
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

    const token = extractAndSanitizeActivationToken();

    expect(token).toBeNull();
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });
});
