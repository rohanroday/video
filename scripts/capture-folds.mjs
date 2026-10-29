// First-viewport captures at several window sizes, plus a shelf preview with extra issues.
//   node scripts/capture-folds.mjs [base] [outDir]   (npm run preview first)
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:4321';
const OUT = process.argv[3] || '.impeccable/review/folds';
mkdirSync(OUT, { recursive: true });
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const base = join(homedir(), '.cache', 'hyperframes', 'chrome', 'chrome-headless-shell');
  const exe = process.platform === 'win32' ? 'chrome-headless-shell.exe' : 'chrome-headless-shell';
  for (const v of readdirSync(base).sort().reverse()) for (const sub of readdirSync(join(base, v))) { const p = join(base, v, sub, exe); if (existsSync(p)) return p; }
  throw new Error('No Chrome found: set CHROME_PATH');
}
const sizes = [[1000, 520], [1440, 900], [1920, 1080], [2560, 1440], [390, 844]];
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: 'shell' });
const settle = async (page) => { await page.evaluate(async () => { await document.fonts.ready; for (const v of document.querySelectorAll('video')) { v.pause(); v.currentTime = 2.5; } }); await new Promise((r) => setTimeout(r, 900)); };
try {
  for (const [path, name] of [['', 'home'], ['styles/paper-cut/', 'style']]) for (const [w, h] of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(`${BASE}/${path}`, { waitUntil: 'networkidle0' });
    await settle(page);
    // does the cover's action sit inside the first window?
    const fit = await page.evaluate((n) => {
      const sel = n === 'home' ? '.offer .btn' : '.ic-print';
      const el = document.querySelector(sel); const r = el.getBoundingClientRect();
      const strip = document.querySelector('.issue-strip')?.getBoundingClientRect();
      return { actionBottom: Math.round(r.bottom), inView: r.bottom <= innerHeight, stripBottom: strip ? Math.round(strip.bottom) : null, overflowX: document.documentElement.scrollWidth - innerWidth };
    }, name);
    await page.screenshot({ path: join(OUT, `${name}-${w}x${h}.png`) });
    console.log(`${name} ${w}x${h}: action bottom ${fit.actionBottom}px of ${h} ${fit.inView ? 'IN VIEW' : 'BELOW FOLD'}${fit.stripBottom ? `, strip bottom ${fit.stripBottom}` : ''}${fit.overflowX > 0 ? `, OVERFLOW ${fit.overflowX}px` : ''}`);
    await page.close();
  }
  // the shelf with five issues (cards duplicated in the page) to preview how it grows
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => { const grid = document.querySelector('.shelf-grid'); const first = grid.querySelector('.zine'); const next = grid.querySelector('.zine.next'); const fields = [['#FF48B0', '#0078BF'], ['#00A95C', '#FFE800'], ['#0078BF', '#FF48B0'], ['#F15060', '#FFE800']]; fields.forEach(([f, e], i) => { const c = first.cloneNode(true); c.style.setProperty('--field', f); c.style.setProperty('--echo', e); c.querySelector('.zine-no').textContent = String(i + 2).padStart(2, '0'); grid.insertBefore(c, next); }); next.querySelector('.zine-no').textContent = '06'; });
  await settle(page);
  const shelf = await page.$('.shelf');
  await shelf.screenshot({ path: join(OUT, 'shelf-5-issues.png') });
  console.log('shelf preview with 5 issues saved');
} finally { await browser.close(); }
