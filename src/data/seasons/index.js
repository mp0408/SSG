import season1 from './season-1';
import season2 from './season-2';
import season3 from './season-3';

/** Newest first. To add a season: create season-N.js and list it here. */
export const SEASONS = [season3, season2, season1];

export const CURRENT_SEASON = SEASONS[0];

/** Most recent season that has finished (or is running) — used for "last season" recaps. */
export const LATEST_PLAYED = SEASONS.find((s) => s.status !== 'upcoming');

export const getSeason = (number) => SEASONS.find((s) => s.number === Number(number));

export const seasonsWith = (key) => SEASONS.filter((s) => s.status === 'upcoming' || s[key]?.length);

export const seasonLabel = (season) => `Season ${season.number}`;

/**
 * Resolves a season's champion to { slug, name, crest, color, captainId }.
 * `champion` is either { team: '<slug>' } (looked up in season.teams) or a full
 * description for seasons without archived squads.
 */
export const championOf = (season) => {
  const champion = season?.champion;
  if (!champion) return null;
  const team = champion.team ? season.teams.find((t) => t.slug === champion.team) : null;
  return {
    slug: team?.slug ?? champion.team ?? null,
    name: team?.name ?? champion.name,
    crest: team?.crest ?? champion.crest,
    color: team?.color ?? champion.color,
    captainId: team?.captainId ?? champion.captainId ?? null,
  };
};

/** Every crowned season, oldest first. */
export const CHAMPIONS = [...SEASONS]
  .reverse()
  .map((season) => ({ season, champion: championOf(season) }))
  .filter((entry) => entry.champion);
