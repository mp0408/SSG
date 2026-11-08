import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEASONS } from '../../data/seasons';
import { getPlayer, playerPhoto } from '../../lib/directory';
import { initials } from '../../lib/format';
import { cn } from '../../lib/cn';
import { EASE_OUT, VIEWPORT_ONCE } from '../../lib/motion';
import Icon from '../../components/ui/Icon';
import SectionHeading from '../../components/ui/SectionHeading';

// The committee of the most recent season that has announced one.
const SEASON = SEASONS.find((s) => s.committee?.length);

/** Flattens role groups into one card per person. */
const membersOf = (groups) =>
  groups.flatMap((group) =>
    group.people.map((person) => {
      const player = person.playerId ? getPlayer(person.playerId) : null;
      return {
        key: `${group.role}-${person.name}`,
        role: group.role.replace(/ Committee$/, ''),
        group: group.role,
        name: player?.name ?? person.name,
        photo: person.photo ?? playerPhoto(player, 'lg'),
        to: player ? `/players/${player.slug}` : null,
      };
    }),
  );

/**
 * Portrait card with a curtain reveal: the frame wipes open as the photo settles.
 * The in-view trigger lives on the unclipped <li>; a fully clipped element never registers as visible.
 */
function MemberCard({ member, index, large }) {
  const Wrapper = member.to ? Link : 'div';
  return (
    <motion.li initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>
      <motion.div
        variants={{ hidden: { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, show: { clipPath: 'inset(0% 0% 0% 0% round 28px)' } }}
        transition={{ duration: 1.1, delay: index * 0.08, ease: EASE_OUT }}
      >
        <Wrapper
          {...(member.to ? { to: member.to } : {})}
          className="group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-surface-2"
        >
          {member.photo ? (
            <motion.img
              src={member.photo}
              alt=""
              loading="lazy"
              decoding="async"
              variants={{ hidden: { scale: 1.2 }, show: { scale: 1 } }}
              transition={{ duration: 1.6, delay: index * 0.08, ease: EASE_OUT }}
              className="size-full object-cover object-[50%_20%] transition-[filter] duration-700 group-hover:brightness-110"
            />
          ) : (
            <div className="flex size-full justify-center bg-[linear-gradient(150deg,rgb(var(--brand)/0.9),#071233_85%)] pt-[22%]">
              <span className="t-display text-outline text-[clamp(4rem,14vw,6rem)] leading-none [-webkit-text-stroke-color:rgb(255_255_255/0.55)]">
                {initials(member.name)}
              </span>
            </div>
          )}

          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#02050d]/95 via-[#02050d]/15 to-transparent" />

          <div className={cn('absolute inset-x-0 bottom-0', large ? 'p-5 sm:p-7' : 'p-4 sm:p-5')}>
            <p className={cn('t-label flex items-center gap-2 text-white/70', !large && 'text-[10px] tracking-[0.14em]')}>
              <span className="size-1.5 shrink-0 rounded-full bg-ball" />
              {member.role}
            </p>
            <p className={cn('t-display mt-2 text-white', large ? 'text-[clamp(2rem,6vw,2.75rem)]' : 'text-[clamp(1.5rem,4.5vw,1.9rem)]')}>
              {member.name}
            </p>
          </div>

          {member.to && (
            <span className="absolute right-4 top-4 flex size-10 scale-90 items-center justify-center rounded-full bg-white text-[#0a1226] opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Icon name="arrowUpRight" className="size-4" />
            </span>
          )}
        </Wrapper>
      </motion.div>
    </motion.li>
  );
}

export default function CommitteeSection() {
  if (!SEASON) return null;
  const leaders = membersOf(SEASON.committee.filter((g) => g.tier === 'lead'));
  const members = membersOf(SEASON.committee.filter((g) => g.tier !== 'lead'));
  const groups = [...new Set(members.map((m) => m.group))];

  return (
    <section id="committee" className="section">
      <div className="shell">
        <SectionHeading
          index="05"
          label={`Organising committee · Season ${SEASON.number}`}
          title={
            <>
              The people behind <span className="t-serif text-brand-ink">the pitch.</span>
            </>
          }
          description="Volunteers from the community who run the auction, the rules, the money and match day. Tap anyone to view their profile."
        />

        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {leaders.map((member, index) => (
            <MemberCard key={member.key} member={member} index={index} large />
          ))}
        </ul>

        {members.length > 0 && (
          <>
            <div className="mb-6 mt-16 flex flex-wrap items-baseline justify-between gap-3 border-b border-line/70 pb-4 sm:mt-20">
              <h3 className="t-display text-3xl text-ink sm:text-4xl">Committee members</h3>
              <p className="text-sm text-ink-3">{groups.join(' · ')}</p>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {members.map((member, index) => (
                <MemberCard key={member.key} member={member} index={index} />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
