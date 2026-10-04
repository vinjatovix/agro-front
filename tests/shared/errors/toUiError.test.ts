import { describe, it, expect } from 'vitest';
import { ApiError } from '../../../src/shared/errors/ApiError';
import { toUiError } from '../../../src/shared/errors/toUiError';

describe('toUiError', () => {
  it('maps ApiError to UiError', () => {
    const error = new ApiError('fail', 400, { name: 'invalid' });

    const result = toUiError(error);

    expect(result.message).toBe('fail');
    expect(result.details).toEqual(['invalid']);
  });

  it('maps normal Error', () => {
    const result = toUiError(new Error('boom'));

    expect(result.message).toBe('boom');
    expect(result.details).toBeUndefined();
  });

  it('handles unknown error', () => {
    const result = toUiError(null);

    expect(result.message).toBe('Error desconocido');
  });

  it('maps ApiError without field errors to a message without details', () => {
    const result = toUiError(new ApiError('not found', 404));

    expect(result).toEqual({ message: 'not found', details: undefined });
  });

  it('maps a thrown non-Error value to the unknown error message', () => {
    const result = toUiError('boom');

    expect(result.message).toBe('Error desconocido');
  });
});
