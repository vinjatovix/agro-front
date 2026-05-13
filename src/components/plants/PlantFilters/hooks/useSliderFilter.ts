import { useState } from 'react';

export function useSliderFilter(initialValue: string | null) {
  const [value, setValue] = useState<number | null>(
    initialValue ? Number(initialValue) : null
  );

  function clear() {
    setValue(null);
  }

  return {
    value,
    setValue,
    clear
  };
}
