import { useEffect, useMemo, useState } from 'preact/hooks';
import { buildClonePrompt, kb } from '../lib/buildPrompt';

export default function CloneBuilder({ from = 'paper-cut' }: { from?: string }) {
  const [files, setFiles] = useState<{ rules: string; reference: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [look, setLook] = useState('');
  const [topic, setTopic] = useState('');
  const [copied, setCopied] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([`/styles/${from}/prompt.md`, `/styles/${from}/reference.html`].map((u) => fetch(u).then((r) => { if (!r.ok) throw new Error(u); return r.text(); })))
      .then(([rules, reference]) => setFiles({ rules, reference }))
      .catch(() => setFailed(true));
  }, [from]);

  const prompt = useMemo(() => (files ? buildClonePrompt(files.reference, files.rules, look, topic) : ''), [files, look, topic]);
  // reset in the handlers, not an effect, so a quick copy after typing isn't wiped
  const changeLook = (v: string) => { setLook(v); setCopied(null); };
  const changeTopic = (v: string) => { setTopic(v); setCopied(null); };

  const copy = async () => { try { await navigator.clipboard.writeText(prompt); setCopied(true); } catch { setCopied(false); } };
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
        <button type="button" class="btn" disabled={!files} onClick={copy}>{copied ? 'Copied' : 'Copy the new-style prompt'}</button>
        <button type="button" class="btn quiet" disabled={!files} onClick={download}>Download .txt</button>
      </div>
      <p class="small muted" aria-live="polite">
        {failed ? 'The starting style could not be loaded. Refresh the page to try again.'
          : !files ? 'Loading the starting style…'
          : copied ? `Copied ${kb(prompt)}. Paste it into a new Claude chat, attach your screenshots, and send.`
          : copied === false ? 'Your browser blocked the clipboard. Use Download .txt instead.'
          : `The prompt is ${kb(prompt)}. Attach 1 to 3 screenshots when you paste it.`}
      </p>
    </div>
  );
}
