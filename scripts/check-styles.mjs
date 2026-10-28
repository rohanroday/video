// Checks every style folder before a build: required files, the {{CONTENT}} slot, the renderer contract,
// rendered media, and that no third-party style library is referenced anywhere in the site's source.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stylesDir = join(root, 'public', 'styles');
const data = readFileSync(join(root, 'src', 'data', 'styles.ts'), 'utf8');
const ids = [...data.matchAll(/id: '([a-z0-9-]+)'/g)].map((m) => m[1]);
const errors = [];
const need = (ok, msg) => { if (!ok) errors.push(msg); };

for (const id of ids) {
  const dir = join(stylesDir, id);
  for (const f of ['prompt.md', 'reference.html', 'media/sample.mp4', 'media/poster.jpg', 'media/frames/00.jpg']) need(existsSync(join(dir, f)), `${id}: missing ${f}`);
  if (!existsSync(join(dir, 'reference.html')) || !existsSync(join(dir, 'prompt.md'))) continue;
  const html = readFileSync(join(dir, 'reference.html'), 'utf8'), prompt = readFileSync(join(dir, 'prompt.md'), 'utf8');
  need(prompt.includes('{{CONTENT}}'), `${id}: prompt.md has no {{CONTENT}} slot`);
  for (const k of ['window.seek', 'window.DURATION', 'window.scoreSound', 'window.SFX', 'window.__ready', '<canvas']) need(html.includes(k), `${id}: reference.html is missing ${k}`);
  need(!/Math\.random\(/.test(html), `${id}: reference.html uses Math.random (frames must be deterministic)`);
}
for (const d of readdirSync(stylesDir)) need(ids.includes(d), `public/styles/${d} is not listed in src/data/styles.ts`);

// nothing from other style libraries may ship with this site
const banned = new RegExp(['na', 'fay'].join(''), 'i'); // assembled so this file doesn't match itself
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); if (['node_modules', 'dist', '.astro', '.git', 'media', '.taste-skill'].includes(f)) return []; return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const f of walk(root)) if (/\.(astro|ts|tsx|js|mjs|css|md|html|json)$/.test(f) && banned.test(readFileSync(f, 'utf8'))) errors.push(`${relative(root, f)}: mentions a third-party style library`);

if (errors.length) { console.error('Style check failed:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log(`Style check passed: ${ids.length} style(s).`);
