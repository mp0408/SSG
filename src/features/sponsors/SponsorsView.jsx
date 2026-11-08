'use client';

import { useState } from 'react';
import { seasonsWith } from '../../data/seasons';
import { useSeasonParam } from '../../hooks/useSeasonParam';
import { useLastDefined } from '../../hooks/useLastDefined';
import PageHeader from '../../components/ui/PageHeader';
import SeasonSwitcher from '../../components/ui/SeasonSwitcher';
import Sheet from '../../components/ui/Sheet';
import SponsorShowcase from './SponsorShowcase';
import PartnerPitch from './PartnerPitch';
import PeopleList from './PeopleList';
import { posterSrc } from './poster';

const SEASON_OPTIONS = seasonsWith('sponsors');
const LATEST_WITH_SPONSORS = SEASON_OPTIONS.find((s) => s.sponsors.length) ?? SEASON_OPTIONS[0];

export default function SponsorsView() {
  const [season, setSeason] = useSeasonParam(SEASON_OPTIONS, LATEST_WITH_SPONSORS);
  const [poster, setPoster] = useState(null);
  const shownPoster = useLastDefined(poster);

  return (
    <>
      <PageHeader
        label="Sponsors"
        ghost="Partners"
        title={
          <>
            The businesses <span className="t-accent">behind the game.</span>
          </>
        }
        description="Every season is made possible by local businesses, many of them run by our own players. Partners change each season; pick one to see who backed it."
      >
        <SeasonSwitcher
          value={season.number}
          onChange={setSeason}
          options={SEASON_OPTIONS.map((s) => ({
            value: s.number,
            label: `Season ${s.number}`,
            badge: s.status === 'upcoming' ? 'Open' : null,
          }))}
        />
      </PageHeader>

      <section className="shell pb-20 sm:pb-32">
        <div key={season.number} className="animate-fade-up">
          {season.sponsors.length ? (
            <>
              <p className="mb-6 text-sm text-ink-3 sm:mb-8">
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
        </div>
      </section>

      <Sheet open={Boolean(poster)} onClose={() => setPoster(null)} size="xl" labelledBy="poster-title">
        {shownPoster && (
          <figure>
            <img src={posterSrc(season, shownPoster)} alt={`${shownPoster.role} announcement`} className="block aspect-video w-full bg-surface-2 object-cover" />
            <figcaption className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="t-label text-brand-ink">
                  Season {season.number} · {shownPoster.role}
                </p>
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
