// Génère l'image de partage `public/og-image.jpg` (1200x630, ratio 1,91:1).
//
// Composition « pleine largeur » : la photo est l'élément dominant, sans pastille ronde ni texte.
// Titre et description restent des métadonnées natives (og:title / og:description), affichées
// sous l'image par les plateformes. Le visage est centré : il reste entier quand une plateforme
// recadre l'image en carré pour sa vignette compacte (WhatsApp, Messenger…).
//
// Source : `scripts/og-source/profile-1024.png` (portrait original 1024x1024, hors `public/`,
// donc non déployé). Il est détouré en disque sur fond bleu uni : les coins transparents sont
// remplis avec ce même bleu, puis le fond est prolongé sur toute la largeur — aucun étirement,
// aucun détail inventé. Un fondu sombre aux bords et en bas raccorde au thème sombre du site.
//
// Écrit aussi `src/app/core/og-image.generated.ts` : dimensions + version (empreinte du fichier)
// utilisée en `?v=` — les plateformes cachent l'image par URL, toute modification de l'image
// change donc l'URL et force un nouveau scraping, sans incrément manuel.
// Usage : npm run og-image  (à relancer après changement de photo)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const SOURCE = resolve(root, 'scripts/og-source/profile-1024.png');
const OUT = 'public/og-image.jpg';

const W = 1200;
const H = 630;
/** Fond uni du portrait source (échantillonné) : sert à prolonger la photo sans couture. */
const PHOTO_BG = '#0d56a1';
/** Fond sombre du site (`--bg` du thème sombre). */
const DARK = '#0a0d14';

/** Partie utile du portrait (coordonnées source) : cheveux -> haut des épaules. */
const CROP_HEIGHT = 800;
/** Marge au-dessus des cheveux (px source), prise dans le même bleu. */
const HEADROOM = 60;

// 1) Portrait : coins transparents remplis par le bleu du fond, marge en haut, recadré sous les
//    épaules puis réduit à la hauteur du canevas (réduction 860 -> 630 : pas de perte de netteté).
//    Un masque elliptique fond les bords de la photo (dont la découpe circulaire des épaules)
//    dans le fond bleu identique : aucune couture visible.
const meta = await sharp(SOURCE).metadata();
const photoHeight = H;
const photoWidth = Math.round((meta.width * photoHeight) / (CROP_HEIGHT + HEADROOM));
const fade = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${photoWidth}" height="${photoHeight}">
  <defs>
    <radialGradient id="m" cx="0.5" cy="0.42" r="0.62" gradientTransform="translate(0.5 0.42) scale(0.9 1) translate(-0.5 -0.42)">
      <stop offset="0.68" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#m)"/>
</svg>`);
// sharp applique toujours extend après resize : le recadrage + la marge sont faits dans une
// première passe, la réduction dans la seconde.
const framed = await sharp(SOURCE)
  .flatten({ background: PHOTO_BG })
  .extract({ left: 0, top: 0, width: meta.width, height: CROP_HEIGHT })
  .extend({ top: HEADROOM, background: PHOTO_BG })
  .toBuffer();
const photo = await sharp(framed)
  .resize(photoWidth, photoHeight, { kernel: 'lanczos3' })
  .ensureAlpha()
  .composite([{ input: fade, blend: 'dest-in' }])
  .png()
  .toBuffer();

// 2) Fond pleine largeur dans le bleu de la photo, légère texture de points sur les côtés.
const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="#ffffff" fill-opacity="0.10"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="${PHOTO_BG}"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
</svg>`);

// 3) Finitions par-dessus la photo : vignette sombre sur les côtés et en bas (thème du site).
const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sides" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${DARK}" stop-opacity="0.92"/>
      <stop offset="0.22" stop-color="${DARK}" stop-opacity="0.35"/>
      <stop offset="0.36" stop-color="${DARK}" stop-opacity="0"/>
      <stop offset="0.64" stop-color="${DARK}" stop-opacity="0"/>
      <stop offset="0.78" stop-color="${DARK}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${DARK}" stop-opacity="0.92"/>
    </linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.6" stop-color="${DARK}" stop-opacity="0"/>
      <stop offset="1" stop-color="${DARK}" stop-opacity="0.75"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#sides)"/>
  <rect width="100%" height="100%" fill="url(#bottom)"/>
</svg>`);

const out = resolve(root, OUT);
const info = await sharp(background)
  .composite([{ input: photo, left: Math.round((W - photoWidth) / 2), top: 0 }, { input: overlay }])
  .flatten({ background: DARK })
  .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(out);

if (info.width !== W || info.height !== H) throw new Error(`Dimensions inattendues : ${info.width}x${info.height}`);

const version = createHash('sha256').update(readFileSync(out)).digest('hex').slice(0, 8);
writeFileSync(
  resolve(root, 'src/app/core/og-image.generated.ts'),
  `// Généré par scripts/generate-og-image.mjs — ne pas modifier à la main.
export const OG_IMAGE_FILE = {
  path: '/og-image.jpg?v=${version}',
  width: ${info.width},
  height: ${info.height},
  type: 'image/jpeg',
} as const;
`,
);
console.log(`${OUT} ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)} kB (v=${version})`);
