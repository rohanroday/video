// Renders the four "print run" pictures in public/steps/ from the running site (npm run preview first):
//   1 the issue card on the shelf, 2 the order slip with a topic typed, 3 the copy button just after a copy,
//   4 a drawn chat (not a screenshot of any real app) showing the pasted prompt and the storyboard reply.
//   node scripts/render-steps.mjs [http://localhost:4321]
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:4321';
const OUT = join('public', 'steps');
mkdirSync(OUT, { recursive: true });
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const base = join(homedir(), '.cache', 'hyperframes', 'chrome', 'chrome-headless-shell');
  const exe = process.platform === 'win32' ? 'chrome-headless-shell.exe' : 'chrome-headless-shell';
  for (const v of readdirSync(base).sort().reverse()) for (const sub of readdirSync(join(base, v))) { const p = join(base, v, sub, exe); if (existsSync(p)) return p; }
  throw new Error('No Chrome found: set CHROME_PATH');
}

// a 4:3 clip around the union of some elements, kept inside the page
async function clip43(page, selectors, pad = 36) {
  const box = await page.evaluate((sels, pad) => {
    const rs = sels.map((s) => document.querySelector(s).getBoundingClientRect());
    let x0 = Math.min(...rs.map((r) => r.left)) - pad, y0 = Math.min(...rs.map((r) => r.top)) - pad;
    let x1 = Math.max(...rs.map((r) => r.right)) + pad, y1 = Math.max(...rs.map((r) => r.bottom)) + pad;
    let w = x1 - x0, h = y1 - y0;
    if (w / h > 4 / 3) { const nh = w * 3 / 4; y0 -= (nh - h) / 2; h = nh; } else { const nw = h * 4 / 3; x0 -= (nw - w) / 2; w = nw; }
    x0 = Math.max(0, Math.min(x0, document.documentElement.scrollWidth - w));
    return { x: x0 + scrollX, y: Math.max(0, y0 + scrollY), width: w, height: h };
  }, selectors, pad);
  return box;
}
async function shoot(page, clip, name) {
  const tmp = join(OUT, `${name}.png`);
  await page.screenshot({ path: tmp, clip, captureBeyondViewport: true });
  spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', tmp, '-vf', 'scale=1200:900:flags=lanczos', '-q:v', '3', join(OUT, `${name}.jpg`)]);
  unlinkSync(tmp);
  console.log(join(OUT, `${name}.jpg`));
}
const settle = (page) => page.evaluate(async () => { await document.fonts.ready; await new Promise((r) => setTimeout(r, 600)); });

const browser = await puppeteer.launch({ executablePath: chromePath(), headless: 'shell' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} } }));

  // 1: the issue on the shelf
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });
  await page.$eval('#issues', (el) => el.scrollIntoView());
  await page.evaluate(() => document.querySelectorAll('.shelf-grid .zine:not(:first-child)').forEach((z) => { z.style.visibility = 'hidden'; }));
  await settle(page);
  await shoot(page, await clip43(page, ['.shelf-grid .zine:first-child'], 40), 'step-1');

  // 2: the order slip with a topic written in, and its title card
  await page.goto(`${BASE}/styles/paper-cut/`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => [...document.querySelectorAll('.builder button')].some((b) => !b.disabled));
  await page.type('.builder textarea', 'How to start running\n- start with 10 minutes\n- go slow, every other day');
  await page.$eval('.builder', (el) => el.scrollIntoView({ block: 'center' }));
  await settle(page);
  await shoot(page, await clip43(page, ['.builder textarea', '.builder-card'], 28), 'step-2');

  // 3: the copy, just after the click: button, stamped print, status
  await page.evaluate(() => [...document.querySelectorAll('.builder button')].find((b) => b.textContent.includes('Copy')).click());
  await page.waitForFunction(() => document.querySelector('.press-print'));
  await settle(page);
  await shoot(page, await clip43(page, ['.builder .toggle', '.actions', '.press-print', '.builder .status'], 30), 'step-3');

  // 4: a drawn chat in the site's own paper style: pasted prompt, then the storyboard reply
  await page.goto(`${BASE}/about/`, { waitUntil: 'networkidle0' });
  await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });
  await page.evaluate((base) => {
    const f = (i) => `${base}/styles/paper-cut/media/frames/${String(i).padStart(2, '0')}.jpg`;
    document.body.innerHTML = `
      <div style="position:fixed;inset:0;background:#e8e2d3;display:grid;place-items:center;font-family:'Schibsted Grotesk Variable',sans-serif;color:#1a1a1a">
        <div style="width:720px;height:540px;background:#fbf8f1;box-shadow:0 1px 1px rgba(26,26,26,.12),0 16px 32px -10px rgba(26,26,26,.35);padding:26px 30px;display:grid;grid-template-rows:auto auto 1fr;gap:18px;position:relative">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:15px;color:#4a4640;border-bottom:2px solid #1a1a1a;padding-bottom:10px">
            <b style="font-family:'Bricolage Grotesque Variable';font-stretch:80%;font-weight:800;font-size:22px;text-transform:uppercase;color:#1a1a1a">New chat</b><span>Claude</span>
          </div>
          <div style="justify-self:end;display:flex;align-items:center;gap:14px;background:#1a1a1a;color:#f4f0e6;padding:12px 16px;max-width:430px">
            <div style="width:46px;height:56px;background:#fbf8f1;padding:7px 6px;display:grid;gap:5px;align-content:start">
              <i style="height:4px;background:#bfd3ea"></i><i style="height:4px;background:#bfd3ea"></i><i style="height:4px;background:#bfd3ea;width:70%"></i><i style="height:4px;background:#bfd3ea"></i>
            </div>
            <div><b style="display:block;font-size:17px">Paper Cut prompt · 58 KB</b><span style="font-size:15px;opacity:.85">Topic: How to start running</span></div>
          </div>
          <div style="display:grid;gap:12px;align-content:start;max-width:560px">
            <p style="margin:0;font-size:17px;line-height:1.4">Here is the storyboard: one still for every beat. Approve it and I'll build the full animation with its sound.</p>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
              ${[4, 11, 21, 29].map((i, k) => `<figure style="margin:0"><img src="${f(i)}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;box-shadow:0 1px 2px rgba(0,0,0,.25)"><figcaption style="font-size:12px;color:#4a4640;padding-top:4px">Beat ${k + 1}</figcaption></figure>`).join('')}
            </div>
            <div style="display:flex;gap:10px;margin-top:6px">
              <span style="background:#0078bf;color:#fff;font-weight:700;font-size:16px;padding:12px 18px;border-radius:2px">Approve and build</span>
              <span style="font-weight:700;font-size:16px;padding:12px 6px;text-decoration:underline;text-decoration-color:#ff48b0;text-underline-offset:4px">Change beat 2</span>
            </div>
          </div>
          <span style="position:absolute;right:26px;bottom:20px;font-size:12px;color:#7a7368">Illustration</span>
        </div>
      </div>`;
  }, BASE);
  await page.evaluate(async () => { await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); });
  await settle(page);
  await shoot(page, { x: 40, y: 30, width: 720, height: 540 }, 'step-4');
} finally { await browser.close(); }
