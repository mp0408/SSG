'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { CURRENT_SEASON, LATEST_PLAYED } from '../../data/seasons';
import { SITE } from '../../data/site';
import { shareLink } from '../../lib/contact';
import { cn } from '../../lib/cn';
import Icon from '../../components/ui/Icon';

const PICK_KEY = `ssgpl-prediction-season-${CURRENT_SEASON.number}`;
// Only the upcoming season's own franchises can be predicted: last season's teams don't carry over.
const OPTIONS = CURRENT_SEASON.teams;
const SLOTS = LATEST_PLAYED?.teams.length || 6;
const NEXT_STEP = CURRENT_SEASON.roadmap?.find((step) => step.state === 'next');

// The saved pick is an external store, so the server render and hydration always agree.
let memoryPick = null; // keeps the pick for this visit if storage is unavailable
const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const readPick = () => {
  try {
    return localStorage.getItem(PICK_KEY) ?? memoryPick;
  } catch {
    return memoryPick;
  }
};
const savePick = (slug) => {
  memoryPick = slug;
  try {
    localStorage.setItem(PICK_KEY, slug);
  } catch {
    /* storage unavailable: memoryPick still shows it for this visit */
  }
  listeners.forEach((listener) => listener());
};

/** Before the auction: no franchises exist yet, so the prediction stays locked. */
function PredictionLocked() {
  return (
    <div className="relative mt-4 flex flex-1 flex-col sm:mt-5">
      <p className="text-sm text-ink-2">Season {CURRENT_SEASON.number} franchises are built at the auction. Predictions open the moment the new teams are revealed.</p>
      <ul aria-hidden className="mt-4 grid grid-cols-3 gap-2 sm:mt-5">
        {Array.from({ length: SLOTS }, (_, i) => (
          <li key={i} className="flex aspect-square flex-col items-center justify-center rounded-lg border border-dashed border-line bg-surface/50">
            <span className="t-display text-outline text-3xl leading-none sm:text-4xl">?</span>
            <span className="t-label mt-1 text-[10px] tracking-normal text-ink-3">Team {String(i + 1).padStart(2, '0')}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-3 pt-5">
        <p className="flex items-start gap-2 text-xs text-ink-3">
          <Icon name="lock" className="mt-px size-3.5 shrink-0" />
          Opens after the auction{NEXT_STEP ? `, next up: ${NEXT_STEP.title.toLowerCase()}` : ''}
        </p>
        <Link href="/#season-3" className="inline-flex min-h-11 w-fit items-center gap-2 whitespace-nowrap rounded-lg border border-line bg-surface/70 px-4 text-sm font-medium text-ink transition hover:border-glow/50">
          Season {CURRENT_SEASON.number} roadmap <Icon name="arrowRight" className="size-4" />
        </Link>
      </div>
    </div>
  );
}

/** Season prediction: pick one of the season's franchises, saved on this device, shareable. */
export default function PredictCard({ className }) {
  const saved = useSyncExternalStore(subscribe, readPick, () => null);
  const pick = OPTIONS.some((t) => t.slug === saved) ? saved : null;
  const [changing, setChanging] = useState(false);
  const choosing = changing || !pick;
  const [shared, setShared] = useState(null);
  const team = OPTIONS.find((t) => t.slug === pick);

  useEffect(() => {
    if (!shared) return undefined;
    const timer = setTimeout(() => setShared(null), 2200);
    return () => clearTimeout(timer);
  }, [shared]);

  const choose = (slug) => {
    savePick(slug);
    setChanging(false);
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
    <li className={cn('h-full', className)}>
      <div className="card hud-ticks flex h-full flex-col overflow-hidden border-glow/40 bg-[linear-gradient(160deg,rgb(var(--brand)/0.2),rgb(var(--surface))_55%)] p-5 sm:p-8">
        <span aria-hidden className="t-display text-outline pointer-events-none absolute -top-3 right-2 text-[4.5rem] leading-none opacity-70 sm:text-[7rem]">
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
          Who lifts it <span className="t-accent">next?</span>
        </h3>

        {OPTIONS.length === 0 ? (
          <PredictionLocked />
        ) : choosing || !team ? (
          <div key="choose" className="relative mt-5 flex flex-1 animate-fade-up flex-col">
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
                    'flex flex-col items-center gap-2 rounded-lg border bg-surface/70 px-1.5 pb-2.5 pt-3 text-center transition-[border-color,transform,background-color] duration-200 active:scale-95',
                    pick === option.slug ? 'border-brand bg-brand/10' : 'border-line hover:border-glow/50',
                  )}
                >
                  <img src={option.crest} alt="" loading="lazy" className="h-12 w-auto object-contain sm:h-14" />
                  <span className="line-clamp-2 text-[11px] font-medium leading-tight text-ink-2">{option.name}</span>
                </button>
              ))}
            </div>
            <p className="mt-auto pt-4 text-xs text-ink-3">Squads are rebuilt at the auction. Pick your colours.</p>
          </div>
        ) : (
          <div key="picked" className="relative mt-5 flex flex-1 animate-fade-up flex-col">
            <div className="relative flex flex-1 flex-col items-center justify-center py-4 text-center">
              <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(55% 55% at 50% 45%, ${team.color}40, transparent 72%)` }} />
              <img src={team.crest} alt="" className="relative h-28 w-auto object-contain sm:h-32" />
              <p className="t-label relative mt-5 text-ink-3">Your pick</p>
              <p className="t-display relative mt-1.5 text-3xl text-ink">{team.name}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={share} className="flex h-11 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-white transition hover:bg-brand/90 active:scale-[0.97]">
                <Icon name={shared ? 'check' : 'share'} className="size-4" />
                {shared === 'copied' ? 'Link copied' : shared === 'shared' ? 'Shared' : 'Share pick'}
              </button>
              <button type="button" onClick={() => setChanging(true)} className="flex h-11 items-center justify-center rounded-lg border border-line bg-surface/70 text-sm font-medium text-ink transition hover:border-glow/50 active:scale-[0.97]">
                Change pick
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
