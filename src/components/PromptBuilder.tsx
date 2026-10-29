import { useEffect, useMemo, useState } from 'preact/hooks';
import { buildPrompt, kb, type VoiceMode } from '../lib/buildPrompt';
import TitleCard from './TitleCard';

interface Props { styleId: string; styleName: string; showCard?: boolean }

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="1.5" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /></svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>
);

export default function PromptBuilder({ styleId, styleName, showCard = true }: Props) {
  const [files, setFiles] = useState<{ rules: string; reference: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<VoiceMode>('none');
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [pulls, setPulls] = useState(0); // each copy pulls a fresh print

  // load the style's files up front so Copy is instant (Safari needs the copy inside the click)
  useEffect(() => {
    Promise.all([`/styles/${styleId}/prompt.md`, `/styles/${styleId}/reference.html`].map((u) => fetch(u).then((r) => { if (!r.ok) throw new Error(u); return r.text(); })))
      .then(([rules, reference]) => setFiles({ rules, reference }))
      .catch(() => setFailed(true));
  }, [styleId]);

  const prompt = useMemo(() => (files ? buildPrompt(files.rules, files.reference, topic, mode) : ''), [files, topic, mode]);
  // reset "Copied" in the handlers, not in an effect: an effect runs after paint and can wipe a copy made right after a change
  const changeTopic = (t: string) => { setTopic(t); setStatus('idle'); };
  const changeMode = (m: VoiceMode) => { setMode(m); setStatus('idle'); };

  const copy = async () => {
    try { await navigator.clipboard.writeText(prompt); setStatus('copied'); setPulls((n) => n + 1); } catch { setStatus('error'); }
  };
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([prompt], { type: 'text/plain' }));
    a.download = `${styleId}-prompt.txt`; a.click(); URL.revokeObjectURL(a.href);
  };

  return (
    <div class="builder">
      <div class="builder-form">
        <label class="field">
          <span class="field-label">Your topic, script or bullet points</span>
          <textarea rows={5} value={topic} onInput={(e) => changeTopic((e.target as HTMLTextAreaElement).value)} placeholder={'How to start running\nOr paste your whole script'} />
        </label>
        <fieldset class="field">
          <legend class="field-label">Voiceover</legend>
          <div class="toggle">
            <button type="button" class="btn paper" aria-pressed={mode === 'none'} onClick={() => changeMode('none')}>No voiceover</button>
            <button type="button" class="btn paper" aria-pressed={mode === 'voiceover'} onClick={() => changeMode('voiceover')}>With voiceover</button>
          </div>
          <p class="small soft">{mode === 'none' ? 'Full mix: music and sound effects, and Claude sets the timing.' : 'Every word lands as it is spoken, with the effects under your voice. Attach your audio in Claude.'}</p>
        </fieldset>
        <div class="actions">
          <button type="button" class="btn" disabled={!files} onClick={copy}><CopyIcon />{status === 'copied' ? 'Copied' : `Copy the ${styleName} prompt`}</button>
          <button type="button" class="btn paper" disabled={!files} onClick={download}><DownloadIcon />Download .txt</button>
        </div>
        <div class={`press${pulls ? ' pulled' : ''}`} key={pulls} aria-hidden="true">
          {pulls > 0 && <span class="press-print">Copied <b>{kb(prompt)}</b> · paste into Claude</span>}
        </div>
        <p class="status" aria-live="polite" style={pulls ? 'margin-top:52px' : undefined}>
          {failed ? 'The style files could not be loaded. Refresh the page to try again.'
            : !files ? 'Loading the style…'
            : status === 'copied' ? `Copied ${kb(prompt)}. Open a new Claude chat, paste it and send.`
            : status === 'error' ? 'Your browser blocked the clipboard. Use Download .txt instead.'
            : `The prompt is ${kb(prompt)}: the style rules, your topic and the full animation code.`}
        </p>
      </div>
      {showCard && (
        <figure class="builder-card">
          <TitleCard topic={topic} />
          <figcaption>Your title, cut and taped the Paper Cut way.</figcaption>
        </figure>
      )}
    </div>
  );
}
