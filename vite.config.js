import { defineConfig } from 'vite';
import { resolve } from 'path';
import { SCROLL_TYPE, STORAGE_KEY, DEFAULT } from './src/constants/storage.js';

export default defineConfig({
  build: {
    sourcemap: 'inline',
    minify: false,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.js'),
        options: resolve(__dirname, 'src/options/options.js'),
        'content-script': resolve(__dirname, 'src/content-script.js'),
        background: resolve(__dirname, 'src/background.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  },
  define: {
    SCROLL_TYPE: JSON.stringify(SCROLL_TYPE),
    STORAGE_KEY: JSON.stringify(STORAGE_KEY),
    DEFAULT: JSON.stringify(DEFAULT)
  }
});
