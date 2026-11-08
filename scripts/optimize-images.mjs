#!/usr/bin/env node
/**
 * Image pipeline for SSGPL.
 *
 * Converts raw photos (phone camera JPEGs, WhatsApp exports, PNGs, HEIC…)
 * into small, web-ready WebP files so pages stay fast on mobile data.
 *
 * Usage
 *   node scripts/optimize-images.mjs <file-or-folder> <out-folder> --preset <name> [--name <slug>]
 *
 * Presets
 *   player   4:5 portraits → <slug>-xs.webp (160w) · <slug>-sm.webp (400w) · <slug>-lg.webp (800w)
 *   logo     team crest, white background removed → <slug>.webp (max 384px)
 *   poster   sponsor creative → <slug>.webp (1280w) · <slug>-sm.webp (640w)
 *   cover    gallery cover → <slug>.webp (1600w) · <slug>-sm.webp (800w)
 *
 * Examples
 *   npm run images -- raw/season-3/players public/images/players --preset player
 *   npm run images -- raw/season-3/logos/tigers.png public/images/teams --preset logo --name tigers
 */
import { readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SUPPORTED = /\.(jpe?g|png|webp|heic|heif|avif|tiff?)$/i;

export const slugify = (value) =>
  value
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** 4:5 portrait crops; sharp's "attention" strategy keeps faces in frame. */
export async function player(input, outDir, slug, { position = sharp.strategy.attention } = {}) {
  const sizes = { xs: [160, 200, 70], sm: [400, 500, 74], lg: [800, 1000, 80] };
  await Promise.all(
    Object.entries(sizes).map(([suffix, [width, height, quality]]) =>
      sharp(input)
        .rotate()
        .resize(width, height, { fit: 'cover', position })
        .webp({ quality, effort: 5 })
        .toFile(path.join(outDir, `${slug}-${suffix}.webp`)),
    ),
  );
}

/**
 * Removes the flat white background most crests are delivered on.
 * Flood-fills near-white pixels connected to the border (so white details
 * *inside* the crest survive), then softens the anti-aliased edge band.
 */
export async function logo(input, outDir, slug) {
  const { data, info } = await sharp(input).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = w * h;
  const isWhite = (i) => {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const min = Math.min(r, g, b);
    return min >= 222 && Math.max(r, g, b) - min <= 32;
  };

  const background = new Uint8Array(px);
  const queue = new Int32Array(px);
  let head = 0, tail = 0;
  const seed = (i) => {
    if (!background[i] && isWhite(i)) { background[i] = 1; queue[tail++] = i; }
  };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
  while (head < tail) {
    const i = queue[head++];
    const x = i % w, y = (i - x) / w;
    if (x > 0) seed(i - 1);
    if (x < w - 1) seed(i + 1);
    if (y > 0) seed(i - w);
    if (y < h - 1) seed(i + w);
  }

  const nearBackground = (i) => {
    const x = i % w, y = (i - x) / w;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && background[ny * w + nx]) return true;
      }
    }
    return false;
  };

  for (let i = 0; i < px; i++) {
    const o = i * 4;
    if (background[i]) { data[o + 3] = 0; continue; }
    if (Math.min(data[o], data[o + 1], data[o + 2]) < 150 || !nearBackground(i)) continue;
    // "Colour to alpha" against white for the soft edge band.
    const a = Math.max(255 - data[o], 255 - data[o + 1], 255 - data[o + 2]) / 255;
    if (a <= 0.02) { data[o + 3] = 0; continue; }
    for (let c = 0; c < 3; c++) data[o + c] = Math.round((data[o + c] - 255 * (1 - a)) / a);
    data[o + 3] = Math.round(a * 255);
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .trim()
    .resize(384, 384, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 95, effort: 6 })
    .toFile(path.join(outDir, `${slug}.webp`));
}

async function widths(input, outDir, slug, sizes) {
  await Promise.all(
    sizes.map(([suffix, width, quality]) =>
      sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toFile(path.join(outDir, `${slug}${suffix}.webp`)),
    ),
  );
}

export const poster = (input, outDir, slug) => widths(input, outDir, slug, [['', 1280, 78], ['-sm', 640, 72]]);
export const cover = (input, outDir, slug) => widths(input, outDir, slug, [['', 1600, 78], ['-sm', 800, 72]]);

const PRESETS = { player, logo, poster, cover };

async function main() {
  const [input, outDir, ...rest] = process.argv.slice(2);
  const flag = (name) => {
    const i = rest.indexOf(`--${name}`);
    return i >= 0 ? rest[i + 1] : undefined;
  };
  const preset = PRESETS[flag('preset')];
  if (!input || !outDir || !preset) {
    console.error('Usage: node scripts/optimize-images.mjs <file-or-folder> <out-folder> --preset player|logo|poster|cover [--name slug]');
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const files = (await stat(input)).isDirectory()
    ? (await readdir(input)).filter((f) => SUPPORTED.test(f)).map((f) => path.join(input, f))
    : [input];

  for (const file of files) {
    const slug = (files.length === 1 && flag('name')) || slugify(path.parse(file).name);
    await preset(file, outDir, slug);
    console.log(`✓ ${path.basename(file)} → ${slug}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
