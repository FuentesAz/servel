// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  server: {
    host: true,
  },
  vite: {
    server:{
      allowedHosts: ['.ngrok-free.app',]
    },
    plugins: [tailwindcss()]
  },
  site: 'https://servel.com'
});