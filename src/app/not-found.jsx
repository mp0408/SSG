import Button from '../components/ui/Button';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col items-start justify-center pb-16 pt-28">
      <p className="t-label text-ball">Error 404 · Out of bounds</p>
      <h1 className="t-display mt-5 text-[clamp(3.5rem,18vw,11rem)] text-ink">
        Clean <span className="t-accent">bowled.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-2">This page doesn’t exist, or it walked back to the pavilion. Let’s get you back to the middle.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button to="/" icon="arrowRight">
          Back to home
        </Button>
        <Button to="/players" variant="secondary">
          Find a player
        </Button>
      </div>
    </section>
  );
}
