/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { make404Html } from './build/make404'

// 빌드가 끝나면 dist/404.html 을 만든다. Vercel이 없는 주소에 이 파일을 404 상태로 보낸다.
function emit404() {
  return {
    name: 'emit-404-html',
    apply: 'build' as const,
    closeBundle() {
      const index = resolve('dist/index.html')
      writeFileSync(resolve('dist/404.html'), make404Html(readFileSync(index, 'utf8')))
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), emit404()],
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
