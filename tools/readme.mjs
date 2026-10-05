// Writes README.md from the theme data.
//
//   node tools/readme.mjs

import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { themes, VARIANTS, CATEGORIES, contrast } from './palettes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://github.com/bjarneo/spice-themes';
const SITE = 'https://bjarneo.github.io/spice-themes';
// Hours that tools/photo.mjs took for all photos on the Intel Arc GPU of this
// machine. Update it after a full run.
const PHOTO_HOURS = process.env.PHOTO_HOURS || '5';

// Lowest contrast of the 6 normal ANSI colors and the text, per variant.
function stats(key) {
  let normal = 99, text = 99;
  for (const t of themes) {
    const v = t.variants[key], bg = v.colors.background;
    v.ansi.slice(1, 7).forEach(h => normal = Math.min(normal, contrast(h, bg)));
    text = Math.min(text, contrast(v.colors.foreground, bg));
  }
  return { normal: normal.toFixed(1), text: text.toFixed(1) };
}

const anchor = s => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}\- ]/gu, '').replace(/ /g, '-');
const pad = n => String(n).padStart(2, '0');
const sizeMb = Math.round(Number(execFileSync('du', ['-sm', '--exclude=.git', '--exclude=.capture', ROOT]).toString().split('\t')[0]) / 10) * 10;
const count = themes.length, total = count * VARIANTS.length;
const HEAT = ['none', 'mild', 'warm', 'hot', 'very hot', 'fiery'];

const USE = {
  night: 'A dark background with the colors of the spice. For the evening and dim rooms.',
  day: 'A cream background with the same hues. For bright rooms and daylight.',
};

const variantTable = VARIANTS.map(v => {
  const s = stats(v.key);
  return `| ${v.label} | \`saffron${v.suffix}\` | ${USE[v.key]} | ${s.normal}:1 | ${s.text}:1 |`;
}).join('\n');

const signatures = themes.filter(t => t.signature).map(t => `[${t.name}](#${anchor(t.name)})`).join(', ');

const rack = Object.entries(CATEGORIES).map(([key, label]) => {
  const list = themes.filter(t => t.cat === key);
  return `| ${label} | ${list.map(t => `[${t.name}](#${anchor(t.name)})`).join(', ')} |`;
}).join('\n');

const sections = Object.entries(CATEGORIES).map(([key, label]) => {
  const list = themes.filter(t => t.cat === key);
  return `## ${label}

${list.map(t => {
    const rows = VARIANTS.map(v => {
      const tv = t.variants[v.key], c = tv.colors;
      return `| ${v.label} | [\`${tv.install}\`](${t.slug}/${v.key}/) | \`${c.background}\` | \`${c.foreground}\` | \`${c.accent}\` | \`${tv.icons}\` |`;
    }).join('\n');
    const colors = VARIANTS.map(v => {
      const a = t.variants[v.key].ansi;
      return `| ${v.label} | ${a.slice(0, 8).map(h => `\`${h}\``).join(' ')} | ${a.slice(8).map(h => `\`${h}\``).join(' ')} |`;
    }).join('\n');
    const tags = (t.signature ? ' · Signature palette' : '') + ` · Origin: ${t.origin}`;
    const facts = [
      t.latin ? `Botanical name: *${t.latin}*` : `Parts: ${t.mix.map(m => (m.name || m.whole.label || '').toLowerCase()).join(', ')}`,
      `Part: ${t.part.toLowerCase()}`,
      `Flavor: ${t.notes.join(', ')}`,
      `Heat: ${HEAT[t.heat]}${t.shu ? `, ${t.shu} Scoville heat units` : ''}`,
    ].join(' · ');
    return `### ${t.name}

[![${t.name} at night and in the day](site/assets/shots/${t.slug}/pair.webp)](${SITE}/#${t.slug})

\`${pad(t.index)}\`${tags} · Folder: [\`${t.slug}/\`](${t.slug}/) · [Open on the site](${SITE}/#${t.slug})

${t.desc}

${facts}

| Variant | Theme name | \`background\` | \`foreground\` | \`accent\` | Icons |
| --- | --- | --- | --- | --- | --- |
${rows}

<details>
<summary>All 16 ANSI colors of each variant</summary>

| Variant | Normal, 0 to 7 | Bright, 8 to 15 |
| --- | --- | --- |
${colors}

</details>

\`\`\`bash
curl -fsSL ${SITE}/install.sh | bash -s -- ${t.slug} --set
\`\`\`
`;
  }).join('\n')}`;
}).join('\n');

const readme = `# Spice themes for Omarchy

[![All ${total} themes, from the darkest night to the lightest day.](site/assets/mosaic.jpg)](${SITE})

