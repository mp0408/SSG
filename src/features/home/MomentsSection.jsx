import Link from 'next/link';
import { SEASONS } from '../../data/seasons';
import Icon from '../../components/ui/Icon';
import Img from '../../components/ui/Img';
import { Stagger } from '../../components/ui/Reveal';
import SectionHeading from '../../components/ui/SectionHeading';

const ALBUMS = SEASONS.flatMap((s) => s.gallery);
const LATEST_MATCH_COVER = ALBUMS.find((a) => a.kind === 'matches' && a.cover)?.cover;
const count = (kind) => ALBUMS.filter((a) => a.kind === kind).length;

function Tile({ to, label, title, meta, children }) {
  return (
    <li>
      <Link href={to} className="group relative block aspect-[5/4] overflow-hidden rounded-2xl bg-surface-2 sm:aspect-[4/3.6]">
        {children}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#02050d]/90 via-[#02050d]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-8">
          <div className="min-w-0">
            <p className="t-label text-white/70">{label}</p>
            <p className="t-display mt-2 text-[clamp(2.5rem,11vw,3.75rem)] text-white">{title}</p>
            <p className="mt-2 text-sm text-white/75">{meta}</p>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-[#0a1226] transition-transform duration-300 group-hover:rotate-45 sm:size-12">
            <Icon name="arrowUpRight" className="size-5" />
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function MomentsSection() {
  return (
    <section className="section border-t border-line/60">
      <div className="shell">
        <SectionHeading
          index="06"
          label="Gallery"
          title={
            <>
              Relive the <span className="t-accent">moments.</span>
            </>
          }
        />
        <Stagger as="ul" className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Tile to="/gallery?view=matches" label="Every season" title="Match days" meta={`${count('matches')} albums`}>
            {LATEST_MATCH_COVER && (
              <Img
                src={`${LATEST_MATCH_COVER}-sm.webp`}
                srcSet={`${LATEST_MATCH_COVER}-sm.webp 800w, ${LATEST_MATCH_COVER}.webp 1600w`}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="absolute inset-0 size-full object-cover group-hover:scale-105"
              />
            )}
          </Tile>
          <Tile to="/gallery?view=auction" label="Behind the paddles" title="Auction nights" meta={`${count('auction')} album${count('auction') === 1 ? '' : 's'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_90%_20%,rgb(var(--brand)/0.55),transparent_70%),linear-gradient(140deg,#0d1f52_0%,#060c1f_75%)]">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:20px_20px]" />
              <Icon name="gavel" strokeWidth={1} className="absolute right-6 top-6 size-24 origin-bottom-left text-white/20 transition-transform duration-300 ease-out group-hover:-rotate-[22deg] sm:right-8 sm:top-8 sm:size-40" />
            </div>
          </Tile>
        </Stagger>
      </div>
    </section>
  );
}
