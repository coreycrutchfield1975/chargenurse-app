import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/chargenurse-app/',
  server: { port: 4173 },
  build: { outDir: 'dist' }
})
