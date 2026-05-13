import { describe, it, expect } from 'vitest';
import { buildPaginationPages } from '../../../../src/shared/utils/pagination/buildPaginationPages';

describe('buildPaginationPages', () => {
  it('returns all pages when total <= 10', () => {
    const result = buildPaginationPages(1, 5);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('adds ellipsis when current is in early pages', () => {
    const result = buildPaginationPages(2, 20);

    expect(result).toEqual([1, 2, 3, 4, 5, '...', 16, 17, 18, 19, 20]);
  });

  it('adds ellipsis when current is in middle pages', () => {
    const result = buildPaginationPages(10, 20);

    expect(result).toEqual([
      1,
      2,
      3,
      4,
      5,
      '...',
      9,
      10,
      11,
      '...',
      16,
      17,
      18,
      19,
      20
    ]);
  });

  it('adds ellipsis when current is near end', () => {
    const result = buildPaginationPages(19, 20);

    expect(result).toEqual([1, 2, 3, 4, 5, '...', 16, 17, 18, 19, 20]);
  });
});

describe('buildPaginationPages - edge cases', () => {
  it('handles total = 10 exactly (no ellipsis)', () => {
    const result = buildPaginationPages(5, 10);

    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('handles current at first page', () => {
    const result = buildPaginationPages(1, 20);

    expect(result).toEqual([1, 2, 3, 4, 5, '...', 16, 17, 18, 19, 20]);
  });

  it('handles current at last page', () => {
    const result = buildPaginationPages(20, 20);

    expect(result).toEqual([1, 2, 3, 4, 5, '...', 16, 17, 18, 19, 20]);
  });

  it('handles minimal pagination (total = 1)', () => {
    const result = buildPaginationPages(1, 1);

    expect(result).toEqual([1]);
  });

  it('handles minimal pagination (total = 2)', () => {
    const result = buildPaginationPages(1, 2);

    expect(result).toEqual([1, 2]);
  });

  it('ensures current page is always included in middle range', () => {
    const result = buildPaginationPages(7, 20);

    expect(result).toContain(7);
    expect(result).toContain(6);
    expect(result).toContain(8);
  });
});
