// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node'; // 1. Importa el adaptador

// https://astro.build/config
export default defineConfig({
  output: 'server', // 2. CAMBIO CLAVE: Activa el modo servidor (SSR)
  adapter: node({
    mode: 'standalone', // Crea un servidor independiente
  }),
  server: {
    host: true,
    port: 4321, // Puerto por defecto de Astro
  },
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.app']
    },
    plugins: [tailwindcss()]
  },
  site: 'https://servel.com'
});