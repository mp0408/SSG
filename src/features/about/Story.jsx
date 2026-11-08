'use client';

import { useEffect, useRef, useState } from 'react';
import { SEASONS, championOf } from '../../data/seasons';
import { SITE } from '../../data/site';
import { formatDate } from '../../lib/format';
import { cn } from '../../lib/cn';
import Reveal from '../../components/ui/Reveal';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Img from '../../components/ui/Img';

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/** The story writes itself from the season files: add a season, gain a chapter. */
const CHAPTERS = [
  {
    key: 'origin',
    year: String(SITE.founded),
    label: 'Chapter 0 · The idea',
    title: 'A league, not a weekend game.',
    body: `Friends, founders and colleagues from the ${SITE.organiser} community wanted more than a casual match. They wanted franchises, an auction, a rulebook and a trophy worth chasing, so they built one.`,
  },
  ...[...SEASONS].reverse().map((season) => ({
    key: `s${season.number}`,
    year: season.year ? String(season.year) : 'Next',
    label: `Chapter ${ROMAN[season.number] ?? season.number} · Season ${season.number}`,
    title: season.headline,
    body: season.summary,
    stats: season.stats,
    milestones: season.milestones,
    cover: season.gallery.find((g) => g.cover)?.cover,
    champion: championOf(season),
    upcoming: season.status === 'upcoming',
  })),
];

function Chapter({ chapter, index, active }) {
  return (
    <article data-index={index} className="relative pb-14 pl-6 last:pb-4 sm:pb-28 sm:pl-14">
      <span aria-hidden className={cn('absolute -left-[5px] top-2 size-[11px] rotate-45 border-2 border-bg transition-colors duration-300', active ? 'bg-glow' : 'bg-line')} />
      <p className="t-display text-outline mb-3 text-[clamp(3.75rem,20vw,7rem)] leading-none lg:hidden">{chapter.year}</p>
      <Reveal>
        <p className="t-label text-brand-ink">{chapter.label}</p>
        <h3 className="t-display mt-3 text-balance text-[clamp(2.25rem,8vw,4.5rem)] text-ink sm:mt-4">{chapter.title}</h3>
        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink-2 sm:mt-5 sm:text-lg">{chapter.body}</p>
      </Reveal>

      {chapter.champion && (
        <Reveal delay={0.04} className="mt-6 flex items-center gap-4 rounded-xl border border-amber-400/30 bg-amber-400/[0.07] p-4 sm:mt-7 sm:max-w-md">
          <img src={chapter.champion.crest} alt="" loading="lazy" className="size-14 shrink-0 object-contain" />
          <div className="min-w-0">
            <p className="t-label flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <Icon name="trophy" className="size-3.5" /> Champions
            </p>
            <p className="t-display mt-1 text-2xl text-ink sm:text-3xl">{chapter.champion.name}</p>
          </div>
        </Reveal>
      )}

      {chapter.milestones?.length > 0 && (
        <Reveal delay={0.05} as="ul" className="mt-6 flex flex-wrap gap-2 sm:mt-7">
          {chapter.milestones.map((m) => (
            <li key={m.label} className="chip min-h-9 flex-wrap px-3 py-1.5 text-sm">
              <Icon name="calendar" className="size-4 text-ink-3" />
              <span className="text-ink">{m.label}</span>
              <span className="text-ink-3">· {formatDate(m.date)}</span>
            </li>
          ))}
        </Reveal>
      )}

      {chapter.stats?.length > 0 && (
        <Reveal delay={0.08} as="dl" className="mt-7 grid grid-cols-3 gap-x-4 gap-y-5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-10">
          {chapter.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-ink-3">{s.label}</dt>
              <dd className="t-numeric text-4xl leading-none text-ink sm:text-5xl">{s.value}</dd>
            </div>
          ))}
        </Reveal>
      )}

      {chapter.cover && (
        <Reveal delay={0.1} className="mt-8 overflow-hidden rounded-2xl border border-line sm:mt-10">
          <Img src={`${chapter.cover}-sm.webp`} srcSet={`${chapter.cover}-sm.webp 800w, ${chapter.cover}.webp 1600w`} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/10] w-full object-cover" />
        </Reveal>
      )}

      {chapter.upcoming && (
        <Reveal delay={0.1} className="mt-7 flex flex-wrap gap-3 sm:mt-8">
          <Button to="/players" icon="arrowRight">
            Meet the player pool
          </Button>
          <Button to="/#season-3" variant="secondary">
            See the roadmap
          </Button>
        </Reveal>
      )}
    </article>
  );
}

export default function Story() {
  const [active, setActive] = useState(0);
  const listRef = useRef(null);

  // The active chapter also drives the progress line: no per-frame scroll work.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(Number(entry.target.dataset.index)));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    listRef.current.querySelectorAll('article').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="shell pb-6 pt-6 sm:pt-16" aria-label="Our story">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-32">
            <p className="t-label text-ink-3">The story so far</p>
            <div className="relative mt-4 h-[14rem] overflow-hidden">
              <p key={CHAPTERS[active].year} className="t-display text-gradient-brand absolute inset-x-0 top-0 animate-fade-up text-[13rem] leading-none">
                {CHAPTERS[active].year}
              </p>
            </div>
            <ol className="mt-6 space-y-2">
              {CHAPTERS.map((c, i) => (
                <li key={c.key} className={cn('flex items-center gap-3 text-sm transition-colors duration-300', i === active ? 'text-ink' : 'text-ink-3')}>
                  <span className={cn('h-px w-10 origin-left transition-transform duration-300', i === active ? 'scale-x-100 bg-glow' : 'scale-x-50 bg-line')} />
                  {c.label}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div ref={listRef} className="relative lg:col-span-7">
          <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />
          <span
            aria-hidden
            style={{ transform: `scaleY(${(active + 1) / CHAPTERS.length})` }}
            className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-brand via-glow to-ball transition-transform duration-500 ease-out"
          />
          {CHAPTERS.map((chapter, index) => (
            <Chapter key={chapter.key} chapter={chapter} index={index} active={index === active} />
          ))}
        </div>
      </div>
    </section>
  );
}
