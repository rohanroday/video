// End-to-end check of the prompt builders against a running site (npm run preview first).
//   node scripts/test-builder.mjs [http://localhost:4321]
// Types a topic, switches voiceover on, clicks Copy and checks what reached the clipboard.
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] || 'http://localhost:4321';
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const base = join(homedir(), '.cache', 'hyperframes', 'chrome', 'chrome-headless-shell');
  const exe = process.platform === 'win32' ? 'chrome-headless-shell.exe' : 'chrome-headless-shell';
  if (existsSync(base)) for (const v of readdirSync(base).sort().reverse()) for (const sub of readdirSync(join(base, v))) { const p = join(base, v, sub, exe); if (existsSync(p)) return p; }
  throw new Error('No Chrome found: set CHROME_PATH');
}

const browser = await puppeteer.launch({ executablePath: chromePath(), headless: 'shell' });
const fails = [];
const check = (ok, msg) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`); if (!ok) fails.push(msg); };
const stubClipboard = () => { window.__copied = null; Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (t) => { window.__copied = t; } } }); };
try {
  const page = await browser.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.evaluateOnNewDocument(stubClipboard);

  // style page builder
  await page.goto(`${BASE}/styles/paper-cut/`, { waitUntil: 'networkidle0' });
  await page.$eval('#prompt', (el) => el.scrollIntoView());
  await page.waitForFunction(() => [...document.querySelectorAll('.builder button')].some((b) => b.textContent.includes('Copy') && !b.disabled), { timeout: 15000 });
  const topic = 'How to brew pour-over coffee\n- grind medium-fine\n- 1:16 ratio, cost $3';
  await page.type('.builder textarea', topic);
  await page.evaluate(() => [...document.querySelectorAll('.builder button')].find((b) => b.textContent === 'With voiceover').click());
  await page.evaluate(() => [...document.querySelectorAll('.builder button')].find((b) => b.textContent.startsWith('Copy')).click());
  await page.waitForFunction(() => window.__copied && document.querySelector('.builder [aria-live]').textContent.startsWith('Copied'), { timeout: 5000 }).catch(() => {});
  const text = await page.evaluate(() => window.__copied || '');
  const status = await page.$eval('.builder [aria-live]', (el) => el.textContent);
  check(text.includes(topic), 'topic is in the prompt, "$" kept as typed');
  check(!text.includes('{{CONTENT}}'), 'the {{CONTENT}} slot is filled');
  check(text.includes('VOICEOVER\nI have a voiceover'), 'voiceover mode text is included');
  check(text.includes('REFERENCE SOURCE') && text.includes('window.scoreSound') && text.trimEnd().endsWith('```'), 'the full reference file is appended in a fence');
  check(text.length > 40000, `prompt size ${Math.round(text.length / 1024)} KB`);
  check(/Copied \d+ KB/.test(status), `status says: ${status}`);
  const card = await page.$eval('.title-card', (c) => c.getAttribute('aria-label'));
  check(card.includes('How to brew pour-over coffee'), 'title card shows the first line of the topic');

  // make-your-own builder
  await page.goto(`${BASE}/make-your-own/`, { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => [...document.querySelectorAll('.builder-form button')].some((b) => b.textContent.includes('Copy') && !b.disabled), { timeout: 15000 });
  await page.type('.builder-form textarea', 'Neon signs on a wet street at night');
  await page.evaluate(() => [...document.querySelectorAll('.builder-form button')].find((b) => b.textContent.startsWith('Copy')).click());
  await page.waitForFunction(() => window.__copied);
  const clone = await page.evaluate(() => window.__copied);
  check(clone.includes('Neon signs on a wet street at night') && clone.includes('REFERENCE SOURCE'), 'new-style prompt has the look and the reference');
  check(clone.includes('MY CONTENT\n{{CONTENT}}'), 'new-style prompt keeps the example guide\'s {{CONTENT}} slot');
  check(errors.length === 0, `no page errors${errors.length ? ': ' + errors.join('; ') : ''}`);
} finally {
  await browser.close();
}
if (fails.length) { console.error(`\n${fails.length} check(s) failed`); process.exit(1); }
console.log('\nAll builder checks passed.');
