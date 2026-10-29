import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://video-rosy-seven.vercel.app',
  integrations: [preact()],
});
