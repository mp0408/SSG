/**
 * The players network: a season-independent directory of people, enriched
 * with everything the season files say about them (team, captaincy,
 * sponsorships, committee roles). Built once at module load.
 */
import playersData from '../data/players.json';
import { SEASONS } from '../data/seasons';

export const CATEGORIES = [
  { id: 'business', label: 'Business' },
  { id: 'tech', label: 'Tech & Creative' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'finance', label: 'Finance' },
  { id: 'careers', label: 'Careers' },
  { id: 'students', label: 'Students' },
];

const CATEGORY_RULES = [
  ['tech', /develop|software|design|market|media|photo/i],
  ['engineering', /engineer|switchgear/i],
  ['finance', /invest|insurance|account/i],
  ['students', /study|student/i],
  ['careers', /^job|service|govern|pvt/i],
  ['business', /business|manufactur|furniture|hotel|groom|embroider|construction|trade|shop/i],
];

const categoryOf = (occupation) => CATEGORY_RULES.find(([, rule]) => rule.test(occupation))?.[0] ?? null;

export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? '';

/* ── Season links ───────────────────────────────────────── */
const journeys = new Map(); // playerId → Map(seasonNumber → entry)

const entryFor = (playerId, season) => {
  if (!journeys.has(playerId)) journeys.set(playerId, new Map());
  const bySeason = journeys.get(playerId);
  if (!bySeason.has(season.number)) {
    bySeason.set(season.number, { season: season.number, year: season.year, team: null, isCaptain: false, isChampion: false, sponsorships: [], committee: [] });
  }
  return bySeason.get(season.number);
};

for (const season of SEASONS) {
  const teamName = (slug) => season.teams.find((t) => t.slug === slug)?.name;
  for (const team of season.teams) {
    for (const id of team.playerIds) {
      const entry = entryFor(id, season);
      entry.team = team;
      entry.isCaptain = team.captainId === id;
      entry.isChampion = season.champion?.team === team.slug;
    }
  }
  for (const sponsor of season.sponsors) {
    for (const person of sponsor.people) {
      if (!person.playerId) continue;
      entryFor(person.playerId, season).sponsorships.push({
        role: sponsor.role,
        brand: sponsor.brand ?? (sponsor.team ? teamName(sponsor.team) : null),
        business: sponsor.brand ?? null, // a real company, not a team name
        slug: sponsor.slug,
      });
    }
  }
  for (const group of season.committee) {
    for (const person of group.people) {
      if (person.playerId) entryFor(person.playerId, season).committee.push(group.role);
    }
  }
}

/* ── Players ────────────────────────────────────────────── */
export const PLAYERS = playersData
  .map((player) => {
    const journey = [...(journeys.get(player.id)?.values() ?? [])].sort((a, b) => b.season - a.season);
    const brands = [...new Set(journey.flatMap((j) => j.sponsorships.map((s) => s.business)).filter(Boolean))];
    const category = categoryOf(player.occupation);
    return {
      ...player,
      category,
      journey,
      brands,
      isCaptain: journey.some((j) => j.isCaptain),
      isChampion: journey.some((j) => j.isChampion),
      isSponsor: journey.some((j) => j.sponsorships.length),
      search: [player.name, player.occupation, categoryLabel(category), ...brands, ...journey.map((j) => j.team?.name)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const byId = new Map(PLAYERS.map((p) => [p.id, p]));
const bySlug = new Map(PLAYERS.map((p) => [p.slug, p]));

export const getPlayer = (id) => byId.get(id);
export const getPlayerBySlug = (slug) => bySlug.get(slug);

export const playerPhoto = (player, size = 'sm') => (player?.photo ? `/images/players/${player.slug}-${size}.webp` : null);

export const playerSrcSet = (player) =>
  player?.photo ? `${playerPhoto(player, 'sm')} 400w, ${playerPhoto(player, 'lg')} 800w` : undefined;

export const categoryCounts = () =>
  PLAYERS.reduce((counts, p) => {
    if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, {});

export const PROFESSION_COUNT = new Set(PLAYERS.map((p) => p.occupation.toLowerCase()).filter(Boolean)).size;
