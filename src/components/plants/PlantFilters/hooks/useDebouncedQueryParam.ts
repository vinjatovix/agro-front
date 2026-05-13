import { useEffect, useState } from 'react';

export function useDebouncedQueryParam(
  initialValue: string,
  onChange: (value: string) => void,
  delay = 400
) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value]);

  return [value, setValue] as const;
}
