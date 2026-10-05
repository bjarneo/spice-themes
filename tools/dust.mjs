// Renders an animated background for each theme variant:
// <theme>/<variant>/backgrounds/5-dust.mp4, 3840x2160, a 12 second loop.
// The Omarchy wordmark lies sifted in the ground spice on a board, seen from
// above, and fine dust drifts through a beam of light over it.
//
//   node tools/dust.mjs                      render all themes and variants
//   node tools/dust.mjs saffron cumin        render the named themes
//   VARIANTS=day node tools/dust.mjs         render only these variants
//   OUT=/tmp/x node tools/dust.mjs saffron   write the videos to $OUT
//   SKIP_EXISTING=1 node tools/dust.mjs      keep videos that exist
//   REDRAW_DUST=1 node tools/dust.mjs        draw the dust frames again
//
// The dust does not depend on the theme, so the script draws its frames once
// into .capture/dust/ and reuses them. For each variant, tools/photo.html
// renders a photographic still from straight above, and ffmpeg lays the
// dust over it in a color of the theme. Needs `chromium` with a GPU that
// Vulkan can use, and `ffmpeg`.

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readdirSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { themes, VARIANTS, mix } from './palettes.mjs';
import { launch } from './cdp.mjs';
import { renderTheme } from './render.mjs';
import { openPhotoPage } from './photo.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 24, SECONDS = 12, FRAMES = FPS * SECONDS;
// Size of the dust frames. ffmpeg scales them up 2 times.
const DUST_SIZE = [1920, 1080];
const DUST_DIR = join(ROOT, '.capture', 'dust');
const OUT = process.env.OUT;
const ONLY = process.env.VARIANTS ? process.env.VARIANTS.split(',') : VARIANTS.map(v => v.key);
const SAMPLES = Number(process.env.SAMPLES || 12);

// Warm light at night. In the day the beam is a pale, stronger veil, because
// a light board hides pale dust.
function dustColor(v) {
  const c = v.colors;
  return c.mode === 'light'
    ? { color: mix(c.background, '#ffffff', .75), opacity: 1 }
    : { color: mix(mix(c.foreground, '#ffd9a8', .5), '#ffffff', .2), opacity: .8 };
}

const wanted = process.argv.slice(2);
const jobs = [];
for (const t of wanted.length ? themes.filter(x => wanted.includes(x.slug)) : themes) {
  for (const { key } of VARIANTS.filter(v => ONLY.includes(v.key))) {
    const out = OUT ? join(OUT, `${t.slug}-${key}-dust.mp4`) : join(ROOT, t.slug, key, 'backgrounds', '5-dust.mp4');
    if (process.env.SKIP_EXISTING && existsSync(out)) continue;
    jobs.push({ t, key, out });
  }
}

const started = Date.now();

// 1. The dust frames, once
const haveDust = existsSync(DUST_DIR) && readdirSync(DUST_DIR).filter(f => f.endsWith('.png')).length === FRAMES;
if (!haveDust || process.env.REDRAW_DUST) {
  rmSync(DUST_DIR, { recursive: true, force: true });
  mkdirSync(DUST_DIR, { recursive: true });
  const browser = await launch();
  const page = await browser.open(pathToFileURL(join(ROOT, 'tools/dust.html')).href);
  for (let f = 0; f < FRAMES; f++) {
    const url = await page.evaluate(`renderDust(${f}, ${FRAMES}, ${DUST_SIZE[0]}, ${DUST_SIZE[1]})`);
    writeFileSync(join(DUST_DIR, `${String(f).padStart(3, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
    process.stdout.write(`\r${f + 1}/${FRAMES} dust frames, ${((Date.now() - started) / 1000).toFixed(0)}s   `);
  }
  process.stdout.write('\n');
  await browser.close();
}

// 2. One still and one video for each variant. The GPU renders the next
// still while ffmpeg encodes the video of the last one.
const run = promisify(execFile);
function encode(still, v, out) {
  const { color, opacity } = dustColor(v);
  const [r, g, b] = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
  mkdirSync(dirname(out), { recursive: true });
  return run('ffmpeg', [
    '-v', 'error', '-y',
    '-loop', '1', '-framerate', String(FPS), '-i', still,
    '-framerate', String(FPS), '-i', join(DUST_DIR, '%03d.png'),
    '-filter_complex', `[1:v]format=rgba,lutrgb=r=${r}:g=${g}:b=${b},colorchannelmixer=aa=${opacity},scale=3840:2160:flags=bicubic[s];[0:v][s]overlay=0:0:format=auto,format=yuv420p[v]`,
    '-map', '[v]', '-frames:v', String(FRAMES), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '26',
    '-g', String(FPS * 4), '-an', '-movflags', '+faststart', out,
  ]);
}
if (jobs.length) {
  const scratch = mkdtempSync(join(tmpdir(), 'theme-dust-'));
  const page = await openPhotoPage();
  let done = 0, encoding = Promise.resolve();
  for (const [i, { t, key, out }] of jobs.entries()) {
    const v = t.variants[key];
    // Two still files take turns, so the next still never replaces the still
    // that ffmpeg reads.
    const still = join(scratch, `still-${i % 2}.jpg`);
    // The view from above has no depth of field, so 12 samples smooth the edges.
    writeFileSync(still, await page.shoot('top', renderTheme(t, v), 3840, 2160, SAMPLES));
    await encoding;
    encoding = encode(still, v, out).then(() => {
      done++;
      process.stdout.write(`\r${done}/${jobs.length} videos, ${((Date.now() - started) / 1000).toFixed(0)}s   `);
    });
  }
  await encoding;
  process.stdout.write('\n');
  await page.close();
  rmSync(scratch, { recursive: true, force: true });
}
