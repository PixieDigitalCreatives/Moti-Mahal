import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = import.meta.dirname;
const pages = ['index', 'menu', 'story', 'gallery', 'visit'];

// Tiny HTML include system: <!-- @include nav.html --> pulls from src/partials.
function partials() {
  const dir = resolve(root, 'src/partials');
  const include = (html, depth = 0) =>
    html.replace(/<!--\s*@include\s+([\w./-]+)\s*-->/g, (_, file) => {
      if (depth > 4) return '';
      return include(readFileSync(resolve(dir, file), 'utf8'), depth + 1);
    });
  return {
    name: 'html-partials',
    transformIndexHtml: { order: 'pre', handler: (html) => include(html) },
    handleHotUpdate({ file, server }) {
      if (file.includes('partials')) server.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig({
  plugins: [partials()],
  server: { port: 5173, host: true },
  build: {
    target: 'es2020',
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(root, `${p}.html`)])),
    },
  },
});
