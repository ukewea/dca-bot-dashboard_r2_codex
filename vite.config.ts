import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = process.env.BASE_PATH || '/';
  return {
    base,
    plugins: [react()],
  };
});
