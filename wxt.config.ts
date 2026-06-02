import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: ['storage', 'activeTab'],
  },
  srcDir: 'src',

  vite: () => ({
    build: {
      sourcemap: true,
    },
    plugins: [tailwindcss()],
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  }),
});
