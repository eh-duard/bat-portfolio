import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://eh-duard.github.io',
  base: '/bat-portfolio',

  i18n: {
    locales: ['it', 'en'],
    defaultLocale: 'it',
    routing: {
      prefixDefaultLocale: false
    }
  },

  vite: {
    plugins: [tailwindcss()]
  }
});