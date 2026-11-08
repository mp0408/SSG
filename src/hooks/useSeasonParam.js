import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSeason } from '../data/seasons';

/**
 * Selected season, synced to `?season=N` so a view can be shared.
 * Falls back to `fallback` (a season object) when the param is missing/invalid
 * or the season isn't in `available`.
 */
export function useSeasonParam(available, fallback) {
  const [params, setParams] = useSearchParams();
  const fromUrl = getSeason(params.get('season'));
  const season = fromUrl && available.includes(fromUrl) ? fromUrl : fallback;

  const setSeason = useCallback(
    (number) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('season', String(number));
          return next;
        },
        { replace: true, preventScrollReset: true },
      ),
    [setParams],
  );

  return [season, setSeason];
}
