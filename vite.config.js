import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: true,
    },
  },
  optimizeDeps: {
    include: ['webamp'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: 'index.html',
        meme: 'public/meme.html',
      },
      output: {
        manualChunks: {
          webamp: ['webamp'],
          firebase: ['firebase/app', 'firebase/database'],
        },
      },
    },
  },
});