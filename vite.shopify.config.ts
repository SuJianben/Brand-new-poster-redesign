import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Shopify serves compiled assets directly; source remains in src/.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'),
      output: {
        entryFileNames: 'poster-home.js',
        assetFileNames: (asset) => asset.names?.some((name) => name.endsWith('.css')) ? 'poster-home.css' : '[name][extname]',
      },
    },
  },
})
