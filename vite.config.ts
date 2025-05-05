import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
    })
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: './src/main.ts',
      name: 'vue-custom-roulette',
      fileName: 'vue-custom-roulette',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
