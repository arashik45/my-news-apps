import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // এটি ব্রাউজারকে বলবে process.env আসলে কী
      'process.env': JSON.stringify(env),
      'global': 'window',
    },
    build: {
      chunkSizeWarningLimit: 1600,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
