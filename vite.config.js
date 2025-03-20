import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  base: '/3d_portfolio/',
  server: {
    host: '0.0.0.0',
    port: 3025,
  },
})
