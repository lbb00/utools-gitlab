import { defineConfig } from 'vite'

export default defineConfig(function (mode) {
  console.log(mode)
  return {
    root: '.',
    mode: 'production',
    build: {
      target: 'esnext',
      outDir: './app/dist',
      minify: false,
      lib: {
        entry: './src/preload.js',
        formats: ['cjs'],
        fileName: 'preload',
      },
      rollupOptions: {
        external: ['@gitbeaker/node'],
      },
    },
  }
})
