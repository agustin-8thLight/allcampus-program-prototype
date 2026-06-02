import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Root by default; GitHub Pages serves from a subpath, set via BASE_PATH in CI.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
})
