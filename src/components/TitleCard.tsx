// The live thing: the visitor's topic, cut out on a torn paper strip and taped to the table, drawn the Paper Cut way.
import { useEffect, useRef } from 'preact/hooks';

const W = 960, H = 540;

function rand(seed: number) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; }
function tornRect(w: number, h: number, seed: number) {
  const r = rand(seed), p = new Path2D(), j = () => (r() - 0.5) * 7, step = 9;
  p.moveTo(0, j());
  for (let x = step; x < w; x += step) p.lineTo(x, j());
  for (let y = 0; y < h; y += step) p.lineTo(w + j(), y);
  for (let x = w; x > 0; x -= step) p.lineTo(x, h + j());
  for (let y = h; y > 0; y -= step) p.lineTo(j(), y);
  p.closePath(); return p;
}
function lifted(c: CanvasRenderingContext2D, lift: number) { c.shadowColor = 'rgba(62,40,18,.32)'; c.shadowBlur = 2 + lift * 1.4; c.shadowOffsetX = lift * 0.45; c.shadowOffsetY = lift * 0.75; }
function wrap(c: CanvasRenderingContext2D, text: string, max: number) {
  const out: string[] = []; let line = '';
  for (const w of text.split(/\s+/)) { const t = line ? `${line} ${w}` : w; if (c.measureText(t).width > max && line) { out.push(line); line = w; } else line = t; }
  if (line) out.push(line); return out;
}

export default function TitleCard({ topic }: { topic: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current?.getContext('2d'); if (!c) return;
    const draw = () => {
      const words = (topic.trim().split('\n')[0] || 'Your topic goes here').slice(0, 70);
      c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
      c.fillStyle = '#E8D9BE'; c.fillRect(0, 0, W, H);
      // the strip, sized to the words
      let size = 84; c.font = `800 ${size}px "Bricolage Grotesque Variable", system-ui, sans-serif`;
      let lines = wrap(c, words, 720);
      while ((lines.length > 3 || lines.some((l) => c.measureText(l).width > 740)) && size > 40) { size -= 6; c.font = `800 ${size}px "Bricolage Grotesque Variable", system-ui, sans-serif`; lines = wrap(c, words, 720); }
      const lh = size * 1.08, sh = lines.length * lh + 110, sy = (H - sh) / 2;
      c.save(); c.translate(100, sy); c.rotate(-0.018); lifted(c, 12); c.fillStyle = '#F8F1E2'; c.fill(tornRect(760, sh, words.length + 7)); c.restore();
      // masking tape on two corners
      for (const [x, y, a] of [[118, sy + 6, -0.55], [842, sy - 4, 0.5]] as const) {
        c.save(); c.translate(x, y); c.rotate(a); lifted(c, 2); c.fillStyle = 'rgba(240,226,176,.85)'; c.fillRect(-55, -15, 110, 30); c.restore();
      }
      // sticker-cut words: cream backing edge, ink face, the last line in tomato
      c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
      lines.forEach((l, i) => {
        const y = sy + 55 + lh * (i + 0.82);
        c.save(); lifted(c, 5); c.strokeStyle = '#F8F1E2'; c.lineWidth = 14; c.strokeText(l, W / 2, y); c.restore();
        c.fillStyle = i === lines.length - 1 && lines.length > 1 ? '#E4572E' : '#2B2A33'; c.fillText(l, W / 2, y);
      });
    };
    draw();
    document.fonts?.ready.then(draw);
  }, [topic]);
  return <canvas ref={ref} width={W} height={H} class="title-card" aria-label={`Paper title card reading: ${topic.trim().split('\n')[0] || 'Your topic goes here'}`} />;
}
