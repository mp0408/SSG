import Link from 'next/link';
import { CHAMPIONS, CURRENT_SEASON } from '../../data/seasons';
import { getPlayer } from '../../lib/directory';
import Icon from '../../components/ui/Icon';
import { Stagger } from '../../components/ui/Reveal';
import SectionHeading from '../../components/ui/SectionHeading';
import PredictCard from './PredictCard';

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

function ChampionCard({ season, champion, defending }) {
  const captain = champion.captainId ? getPlayer(champion.captainId) : null;
  const stat = (label) => season.stats.find((s) => s.label === label)?.value;
  const detail = captain ? `Captain ${captain.name}` : [stat('Teams') && `${stat('Teams')} teams`, stat('Players') && `${stat('Players')} players`].filter(Boolean).join(' · ');
  const Wrapper = season.teams.length ? Link : 'div';

  return (
    <li className="h-full">
      <Wrapper {...(season.teams.length ? { href: `/teams?season=${season.number}` } : {})} className="card card-interactive group flex h-full flex-col overflow-hidden p-4 sm:p-8">
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(70% 55% at 50% 42%, ${champion.color}33, transparent 72%)` }} />
        <span aria-hidden className="t-display text-outline pointer-events-none absolute -right-1 -top-2 text-[3.25rem] leading-none opacity-60 sm:-right-2 sm:-top-3 sm:text-[7rem]">
          {season.year}
        </span>

        <p className="t-label relative flex items-center gap-1.5 text-amber-600 dark:text-amber-300">
          <Icon name="trophy" className="size-3.5 shrink-0" />
          Season {season.number}
        </p>
        {defending && (
          <span className="t-label relative mt-3 w-fit rounded bg-amber-400/15 px-2 py-1 text-[10px] tracking-[0.08em] text-amber-700 dark:text-amber-300">Defending champions</span>
        )}

        <div className="relative flex flex-1 items-center justify-center py-5 sm:py-10">
          <img src={champion.crest} alt="" loading="lazy" className="h-24 w-auto object-contain transition-transform duration-500 ease-out group-hover:-rotate-3 group-hover:scale-110 sm:h-44" />
        </div>

        <div className="relative">
          <p className="t-label text-ink-3">Champions</p>
          <h3 className="t-display mt-2 text-[clamp(1.6rem,6vw,3rem)] text-ink">{champion.name}</h3>
          {detail && <p className="mt-2 text-xs text-ink-2 sm:text-sm">{detail}</p>}
          <span aria-hidden className="mt-4 block h-1 w-12" style={{ background: champion.color }} />
        </div>
      </Wrapper>
    </li>
  );
}

export default function ChampionsSection() {
  if (!CHAMPIONS.length) return null;
  const count = WORDS[CHAMPIONS.length] ?? CHAMPIONS.length;
  const latest = CHAMPIONS.at(-1);
  const story = CHAMPIONS.map(({ season, champion }) => `${champion.name} won Season ${season.number}`).join(', ');

  return (
    <section id="champions" className="section">
      <div className="shell">
        <SectionHeading
          index="01"
          label="Hall of champions"
          title={
            <>
              {count} seasons. <span className="t-accent">{count} champions.</span>
            </>
          }
          description={`${story}. Season ${CURRENT_SEASON.number} is wide open: ${CURRENT_SEASON.teams.length ? 'make your call.' : 'predictions open once the new teams are revealed.'}`}
        />

        <Stagger as="ul" gap={0.1} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {CHAMPIONS.map(({ season, champion }) => (
            <ChampionCard key={season.number} season={season} champion={champion} defending={season === latest.season} />
          ))}
          {CURRENT_SEASON.status === 'upcoming' && <PredictCard className="col-span-2 lg:col-span-1" />}
        </Stagger>
      </div>
    </section>
  );
}
