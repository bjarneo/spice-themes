// Renders the photographic backgrounds of each theme variant on the GPU:
//
//   0-omarchy-wordmark.jpg   the Omarchy wordmark spelled in the whole spice,
//                            or sifted in the ground spice through a stencil
//   1-spice-bowl.jpg         the spice in a small bowl, with pieces on the table
//   3-ground.jpg             a wooden spoon heaped with the ground spice
//   4-whole.jpg              whole pieces from a low angle
//
// tools/photo.html ray-marches the scenes.
//
//   node tools/photo.mjs                     render all themes and variants
//   node tools/photo.mjs saffron cumin       render the named themes
//   VARIANTS=day node tools/photo.mjs        render only these variants
//   KINDS=bowl,whole node tools/photo.mjs    render only these kinds
//   SAMPLES=20 node tools/photo.mjs          samples for each pixel (default 14)
//   PREVIEW=1 OUT=/tmp/x node tools/photo.mjs saffron
//                                            write small JPEGs to $OUT
//   SIZE=3840x2160 node tools/photo.mjs      render at another 16:9 size
//   RESUME=1 node tools/photo.mjs            skip images that this run already wrote
//
// The run lists each finished image in .capture/photo-done.txt, so RESUME=1
// continues a stopped run. Needs `chromium` with a GPU that Vulkan can use.

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { themes, VARIANTS } from './palettes.mjs';
import { launch, logoPaths } from './cdp.mjs';
import { renderTheme } from './render.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PHOTOS = [
  ['wordmark', '0-omarchy-wordmark'],
  ['bowl', '1-spice-bowl'],
  ['ground', '3-ground'],
  ['whole', '4-whole'],
];
const PREVIEW = !!process.env.PREVIEW;
const OUT = process.env.OUT || ROOT;
// Samples for each pixel, per scene. 14 keep the grain of the depth of field
// fine at 6K.
const SAMPLES = { wordmark: 14, bowl: 14, ground: 14, whole: 14 };
const samplesFor = kind => Number(process.env.SAMPLES || (PREVIEW ? 12 : SAMPLES[kind]));
const SIZE = (process.env.SIZE || (PREVIEW ? '960x540' : '6144x3456')).split('x').map(Number);
const ONLY = process.env.VARIANTS ? process.env.VARIANTS.split(',') : VARIANTS.map(v => v.key);
const KINDS = process.env.KINDS ? process.env.KINDS.split(',') : PHOTOS.map(([k]) => k);
const DONE = join(ROOT, '.capture', 'photo-done.txt');
// Tiles of TILE pixels, and a wait for the GPU after every SYNC tiles. Smaller
// numbers keep each GPU job shorter, which some drivers need.
const TILE = Number(process.env.TILE || 128), SYNC = Number(process.env.SYNC || 4);

// Opens the photo page. tools/dust.mjs uses this too.
export async function openPhotoPage() {
  const logo = logoPaths(readFileSync('/usr/share/omarchy/logo.svg', 'utf8'));
  const browser = await launch({ gpu: true });
  const photo = await browser.open(pathToFileURL(join(ROOT, 'tools/photo.html')).href);
  await photo.evaluate(`setup(${JSON.stringify(logo)})`);
  // Draws one photo and returns the JPEG as a Buffer. The photo page must be
  // the front tab: Chromium skips the GPU work of a hidden tab.
  async function shoot(scene, theme, width, height, samples, extra = {}) {
    await photo.send('Page.bringToFront');
    const url = await photo.evaluate(`renderPhoto({ scene: '${scene}', width: ${width}, height: ${height}, samples: ${samples}, tile: ${TILE}, sync: ${SYNC}, theme: ${JSON.stringify(theme)}, ...${JSON.stringify(extra)} })`);
    return Buffer.from(url.split(',')[1], 'base64');
  }
  return { shoot, close: () => browser.close() };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const wanted = process.argv.slice(2);
  const done = new Set(process.env.RESUME && existsSync(DONE) ? readFileSync(DONE, 'utf8').split('\n') : []);
  if (!process.env.RESUME && !PREVIEW) { mkdirSync(dirname(DONE), { recursive: true }); writeFileSync(DONE, ''); }
  const jobs = [];
  for (const [kind, file] of PHOTOS.filter(([k]) => KINDS.includes(k))) {
    for (const t of wanted.length ? themes.filter(x => wanted.includes(x.slug)) : themes) {
      for (const { key } of VARIANTS.filter(v => ONLY.includes(v.key))) {
        const id = `${t.slug}/${key}/${file}`;
        if (done.has(id)) continue;
        const out = PREVIEW ? join(OUT, `${t.slug}-${key}-${file}.jpg`) : join(OUT, t.slug, key, 'backgrounds', `${file}.jpg`);
        jobs.push({ t, key, kind, out, id });
      }
    }
  }
  const page = await openPhotoPage();
  const started = Date.now();
  let n = 0;
  for (const { t, key, kind, out, id } of jobs) {
    const jpeg = await page.shoot(kind, renderTheme(t, t.variants[key]), SIZE[0], SIZE[1], samplesFor(kind));
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, jpeg);
    if (!PREVIEW) appendFileSync(DONE, id + '\n');
    n++;
    const left = (Date.now() - started) / n * (jobs.length - n) / 60000;
    process.stdout.write(`\r${n}/${jobs.length} photos, about ${left.toFixed(0)} min left   `);
  }
  process.stdout.write('\n');
  await page.close();
}
