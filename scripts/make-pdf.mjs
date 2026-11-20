// /doc 쪽을 시스템 Chrome 으로 PDF 로 찍어 public/yun-sooyong-portfolio.pdf 를 만든다.
// 로컬 전용이다. 먼저 `npm run build` 로 dist 를 만들어 두어야 한다(npm run pdf 가 함께 한다).
import { spawn } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { preview } from 'vite'

const PORT = 4190
const OUT = resolve('public/yun-sooyong-portfolio.pdf')
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PATH_ARG = process.argv[2] ?? '/doc'
const OUT_ARG = process.argv[3] ? resolve(process.argv[3]) : OUT

if (!existsSync(resolve('dist/index.html'))) {
  console.error('dist 가 없습니다. 먼저 npm run build 를 실행하세요.')
  process.exit(1)
}
if (!existsSync(CHROME)) {
  console.error(`Chrome 을 찾을 수 없습니다: ${CHROME} (CHROME_PATH 로 지정하세요)`)
  process.exit(1)
}

// 이 스크립트가 띄운 preview 서버만 닫는다.
const server = await preview({ preview: { port: PORT, strictPort: true, host: '127.0.0.1' }, logLevel: 'warn' })
let code = 1
try {
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=10000',
    `--print-to-pdf=${OUT_ARG}`,
    `http://127.0.0.1:${PORT}${PATH_ARG}`,
  ]
  code = await new Promise((done) => {
    const child = spawn(CHROME, args, { stdio: 'inherit' })
    child.on('error', (e) => {
      console.error(e.message)
      done(1)
    })
    child.on('exit', (c) => done(c ?? 1))
  })
  if (code === 0) console.log(`만들었습니다: ${OUT_ARG} (${statSync(OUT_ARG).size} bytes)`)
} finally {
  await server.close()
}
process.exit(code)
