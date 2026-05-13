export function buildPaginationPages(
  current: number,
  total: number
): (number | '...')[] {
  if (total <= 10) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const startPages = [1, 2, 3, 4, 5];
  const endPages = [total - 4, total - 3, total - 2, total - 1, total];

  if (current <= 5) {
    return [...startPages, '...', ...endPages];
  }

  if (current >= total - 4) {
    return [...startPages, '...', ...endPages];
  }

  return [
    ...startPages,
    '...',
    current - 1,
    current,
    current + 1,
    '...',
    ...endPages
  ];
}
