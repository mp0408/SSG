import Link from 'next/link';
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

// Phones load 12 faces per row instead of 24: half the images, half the moving layer.
const FEWER_ON_PHONES = 'max-sm:[&>a:nth-child(n+13)]:hidden';

function Face({ player }) {
  return (
    <Link href={`/players/${player.slug}`} className="group relative mr-3 block h-[7.5rem] w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2 sm:h-36 sm:w-28" aria-label={player.name}>
      <img src={playerPhoto(player, 'xs')} alt="" loading="lazy" decoding="async" width={160} height={200} className="size-full object-cover" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">{player.name}</span>
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
              Every player is also a <span className="t-accent">founder, maker or pro.</span>
            </>
          }
          description="Behind the jerseys are business owners, engineers, designers, advisors and more. Find someone, tap their card and connect directly. That’s how this league grows business."
        />
      </div>

      <Reveal className="space-y-3">
        <Marquee duration={70} trackClassName={FEWER_ON_PHONES}>
          {ROWS[0].map((p) => (
            <Face key={p.id} player={p} />
          ))}
        </Marquee>
        <Marquee duration={80} reverse trackClassName={FEWER_ON_PHONES}>
          {ROWS[1].map((p) => (
            <Face key={p.id} player={p} />
          ))}
        </Marquee>
      </Reveal>

      <div className="shell mt-8 grid gap-5 lg:mt-14 lg:grid-cols-12 lg:items-center">
        <Reveal className="lg:col-span-6">
          <Link href="/players?focus=search" className="group flex h-14 items-center gap-3 rounded-xl border border-line bg-surface pl-4 pr-2.5 text-ink-3 shadow-card transition-colors hover:border-glow/50 sm:h-16 sm:gap-4 sm:px-6">
            <Icon name="search" className="size-5 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-[15px] sm:text-base">Search {PLAYERS.length} players by name, profession or brand</span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition-transform group-hover:translate-x-0.5">
              <Icon name="arrowRight" className="size-4" />
            </span>
          </Link>
        </Reveal>
        <Reveal delay={0.08} as="ul" className="flex flex-wrap gap-2 lg:col-span-6 lg:justify-end">
          {CATEGORIES.filter((c) => COUNTS[c.id]).map((c) => (
            <li key={c.id}>
              <Link href={`/players?category=${c.id}`} className="chip min-h-10 px-3.5 text-sm transition-colors hover:border-glow/50 hover:text-ink">
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
