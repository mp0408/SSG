'use client';

import { CURRENT_SEASON, SEASONS } from '../../data/seasons';
import { useUrlParam } from '../../hooks/useUrlParam';
import PageHeader from '../../components/ui/PageHeader';
import SeasonSwitcher from '../../components/ui/SeasonSwitcher';
import { Stagger } from '../../components/ui/Reveal';
import AlbumCard, { LockedAlbum } from './AlbumCard';

const ALBUMS = SEASONS.flatMap((season) => season.gallery.map((album) => ({ ...album, season: season.number, year: season.year })));

const VIEWS = [
  { value: 'matches', label: 'Match days' },
  { value: 'auction', label: 'Auction nights' },
].map((view) => ({ ...view, count: ALBUMS.filter((a) => a.kind === view.value).length }));

export default function GalleryView() {
  const [param, setView] = useUrlParam('view');
  const view = param === 'auction' ? 'auction' : 'matches';
  const albums = ALBUMS.filter((album) => album.kind === view);
  const upcoming = CURRENT_SEASON.status === 'upcoming';

  return (
    <>
      <PageHeader
        label="Gallery"
        ghost="Moments"
        title={
          <>
            Every shot. <span className="t-accent">Every roar.</span>
          </>
        }
        description="Relive the spirit of SSGPL: match days and auction nights from every season."
      >
        <SeasonSwitcher label="Album type" options={VIEWS} value={view} onChange={setView} />
      </PageHeader>

      <section className="shell pb-20 sm:pb-32">
        <div key={view} className="animate-fade-up">
          <Stagger as="ul" gap={0.08} className="flex flex-col gap-4 sm:gap-6">
            {upcoming && <LockedAlbum season={CURRENT_SEASON} kind={view} />}
            {albums.map((album) => (
              <AlbumCard key={album.url} album={album} />
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
