import { useEffect, useState } from 'react';

// Returns `value`, but only after it has stopped changing for `delayMs`.
// Used to avoid sending one API request per keystroke.
export const useDebouncedValue = <T>(value: T, delayMs = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);

    // Runs before the next effect (i.e. on the next keystroke) and on unmount,
    // cancelling the pending update.
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
};
