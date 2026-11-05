// Génère les variantes AVIF responsives (320w, 640w) des images de contenu.
// Convention (cf. src/app/core/image-loader.ts) : `<nom>.webp` -> `<nom>-320.avif`, `<nom>-640.avif`.
// Usage : npm run images  (à relancer après ajout ou remplacement d'une image source)
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '../public/assets');
const WIDTHS = [320, 640];
const SOURCES = [
  ...readdirSync(join(root, 'projects'))
    .filter((f) => f.endsWith('.webp'))
    .map((f) => ({ src: join(root, 'projects', f), base: join(root, 'projects', f.replace(/\.webp$/, '')) })),
  { src: join(root, 'images/profile-640.webp'), base: join(root, 'images/profile') },
];

for (const { src, base } of SOURCES) {
  for (const width of WIDTHS) {
    const out = `${base}-${width}.avif`;
    const info = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 60, effort: 6 })
      .toFile(out);
    console.log(`${out.slice(root.length + 1)} ${info.width}x${info.height} ${(info.size / 1024).toFixed(1)} kB`);
  }
}
