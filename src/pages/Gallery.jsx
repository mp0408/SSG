import { AnimatePresence, motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { CURRENT_SEASON, SEASONS } from '../data/seasons';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { EASE_OUT } from '../lib/motion';
import PageHeader from '../components/ui/PageHeader';
import SeasonSwitcher from '../components/ui/SeasonSwitcher';
import { Stagger } from '../components/ui/Reveal';
import AlbumCard, { LockedAlbum } from '../features/gallery/AlbumCard';

const ALBUMS = SEASONS.flatMap((season) => season.gallery.map((album) => ({ ...album, season: season.number, year: season.year })));

const VIEWS = [
  { value: 'matches', label: 'Match days' },
  { value: 'auction', label: 'Auction nights' },
].map((view) => ({ ...view, count: ALBUMS.filter((a) => a.kind === view.value).length }));

export default function Gallery() {
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'auction' ? 'auction' : 'matches';
  const albums = ALBUMS.filter((album) => album.kind === view);
  const upcoming = CURRENT_SEASON.status === 'upcoming';
  useDocumentTitle('Gallery');

  const setView = (next) => setParams({ view: next }, { replace: true, preventScrollReset: true });

  return (
    <>
      <PageHeader
        label="Gallery"
        ghost="Moments"
        title={
          <>
            Every shot. <span className="t-serif text-brand-ink">Every roar.</span>
          </>
        }
        description="Relive the spirit of SSGPL — match days and auction nights from every season."
      >
        <SeasonSwitcher id="gallery" label="Album type" options={VIEWS} value={view} onChange={setView} />
      </PageHeader>

      <section className="shell pb-24 sm:pb-32">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <Stagger as="ul" gap={0.1} className="flex flex-col gap-5 sm:gap-8">
              {upcoming && <LockedAlbum season={CURRENT_SEASON} kind={view} />}
              {albums.map((album) => (
                <AlbumCard key={album.url} album={album} />
              ))}
            </Stagger>
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  );
}
