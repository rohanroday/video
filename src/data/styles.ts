// Every style in the library. Files for a style live in public/styles/<id>/:
// prompt.md (rules with a {{CONTENT}} slot), reference.html (the working animation) and media/ (rendered by `npm run previews`).
export interface Style {
  id: string;
  name: string;
  family: string;
  tagline: string;
  look: string;
  howItExplains: string;
  bestFor: string[];
  palette: string[];
  fonts: string[];
  duration: number;
  frames: number; // stills in media/frames, rendered by scripts/render-previews.mjs
  added: string;
  /** frames worth showing large, by index */
  highlights: { frame: number; name: string; fact: string }[];
}

export const STYLES: Style[] = [
  {
    id: 'paper-cut',
    name: 'Paper Cut',
    family: 'Illustrated',
    tagline: 'Coloured paper, torn strips, masking tape and a rubber stamp.',
    look: 'A craft table seen from above. Every object is a piece of coloured paper lifted off the table by a soft shadow; words are cut out like stickers and drop onto the table one at a time. Titles sit on torn strips held down with tape, numbers hang on paper tags, and the last word is a rubber stamp.',
    howItExplains: 'One idea per sheet of paper. The setting slides in with layered parallax, the statement drops in word by word, one handwritten line writes itself on, and a paper prop proves the point: a counter on a tag, a glass filling, a clock sweeping round. A new sheet slides over, or the old one tears away, for the next idea.',
    bestFor: ['How-tos and tips', 'Lifestyle and habits', 'Kids and education', 'Any friendly explainer'],
    palette: ['#E8D9BE', '#F8F1E2', '#2B2A33', '#E4572E', '#F2B134', '#8DB38B', '#A9CBE8'],
    fonts: ['Bricolage Grotesque', 'Caveat', 'DM Sans'],
    duration: 18.5,
    frames: 30,
    added: '2026-10-28',
    highlights: [
      { frame: 3, name: 'Title strip', fact: 'torn paper, taped' },
      { frame: 9, name: 'Morning scene', fact: 'three hill layers' },
      { frame: 15, name: 'Notebook sheet', fact: 'a glass fills' },
      { frame: 20, name: 'Sheet tears away', fact: 'fibre edge' },
      { frame: 23, name: 'Clock', fact: '10-minute sweep' },
      { frame: 29, name: 'The stamp', fact: 'last word' },
    ],
  },
];

export const styleById = (id: string) => STYLES.find((s) => s.id === id);
export const frameUrl = (s: Style, i: number) => `/styles/${s.id}/media/frames/${String(i).padStart(2, '0')}.jpg`;