This repo has ${count} spice themes for [Omarchy](https://omarchy.org), from cumin to mulling spices. Each theme has a night variant and a day variant. That makes ${total} Omarchy themes. Each variant has a 16-color ANSI palette, 5 backgrounds at 6K and a dust video.

- Site: [${SITE.replace('https://', '')}](${SITE})
- Screenshots: real captures of an Omarchy desktop with each variant applied
- Backgrounds: ${total * 5} images at 6K, 6144×3456, and ${total} dust videos at 3840×2160

## Variants

| Variant | Theme name | What it is | Lowest ANSI contrast | Lowest text contrast |
| --- | --- | --- | --- | --- |
${variantTable}

The contrast columns show the lowest WCAG contrast ratio against the background, over all ${count} themes. The script raises or lowers the lightness of each color until it reaches its target. The 6 main ANSI colors reach at least 4.5:1, the WCAG AA level. The muted color for comments reaches at least 3.8:1. Each variant is a complete Omarchy theme with its own folder, so you can install any mix of them.

## Signature palettes

${themes.filter(t => t.signature).length} spices use a signature palette. Like Osaka Jade and Miasma in Omarchy, they fill the 6 ANSI slots with the colors of the spice, so a slot can hold a color that is not its name. The blue of Turmeric is the orange of its skin, and the chilies use the reds and browns of their pods. The other spices keep a classic palette, where red is red and blue is blue.

The contrast targets above apply to both kinds. A check also keeps the 6 slots apart, so no 2 slots look the same.

Signature palettes: ${signatures}.

## Backgrounds

Each variant has 6 backgrounds: 5 images and 1 video. Omarchy shows them in this order. To show the next one, run \`omarchy theme bg next\`.

| File | What it shows |
| --- | --- |
| \`0-omarchy-wordmark.jpg\` | The Omarchy wordmark spelled in the whole spice on a table. For large spices and for spices that are sold ground, the ground spice is sifted through a stencil of the wordmark, with whole pieces around it. |
| \`1-spice-bowl.jpg\` | The spice in a small bowl of glazed ceramic, wood, brass or stone, with pieces on the table. Large and flat pieces, such as star anise and bay leaves, rest on a heap of the ground spice. Long pieces lie on the table next to it. |
| \`2-spice-card.jpg\` | A profile card: the botanical name, the part of the plant, the flavor, the heat and the colors. A chili card shows its Scoville range. A blend card lists its parts. |
| \`3-ground.jpg\` | A wooden spoon heaped with the ground spice, with a small spill and whole pieces. |
| \`4-whole.jpg\` | Whole pieces from a low angle with a shallow focus. A blend shows its parts. |
| \`5-dust.mp4\` | A 12 second loop at 3840×2160. The wordmark lies sifted in the ground spice, seen from above, and fine dust drifts through a beam of light. |

The wordmark, the bowl, the spoon, the whole pieces and the still of the dust video are photographic renders. The GPU ray-marches each 3D scene with soft shadows, reflections and depth of field. The card is a flat drawing.

## Install

\`install.sh\` copies themes into \`~/.config/omarchy/themes\`. Each theme variant becomes a normal Omarchy theme folder. The script installs the night and day variants of a theme unless you name one with \`--variant\`.

### Install one theme without a clone

The script downloads only the themes that you name:

\`\`\`bash
curl -fsSL ${SITE}/install.sh | bash -s -- saffron --set
\`\`\`

To install one variant only, add \`--variant\`:

\`\`\`bash
curl -fsSL ${SITE}/install.sh | bash -s -- saffron cumin --variant day
\`\`\`

\`--set\` applies the first installed variant of the last theme.

### Install from a clone

\`\`\`bash
git clone --depth 1 ${REPO} ~/.local/share/spice-themes
cd ~/.local/share/spice-themes
./install.sh --all
omarchy theme set saffron-night
\`\`\`

The full repo is about ${sizeMb} MB because it has ${total * 5} backgrounds at 6K. To download less, use the \`curl\` command above. It downloads only the folders that you name.

### Options

| Command | Result |
| --- | --- |
| \`install.sh saffron cumin\` | Installs the night and day variants of the named themes |
| \`install.sh saffron --variant day\` | Installs only this variant |
| \`install.sh --all\` | Installs all ${total} themes |
| \`install.sh --list\` | Lists the ${count} theme names |
| \`install.sh saffron --set\` | Installs the theme, then applies its night variant |
| \`install.sh --update\` | Installs again every theme variant that the script installed |
| \`install.sh --remove saffron\` | Removes the variants of a theme that the script installed |
| \`install.sh --link saffron\` | Links to the clone instead of copying. Run \`git pull\` in the clone to update. |
| \`install.sh --force saffron\` | Replaces a theme with the same name that the script did not install |

The variant names are \`night\` and \`day\`. The script writes a \`.spice-themes\` marker file in each theme that it copies. \`--update\` and \`--remove\` use this file, so they never change a theme that you made.

### Apply with Aether

[Aether](https://github.com/omacom/aether) can apply a theme straight from the [site](${SITE}). Open a spice, pick a variant and a background, and select 1 of these buttons:

| Button | Result |
| --- | --- |
| Apply with Aether | Aether loads the palette and the background, then applies them at once through its own theme. |
| Install as Omarchy theme | Aether adds the variant to \`~/.config/omarchy/themes\` and activates it at once. This stops if a theme with the same name exists, for example after \`install.sh\`. |
| Open in editor | Aether opens the palette in its editor. Nothing changes until you select Apply. |

Aether stops a download after 60 seconds. On a slow connection, a 6K background can take longer, so the links download a 3840×2160 copy from \`site/assets/aether/\`. GitHub does not render \`aether://\` links, so use the site or build a link yourself:

\`\`\`text
aether://apply?colors=${SITE}/saffron/night/colors.toml&wallpaper=${SITE}/assets/aether/saffron/night/1-spice-bowl.jpg&silent=true
\`\`\`

Add \`&as_omarchy_theme=saffron-night\` to install the variant. Use \`&edit=true\` instead of \`&silent=true\` to open the editor.

### Name conflicts

All theme names end in \`-night\` or \`-day\`, so they do not collide with the themes that ship with Omarchy, with [coffee-themes](https://github.com/bjarneo/coffee-themes) or with [100-themes](https://github.com/bjarneo/100-themes). The script does not replace a theme that it did not install. If \`~/.config/omarchy/themes/saffron-night\` exists, the script skips it and tells you. Rename your theme, or use \`--force\` to replace it.

Folder names drop accents and apostrophes. Ají Amarillo is \`aji-amarillo\`, and Za'atar is \`zaatar\`.

\`omarchy theme install <url>\` does not work with this repo. That command expects one theme at the root of a repo.

## Switch themes and backgrounds

\`\`\`bash
omarchy theme set saffron-night   # apply a theme
omarchy theme set saffron-day     # the same spice in daylight
omarchy theme bg next             # show the next background of the current theme
\`\`\`

## The rack

| Category | Spices |
| --- | --- |
${rack}

${sections}

## How the themes are made

The scripts in [\`tools/\`](tools/) make every file in this repo. They need Node.js 22 or later, Chromium, ImageMagick and ffmpeg. \`tools/photo.mjs\` and \`tools/dust.mjs\` also need a GPU that Chromium can use through Vulkan. \`tools/capture.sh\` also needs Omarchy, Hyprland and grim.

| Script | Output |
| --- | --- |
| \`tools/palettes.mjs\` | The spice table and the color math. Every other script reads it. |
| \`tools/build.mjs\` | \`colors.toml\` and \`icons.theme\` of each variant, and \`site/assets/themes.js\` |
| \`tools/render.mjs\` | The profile card of each variant at 6K. \`tools/render.html\` draws it on a canvas. |
| \`tools/photo.mjs\` | The 4 photographic backgrounds of each variant at 6K. \`tools/photo.html\` ray-marches the 3D scenes on the GPU. |
| \`tools/dust.mjs\` | The dust video of each variant. \`tools/dust.html\` draws the dust once, \`tools/photo.html\` renders the board from above, and ffmpeg lays the dust over it. |
| \`tools/capture.sh\` | \`preview.png\` of each variant and the site screenshots. It applies each variant on this desktop and takes a screenshot of workspace 8. |
| \`tools/preview.mjs\` | Optional. Draws a desktop preview for each variant on a computer without Omarchy. \`tools/capture.sh\` replaces these drawings with real screenshots. |
| \`tools/assets.mjs\` | The site previews, the thumbnails, the Aether copies and the mosaic |
| \`tools/readme.mjs\` | This README |

To build everything again, run the scripts in this order:

\`\`\`bash
node tools/build.mjs
node tools/render.mjs
node tools/photo.mjs
node tools/dust.mjs
tools/capture.sh
node tools/assets.mjs
node tools/readme.mjs
\`\`\`

\`tools/photo.mjs\` takes about ${PHOTO_HOURS} hours for all ${total * 4} photos on an Intel Arc GPU. It draws small tiles and waits for the GPU after every few tiles. Some GPU drivers reset the GPU when one job runs longer than 5 seconds. Each shape of spice compiles its own shader the first time, so the first image of each shape takes longer.

\`tools/capture.sh\` takes about 30 minutes. It changes the theme of the desktop ${total} times and shows workspace 8 the whole time. Open the windows that you want in the screenshots on workspace 8 first. If you switch to another workspace, the script stops and restores your theme. Run it again to continue where it stopped. On a computer without Omarchy, run \`node tools/preview.mjs\` instead.

To change a spice, edit its row in \`tools/palettes.mjs\`, then run the scripts with the theme name, for example \`node tools/photo.mjs saffron\` and \`tools/capture.sh saffron\`.

The site in [\`site/\`](site/) is a static page. The workflow in \`.github/workflows/pages.yml\` copies \`install.sh\` and every \`colors.toml\` into it and publishes it to GitHub Pages.
`;

writeFileSync(join(ROOT, 'README.md'), readme);
console.log(`wrote README.md (${themes.length} themes)`);
