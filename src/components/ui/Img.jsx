'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

/** <img> that fades in once decoded, over a neutral placeholder colour. Lazy by default. */
export default function Img({ className, loading = 'lazy', alt = '', onLoad, ...props }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      alt={alt}
      loading={loading}
      decoding="async"
      data-loading={loaded ? undefined : ''}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn('transition-[opacity,transform] duration-500 ease-out', className)}
      {...props}
    />
  );
}
