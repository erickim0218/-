import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'path';
import {defineConfig} from 'vite';

const copyPdfJsAssets = () => ({
  name: 'copy-pdfjs-assets',
  closeBundle() {
    const outputRoot = path.resolve(__dirname, 'dist/pdfjs');
    fs.mkdirSync(outputRoot, { recursive: true });
    fs.cpSync(
      path.resolve(__dirname, 'node_modules/pdfjs-dist/cmaps'),
      path.join(outputRoot, 'cmaps'),
      { recursive: true }
    );
    fs.cpSync(
      path.resolve(__dirname, 'node_modules/pdfjs-dist/standard_fonts'),
      path.join(outputRoot, 'standard_fonts'),
      { recursive: true }
    );
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyPdfJsAssets()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
