import { describe, it, expect } from 'vitest';
import { safeNumber } from '../../../src/shared/utils/safeNumber';

describe('safeNumber', () => {
  it('returns number for valid numeric string', () => {
    expect(safeNumber('10')).toBe(10);
  });

  it('returns undefined for null', () => {
    expect(safeNumber(null)).toBeUndefined();
  });

  it('returns undefined for empty string', () => {
    expect(safeNumber('')).toBeUndefined();
  });

  it('returns undefined for whitespace string', () => {
    expect(safeNumber('   ')).toBeUndefined();
  });

  it('returns undefined for invalid number', () => {
    expect(safeNumber('abc')).toBeUndefined();
  });

  it('parses decimals correctly', () => {
    expect(safeNumber('3.14')).toBe(3.14);
  });

  it('returns undefined for NaN-like values', () => {
    expect(safeNumber('NaN')).toBeUndefined();
  });
});
