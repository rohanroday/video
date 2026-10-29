// One place for the brand: rename the site here.
export const SITE = {
  name: 'Cutframe',
  maker: 'Rohan',
  description: 'Animation styles drawn in code and printed for Claude. Pick an issue, type your topic, copy one prompt: Claude builds the video, sound included. Free.',
  year: 2026,
  // public contact, shown on About and Privacy; set before launch (left empty until the maker chooses one)
  contact: '',
  // where to follow for new issues, e.g. [{ label: 'Instagram', url: 'https://instagram.com/…' }]; until set, pages ask visitors to follow from where they found the link
  socials: [
    { label: 'Instagram @roday.28', url: 'https://www.instagram.com/roday.28/' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rohanprasad28/' },
  ] as { label: string; url: string }[],
};
