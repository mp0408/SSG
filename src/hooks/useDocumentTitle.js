import { useEffect } from 'react';

const BASE = 'SSG Premier League';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} · Season 3 — Coming Soon`;
  }, [title]);
}
