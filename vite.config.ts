import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 빌드 최적화
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        // 청크 분리: vendor, framer-motion 별도 분리
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
