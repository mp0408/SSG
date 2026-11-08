/** Sponsor announcement image: full (1280w) or `sm` (640w). */
export const posterSrc = (season, sponsor, size = '') =>
  `/images/sponsors/season-${season.number}/${sponsor.slug}${size ? `-${size}` : ''}.webp`;
