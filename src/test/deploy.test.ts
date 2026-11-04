import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { make404Html } from '../../build/make404'

const read = (p: string) => readFileSync(resolve(process.cwd(), p), 'utf8')

describe('vercel.json', () => {
  const config = JSON.parse(read('vercel.json')) as {
    rewrites: { source: string; destination: string }[]
    headers: { source: string; headers: { key: string; value: string }[] }[]
  }

  it('rewrites는 아는 주소(/, /print)만 index.html로 보낸다', () => {
    expect(config.rewrites.map((r) => r.source).sort()).toEqual(['/', '/print'])
    for (const r of config.rewrites) expect(r.destination).toBe('/index.html')
  })

  it('/print 와 /404.html 에 X-Robots-Tag noindex 헤더가 있다', () => {
    for (const source of ['/print', '/404.html']) {
      const rule = config.headers.find((h) => h.source === source)
      expect(rule?.headers).toContainEqual({ key: 'X-Robots-Tag', value: 'noindex' })
    }
  })

  it('CSP 헤더는 모든 주소에 있다', () => {
    const all = config.headers.find((h) => h.source === '/(.*)')
    expect(all?.headers.some((h) => h.key === 'Content-Security-Policy')).toBe(true)
  })
})

describe('404.html', () => {
  const index = read('index.html')

  it('index.html 에서 noindex meta를 넣어 만든다. 인라인 script는 없다', () => {
    const html = make404Html(index)
    expect(html).toContain('<meta name="robots" content="noindex" />')
    for (const s of html.match(/<script\b[^>]*>/g) ?? []) expect(s).toContain('src=')
  })

  it('index.html 자체에는 noindex가 없다(상세본은 색인 대상)', () => {
    expect(index).not.toContain('noindex')
  })

  // 빌드 뒤에만 확인한다. CI는 test 다음에 build를 돌리므로 dist가 없으면 건너뛴다.
  it.skipIf(!existsSync(resolve(process.cwd(), 'dist/404.html')))('빌드 산출물 dist/404.html 에 noindex meta가 있다', () => {
    const html = read('dist/404.html')
    expect(html).toContain('name="robots" content="noindex"')
    expect(html).toMatch(/src="\/assets\//)
    expect(html).not.toMatch(/\sstyle=/)
  })
})
