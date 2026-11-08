import { redirect } from 'next/navigation';
import { PLAYERS, getPlayerBySlug, playerPhoto } from '../../../lib/directory';

export const generateStaticParams = () => [{ slug: [] }, ...PLAYERS.map((player) => ({ slug: [player.slug] }))];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const player = slug?.length === 1 ? getPlayerBySlug(slug[0]) : null;
  if (!player) {
    return {
      title: 'Players Network',
      description: `${PLAYERS.length} SSGPL players, and the businesses behind them. Search by name, profession or brand.`,
    };
  }
  const description = `${player.name}${player.occupation ? `, ${player.occupation}` : ''}, on the SSG Premier League players network.`;
  return {
    title: player.name,
    description,
    openGraph: { title: player.name, description, images: player.photo ? [{ url: playerPhoto(player, 'lg') }] : undefined },
  };
}

/** Renders nothing: the grid and profile sheet are in the layout, this route only supplies metadata. */
export default async function PlayersPage({ params }) {
  const { slug } = await params;
  if (slug && (slug.length > 1 || !getPlayerBySlug(slug[0]))) redirect('/players');
  return null;
}
