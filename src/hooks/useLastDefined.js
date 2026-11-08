import { useState } from 'react';

/**
 * Returns `value`, or the last non-null value it had. Lets a closing sheet
 * keep rendering its content while the exit animation plays.
 */
export function useLastDefined(value) {
  const [last, setLast] = useState(value);
  if (value != null && value !== last) setLast(value);
  return value ?? last;
}
