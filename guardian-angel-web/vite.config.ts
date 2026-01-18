import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      // Proxy /api requests to the backend
      "/api": {
        target: "http://localhost:3000", // Backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
      },
      "/peerjs": {
        target: "http://localhost:3000", // Backend server URL
        changeOrigin: true, // Needed for virtual hosted sites
        ws: true, // Enable WebSocket proxying
      },
      "/flask": {
        target: "http://localhost:6000", // Flask server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flask/, ''),
      },
    },
  },
});
