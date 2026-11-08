# SSG Premier League

Official site of the SSG Premier League, organised by Satva Shiv Gold Yuva Mandal in Ahmedabad. It has a season hub, a players and business network, teams, sponsors, a gallery and the league's story.

**Stack:** React 19 · Vite 6 · Tailwind CSS 3 · Framer Motion · raw WebGL (hero) · deployed on Vercel.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the build locally
npm run lint
```

## Project structure

```
src/
  data/
    players.json          People directory. A person keeps the same id in every season.
    seasons/season-N.js   Everything that changes per season: teams, champion, sponsors,
                          committee, gallery and roadmap.
    seasons/index.js      Season registry (newest first).
    site.js               Name, organiser, navigation.
  lib/                    Pure helpers: directory index, contact actions (call / WhatsApp /
                          vCard / share), formatting, motion presets.
  hooks/                  Theme, scroll lock, media query, season URL param, etc.
  components/
    brand/                Vector logo (traced from the official mark).
    layout/               Navbar, mobile menu, footer, site shell.
    ui/                   Design-system primitives (Button, Sheet, Reveal, Marquee…).
    webgl/                Hero shader and canvas.
  features/<area>/        Page-specific components (home, players, teams, sponsors, gallery).
  pages/                  One file per route. Every page except Home is lazy-loaded.
  styles/index.css        Theme tokens (dark and light) and type roles.
scripts/optimize-images.mjs   Image pipeline (sharp).
public/images/            Optimised WebP assets only.
```

## Adding a new season

1. Create `src/data/seasons/season-4.js` (copy `season-3.js`) and add it to the front of `SEASONS` in `seasons/index.js`.
2. While a season is upcoming, edit its `roadmap`. Set each step's `state` to `done`, `next` or `later`, and fill in `when`.
3. After the auction, fill in `teams` using player ids. Add new people to `players.json` with new ids. Returning players keep their existing id.
4. Add `sponsors`, `committee` and `gallery` in the same file. The Teams, Sponsors, Gallery and About pages, and the home sections, all update from that file automatically.

## Images

Put raw photos in `/raw` (git-ignored), then run:

```bash
npm run images -- raw/players public/images/players --preset player               # 3 sizes, 4:5, faces kept in frame
npm run images -- raw/crest.png public/images/teams --preset logo --name tigers    # removes the white background
npm run images -- raw/sponsors public/images/sponsors/season-4 --preset poster
npm run images -- raw/cover.jpg public/images/gallery --preset cover --name season-4-matches
```

A player's photo path is derived from their `slug`, for example `/images/players/<slug>-sm.webp`.

## Brand

- `public/brand/ssgpl-logo.svg` and `ssgpl-logo-on-dark.svg` are vector masters, so they stay sharp at any size.
- `public/brand/ssgpl-logo-4k.png` is a 3840 px transparent PNG for print and social media.
- The favicon, app icons and `og-image.jpg` (the WhatsApp/social link preview) are in `public/`.

## Configuration

Set `VITE_SITE_URL` in `.env` to the production URL with no trailing slash. It is used to build absolute URLs for the social preview image.
