import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seasonsWith } from '../data/seasons';
import { useSeasonParam } from '../hooks/useSeasonParam';
import { useLastDefined } from '../hooks/useLastDefined';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { EASE_OUT } from '../lib/motion';
import PageHeader from '../components/ui/PageHeader';
import SeasonSwitcher from '../components/ui/SeasonSwitcher';
import Sheet from '../components/ui/Sheet';
import SponsorShowcase from '../features/sponsors/SponsorShowcase';
import PartnerPitch from '../features/sponsors/PartnerPitch';
import PeopleList from '../features/sponsors/PeopleList';
import { posterSrc } from '../features/sponsors/poster';

const SEASON_OPTIONS = seasonsWith('sponsors');
const LATEST_WITH_SPONSORS = SEASON_OPTIONS.find((s) => s.sponsors.length) ?? SEASON_OPTIONS[0];

export default function Sponsors() {
  const [season, setSeason] = useSeasonParam(SEASON_OPTIONS, LATEST_WITH_SPONSORS);
  const [poster, setPoster] = useState(null);
  const shownPoster = useLastDefined(poster);
  useDocumentTitle(`Sponsors · Season ${season.number}`);

  return (
    <>
      <PageHeader
        label="Sponsors"
        ghost="Partners"
        title={
          <>
            The businesses <span className="t-serif text-brand-ink">behind the game.</span>
          </>
        }
        description="Every season is made possible by local businesses — many of them run by our own players. Partners change each season; pick one to see who backed it."
      >
        <SeasonSwitcher
          id="sponsors"
          value={season.number}
          onChange={setSeason}
          options={SEASON_OPTIONS.map((s) => ({
            value: s.number,
            label: `Season ${s.number}`,
            badge: s.status === 'upcoming' ? 'Open' : null,
          }))}
        />
      </PageHeader>

      <section className="shell pb-24 sm:pb-32">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={season.number}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            {season.sponsors.length ? (
              <>
                <p className="mb-8 text-sm text-ink-3">
                  <span className="font-medium text-ink">{season.sponsors.length} partners</span> backed Season {season.number}
                  {season.year ? ` · ${season.year}` : ''}
                </p>
                <SponsorShowcase season={season} onView={setPoster} />
              </>
            ) : (
              <PartnerPitch
                season={season}
                onShowPrevious={season !== LATEST_WITH_SPONSORS ? () => setSeason(LATEST_WITH_SPONSORS.number) : undefined}
                previousLabel={`See Season ${LATEST_WITH_SPONSORS.number} partners`}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <Sheet open={Boolean(poster)} onClose={() => setPoster(null)} size="xl" labelledBy="poster-title">
        {shownPoster && (
          <figure>
            <img src={posterSrc(season, shownPoster)} alt={`${shownPoster.role} announcement`} className="block aspect-video w-full bg-surface-2 object-cover" />
            <figcaption className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="t-label text-brand-ink">Season {season.number} · {shownPoster.role}</p>
                <h2 id="poster-title" className="mt-2 text-xl font-semibold text-ink">
                  {shownPoster.brand ?? season.teams.find((t) => t.slug === shownPoster.team)?.name ?? shownPoster.role}
                </h2>
              </div>
              <PeopleList people={shownPoster.people} />
            </figcaption>
          </figure>
        )}
      </Sheet>
    </>
  );
}
