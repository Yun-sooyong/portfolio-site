import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../app/routes'
import { SCENES } from '../domain/scenes'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

function mockMatchMedia(reduce: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? reduce : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

afterEach(() => {
  // matchMedia를 되돌린다.
  // @ts-expect-error jsdom에는 matchMedia가 없다.
  delete window.matchMedia
  document.head.querySelectorAll('meta[name="robots"]').forEach((m) => m.remove())
})

describe('주소', () => {
  it('/ 는 상세본이다. 장면 8개와 위치 표시 점 8개가 있다', () => {
    const { container } = renderAt('/')
    expect(container.querySelectorAll('section.scene')).toHaveLength(SCENES.length)
    const nav = screen.getByRole('navigation', { name: '장면 위치' })
    expect(within(nav).getAllByRole('button')).toHaveLength(8)
    expect(screen.getByRole('heading', { level: 1, name: '홍길동' })).toBeInTheDocument()
    expect(screen.getByText(/예시 내용입니다/)).toBeInTheDocument()
  })

  it('상세본에 시행착오 장면이 있다', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: '시행착오' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '이 사이트를 만든 방식' })).toBeInTheDocument()
  })

  it('/print 는 단축본이다. PDF로 저장 단추가 print를 부르고 noindex 이다', async () => {
    const print = vi.fn()
    window.print = print
    renderAt('/print')
    await userEvent.click(screen.getByRole('button', { name: 'PDF로 저장' }))
    expect(print).toHaveBeenCalledTimes(1)
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
    // 프로젝트는 상위 3개까지 보인다.
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeLessThanOrEqual(3)
  })

  it('/print 에는 장면과 위치 표시가 없다', () => {
    const { container } = renderAt('/print')
    expect(container.querySelector('.scene')).toBeNull()
    expect(screen.queryByRole('navigation', { name: '장면 위치' })).toBeNull()
  })

  it('없는 주소는 안내 화면과 상세본 링크를 보인다', () => {
    renderAt('/nothing-here')
    expect(screen.getByRole('heading', { name: '페이지가 없습니다' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '상세본으로 가기' })).toHaveAttribute('href', '/')
  })
})

describe('이메일', () => {
  const email = 'hello@example.com'

  it('서버가 만드는 HTML 원문 문자열에 이메일이 없다', () => {
    for (const path of ['/', '/print']) {
      const html = renderToString(
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>,
      )
      expect(html).not.toContain(email)
      expect(html).not.toContain('mailto:')
    }
  })

  it('index.html 원문에 이메일이 없다', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
    expect(html).not.toContain(email)
  })

  it('브라우저에서는 화면에서 조립해 링크를 보인다', () => {
    renderAt('/')
    const link = screen.getByRole('link', { name: email })
    expect(link).toHaveAttribute('href', `mailto:${email}`)
  })
})

describe('움직임', () => {
  it('움직임 줄이기가 꺼져 있으면 장면에 전환 클래스가 있다', () => {
    mockMatchMedia(false)
    const { container } = renderAt('/')
    expect(container.querySelectorAll('.scene-motion')).toHaveLength(SCENES.length - 1)
    // 첫 장면은 로딩 직후 바로 보이도록 전환 클래스가 없다.
    expect(container.querySelector('#intro')).not.toHaveClass('scene-motion')
  })

  it('reduced-motion 이면 장면에 전환 클래스가 없다', () => {
    mockMatchMedia(true)
    const { container } = renderAt('/')
    expect(container.querySelectorAll('section.scene')).toHaveLength(SCENES.length)
    expect(container.querySelector('.scene-motion')).toBeNull()
  })
})

describe('빌드 입력', () => {
  it('index.html 에 인라인 script 와 style 속성이 없다', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
    const scripts = html.match(/<script\b[^>]*>/g) ?? []
    for (const s of scripts) expect(s).toContain('src=')
    expect(html).not.toMatch(/\sstyle=/)
  })
})

describe('시행착오 장면', () => {
  it('기록이 없으면 빈 상태 문구를 보인다', async () => {
    const { JournalScene } = await import('../features/detail/TailScenes')
    render(<JournalScene entries={[]} id="journal" title="시행착오" />)
    expect(screen.getByText(/아직 기록한 시행착오가 없습니다/)).toBeInTheDocument()
  })

  it('기록이 있으면 날짜, 문제, 원인, 해결을 보인다', () => {
    renderAt('/')
    const scene = document.getElementById('journal')!
    expect(within(scene).getAllByText('원인').length).toBeGreaterThan(0)
    expect(within(scene).getAllByText('해결').length).toBeGreaterThan(0)
    expect(scene.querySelector('time')).toHaveAttribute('datetime', '2026-11-04')
  })
})
