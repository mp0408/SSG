import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { SEASONS, championOf } from '../data/seasons';
import { SITE } from '../data/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate } from '../lib/format';
import { cn } from '../lib/cn';
import { EASE_OUT } from '../lib/motion';
import PageHeader from '../components/ui/PageHeader';
import Reveal from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import Img from '../components/ui/Img';
import StatsSection from '../features/home/StatsSection';

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/** The story writes itself from the season files: add a season, gain a chapter. */
const CHAPTERS = [
  {
    key: 'origin',
    year: String(SITE.founded),
    label: 'Chapter 0 · The idea',
    title: 'A league, not a weekend game.',
    body: `Friends, founders and colleagues from the ${SITE.organiser} community wanted more than a casual match. They wanted franchises, an auction, a rulebook and a trophy worth chasing — so they built one.`,
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

const VALUES = [
  { title: 'Play it straight', text: 'We compete hard and fair. The umpire’s word is final; the handshake afterwards is mandatory.' },
  { title: 'Grow together', text: 'Every season widens the circle — new players, new partners, and new business between friends.' },
  { title: 'Raise the bar', text: 'From the auction paddle to the final over, each season should feel bigger than the last.' },
];

function Chapter({ chapter, index, active, register }) {
  const ref = useRef(null);
  useEffect(() => register(index, ref.current), [index, register]);

  return (
    <article ref={ref} data-index={index} className="relative pb-20 pl-8 last:pb-4 sm:pb-28 sm:pl-14">
      <span
        aria-hidden
        className={cn(
          'absolute -left-[6px] top-2 size-[13px] rounded-full border-[3px] border-bg transition-colors duration-500',
          active ? 'bg-ball' : 'bg-line',
        )}
      />
      <p className="t-display text-outline mb-4 text-[clamp(4.5rem,22vw,7rem)] leading-none lg:hidden">{chapter.year}</p>
      <Reveal>
        <p className="t-label text-brand-ink">{chapter.label}</p>
        <h3 className="t-display mt-4 text-balance text-[clamp(2.6rem,8vw,4.5rem)] text-ink">{chapter.title}</h3>
        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-2">{chapter.body}</p>
      </Reveal>

      {chapter.champion && (
        <Reveal delay={0.04} className="mt-7 flex items-center gap-4 rounded-2xl border border-amber-400/30 bg-amber-400/[0.07] p-4 sm:max-w-md">
          <img src={chapter.champion.crest} alt="" loading="lazy" className="size-14 shrink-0 object-contain" />
          <div>
            <p className="t-label flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <Icon name="trophy" className="size-3.5" /> Champions
            </p>
            <p className="t-display mt-1 text-3xl text-ink">{chapter.champion.name}</p>
          </div>
        </Reveal>
      )}

      {chapter.milestones?.length > 0 && (
        <Reveal delay={0.05} as="ul" className="mt-7 flex flex-wrap gap-2">
          {chapter.milestones.map((m) => (
            <li key={m.label} className="chip h-9 px-4 text-sm">
              <Icon name="calendar" className="size-4 text-ink-3" />
              <span className="text-ink">{m.label}</span>
              <span className="text-ink-3">· {formatDate(m.date)}</span>
            </li>
          ))}
        </Reveal>
      )}

      {chapter.stats?.length > 0 && (
        <Reveal delay={0.08} as="dl" className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
          {chapter.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm text-ink-3">{s.label}</dt>
              <dd className="t-numeric text-5xl leading-none text-ink">{s.value}</dd>
            </div>
          ))}
        </Reveal>
      )}

      {chapter.cover && (
        <Reveal delay={0.1} className="mt-10 overflow-hidden rounded-3xl border border-line">
          <Img
            src={`${chapter.cover}-sm.webp`}
            srcSet={`${chapter.cover}-sm.webp 800w, ${chapter.cover}.webp 1600w`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-[16/10] w-full object-cover"
          />
        </Reveal>
      )}

      {chapter.upcoming && (
        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
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

export default function About() {
  useDocumentTitle('About');
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const nodes = useRef([]);
  const observer = useRef(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 60%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(Number(entry.target.dataset.index)));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nodes.current.forEach((node) => node && observer.current.observe(node));
    return () => observer.current.disconnect();
  }, []);

  const register = useRef((index, node) => {
    nodes.current[index] = node;
    if (node) observer.current?.observe(node);
  }).current;

  return (
    <>
      <PageHeader
        label="About SSGPL"
        ghost="Story"
        title={
          <>
            More than a tournament. <span className="t-serif text-brand-ink">A story, one season at a time.</span>
          </>
        }
        description={`SSG Premier League is organised by ${SITE.organiser} in ${SITE.city}. It started with one question: what if the people who build businesses all week took the field together?`}
      />

      <section className="shell pb-8 pt-8 sm:pt-16" aria-label="Our story">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-32">
              <p className="t-label text-ink-3">The story so far</p>
              <div className="relative mt-4 h-[16rem] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={CHAPTERS[active].year}
                    initial={{ y: '60%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-60%', opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                    className="t-display text-gradient-brand absolute inset-x-0 top-0 text-[13rem] leading-none"
                  >
                    {CHAPTERS[active].year}
                  </motion.p>
                </AnimatePresence>
              </div>
              <ol className="mt-6 space-y-2">
                {CHAPTERS.map((c, i) => (
                  <li key={c.key} className={cn('flex items-center gap-3 text-sm transition-colors duration-500', i === active ? 'text-ink' : 'text-ink-3')}>
                    <span className={cn('h-px transition-all duration-500', i === active ? 'w-10 bg-ball' : 'w-5 bg-line')} />
                    {c.label}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div ref={listRef} className="relative lg:col-span-7">
            <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />
            <motion.span aria-hidden style={{ scaleY: progress }} className="absolute bottom-0 left-0 top-0 w-px origin-top bg-gradient-to-b from-brand via-glow to-ball" />
            {CHAPTERS.map((chapter, index) => (
              <Chapter key={chapter.key} chapter={chapter} index={index} active={index === active} register={register} />
            ))}
          </div>
        </div>
      </section>

      <section className="section border-y border-line/60 bg-bg-2">
        <div className="shell">
          <Reveal>
            <p className="t-label text-brand-ink">What makes SSGPL different</p>
            <p className="t-serif mt-6 max-w-5xl text-balance text-[clamp(2.4rem,7vw,5.5rem)] leading-[1.02] text-ink">
              On the field, teammates. Off it, each other’s first call.
            </p>
          </Reveal>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:mt-20 lg:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal as="li" key={value.title} delay={i * 0.08} className="bg-bg-2 p-6 sm:p-8">
                <span className="t-numeric text-sm text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-display mt-8 text-4xl text-ink">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{value.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <StatsSection />

      <section className="shell pb-24 sm:pb-32">
        <Reveal className="card relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(var(--brand)/0.2),transparent_70%)]" />
          <p className="t-label relative text-brand-ink">Season {SEASONS[0].number}</p>
          <h2 className="t-display relative mx-auto mt-5 max-w-3xl text-balance text-[clamp(3rem,10vw,6rem)] text-ink">
            The next chapter is <span className="t-serif text-brand-ink">unwritten.</span>
          </h2>
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <Button to="/players" icon="arrowRight">
              Meet the players
            </Button>
            <Button to="/gallery" variant="secondary">
              Relive the moments
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
