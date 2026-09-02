import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { thcApiPlugin } from './server/apiPlugin.js';

export default defineConfig({
  plugins: [react(), thcApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
