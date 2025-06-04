import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['eventemitter3'],
  },
  build: {
    sourcemap: true,
  },
  server: {
		allowedHosts: ['w3p1qao7o86c.share.zrok.io'],
    watch: {
      usePolling: true,
    },
  },
	css: {
    preprocessorOptions: {
      scss: {
        api: 'modern' // or "modern"
      }
    }
  }
});
