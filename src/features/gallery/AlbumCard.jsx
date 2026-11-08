import { motion } from 'framer-motion';
import { formatDate } from '../../lib/format';
import { cn } from '../../lib/cn';
import { rise } from '../../lib/motion';
import Icon from '../../components/ui/Icon';
import Img from '../../components/ui/Img';

const CORNERS = [
  'left-0 top-0 border-l-2 border-t-2 rounded-tl-[28px]',
  'right-0 top-0 border-r-2 border-t-2 rounded-tr-[28px]',
  'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[28px]',
  'bottom-0 right-0 border-b-2 border-r-2 rounded-br-[28px]',
];

function AuctionCover({ album }) {
  return (
    <div className="relative flex size-full min-h-[240px] flex-col justify-end overflow-hidden bg-[linear-gradient(140deg,#0d1f52_0%,#060c1f_70%)] p-6 sm:p-8">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:20px_20px]" />
      <div aria-hidden className="absolute -right-10 -top-10 size-56 rounded-full bg-[rgb(var(--brand)/0.35)] blur-3xl" />
      <Icon
        name="gavel"
        strokeWidth={1.2}
        className="absolute right-6 top-6 size-20 origin-bottom-left text-white/25 transition-transform duration-500 ease-out group-hover:-rotate-[22deg] group-hover:text-white/40 sm:size-24"
      />
      <p className="t-label relative text-white/55">Satva Shiv Gold</p>
      <p className="t-display relative mt-2 text-[clamp(3rem,9vw,4.5rem)] text-white">
        Auction
        <br />
        Night
      </p>
      <p className="relative mt-3 text-sm text-white/65">
        {[formatDate(album.date), album.place].filter(Boolean).join(' · ')}
      </p>
    </div>
  );
}

/**
 * Album link card. Hover: corner brackets light up, border takes the accent,
 * image zooms, the badge inverts and the CTA fills left-to-right.
 */
export default function AlbumCard({ album }) {
  return (
    <motion.li variants={rise}>
      <a
        href={album.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative grid overflow-hidden rounded-[28px] border border-line bg-surface transition-[border-color,box-shadow] duration-700 hover:border-brand-ink/70 hover:shadow-lift md:grid-cols-12"
      >
        {CORNERS.map((corner) => (
          <span
            key={corner}
            aria-hidden
            className={cn('pointer-events-none absolute z-20 size-7 border-brand-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100', corner)}
          />
        ))}

        <div className="relative aspect-[16/10] overflow-hidden border-b border-line md:col-span-5 md:aspect-auto md:min-h-[340px] md:border-b-0 md:border-r">
          {album.cover ? (
            <Img
              src={`${album.cover}-sm.webp`}
              srcSet={`${album.cover}-sm.webp 800w, ${album.cover}.webp 1600w`}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="absolute inset-0 size-full scale-[1.02] object-cover duration-[1.4s] group-hover:scale-110"
            />
          ) : (
            <AuctionCover album={album} />
          )}
        </div>

        <div className="relative flex flex-col p-6 sm:p-10 md:col-span-7">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_40%,rgb(var(--brand)/0.12),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <span className="t-label relative inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface-2/70 px-3 py-1.5 text-ink-2 transition-colors duration-500 group-hover:border-transparent group-hover:bg-brand group-hover:text-white">
            <span className="size-1.5 rounded-full bg-current" />
            Season {album.season} · {album.year}
          </span>
          <h3 className="t-display relative mt-6 text-[clamp(2.4rem,7vw,4rem)] text-ink transition-colors duration-500 group-hover:text-brand-ink">
            {album.title}
          </h3>
          <p className="relative mt-4 max-w-lg text-pretty leading-relaxed text-ink-2 sm:text-lg">{album.description}</p>

          <div className="relative mt-8 flex items-center gap-4 md:mt-auto md:pt-10">
            <span className="relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-line px-6">
              <span aria-hidden className="absolute inset-0 -translate-x-[101%] bg-brand transition-transform duration-500 ease-[cubic-bezier(0.86,0,0.07,1)] group-hover:translate-x-0" />
              <span className="relative text-sm font-semibold text-ink transition-colors delay-75 duration-500 group-hover:text-white">Open album</span>
              <Icon name="arrowUpRight" className="relative size-4 text-ink transition-[color,transform] duration-500 group-hover:translate-x-0.5 group-hover:text-white" />
            </span>
            <span className="text-xs text-ink-3">Opens fotoowl gallery</span>
          </div>
        </div>
      </a>
    </motion.li>
  );
}

export function LockedAlbum({ season, kind }) {
  return (
    <motion.li variants={rise} className="relative flex items-center gap-5 overflow-hidden rounded-[28px] border border-dashed border-line bg-surface/50 p-6 sm:p-8">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface-2 text-ink-3">
        <Icon name="lock" className="size-6" />
      </span>
      <div>
        <p className="t-label text-ink-3">Season {season.number} · Coming soon</p>
        <p className="mt-1.5 text-ink-2">
          The {kind === 'auction' ? 'auction night' : 'match day'} album unlocks right here once the cameras are out.
        </p>
      </div>
    </motion.li>
  );
}
