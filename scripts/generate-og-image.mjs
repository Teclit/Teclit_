// Génère l'image de partage `public/og-image.png` (1200x630, ratio 1,91:1).
// Mise en page centrée : la photo et le nom restent visibles même quand une plateforme
// recadre l'image en carré pour sa vignette compacte (LinkedIn, WhatsApp, Messenger…).
// Usage : npm run og-image  (à relancer après changement de photo ou de titre)
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const profile = JSON.parse(readFileSync(resolve(root, 'src/content/profile.json'), 'utf8'));
const name = profile.identity.fullName;

const W = 1200;
const H = 630;
const PHOTO = 280; // diamètre de la photo
const PHOTO_TOP = 50;
const RING = 10;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="#0a0d14"/>
  <rect width="12" height="100%" fill="#3b82f6"/>
  <circle cx="${W / 2}" cy="${PHOTO_TOP + PHOTO / 2}" r="${PHOTO / 2 + RING}" fill="#0b5cad"/>
  <text x="${W / 2}" y="420" text-anchor="middle" font-family="${FONT}" font-size="64" font-weight="700" fill="#f8fafc">${esc(name)}</text>
  <text x="${W / 2}" y="478" text-anchor="middle" font-family="${FONT}" font-size="34" fill="#93c5fd">Développeur Full Stack</text>
  <text x="${W / 2}" y="540" text-anchor="middle" font-family="${FONT}" font-size="26" fill="#cbd5e1">Java · Kotlin · Spring Boot · Node.js · NestJS · React · Docker</text>
</svg>`);

const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO}" height="${PHOTO}"><circle cx="${PHOTO / 2}" cy="${PHOTO / 2}" r="${PHOTO / 2}"/></svg>`,
);
const photo = await sharp(resolve(root, 'public/assets/images/profile-640.webp'))
  .resize(PHOTO, PHOTO, { fit: 'cover', position: 'top' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const out = resolve(root, 'public/og-image.png');
const info = await sharp(background)
  .composite([{ input: photo, left: (W - PHOTO) / 2, top: PHOTO_TOP }])
  .png({ compressionLevel: 9 })
  .toFile(out);
console.log(`public/og-image.png ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)} kB`);
