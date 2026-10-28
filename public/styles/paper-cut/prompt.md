Make an animated video in the "Paper Cut" style (Illustrated / Craft), an original style by Rohan. The reference file below (reference.html) is a complete working animation: the PK helpers, the SND sound kit, the paper drawing kit, the demo scenes, the compositor, the sound score and the player. Treat it as the ground truth for how this style looks, moves and sounds, and rebuild it around my content.

MY CONTENT
{{CONTENT}}

STORYBOARD FIRST
Before building, show me a storyboard and wait for my OK:
- One HTML page with a grid of 6 to 10 panels, one per beat, each a still rendered by the real animation code (so it already looks like the finished video). No motion or sound yet.
- Under each panel: beat number, start and end time, the exact on-screen words, the camera move or emphasis, how it arrives (same scene continuing, sheet slide, or tear), and its key sounds.
- Below the grid, list every fact or number shown and where it comes from, or mark it as an example.
After my OK (and any changes), build the full animation from the same drawing code.

WHAT TO BUILD
One self-contained HTML file, made from the reference:
- Keep unchanged: the page and player (play/pause, scrub, time, sound, loop, Load voiceover), PK, SND, the paper drawing kit (lifted, piece, torn, hill, circle, rect, cloud, sticker, dropState, line, dropWord, handwrite, tape, stepTag, stamp, grain and finishing), the camera and layer helpers and the compositor (frame, paint, edgePath).
- Replace: TL, CUTS, SHAKES, SCENE_SPAN, the scene functions and their props, SCENES, the stamp text (stampLayer) and scoreSound().
- Length 15 to 45 seconds unless my content needs more; set it in TL.D. With a voiceover, TL.D is the voiceover length plus about 1 second.
- Keep window.seek(t), window.DURATION, window.scoreSound and window.SFX exposed (the renderer drives them), and window.__ready set after the fonts load.
- Load the fonts before the first draw, as the reference does: Bricolage Grotesque 800, Caveat 700, DM Sans 500/700.

THE STYLE
- The world is a craft table: every object is a flat piece of coloured paper cut to shape and lifted off the table by a soft, warm drop shadow. The shadow's offset and blur grow with the piece's height, so depth reads from shadows alone. The lamp is top left: a light rim on that edge, a faint dark rim on the other.
- Paper colours only (PAL): kraft, cream, ink, tomato, mustard, sage, leaf, moss, sky, dawn, navy, blush, water. Flat fills, no gradients on objects (sky and lamp light are the exceptions). Each scene sits on its own sheet: kraft, cream notebook paper, a coloured sunburst, a sky over paper hills.
- Type: Bricolage Grotesque 800 for statements, cut out as stickers with a thick cream backing edge; tomato for the one key word or line, ink for the rest. Caveat in navy or tomato for the one handwritten, human line, written on left to right. DM Sans for tags, units and labels.
- How things arrive: words drop onto the table one at a time (big and high, then landing with a small squash as the shadow tightens). Cards, tags and props pop in with a springy overshoot. Backgrounds and hills slide up from below with parallax. Torn paper strips slide in from the side and get taped down.
- Emphasis: a torn mustard or cream strip behind the key line, masking tape on corners, a hanging tag for a number, a rubber stamp slammed in for the final verdict (with a small shake), paper stars for a happy moment.
- Numbers: a counter on a paper tag or inside a prop (a glass filling, a clock sweeping, a bar of paper growing); it eases up and lands with a pluck.
- Scene changes: a new sheet slides over from the side with a shadowed cut edge, or the old sheet tears away upward revealing the new one, showing a white fibre core along the rip. Alternate them. Inside a scene, keep it continuous.
- Camera: one slow push per scene and a gentle drift, with layers moving by depth for parallax. No whip pans, no glitches: this is a calm, tactile style.
- Chrome: a navy torn "STEP n" tag taped top left only when the content is a real sequence.
- Pace: the first words land within 1.5 seconds, something new every 0.6 to 1.5 seconds, and the takeaway holds about 1.5 seconds before the end.

RULES THAT KEEP IT IN STYLE
- Change the story, words and props; never the medium. Every subject is drawn as cut paper with piece(): no photos, no outlines, no gradients on objects, no real logos, brands or people. Draw subjects accurately for my topic.
- Check every fact and number shown. If a number is illustrative, label it ("example", "typical", "a glass").
- Every frame is a pure function of t. All randomness comes from PK.seeded(seed) or PK.wave(seed), never Math.random. Cache static paths with cached() and static layers on offscreen canvases.
- Phone-legible at 1280x720: statements 90 px or more, the handwritten line 52 px or more, labels 28 px or more, key numbers 78 px or more. Fill the frame; keep text clear of busy props.
- Keep every frame under 50 ms (the renderer reports it).
- Give my topic its own content; don't reuse the demo's "calmer morning" story unless I ask for it.

SOUND
- Bed: the kalimba arpeggio bed (k.bed) with a soft shaker and felt kick, under the whole piece; pick chords that suit the mood.
- Map events to the kit: words landing get "land"; strips, hills and sheets sliding get "slide"; tags, props and confetti get "pop" (higher pitch for smaller things); tape gets "tape"; scissors-style reveals get "snip"; the handwritten line gets a "rustle"; counters "tick" only when the shown number changes (no more than about 10 per second) and land on a "pluck"; scene changes get "flip" (sheet) or "rustle" + "slide" (tear); pouring gets "pour"; happy moments get "twinkle"; the verdict gets "stamp" after a short duck of the music.
- Full mix (no voiceover): keep the bed, no more than about 3 sounds at once, and a breath of quiet before the stamp.
- With a voiceover: render with { voiceover: true } (the bed drops and soft sounds play at 60%) and time every beat to the spoken words.
- Sync is everything: scoreSound() reads the same TL times as the picture.

IF YOU CAN RUN CODE
Render with the skill's renderer: node scripts/render_canvas.mjs --input <file.html> --out <file.mp4> [--vo <voiceover.wav>]. It calls window.seek(i / 30) for every frame, renders the sound with SFX.render(scoreSound, DURATION, 48000, { voiceover }) and mixes it under the voiceover.

STYLE CARD
Name: Paper Cut
Family: Illustrated / Craft
Owner: Rohan (original style; free to share)
Look: A handmade craft-table explainer: coloured paper pieces with soft lifted shadows, torn-paper title strips, masking tape, sticker-cut words that drop onto the table, hanging paper tags for numbers, a rubber stamp for the verdict, warm lamp light and paper grain.
How it explains: Each idea is a scene on its own sheet: the setting slides in with paper parallax, the statement drops in word by word, one handwritten human line writes itself on, a prop proves the point (a counter on a tag, a glass filling, a clock sweeping), and a new sheet slides over or the old one tears away for the next idea. It ends on the takeaway, taped down and stamped.
