'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CATEGORIES, PLAYERS, categoryCounts, getPlayerBySlug } from '../../lib/directory';
import { useLastDefined } from '../../hooks/useLastDefined';
import { useUrlParam } from '../../hooks/useUrlParam';
import { cn } from '../../lib/cn';
import PageHeader from '../../components/ui/PageHeader';
import Sheet from '../../components/ui/Sheet';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Reveal from '../../components/ui/Reveal';
import PlayerCard from './PlayerCard';
import PlayerProfile from './PlayerProfile';

const COUNTS = categoryCounts();
const FILTERS = [{ id: 'all', label: 'Everyone', count: PLAYERS.length }, ...CATEGORIES.map((c) => ({ ...c, count: COUNTS[c.id] ?? 0 })).filter((c) => c.count)];

export default function PlayersView() {
  const pathname = usePathname();
  const slug = pathname.split('/')[2];
  const searchRef = useRef(null);
  const openedFromList = useRef(false);
  const [query, setQuery] = useState('');
  const [categoryParam, setCategory] = useUrlParam('category');
  const [focusParam] = useUrlParam('focus');
  const category = FILTERS.some((f) => f.id === categoryParam) ? categoryParam : 'all';
  const deferredQuery = useDeferredValue(query);
  const selected = slug ? getPlayerBySlug(slug) : null;
  const shown = useLastDefined(selected);

  useEffect(() => {
    document.title = `${selected ? selected.name : 'Players Network'} · SSG Premier League`;
  }, [selected]);

  useEffect(() => {
    if (focusParam === 'search') searchRef.current?.focus({ preventScroll: true });
  }, [focusParam]);

  const results = useMemo(() => {
    const terms = deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return PLAYERS.filter((p) => (category === 'all' || p.category === category) && terms.every((term) => p.search.includes(term)));
  }, [deferredQuery, category]);

  // pushState keeps the profile URL shareable while opening instantly, with no server round trip.
  const openPlayer = useCallback((player) => {
    openedFromList.current = true;
    window.history.pushState(null, '', `/players/${player.slug}`);
  }, []);

  const closePlayer = useCallback(() => {
    if (openedFromList.current) {
      openedFromList.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, '', '/players');
    }
  }, []);

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
  };

  return (
    <>
      <PageHeader
        label="The Players Network"
        ghost="Network"
        title={
          <>
            {PLAYERS.length} players. <span className="t-accent">One network.</span>
          </>
        }
        description="Every SSGPL player is also a founder, professional or maker. Search by name, profession or brand, then call, WhatsApp or save their contact in one tap."
      />

      {/* Phones: only the search stays pinned, so the list keeps the screen. Desktop: one sticky row. */}
      <div className="glass z-30 border-y border-line/70 max-lg:contents lg:sticky lg:top-[var(--header)] lg:bg-bg/85">
        <div className="max-lg:contents lg:mx-auto lg:flex lg:max-w-[1240px] lg:items-center lg:gap-3 lg:px-8 lg:py-3">
          <div className="z-30 border-b border-line/70 bg-bg px-4 py-2 max-lg:sticky max-lg:top-[var(--header)] sm:px-6 lg:w-[22rem] lg:shrink-0 lg:border-0 lg:bg-transparent lg:p-0">
            <label className="relative block">
              <span className="sr-only">Search players</span>
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-ink-3" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, profession or brand"
                enterKeyHint="search"
                autoComplete="off"
                className="h-12 w-full rounded-lg border border-line bg-surface pl-10 pr-11 text-base text-ink outline-none transition-[border-color] placeholder:text-ink-3 focus:border-glow/70 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-ink-3 hover:bg-surface-2 hover:text-ink">
                  <Icon name="close" className="size-4" />
                </button>
              )}
            </label>
          </div>

          <div role="radiogroup" aria-label="Filter by profession" className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:p-0">
            {FILTERS.map((filter) => {
              const active = category === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCategory(filter.id)}
                  className={cn(
                    'flex h-11 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors duration-200 lg:h-10',
                    active ? 'border-transparent bg-ink text-bg' : 'border-line bg-surface/60 text-ink-2 hover:text-ink',
                  )}
                >
                  {filter.label}
                  <span className={cn('t-numeric text-xs tracking-normal', active ? 'text-bg/60' : 'text-ink-3')}>{filter.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="shell pb-20 pt-4 sm:pb-24 sm:pt-10" aria-live="polite">
        <p className="mb-4 text-sm text-ink-3 sm:mb-5">
          Showing <span className="font-medium text-ink">{results.length}</span> of {PLAYERS.length} · A–Z
        </p>

        {results.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((player) => (
              <PlayerCard key={player.id} player={player} onOpen={openPlayer} />
            ))}
          </div>
        ) : (
          <EmptyState icon="search" title="No match yet" description={`Nobody matches “${query.trim()}” in this filter. Try a first name or a broader profession.`}>
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          </EmptyState>
        )}

        <Reveal className="card mt-12 flex flex-col items-start gap-5 overflow-hidden p-5 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="t-label text-brand-ink">For players</p>
            <h2 className="t-display mt-3 text-3xl text-ink sm:text-4xl">Want your business listed?</h2>
            <p className="mt-2 max-w-lg text-ink-2">Share your company name, services or a new number with the organising committee and we’ll update your card.</p>
          </div>
          <Button to="/#committee" variant="secondary" icon="arrowRight" className="shrink-0">
            Contact the committee
          </Button>
        </Reveal>
      </section>

      <Sheet open={Boolean(selected)} onClose={closePlayer} labelledBy="player-sheet-title">
        {shown && <PlayerProfile key={shown.id} player={shown} titleId="player-sheet-title" />}
      </Sheet>
    </>
  );
}
