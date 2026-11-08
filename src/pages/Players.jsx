import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CATEGORIES, PLAYERS, categoryCounts, getPlayerBySlug } from '../lib/directory';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLastDefined } from '../hooks/useLastDefined';
import { cn } from '../lib/cn';
import PageHeader from '../components/ui/PageHeader';
import Sheet from '../components/ui/Sheet';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Reveal from '../components/ui/Reveal';
import PlayerCard from '../features/players/PlayerCard';
import PlayerProfile from '../features/players/PlayerProfile';

const COUNTS = categoryCounts();
const FILTERS = [{ id: 'all', label: 'Everyone', count: PLAYERS.length }, ...CATEGORIES.map((c) => ({ ...c, count: COUNTS[c.id] ?? 0 })).filter((c) => c.count)];

export default function Players() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const [query, setQuery] = useState('');
  const [params] = useSearchParams();
  const [category, setCategory] = useState(() => (FILTERS.some((f) => f.id === params.get('category')) ? params.get('category') : 'all'));
  const deferredQuery = useDeferredValue(query);
  const selected = slug ? getPlayerBySlug(slug) : null;
  const shown = useLastDefined(selected);

  useDocumentTitle(selected ? selected.name : 'Players Network');

  useEffect(() => {
    if (slug && !selected) navigate('/players', { replace: true });
  }, [slug, selected, navigate]);

  useEffect(() => {
    if (location.state?.focusSearch) searchRef.current?.focus({ preventScroll: true });
  }, [location.state]);

  const results = useMemo(() => {
    const terms = deferredQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return PLAYERS.filter(
      (p) => (category === 'all' || p.category === category) && terms.every((term) => p.search.includes(term)),
    );
  }, [deferredQuery, category]);

  const openPlayer = useCallback(
    (player) => navigate(`/players/${player.slug}`, { state: { fromList: true } }),
    [navigate],
  );

  const closePlayer = useCallback(() => {
    if (location.state?.fromList) navigate(-1);
    else navigate('/players', { replace: true });
  }, [location.state, navigate]);

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
            {PLAYERS.length} players. <span className="t-serif text-brand-ink">One network.</span>
          </>
        }
        description="Every SSGPL player is also a founder, professional or maker. Search by name, profession or brand — then call, WhatsApp or save their contact in one tap."
      />

      <div className="sticky top-[4.5rem] z-30 border-y border-line/70 bg-bg/85 backdrop-blur-xl">
        <div className="shell flex flex-col gap-3 py-3 lg:flex-row lg:items-center">
          <label className="relative block lg:w-[22rem] lg:shrink-0">
            <span className="sr-only">Search players</span>
            <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-ink-3" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, profession or brand"
              enterKeyHint="search"
              autoComplete="off"
              className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-11 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-3 focus:border-brand/60 focus:shadow-[0_0_0_4px_rgb(var(--brand)/0.12)] [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink"
              >
                <Icon name="close" className="size-4" />
              </button>
            )}
          </label>

          <div role="radiogroup" aria-label="Filter by profession" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
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
                    'flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-300',
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

      <section className="shell pb-24 pt-8 sm:pt-10" aria-live="polite">
        <p className="mb-5 text-sm text-ink-3">
          Showing <span className="font-medium text-ink">{results.length}</span> of {PLAYERS.length} · A–Z
        </p>

        {results.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((player, index) => (
              <PlayerCard key={player.id} player={player} index={index} onOpen={openPlayer} />
            ))}
          </div>
        ) : (
          <EmptyState icon="search" title="No match yet" description={`Nobody matches “${query.trim()}” in this filter. Try a first name or a broader profession.`}>
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          </EmptyState>
        )}

        <Reveal className="card mt-16 flex flex-col items-start gap-6 overflow-hidden p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="t-label text-brand-ink">For players</p>
            <h2 className="t-display mt-3 text-3xl text-ink sm:text-4xl">Want your business listed?</h2>
            <p className="mt-2 max-w-lg text-ink-2">
              Share your company name, services or a new number with the organising committee and we’ll update your card.
            </p>
          </div>
          <Button to="/#committee" variant="secondary" icon="arrowRight">
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
