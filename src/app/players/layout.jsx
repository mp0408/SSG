import PlayersView from '../../features/players/PlayersView';

/**
 * The grid lives in the layout so it stays mounted (with its search, filters and
 * scroll position) while the profile sheet opens at /players/<slug>.
 */
export default function PlayersLayout({ children }) {
  return (
    <>
      <PlayersView />
      {children}
    </>
  );
}
