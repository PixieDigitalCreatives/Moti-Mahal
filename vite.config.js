import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
  // React + GSAP (with SplitText, ScrollTrigger, Flip, DrawSVG) + Lenis land around 175 kB gzipped.
  build: { chunkSizeWarningLimit: 600 },
});
