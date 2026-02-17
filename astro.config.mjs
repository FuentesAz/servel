// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: true
  },
  
  security: {
    checkOrigin: false,
  },

  vite: {
    plugins: [tailwindcss()]
  },
  site: 'https://servelcomputadoras.com'
});