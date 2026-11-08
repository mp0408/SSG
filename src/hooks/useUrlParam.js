'use client';

import { useCallback, useLayoutEffect, useState } from 'react';

const read = (name) => new URLSearchParams(window.location.search).get(name);

/**
 * One query-string value as state, for shareable views like ?season=2.
 * Pages stay statically rendered (the URL is read after hydration) and changing
 * the value is instant: it never triggers a server round trip or scroll.
 */
export function useUrlParam(name) {
  const [value, setValue] = useState(null);

  useLayoutEffect(() => {
    const sync = () => setValue(read(name));
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [name]);

  const update = useCallback(
    (next) => {
      const url = new URL(window.location.href);
      url.searchParams.set(name, String(next));
      window.history.replaceState(null, '', url);
      setValue(String(next));
    },
    [name],
  );

  return [value, update];
}
