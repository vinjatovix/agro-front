import { useEffect, useState } from 'react';

export function useDebouncedQueryParam(
  initialValue: string,
  onChange: (value: string) => void,
  delay = 400
) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, onChange, delay]);

  return [value, setValue] as const;
}
