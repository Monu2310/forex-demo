import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // single-bundle demo; recharts accounts for most of the size
    chunkSizeWarningLimit: 900,
  },
})
