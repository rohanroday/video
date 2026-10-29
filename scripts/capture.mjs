// Full-page review captures of the running site (npm run preview first).
//   node scripts/capture.mjs [base] [outDir]
// Reduced motion is emulated so entrance animations are settled, not caught mid-reveal.
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:4321';
const OUT = process.argv[3] || '.impeccable/review';
mkdirSync(OUT, { recursive: true });
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const base = join(homedir(), '.cache', 'hyperframes', 'chrome', 'chrome-headless-shell');
  const exe = process.platform === 'win32' ? 'chrome-headless-shell.exe' : 'chrome-headless-shell';
  for (const v of readdirSync(base).sort().reverse()) for (const sub of readdirSync(join(base, v))) { const p = join(base, v, sub, exe); if (existsSync(p)) return p; }
  throw new Error('No Chrome found: set CHROME_PATH');
}
const pages = [['', 'home'], ['styles/paper-cut/', 'style'], ['make-your-own/', 'own'], ['about/', 'about']];
const sizes = [['desktop', 1440, 900, 1], ['mobile', 390, 844, 2]];
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: 'shell' });
try {
  for (const [path, name] of pages) for (const [label, w, h, dpr] of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: dpr });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(`${BASE}/${path}`, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => { await document.fonts.ready; for (const v of document.querySelectorAll('video')) { v.pause(); v.currentTime = 2.5; } for (const i of document.querySelectorAll('img[loading=lazy]')) i.loading = 'eager'; });
    await new Promise((r) => setTimeout(r, 1200));
    const file = name === 'home' ? join(OUT, `${label}.png`) : join(OUT, `${name}-${label}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    console.log(`${file}${overflow > 0 ? `  OVERFLOW ${overflow}px` : ''}`);
    await page.close();
  }
} finally { await browser.close(); }
