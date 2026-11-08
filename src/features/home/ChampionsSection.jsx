import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CHAMPIONS, CURRENT_SEASON, LATEST_PLAYED } from '../../data/seasons';
import { SITE } from '../../data/site';
import { getPlayer } from '../../lib/directory';
import { shareLink } from '../../lib/contact';
import { cn } from '../../lib/cn';
import { EASE_OUT, rise } from '../../lib/motion';
import Icon from '../../components/ui/Icon';
import { Stagger } from '../../components/ui/Reveal';
import SectionHeading from '../../components/ui/SectionHeading';

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const PICK_KEY = `ssgpl-prediction-season-${CURRENT_SEASON.number}`;
// Only the upcoming season's own franchises can be predicted — last season's teams don't carry over.
const OPTIONS = CURRENT_SEASON.teams;
const SLOTS = LATEST_PLAYED?.teams.length || 6;
const NEXT_STEP = CURRENT_SEASON.roadmap?.find((step) => step.state === 'next');

const readPick = () => {
  try {
    return localStorage.getItem(PICK_KEY);
  } catch {
    return null;
  }
};

function ChampionCard({ season, champion, defending }) {
  const captain = champion.captainId ? getPlayer(champion.captainId) : null;
  const stat = (label) => season.stats.find((s) => s.label === label)?.value;
  const detail = captain ? `Captain ${captain.name}` : [stat('Teams') && `${stat('Teams')} teams`, stat('Players') && `${stat('Players')} players`].filter(Boolean).join(' · ');
  const Wrapper = season.teams.length ? Link : 'div';

  return (
    <motion.li variants={rise} className="h-full">
      <Wrapper
        {...(season.teams.length ? { to: `/teams?season=${season.number}` } : {})}
        className="card card-interactive group relative flex h-full flex-col overflow-hidden p-5 sm:p-8"
      >
        <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(70% 55% at 50% 42%, ${champion.color}33, transparent 72%)` }} />
        <span aria-hidden className="t-display text-outline pointer-events-none absolute -right-2 -top-3 text-[4.5rem] leading-none opacity-70 sm:text-[7rem]">
          {season.year}
        </span>

        <p className="t-label relative flex items-center gap-2 text-amber-600 dark:text-amber-300">
          <Icon name="trophy" className="size-4" />
          Season {season.number}
        </p>
        {defending && (
          <span className="relative mt-3 w-fit rounded-full bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            Defending champions
          </span>
        )}

        <div className="relative flex flex-1 items-center justify-center py-6 sm:py-10">
          <img
            src={champion.crest}
            alt=""
            loading="lazy"
            className="h-24 w-auto object-contain drop-shadow-[0_20px_30px_rgb(0_0_0/0.35)] transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110 sm:h-44"
          />
        </div>

        <div className="relative">
          <p className="t-label text-ink-3">Champions</p>
          <h3 className="t-display mt-2 text-[clamp(1.6rem,6vw,3rem)] text-ink">{champion.name}</h3>
          {detail && <p className="mt-2 text-xs text-ink-2 sm:text-sm">{detail}</p>}
          <span aria-hidden className="mt-5 block h-1 w-12 rounded-full" style={{ background: champion.color }} />
        </div>
      </Wrapper>
    </motion.li>
  );
}

/** Before the auction: no franchises exist yet, so the prediction stays locked. */
function PredictionLocked() {
  return (
    <div className="relative mt-5 flex flex-1 flex-col">
      <p className="text-sm text-ink-2">
        Season {CURRENT_SEASON.number} franchises are built at the auction. Predictions open the moment the new teams are revealed.
      </p>
      <ul aria-hidden className="mt-5 grid grid-cols-3 gap-2">
        {Array.from({ length: SLOTS }, (_, i) => (
          <li key={i} className="relative flex aspect-[1/0.95] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-surface/50">
            <span className="skeleton absolute inset-0 bg-transparent" />
            <span className="t-display text-outline relative text-4xl leading-none">?</span>
            <span className="t-numeric relative mt-1.5 text-[10px] tracking-normal text-ink-3">Team {String(i + 1).padStart(2, '0')}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-3 pt-5">
        <p className="flex items-center gap-2 text-xs text-ink-3">
          <Icon name="lock" className="size-3.5" />
          Opens after the auction{NEXT_STEP ? ` · next up: ${NEXT_STEP.title.toLowerCase()}` : ''}
        </p>
        <Link
          to="/#season-3"
          className="inline-flex h-10 w-fit items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface/70 px-4 text-sm font-medium text-ink transition hover:border-ink-3/60"
        >
          Season {CURRENT_SEASON.number} roadmap <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/** Season prediction: pick one of the season's franchises, saved on this device, shareable. */
function PredictCard({ className }) {
  const [pick, setPick] = useState(() => (OPTIONS.some((t) => t.slug === readPick()) ? readPick() : null));
  const [choosing, setChoosing] = useState(!pick);
  const [shared, setShared] = useState(null);
  const team = OPTIONS.find((t) => t.slug === pick);

  useEffect(() => {
    if (!shared) return undefined;
    const timer = setTimeout(() => setShared(null), 2200);
    return () => clearTimeout(timer);
  }, [shared]);

  const choose = (slug) => {
    setPick(slug);
    setChoosing(false);
    try {
      localStorage.setItem(PICK_KEY, slug);
    } catch {
      /* storage unavailable — the pick still shows for this visit */
    }
  };

  const share = async () => {
    const result = await shareLink({
      title: `${SITE.name} · Season ${CURRENT_SEASON.number}`,
      text: `My pick to win ${SITE.name} Season ${CURRENT_SEASON.number}: ${team.name}. Who’s yours?`,
      url: `${window.location.origin}/#champions`,
    });
    if (result !== 'dismissed') setShared(result);
  };

  return (
    <motion.li variants={rise} className={cn('h-full', className)}>
      <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand/40 bg-[linear-gradient(160deg,rgb(var(--brand)/0.16),rgb(var(--surface))_55%)] p-5 sm:p-8">
        <span aria-hidden className="t-display text-outline pointer-events-none absolute -right-2 -top-3 text-[4.5rem] leading-none opacity-70 sm:text-[7rem]">
          ?
        </span>
        <p className="t-label relative flex items-center gap-2 text-ball">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ball opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-ball" />
          </span>
          Season {CURRENT_SEASON.number} · Prediction
        </p>
        <h3 className="t-display relative mt-4 text-[clamp(2rem,7vw,3rem)] text-ink">
          Who lifts it <span className="t-serif text-brand-ink">next?</span>
        </h3>

        {OPTIONS.length === 0 ? (
          <PredictionLocked />
        ) : (
        <AnimatePresence mode="wait" initial={false}>
          {choosing || !team ? (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="relative mt-5 flex flex-1 flex-col"
            >
              <p className="text-sm text-ink-2">Back a franchise for Season {CURRENT_SEASON.number}. Your pick is saved on this device.</p>
              <div role="radiogroup" aria-label="Predict the champion" className="mt-5 grid grid-cols-3 gap-2">
                {OPTIONS.map((option) => (
                  <button
                    key={option.slug}
                    type="button"
                    role="radio"
                    aria-checked={pick === option.slug}
                    onClick={() => choose(option.slug)}
                    className={cn(
                      'group/pick flex flex-col items-center gap-2 rounded-2xl border bg-surface/70 px-1.5 pb-2.5 pt-3 text-center transition-[border-color,transform,background-color] duration-300 hover:-translate-y-0.5 active:scale-95',
                      pick === option.slug ? 'border-brand bg-brand/10' : 'border-line hover:border-ink-3/60',
                    )}
                  >
                    <img src={option.crest} alt="" loading="lazy" className="h-12 w-auto object-contain transition-transform duration-300 group-hover/pick:scale-110 sm:h-14" />
                    <span className="line-clamp-2 text-[11px] font-medium leading-tight text-ink-2">{option.name}</span>
                  </button>
                ))}
              </div>
              <p className="mt-auto pt-4 text-xs text-ink-3">Squads are rebuilt at the auction — pick your colours.</p>
            </motion.div>
          ) : (
            <motion.div
              key="picked"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="relative mt-5 flex flex-1 flex-col"
            >
              <div className="relative flex flex-1 flex-col items-center justify-center py-4 text-center">
                <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(55% 55% at 50% 45%, ${team.color}40, transparent 72%)` }} />
                <motion.img
                  src={team.crest}
                  alt=""
                  initial={{ rotate: -12, scale: 0.6 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  className="relative h-28 w-auto object-contain drop-shadow-[0_18px_28px_rgb(0_0_0/0.35)] sm:h-32"
                />
                <p className="t-label relative mt-5 text-ink-3">Your pick</p>
                <p className="t-display relative mt-1.5 text-3xl text-ink">{team.name}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand text-sm font-medium text-white transition hover:bg-brand/90 active:scale-[0.97]"
                >
                  <Icon name={shared ? 'check' : 'share'} className="size-4" />
                  {shared === 'copied' ? 'Link copied' : shared === 'shared' ? 'Shared' : 'Share pick'}
                </button>
                <button
                  type="button"
                  onClick={() => setChoosing(true)}
                  className="flex h-11 items-center justify-center rounded-full border border-line bg-surface/70 text-sm font-medium text-ink transition hover:border-ink-3/60 active:scale-[0.97]"
                >
                  Change pick
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        )}
      </div>
    </motion.li>
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
              {count} seasons. <span className="t-serif text-brand-ink">{count} champions.</span>
            </>
          }
          description={`${story}. Season ${CURRENT_SEASON.number} is wide open — ${
            OPTIONS.length ? 'make your call.' : 'predictions open once the new teams are revealed.'
          }`}
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
