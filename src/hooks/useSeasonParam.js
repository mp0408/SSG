'use client';

import { getSeason } from '../data/seasons';
import { useUrlParam } from './useUrlParam';

/**
 * Selected season, synced to `?season=N` so a view can be shared.
 * Falls back to `fallback` (a season object) when the param is missing/invalid
 * or the season isn't in `available`.
 */
export function useSeasonParam(available, fallback) {
  const [param, setSeason] = useUrlParam('season');
  const fromUrl = param ? getSeason(param) : null;
  const season = fromUrl && available.includes(fromUrl) ? fromUrl : fallback;
  return [season, setSeason];
}
