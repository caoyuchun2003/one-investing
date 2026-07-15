import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        q: resolve(root, 'q.html'),
        about: resolve(root, 'about.html'),
        author: resolve(root, 'author.html'),
        all: resolve(root, 'all.html'),
      },
    },
  },
})
