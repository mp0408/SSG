import { motion } from 'framer-motion';
import { rise } from '../../lib/motion';
import { cn } from '../../lib/cn';
import { Stagger } from '../../components/ui/Reveal';
import Icon from '../../components/ui/Icon';
import Img from '../../components/ui/Img';
import PeopleList from './PeopleList';
import { posterSrc } from './poster';

function Poster({ season, sponsor, onView, className }) {
  return (
    <button
      type="button"
      onClick={() => onView(sponsor)}
      className={cn('group/poster relative block aspect-video w-full overflow-hidden bg-surface-2', className)}
      aria-label={`View ${sponsor.role}${sponsor.brand ? ` — ${sponsor.brand}` : ''} announcement`}
    >
      <Img
        src={posterSrc(season, sponsor, 'sm')}
        srcSet={`${posterSrc(season, sponsor, 'sm')} 640w, ${posterSrc(season, sponsor)} 1280w`}
        sizes="(min-width: 1024px) 40vw, 92vw"
        width={640}
        height={360}
        className="size-full object-cover group-hover/poster:scale-[1.03]"
      />
      <span className="absolute bottom-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/poster:opacity-100 max-sm:opacity-90 sm:bottom-3 sm:right-3 sm:size-9">
        <Icon name="expand" className="size-3 sm:size-4" />
      </span>
    </button>
  );
}

function GroupTitle({ children, count }) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-line/70 pb-4">
      <h2 className="t-display text-3xl text-ink sm:text-4xl">{children}</h2>
      {count != null && <span className="t-numeric text-sm text-ink-3">{String(count).padStart(2, '0')}</span>}
    </div>
  );
}

export default function SponsorShowcase({ season, onView }) {
  const headline = season.sponsors.filter((s) => s.tier === 'title' || s.tier === 'co');
  const teamSponsors = season.sponsors.filter((s) => s.tier === 'team');
  const partners = season.sponsors.filter((s) => s.tier === 'partner');
  const team = (slug) => season.teams.find((t) => t.slug === slug);

  return (
    <div className="space-y-20 sm:space-y-28">
      {headline.length > 0 && (
        <Stagger as="div" className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          {headline.map((sponsor) => {
            const title = sponsor.tier === 'title';
            return (
              <motion.article key={sponsor.slug} variants={rise} className={cn('card overflow-hidden', title ? 'lg:col-span-7' : 'lg:col-span-5')}>
                <Poster season={season} sponsor={sponsor} onView={onView} />
                <div className="p-6 sm:p-8">
                  <p className="t-label flex items-center gap-2 text-brand-ink">
                    <Icon name={title ? 'trophy' : 'spark'} className="size-4" />
                    {sponsor.role}
                  </p>
                  <h3 className={cn('t-display mt-4 text-ink', title ? 'text-[clamp(2.5rem,7vw,4rem)]' : 'text-[clamp(2.25rem,6vw,3rem)]')}>
                    {sponsor.brand}
                  </h3>
                  {sponsor.note && <p className="mt-2 text-sm text-ink-3">{sponsor.note}</p>}
                  <PeopleList people={sponsor.people} className="mt-5" />
                </div>
              </motion.article>
            );
          })}
        </Stagger>
      )}

      {teamSponsors.length > 0 && (
        <section>
          <GroupTitle count={teamSponsors.length}>Team sponsors</GroupTitle>
          <Stagger as="ul" gap={0.05} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
            {teamSponsors.map((sponsor) => {
              const t = team(sponsor.team);
              return (
                <motion.li key={sponsor.slug} variants={rise}>
                  <button
                    type="button"
                    onClick={() => onView(sponsor)}
                    className="card card-interactive flex h-full w-full flex-col items-center p-5 text-center"
                  >
                    <span className="relative flex aspect-square w-full items-center justify-center rounded-2xl" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${t?.color}30, transparent 70%)` }}>
                      {t && <img src={t.crest} alt="" loading="lazy" className="h-[78%] w-auto object-contain" />}
                    </span>
                    <span className="mt-4 text-sm font-semibold text-ink">{t?.name}</span>
                    <span className="mt-1 text-xs text-ink-3">{sponsor.people.map((p) => p.name).join(', ')}</span>
                  </button>
                </motion.li>
              );
            })}
          </Stagger>
        </section>
      )}

      {partners.length > 0 && (
        <section>
          <GroupTitle count={partners.length}>Match partners</GroupTitle>
          <Stagger as="ul" gap={0.04} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {partners.map((sponsor) => (
              <motion.li key={sponsor.slug} variants={rise} className="card flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl">
                <Poster season={season} sponsor={sponsor} onView={onView} />
                <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                  <p className="t-label text-[10px] leading-snug tracking-[0.12em] text-brand-ink sm:text-[11px] sm:tracking-label">{sponsor.role}</p>
                  {sponsor.brand && <h3 className="mt-2 text-[15px] font-semibold leading-snug text-ink sm:mt-2.5 sm:text-lg">{sponsor.brand}</h3>}
                  <PeopleList
                    people={sponsor.people}
                    size="text-xs sm:text-sm"
                    className={cn(sponsor.brand ? 'mt-1.5' : 'mt-2')}
                  />
                </div>
              </motion.li>
            ))}
          </Stagger>
        </section>
      )}
    </div>
  );
}
