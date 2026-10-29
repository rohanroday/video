# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Creators who post short videos on Instagram Reels, YouTube Shorts and LinkedIn and want good-looking animated explainers fast, often without editing skills. They arrive from a creator's post (a reel or LinkedIn post that says "DM me for the link" or "link in bio"), usually on a phone, curious whether "one prompt, one video" is real.

## Product Purpose
A free library of animation styles drawn in code. Each style is a complete working animation with synthesized sound plus the rules for rebuilding it around any topic. A visitor picks a style, types a topic or script, copies one prompt, and pastes it into Claude, which builds the video (storyboard first, then the animation; MP4 export with Claude Code).

Success: a visitor tries a style (copies a prompt) and follows or contacts the creator for new styles.

## Positioning
Not a video-generation service and not an editor: the site hands creators the whole animation as code plus its rules, and their own Claude does the work. Every style is original, drawn and sound-designed in code, and the sample video on each page was made with the same prompt the visitor copies.

## Operating Context
- Visitors usually land on a phone from Instagram or LinkedIn.
- The real work happens in Claude (claude.ai chat, or Claude Code for MP4 export), not on the site.
- Prompts are long (about 60 KB); a paid Claude plan handles them most reliably.
- Voiceover option: visitors can choose "no voiceover" (full music/effects mix) or "with voiceover" (words timed to their own narration).

## Capabilities and Constraints
- Static site (Astro + Preact), deployed on Vercel from GitHub `rohanroday/video`; no accounts, no server, no database.
- What visitors type is assembled into the prompt in the browser and never sent anywhere.
- One style today: Paper Cut. More original styles are planned (one a month); none may come from third-party style libraries.
- Each style folder: `prompt.md` with a `{{CONTENT}}` slot, `reference.html`, rendered media (sample.mp4, poster, 30 frames).
- Undecided: the site name ("Cutframe" is a working name, already said in one posted reel), the domain, and the creator's public contact/follow handles.

## Brand Commitments
- Free, no sign-up. Videos people make are theirs, including commercially; prompts may not be resold or republished as a pack.
- Made by Rohan; every style is original.
- Name "Cutframe" is a working name, not final.

## Evidence on Hand
- Paper Cut: demo animation, sample video, poster and 30 frames in `public/styles/paper-cut/media/`.
- A launch reel made with Paper Cut (in the creator's own folder, not yet on the site).
- No testimonials, user counts, press or videos made by other people exist yet; do not invent any.

## Product Principles
1. Show, don't claim: every promise is proven by a real style, frame or video made with it.
2. One prompt is the product: the path from landing to copied prompt stays short and obvious, especially on a phone.
3. Original only: every style is made from scratch; nothing borrowed from other libraries.
4. Free and private: no sign-up, no tracking of what visitors type.
5. The creator is visible: visitors should know who makes this and where to follow for new styles.
