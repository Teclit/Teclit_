// Génère le CV PDF téléchargeable (public/cv/) en imprimant la page /cv du build.
// Usage : npm run build && npm run cv:pdf   (puis rebuild pour inclure le PDF)
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'public/cv/Teklit-TEWOLDE-CV.pdf');
const port = 4310;

const server = spawn(process.execPath, ['dist/teclit/server/server.mjs'], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: 'ignore',
});
try {
  await new Promise((r) => setTimeout(r, 1500));
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
  const page = await browser.newPage();
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.goto(`http://localhost:${port}/cv`, { waitUntil: 'networkidle' });
  mkdirSync(dirname(out), { recursive: true });
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
  });
  await browser.close();
  console.log(`[cv:pdf] ${out}`);
} finally {
  server.kill();
}
