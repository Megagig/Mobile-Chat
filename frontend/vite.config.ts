import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/api/v1/messages': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
