import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import SiteLayout from './components/layout/SiteLayout';
import Home from './pages/Home';

// Home ships in the main bundle for a fast first paint; other pages load on demand.
const Players = lazy(() => import('./pages/Players'));
const Teams = lazy(() => import('./pages/Teams'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Sponsors = lazy(() => import('./pages/Sponsors'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<Home />} />
              <Route path="players/:slug?" element={<Players />} />
              <Route path="members" element={<Navigate to="/players" replace />} />
              <Route path="teams" element={<Teams />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="sponsors" element={<Sponsors />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}
