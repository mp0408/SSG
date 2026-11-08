import { Link } from 'react-router-dom';
import { CATEGORIES, PLAYERS, categoryCounts, playerPhoto } from '../../lib/directory';
import Icon from '../../components/ui/Icon';
import Marquee from '../../components/ui/Marquee';
import Reveal from '../../components/ui/Reveal';
import SectionHeading from '../../components/ui/SectionHeading';

// A light, deterministic shuffle so the wall doesn't read alphabetically.
const faces = PLAYERS.filter((p) => p.photo)
  .map((p) => ({ p, k: (p.id * 2654435761) % 1000 }))
  .sort((a, b) => a.k - b.k)
  .map(({ p }) => p)
  .slice(0, 48);
const ROWS = [faces.slice(0, 24), faces.slice(24)];
const COUNTS = categoryCounts();

function Face({ player }) {
  return (
    <Link
      to={`/players/${player.slug}`}
      className="group relative mr-3 block h-[7.5rem] w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-2 sm:h-36 sm:w-28"
      aria-label={player.name}
    >
      <img src={playerPhoto(player, 'xs')} alt="" loading="lazy" decoding="async" width={160} height={200} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
        {player.name}
      </span>
    </Link>
  );
}

export default function NetworkSection() {
  return (
    <section className="section overflow-hidden">
      <div className="shell">
        <SectionHeading
          index="03"
          label="The Network"
          title={
            <>
              Every player is also a <span className="t-serif text-brand-ink">founder, maker or pro.</span>
            </>
          }
          description="Behind the jerseys are business owners, engineers, designers, advisors and more. Find someone, tap their card and connect directly — that’s how this league grows business."
        />
      </div>

      <Reveal className="space-y-3" y={30}>
        <Marquee duration={90}>
          {ROWS[0].map((p) => (
            <Face key={p.id} player={p} />
          ))}
        </Marquee>
        <Marquee duration={100} reverse>
          {ROWS[1].map((p) => (
            <Face key={p.id} player={p} />
          ))}
        </Marquee>
      </Reveal>

      <div className="shell mt-10 grid gap-6 lg:mt-14 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-6">
          <Link
            to="/players"
            state={{ focusSearch: true }}
            className="group flex h-16 items-center gap-4 rounded-full border border-line bg-surface px-6 text-ink-3 shadow-card transition-colors hover:border-brand/50"
          >
            <Icon name="search" className="size-5 shrink-0" />
            <span className="flex-1 truncate">Search {PLAYERS.length} players by name, profession or brand</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform group-hover:translate-x-0.5">
              <Icon name="arrowRight" className="size-4" />
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.08} as="ul" className="flex flex-wrap gap-2 lg:col-span-6 lg:justify-end">
          {CATEGORIES.filter((c) => COUNTS[c.id]).map((c) => (
            <li key={c.id}>
              <Link to={`/players?category=${c.id}`} className="chip h-9 px-4 text-sm transition-colors hover:border-ink-3/60 hover:text-ink">
                {c.label}
                <span className="t-numeric text-xs tracking-normal text-ink-3">{COUNTS[c.id]}</span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
