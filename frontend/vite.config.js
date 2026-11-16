// إعدادات Vite: إضافة React + بروكسي بيحوّل نداءات /api لسيرفر Node على بورت 5000
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' }
  }
});
