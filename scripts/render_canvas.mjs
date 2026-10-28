// Render a canvas animation page (window.seek / DURATION / scoreSound / SFX) to MP4.
//
//   node render_canvas.mjs --input video.html --out exports/name-v1.mp4
//        [--fps 30] [--size 1920x1080] [--vo voiceover.wav] [--aroll clip.mp4]
//        [--fx-gain 1] [--vo-gain 1] [--stills 1.5,4,8 --stills-dir work/stills]
//
// --vo     mixes the effects (rendered in voiceover mode) under a narration file.
// --aroll  loads a talking-head clip with window.loadARoll (for styles that define it) and uses its sound as the voice.
// --stills only saves PNG frames at those times (for storyboards), no video.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith('--') ? a.concat([[v.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]]) : a), []));
if (!args.input || (!args.out && !args.stills)) { console.error('usage: node render_canvas.mjs --input page.html --out out.mp4 [--fps 30] [--size WxH] [--vo file] [--aroll file] [--stills t,t --stills-dir dir]'); process.exit(1); }
const FPS = +(args.fps || 30), input = resolve(args.input);
// social-media loudness (Reels/Shorts/TikTok sit around -14 LUFS); --lufs to change it
const LOUD = `loudnorm=I=${args.lufs || -14}:TP=-1.5:LRA=11,aresample=48000`;

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  // HyperFrames keeps it in ~/.cache/hyperframes/chrome/chrome-headless-shell/<version>/chrome-headless-shell-<platform>/
  const base = join(homedir(), '.cache', 'hyperframes', 'chrome', 'chrome-headless-shell');
  const exe = process.platform === 'win32' ? 'chrome-headless-shell.exe' : 'chrome-headless-shell';
  if (existsSync(base)) for (const v of readdirSync(base).sort().reverse()) {
    const dir = join(base, v); if (!existsSync(dir)) continue;
    for (const sub of readdirSync(dir)) { const p = join(dir, sub, exe); if (existsSync(p)) return p; }
  }
  throw new Error('Chrome Headless Shell not found: run `hyperframes browser ensure` or set CHROME_PATH');
}
const run = (cmd, a) => { const r = spawnSync(cmd, a, { stdio: ['ignore', 'ignore', 'pipe'] }); if (r.status) throw new Error(cmd + ' failed: ' + r.stderr.toString().slice(-800)); };

const work = join(tmpdir(), 'render_canvas_' + process.pid); mkdirSync(work, { recursive: true });
const browser = await puppeteer.launch({ executablePath: chromePath(), headless: 'shell', args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  page.on('pageerror', (e) => console.error('[page error]', e.message));
  await page.goto(pathToFileURL(input).href, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction('window.__ready === true', { timeout: 120000 });

  let voice = args.vo ? resolve(args.vo) : null;
  if (args.aroll) {
    // re-encode to VP9 so the headless browser can always decode it; its sound becomes the voice track
    const webm = join(work, 'aroll.webm'), wav = join(work, 'aroll.wav');
    run('ffmpeg', ['-y', '-v', 'error', '-i', resolve(args.aroll), '-an', '-c:v', 'libvpx-vp9', '-deadline', 'realtime', '-cpu-used', '8', '-b:v', '6M', '-g', '1', webm]);
    run('ffmpeg', ['-y', '-v', 'error', '-i', resolve(args.aroll), '-vn', '-ac', '2', '-ar', '48000', wav]);
    voice = voice || wav;
    await page.evaluate((u) => window.loadARoll(u), pathToFileURL(webm).href);
  }

  const info = await page.evaluate(() => { const c = document.querySelector('canvas'); return { D: window.DURATION, w: c.width, h: c.height }; });
  const grab = async (t) => page.evaluate(async (t) => {
    const t0 = performance.now(); const r = window.seek(t); if (r && r.then) await r; const ms = performance.now() - t0;
    return { ms, png: document.querySelector('canvas').toDataURL('image/png').split(',')[1] };
  }, t);

  if (args.stills) {
    const dir = resolve(args['stills-dir'] || 'stills'); mkdirSync(dir, { recursive: true });
    for (const t of String(args.stills).split(',').map(Number)) { const f = await grab(t); writeFileSync(join(dir, `still-${t.toFixed(2)}s.png`), Buffer.from(f.png, 'base64')); }
    console.log('stills saved to', dir);
  } else {
    // ---- sound: the page renders its own score offline ----
    const vo = !!voice;
    const audio = await page.evaluate(async (vo) => {
      const r = await window.SFX.render(window.scoreSound, window.DURATION, 48000, { voiceover: vo });
      const pcm = new Int16Array(r.inter.length); const k = r.peak > 0.98 ? 0.98 / r.peak : 1;
      for (let i = 0; i < pcm.length; i++) pcm[i] = Math.max(-32767, Math.min(32767, Math.round(r.inter[i] * k * 32767)));
      let s = ''; const b = new Uint8Array(pcm.buffer); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
      return { b64: btoa(s), peak: r.peak };
    }, vo);
    const pcm = Buffer.from(audio.b64, 'base64'), hdr = Buffer.alloc(44);
    hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVE', 8); hdr.write('fmt ', 12); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(2, 22);
    hdr.writeUInt32LE(48000, 24); hdr.writeUInt32LE(48000 * 4, 28); hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);
    const fxWav = join(work, 'fx.wav'); writeFileSync(fxWav, Buffer.concat([hdr, pcm]));

    // ---- picture: seek every frame, pipe PNGs into ffmpeg ----
    const silent = join(work, 'video.mp4'), N = Math.round(info.D * FPS);
    const vf = args.size ? ['-vf', `scale=${String(args.size).replace('x', ':')}:flags=lanczos`] : [];
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', ...vf, '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
    const done = new Promise((res, rej) => ff.on('close', (c) => (c ? rej(new Error('ffmpeg exited ' + c)) : res())));
    let slow = 0, worst = 0;
    for (let i = 0; i < N; i++) {
      const f = await grab(i / FPS); worst = Math.max(worst, f.ms); if (f.ms > 50) slow++;
      if (!ff.stdin.write(Buffer.from(f.png, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
      if (i % FPS === 0) process.stdout.write(`\rframe ${i}/${N}`);
    }
    ff.stdin.end(); await done; process.stdout.write(`\rframe ${N}/${N}\n`);

    // ---- mux: effects alone, or effects under the voice ----
    const out = resolve(args.out); mkdirSync(dirname(out), { recursive: true });
    const fxg = args['fx-gain'] || (vo ? 0.8 : 1), vog = args['vo-gain'] || 1;
    const amix = vo
      ? ['-i', voice, '-filter_complex', `[1:a]volume=${fxg}[fx];[2:a]aresample=48000,volume=${vog}[v];[fx][v]amix=inputs=2:duration=first:normalize=0,${LOUD}[a]`, '-map', '0:v', '-map', '[a]']
      : ['-filter_complex', `[1:a]volume=${fxg},${LOUD}[a]`, '-map', '0:v', '-map', '[a]'];
    run('ffmpeg', ['-y', '-v', 'error', '-i', silent, '-i', fxWav, ...amix, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', String(info.D), '-movflags', '+faststart', out]);
    console.log(JSON.stringify({ out, duration: info.D, canvas: `${info.w}x${info.h}`, frames: N, fps: FPS, worstFrameMs: +worst.toFixed(1), framesOver50ms: slow, audioPeak: +audio.peak.toFixed(3), voice: voice || null }));
  }
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}
