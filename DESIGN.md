---
name: Cutframe
description: Animation styles for Claude, printed as a risograph zine. One prompt, one video, free.
colors:
  paper: "#f4f0e6"
  paper-shade: "#ebe5d6"
  print-stock: "#fbf8f1"
  ink: "#1a1a1a"
  ink-soft: "#4a4640"
  ink-fine: "#b8b1a4"
  fluoro-pink: "#ff48b0"
  pink-deep: "#b81f76"
  riso-blue: "#0078bf"
  blue-deep: "#005a91"
  blue-lift: "#0a86d1"
  riso-yellow: "#ffe800"
  bright-red: "#f15060"
typography:
  giant:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(96px, 28.5vw, 520px)"
    fontWeight: 800
    lineHeight: 0.78
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 75"
  display:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(72px, 13vw, 230px)"
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 75"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(44px, 6vw, 96px)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 75"
  title:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(22px, 1.9vw, 28px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 75"
  lede:
    fontFamily: "Bricolage Grotesque Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(22px, 1.9vw, 28px)"
    fontWeight: 700
    lineHeight: 1.2
    fontVariation: "'wdth' 90"
  body:
    fontFamily: "Schibsted Grotesk Variable, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Schibsted Grotesk Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  none: "0px"
  press: "2px"
  dot: "50%"
spacing:
  margin: "clamp(16px, 2.6vw, 40px)"
  section: "clamp(96px, 11vw, 176px)"
  slip: "clamp(22px, 3vw, 40px)"
  field: "24px"
  tight: "8px"
components:
  button-action:
    backgroundColor: "{colors.riso-blue}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.press}"
    padding: "0 26px"
    height: "52px"
  button-action-hover:
    backgroundColor: "{colors.blue-lift}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.press}"
    padding: "0 26px"
    height: "44px"
  button-paper-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  order-slip:
    backgroundColor: "{colors.print-stock}"
    padding: "{spacing.slip}"
  printed-frame:
    backgroundColor: "{colors.print-stock}"
    padding: "12px 12px 0"
  issue-strip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "14px {spacing.margin}"
  colophon-footer:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    padding: "56px {spacing.margin} 32px"
---

# Design System: Cutframe

## Overview

**Creative North Star: "The Riso Zine Print Shop"**

Cutframe is a small print shop that runs off one zine issue per animation style. Every page is printed in two or three riso drums on warm uncoated stock: a fluorescent field, a heavy condensed grotesk overprinted on it with a slightly off-register echo, and the actual product (sample video, frames, title card) pasted down as stapled, slightly tilted prints with a soft lifted shadow. Copying a prompt is "pulling your own print".

The system is loud at the head and quiet in the body. One ink owns each page head as a full-bleed field (pink on home and Make your own, yellow on text pages, the style's own ink pair on its issue page), then the page falls back to paper and ink with generous section gaps, and closes on a black colophon. Blue is the action ink: it fills buttons and rings focus, and appears otherwise only as overprinted type and link-hover underline.

**Key Characteristics:**
- Full-bleed fluorescent ink field owns the first viewport of every page.
- Huge uppercase condensed display (Bricolage at width 75, weight 800) with a multiply-blended misregistered echo.
- Product media presented as physical prints: off-white stock border, staples, 1–2deg rotation, soft lifted shadow.
- Faint fibre-grain noise over the whole page and halftone dot screens on ink fields.
- Blue-filled surfaces mean "act"; nothing decorative is blue-filled.
- Black colophon footer with the wordmark set giant and a pink full stop.

## Colors

A riso drum set (fluorescent pink, blue, yellow, bright red) over warm paper and near-black ink.

### Primary
- **Riso Blue** (riso-blue): the action ink. Fills every button that does something (Get Issue, Copy prompt), the focus ring, link hover underline, and the "Copied" stamp text. As type it is overprinted (multiply) on pink fields for the CUTFRAME cover title, the Make your own head and the closing print.
- **Blue Deep / Blue Lift** (blue-deep, blue-lift): state tones of the action ink (blue-lift is the hover fill). Never used alone.

### Secondary
- **Fluorescent Pink** (fluoro-pink): the house field. Owns the home cover, the Make your own cover and the closing print; is the default echo ink behind display type, the link underline, the input caret, the print-run step numerals and the footer full stop.
- **Pink Deep** (pink-deep): pink as readable text on paper (captions such as "made from one prompt", the Copied size). Use it whenever pink must carry words on paper; raw pink is a field and echo, not a text colour.

### Tertiary
- **Riso Yellow** (riso-yellow): the third drum. Field for text-page heads (About, License, Privacy) and the home contact sheet; the echo behind CUTFRAME on pink; the "out now" text on the black issue strip; text selection.
- **Bright Red** (bright-red): a per-issue echo ink (Paper Cut's pair is yellow field + red echo). Also fills that issue's Play with sound control.

### Neutral
- **Paper** (paper): page background, the uncoated stock.
- **Paper Shade** (paper-shade): scrollbar track, video placeholder.
- **Print Stock** (print-stock): the whiter sheet that prints and slips are cut from: framed video, zine spread, order slip, image borders.
- **Ink** (ink): text, the issue strip, the colophon footer, input underline, staples, pressed toggle fill.
- **Ink Soft** (ink-soft): secondary text, step descriptions, captions, status lines.
- **Ink Fine** (ink-fine): fine print and "next month" on black.

### Named Rules
**The Action Ink Rule.** Blue fills only things you can press. Blue as overprinted display type or a focus ring is native to the world; a blue-filled card, badge, band or decoration is not.

**The One Field Rule.** Each page head is owned by exactly one full-bleed ink field; the rest of the page is paper. A second large field (contact sheet, closing print) appears only once further down, never adjacent to the first.

**The Reprint Rule.** Each style's issue page reprints the head in that style's ink pair (`inks.field` as the field, `inks.echo` as the display echo and its play control), while the masthead, buttons and body stay fixed. Blue stays the action ink on every reprint.

## Typography

**Display Font:** Bricolage Grotesque Variable (with Arial Narrow, sans-serif), condensed via width axis (75 for headings, 80 for labels, 85–90 for ledes).
**Body Font:** Schibsted Grotesk Variable (with system-ui, sans-serif).

**Character:** A heavy, squeezed poster grotesk shouting in uppercase over a plain, sturdy text grotesk. The display does the printing; the text face does the explaining.

### Hierarchy
- **Giant** (800, clamp(96px, 28.5vw, 520px), 0.78): the CUTFRAME cover title only, edge to edge.
- **Display** (800, clamp(72px, 13vw, 230px), 0.78–0.82): page-head h1 on issue, text and Make your own pages; the giant colophon wordmark sits in the same register (clamp(64px, 12vw, 200px)).
- **Headline** (800, clamp(44px, 6vw, 96px), 0.9): section h2 (The print run, Every frame, Make it yours). Prose pages step down to clamp(32px, 3.4vw, 48px).
- **Title** (800, clamp(22px, 1.9vw, 28px), 1): h3, field labels and FAQ questions (22px, width 80).
- **Lede** (700, width 90, 1.2–1.25): the one-line tagline under a head, max ~22–30ch.
- **Body** (400, 18px, 1.55): running text, max 52–64ch.
- **Label** (600–700, 15px): nav, captions, facts lists, footer.

### Named Rules
**The Overprint Rule.** Display type set in a field gets a second impression of the same words in the echo ink, offset (0.045em, 0.03em) and multiplied behind it. One echo per heading; body text never overprints.

**The Uppercase Display Rule.** All h1–h3 are uppercase, condensed, weight 800, tight leading. Body, buttons and labels stay sentence case.

## Layout

Full-bleed fields with a fluid side margin (`spacing.margin`) for content. Sections are separated by large print gaps (`spacing.section`), no rules or dividers. Heads use asymmetric two-column grids (7fr/5fr, 5fr/7fr, 6fr/5fr); text pages and FAQ use a 4fr/8fr grid with content in the right column. Contact sheets are a 6-column grid with 8px gutters (3 below 760px); the print-run steps run 4 / 2 / 1 columns. Grids collapse to one column at 900px, with the builder's title card moving above the form. The masthead hides secondary nav links at 820px and 480px but always keeps the blue Get Issue button.

Motion: one authored entrance, the "feed": sections clip in from the top (clip-path + 14px translate, 0.9s, ease `cubic-bezier(.16,1,.3,1)`, staggered 90ms), only when motion is allowed and JS is on; content is visible without it.

## Elevation & Depth

Depth is physical paper, not interface. Prints, slips and pasted frames lift off the page with one soft two-layer shadow; everything else is flat ink on paper. Grain (fixed fractal noise, multiply, 0.5) and halftone dots (7px screen) give the stock tooth.

### Shadow Vocabulary
- **Print lift** (`box-shadow: 0 1px 1px rgba(26,26,26,.12), 0 10px 24px -8px rgba(26,26,26,.28)`): every printed object: framed video, spread, order slip, tilted frames, title card, closing print, hovered contact-sheet frame.
- **Contact frame** (`box-shadow: 0 1px 2px rgba(0,0,0,.2)`): resting thumbnails on the yellow sheet.

### Named Rules
**The Paper Lift Rule.** Shadow means "this is a separate printed sheet". Nav, fields and strips never cast one; buttons carry only a soft ink-tinted lift that grows on hover.

## Shapes

Square-cut paper. Corners are 0 on fields and prints, 2px on buttons and the play control (a trimmed edge, not a pill). The only round shapes are ink swatch dots. Prints tilt (-1.5deg to +2deg; up to ±6deg in the Make your own pile) and are framed in 8–12px of print stock. The order slip has a perforated top edge; staples are flat ink bars (34x5px, 1px radius) slightly rotated.

## Components

### Buttons
Printed, square and blunt.
- **Shape:** trimmed edge (2px radius), min height 52px (44px in masthead and toggles).
- **Action:** blue fill, white 700 text, 26px side padding, optional 18px stroked SVG icon. Hover lifts 2px to blue-lift; active presses down 1px.
- **Paper:** paper fill with a 2px inset ink outline; hover goes white with a soft lift; pressed (aria-pressed) inverts to ink with paper text. Used for the voiceover toggle and Download .txt.
- **Focus:** 3px blue outline, 3px offset, everywhere.

### Inputs / Fields
- **Style:** paper fill, no box, 2px ink underline, square corners, 18px body text, pink caret.
- **Focus:** fill goes white with a 3px blue ring; no outline.
- **Label:** uppercase condensed 22px title above the field.

### Cards / Containers
- **Order slip:** print-stock sheet with print lift, fluid padding and a perforated top edge; holds the prompt builder (6fr form / 5fr title card).
- **Printed frame:** print-stock border (12px, open bottom carrying a 15px caption), print lift, staples, slight tilt.
- **Zine spread:** two-page print-stock sheet with a soft centre gutter shading.

### Navigation
Masthead on paper: uppercase condensed wordmark (26px) left; 15px 600 links right with no underline until hover (blue underline); blue Get Issue button always last and always visible.

### Issue strip
Full-bleed black band at the foot of the home cover: condensed uppercase issue numbers, yellow "out now", ink-fine for upcoming.

### The print pull (signature)
On copy, a white stamped print (condensed uppercase 20px, blue text with the size in pink-deep, print lift) feeds out under the actions: clip-path reveal with a slight drop and settle at -1deg over 0.9s. Reduced motion shows it statically.

### Colophon footer
Black band, giant paper wordmark with a pink full stop, three-column links and Follow for Issue 02 block; single column below 760px.

## Do's and Don'ts

### Do:
- **Do** give each page head one full-bleed ink field with halftone, and let the body return to paper.
- **Do** overprint display headings with one echo in the field's partner ink, multiplied, offset ~0.045em.
- **Do** present every product image or video as a print: print-stock border, print lift shadow, 1–2deg tilt, staples where it is the hero.
- **Do** reprint an issue page in its own `inks` pair and keep the masthead, blue actions and body fixed.
- **Do** use pink-deep, not raw pink, when pink carries text on paper.

### Don't:
- **Don't** fill any non-action surface (card, band, badge, decoration) with blue.
- **Don't** put two full-bleed ink fields back to back or use more than three drums on one screen.
- **Don't** round corners beyond the 2px trim or use pill buttons.
- **Don't** cast shadows from nav, fields or strips; shadow belongs to printed sheets and buttons.
- **Don't** use a dark page, centred glow hero or icon feature cards; the page is paper, not a screen.
