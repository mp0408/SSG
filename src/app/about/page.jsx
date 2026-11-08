import { SEASONS } from '../../data/seasons';
import { SITE } from '../../data/site';
import PageHeader from '../../components/ui/PageHeader';
import Reveal from '../../components/ui/Reveal';
import Button from '../../components/ui/Button';
import StatsSection from '../../features/home/StatsSection';
import Story from '../../features/about/Story';

export const metadata = {
  title: 'About',
  description: `SSG Premier League is organised by ${SITE.organiser} in ${SITE.city}: one story, one season at a time.`,
};

const VALUES = [
  { title: 'Play it straight', text: 'We compete hard and fair. The umpire’s word is final; the handshake afterwards is mandatory.' },
  { title: 'Grow together', text: 'Every season widens the circle: new players, new partners, and new business between friends.' },
  { title: 'Raise the bar', text: 'From the auction paddle to the final over, each season should feel bigger than the last.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About SSGPL"
        ghost="Story"
        title={
          <>
            More than a tournament. <span className="t-accent">One season at a time.</span>
          </>
        }
        description={`SSG Premier League is organised by ${SITE.organiser} in ${SITE.city}. It started with one question: what if the people who build businesses all week took the field together?`}
      />

      <Story />

      <section className="section border-y border-line/60 bg-bg-2">
        <div className="shell">
          <Reveal>
            <p className="t-label text-brand-ink">What makes SSGPL different</p>
            <p className="t-display mt-6 max-w-5xl text-balance text-[clamp(2.25rem,7vw,5.25rem)] text-ink">
              On the field, teammates. <span className="t-accent">Off it, each other’s first call.</span>
            </p>
          </Reveal>
          <ol className="mt-10 grid gap-3 sm:mt-16 lg:grid-cols-3 lg:gap-4">
            {VALUES.map((value, i) => (
              <Reveal as="li" key={value.title} delay={i * 0.08} className="card p-5 sm:p-8">
                <span className="t-label text-glow">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-display mt-5 text-3xl text-ink sm:mt-8 sm:text-4xl">{value.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-2">{value.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <StatsSection />

      <section className="shell pb-20 sm:pb-32">
        <Reveal className="card hud-ticks relative overflow-hidden px-5 py-12 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(var(--brand)/0.24),transparent_70%)]" />
          <p className="t-label relative text-brand-ink">Season {SEASONS[0].number}</p>
          <h2 className="t-display relative mx-auto mt-5 max-w-3xl text-balance text-[clamp(2.75rem,10vw,6rem)] text-ink">
            The next chapter is <span className="t-accent">unwritten.</span>
          </h2>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3 sm:mt-10">
            <Button to="/players" icon="arrowRight">
              Meet the players
            </Button>
            <Button to="/gallery" variant="secondary">
              Relive the moments
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
