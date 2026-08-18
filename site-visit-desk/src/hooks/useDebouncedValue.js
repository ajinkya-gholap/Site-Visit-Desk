import { useEffect, useState } from 'react';

// Returns `value` but delayed by `delayMs` of inactivity — used to debounce the
// queue search box so filtering doesn't re-run on every keystroke (3.6).
export function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
