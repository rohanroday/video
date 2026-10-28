// Render the sample video, poster and contact-sheet frames for every style (or the ones named on the command line).
//   npm run previews            all styles
//   npm run previews paper-cut  one style
// Needs FFmpeg on PATH and HyperFrames' Chrome Headless Shell (or CHROME_PATH).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stylesDir = join(root, 'public', 'styles');
const renderer = join(root, 'scripts', 'render_canvas.mjs');
const FRAMES = 30;

const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: 'inherit' }); if (r.status) throw new Error(`${cmd} failed`); };
const probe = (file) => { const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }); return parseFloat(r.stdout); };

const ids = process.argv.slice(2).length ? process.argv.slice(2) : readdirSync(stylesDir).filter((d) => existsSync(join(stylesDir, d, 'reference.html')));
for (const id of ids) {
  const dir = join(stylesDir, id), media = join(dir, 'media'), frames = join(media, 'frames'), tmp = join(media, '.tmp');
  console.log(`\n== ${id}`);
  mkdirSync(frames, { recursive: true });
  // sample video (H.264 + AAC, faststart) from the renderer
  run('node', [renderer, '--input', join(dir, 'reference.html'), '--out', join(media, 'sample.mp4')]);
  const D = probe(join(media, 'sample.mp4'));
  // evenly spaced stills, skipping the first and last half second
  const times = Array.from({ length: FRAMES }, (_, i) => (0.5 + ((D - 1) * i) / (FRAMES - 1)).toFixed(2));
  rmSync(tmp, { recursive: true, force: true });
  run('node', [renderer, '--input', join(dir, 'reference.html'), '--stills', times.join(','), '--stills-dir', tmp]);
  times.forEach((t, i) => run('ffmpeg', ['-y', '-v', 'error', '-i', join(tmp, `still-${t}s.png`), '-vf', 'scale=960:-1', '-q:v', '4', join(frames, `${String(i).padStart(2, '0')}.jpg`)]));
  run('ffmpeg', ['-y', '-v', 'error', '-i', join(tmp, `still-${times[Math.floor(FRAMES * 0.3)]}s.png`), '-q:v', '3', join(media, 'poster.jpg')]);
  rmSync(tmp, { recursive: true, force: true });
  console.log(`${id}: sample.mp4 (${D.toFixed(1)} s), poster.jpg, ${FRAMES} frames`);
}
