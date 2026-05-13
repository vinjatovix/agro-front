export function buildPaginationPages(
  current: number,
  total: number
): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];

  const add = (value: number | '...') => {
    pages.push(value);
  };

  const addRange = (start: number, end: number) => {
    for (let i = start; i <= end; i++) {
      add(i);
    }
  };

  // siempre inicio
  addRange(1, 2);

  // gap izquierda
  if (current > 4) {
    add('...');
  }

  // ventana central (SIN solapamiento real)
  const start = Math.max(3, current - 1);
  const end = Math.min(total - 2, current + 1);

  addRange(start, end);

  // gap derecha
  if (current < total - 3) {
    add('...');
  }

  // siempre final
  addRange(total - 1, total);

  // 🔥 dedupe final (garantía absoluta)
  const cleaned: (number | '...')[] = [];
  for (const p of pages) {
    if (cleaned[cleaned.length - 1] !== p) {
      cleaned.push(p);
    }
  }

  return cleaned;
}
