import { CHAMPIONS, CURRENT_SEASON, LATEST_PLAYED } from '../../data/seasons';
import { SITE } from '../../data/site';
import { PLAYERS } from '../../lib/directory';
import Marquee from '../../components/ui/Marquee';

const ITEMS = [
  `Season ${CURRENT_SEASON.number}: coming soon`,
  'Auction date: TBA',
  ...[...CHAMPIONS].reverse().map(({ season, champion }) => `S${season.number} champions: ${champion.name}`),
  `${PLAYERS.length} players`,
  `${LATEST_PLAYED.teams.length} franchises`,
  `${LATEST_PLAYED.sponsors.length} partners`,
  SITE.city,
  SITE.organiser,
];

export default function Ticker() {
  return (
    <div className="relative border-y border-line/70 bg-bg-2 py-3.5">
      <Marquee duration={50} className="[--marquee-fade:rgb(var(--bg-2))]">
        {ITEMS.map((item) => (
          <span key={item} className="t-label flex items-center gap-7 whitespace-nowrap pr-7 text-ink-2">
            {item}
            <span aria-hidden className="size-1.5 rotate-45 bg-glow" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
