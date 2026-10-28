// Assembles the prompt a visitor copies: the style's rules with their topic in the {{CONTENT}} slot,
// a voiceover section for the mode they picked, and the complete reference file. Runs in the browser only.
export type VoiceMode = 'none' | 'voiceover';

const VOICE: Record<VoiceMode, string> = {
  none: 'VOICEOVER\nNone. Use the full mix described under SOUND and set every beat time yourself, at the pace the style asks for.',
  voiceover:
    'VOICEOVER\nI have a voiceover. I will attach the audio file (or its script with word timings); if it is not attached yet, ask me for it before building. Time every beat to the spoken words so each word on screen lands as it is said, change scenes on sentence boundaries, set TL.D to the voiceover length plus about one second, and render the sound with { voiceover: true } so the effects sit quietly under my voice.',
};

export const TOPIC_PLACEHOLDER = '[Write your topic, script or bullet points here]';

export function buildPrompt(rules: string, reference: string, topic: string, mode: VoiceMode): string {
  const content = (topic.trim() || TOPIC_PLACEHOLDER) + '\n\n' + VOICE[mode];
  // function replacer, so "$" in the visitor's text is kept as typed
  return `${rules.replace('{{CONTENT}}', () => content).trimEnd()}\n\nREFERENCE SOURCE (the complete working file)\n\`\`\`html\n${reference.trimEnd()}\n\`\`\`\n`;
}

export function buildClonePrompt(reference: string, rulesExample: string, look: string, topic: string): string {
  const lookText = look.trim() || '[Optional: describe the look in your own words: colours, type, mood, how things move]';
  const topicText = topic.trim() || '[Optional: a topic for the demo animation]';
  return `I want a new animated video style, built from the 1 to 3 screenshots I have attached. Below is a complete working animation in another style (Paper Cut): its helpers, synthesized sound kit, scenes, compositor, sound score and player. Use its engine and rebuild the look.

THE LOOK I WANT
${lookText}

DEMO TOPIC
${topicText}

HOW TO WORK
1. First, explain in a few short lines how the reference engine works (timeline, scenes, compositor, sound score) and what you will change for my look.
2. Then show me ONE still frame of the new style, drawn with the real code, and wait for my OK before going further.
3. After my OK, build a 15 to 25 second demo animation as one self-contained HTML file, and write a style guide for it in the same section format as the Paper Cut guide below (MY CONTENT with a {{CONTENT}} slot, STORYBOARD FIRST, WHAT TO BUILD, THE STYLE, RULES THAT KEEP IT IN STYLE, SOUND, IF YOU CAN RUN CODE, STYLE CARD), so I can reuse it for any topic.

WHAT TO KEEP AND WHAT TO CHANGE
- Keep: the page and player, the PK helpers, the SND sound kit and its render() function, the compositor, a 1280x720 canvas, and window.seek(t), window.DURATION, window.scoreSound, window.SFX and window.__ready.
- Rebuild to match my screenshots: the palette, the typefaces (Google Fonts, loaded before the first draw), the background and finishing pass, how text and objects arrive, the emphasis devices, the scene changes, and the sound palette.
- Every frame stays a pure function of t, all randomness seeded, every frame under 50 ms.
- Never copy logos, brand names, real people or text from the screenshots: take the look, not the content.

THE PAPER CUT STYLE GUIDE (the format to follow)
${rulesExample.replace('{{CONTENT}}', () => '{{CONTENT}}').trimEnd()}

REFERENCE SOURCE (the complete working file)
\`\`\`html
${reference.trimEnd()}
\`\`\`
`;
}

export function kb(text: string) {
  return `${Math.max(1, Math.round(new Blob([text]).size / 1024))} KB`;
}
