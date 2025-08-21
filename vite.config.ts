import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Yang-s-lab-CAD-viewer/',
  plugins: [react()],
  assetsInclude: ['**/*.glb'], // Add this line
})
