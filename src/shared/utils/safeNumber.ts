export function safeNumber(value: string | null): number | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const n = Number(trimmed);

  if (!Number.isFinite(n)) return undefined;

  return n;
}
