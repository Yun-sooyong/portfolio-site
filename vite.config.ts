/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 소스 맵을 만들지 않는다.
    sourcemap: false,
    // 작은 자산도 data: URI로 넣지 않는다. CSP font-src 'self'가 data: 글꼴을 막기 때문이다.
    assetsInlineLimit: 0,
    // 모듈 preload 보조 코드를 인라인 script로 넣지 않는다.
    modulePreload: { polyfill: false },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    css: false,
  },
})
