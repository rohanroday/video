import { useEffect, useMemo, useState } from 'preact/hooks';
import { buildClonePrompt, kb } from '../lib/buildPrompt';

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="1.5" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /></svg>
);

export default function CloneBuilder({ from = 'paper-cut' }: { from?: string }) {
  const [files, setFiles] = useState<{ rules: string; reference: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [look, setLook] = useState('');
  const [topic, setTopic] = useState('');
  const [copied, setCopied] = useState<boolean | null>(null);
  const [pulls, setPulls] = useState(0);

  useEffect(() => {
    Promise.all([`/styles/${from}/prompt.md`, `/styles/${from}/reference.html`].map((u) => fetch(u).then((r) => { if (!r.ok) throw new Error(u); return r.text(); })))
      .then(([rules, reference]) => setFiles({ rules, reference }))
      .catch(() => setFailed(true));
  }, [from]);

  const prompt = useMemo(() => (files ? buildClonePrompt(files.reference, files.rules, look, topic) : ''), [files, look, topic]);
  // reset in the handlers, not an effect, so a quick copy after typing isn't wiped
  const changeLook = (v: string) => { setLook(v); setCopied(null); };
  const changeTopic = (v: string) => { setTopic(v); setCopied(null); };

  const copy = async () => { try { await navigator.clipboard.writeText(prompt); setCopied(true); setPulls((n) => n + 1); } catch { setCopied(false); } };
  const download = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([prompt], { type: 'text/plain' })); a.download = 'new-style-prompt.txt'; a.click(); URL.revokeObjectURL(a.href); };

  return (
    <div class="builder-form">
      <label class="field">
        <span class="field-label">Describe the look (optional)</span>
        <textarea rows={4} value={look} onInput={(e) => changeLook((e.target as HTMLTextAreaElement).value)} placeholder="Risograph poster: two inks, grainy paper, big condensed type, shapes slightly out of register" />
      </label>
      <label class="field">
        <span class="field-label">A topic for the demo (optional)</span>
        <input type="text" value={topic} onInput={(e) => changeTopic((e.target as HTMLInputElement).value)} placeholder="Why bees matter" />
      </label>
      <div class="actions">
        <button type="button" class="btn" disabled={!files} onClick={copy}><CopyIcon />{copied ? 'Copied' : 'Copy the new-style prompt'}</button>
        <button type="button" class="btn paper" disabled={!files} onClick={download}>Download .txt</button>
      </div>
      <div class={`press${pulls ? ' pulled' : ''}`} key={pulls} aria-hidden="true">
        {pulls > 0 && <span class="press-print">Copied <b>{kb(prompt)}</b> · attach your screenshots</span>}
      </div>
      <p class="status" aria-live="polite" style={pulls ? 'margin-top:52px' : undefined}>
        {failed ? 'The starting style could not be loaded. Refresh the page to try again.'
          : !files ? 'Loading the starting style…'
          : copied ? `Copied ${kb(prompt)}. Paste it into a new Claude chat, attach your screenshots, and send.`
          : copied === false ? 'Your browser blocked the clipboard. Use Download .txt instead.'
          : `The prompt is ${kb(prompt)}. Attach 1 to 3 screenshots when you paste it.`}
      </p>
    </div>
  );
}
