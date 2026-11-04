import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../app/routes'
import { MAX_FLAT_DOTS, buildScenePlan, flattenSceneIds } from '../domain/scenes'
import { PrintSheet } from '../features/print/PrintSheet'
import { portfolio } from '../content'

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
  it('/ 는 상세본이다. 장면 계획의 모든 칸이 있고 위치 표시가 있다', () => {
    const { container } = renderAt('/')
    const plan = buildScenePlan(portfolio)
    const ids = flattenSceneIds(plan)
    expect(container.querySelectorAll('section.scene')).toHaveLength(ids.length)
    for (const id of ids) expect(document.getElementById(id)).not.toBeNull()
    const nav = screen.getByRole('navigation', { name: '장면 위치' })
    const total = ids.length
    // 하위 장면이 많으면 큰 장면 8개만 큰 점이고, 지금 장면의 하위 점이 펼쳐진다.
    const expected = total <= MAX_FLAT_DOTS ? total : 8 + (plan[0]!.scenes.length > 1 ? plan[0]!.scenes.length : 0)
    expect(within(nav).getAllByRole('button')).toHaveLength(expected)
    expect(screen.getByRole('heading', { level: 1, name: '홍길동' })).toBeInTheDocument()
    expect(screen.getByText(/예시 내용입니다/)).toBeInTheDocument()
  })

  it('상세본에 시행착오 장면이 있다', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: '시행착오' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '이 사이트를 만든 방식' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'CI 단계' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '연락처' })).toBeInTheDocument()
  })

  it('/print 는 단축본이다. PDF로 저장 단추가 print를 부르고 noindex 이다', async () => {
    const print = vi.fn()
    window.print = print
    renderAt('/print')
    await userEvent.click(await screen.findByRole('button', { name: 'PDF로 저장' }))
    expect(print).toHaveBeenCalledTimes(1)
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
    // 프로젝트는 상위 3개까지 보인다.
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeLessThanOrEqual(3)
  })

  it('/print 에는 장면과 위치 표시가 없다', async () => {
    const { container } = renderAt('/print')
    await screen.findByRole('button', { name: 'PDF로 저장' })
    expect(container.querySelector('.scene')).toBeNull()
    expect(screen.queryByRole('navigation', { name: '장면 위치' })).toBeNull()
  })

  it('없는 주소는 안내 화면과 상세본 링크를 보인다', async () => {
    renderAt('/nothing-here')
    expect(await screen.findByRole('heading', { name: '페이지가 없습니다' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '상세본으로 가기' })).toHaveAttribute('href', '/')
  })
})

describe('이메일', () => {
  const email = 'hello@example.com'

  it('서버가 만드는 HTML 원문 문자열에 이메일이 없다', () => {
    // 단축본은 쪽 단위로 늦게 불러오므로 화면 부품을 직접 그린다.
    const pages = [
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
      <PrintSheet data={portfolio} />,
    ]
    for (const page of pages) {
      const html = renderToString(page)
      expect(html.length).toBeGreaterThan(500)
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
    const total = flattenSceneIds(buildScenePlan(portfolio)).length
    expect(container.querySelectorAll('.scene-motion')).toHaveLength(total - 1)
    // 첫 장면은 로딩 직후 바로 보이도록 전환 클래스가 없다.
    expect(container.querySelector('#intro')).not.toHaveClass('scene-motion')
  })

  it('reduced-motion 이면 장면에 전환 클래스가 없다', () => {
    mockMatchMedia(true)
    const { container } = renderAt('/')
    expect(container.querySelectorAll('section.scene').length).toBeGreaterThanOrEqual(8)
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
    const { JournalScenes } = await import('../features/detail/TailScenes')
    render(
      <MemoryRouter>
        <JournalScenes entries={[]} title="시행착오" />
      </MemoryRouter>,
    )
    expect(screen.getByText(/아직 기록한 시행착오가 없습니다/)).toBeInTheDocument()
  })

  it('기록이 있으면 날짜, 문제, 원인, 해결을 보인다', () => {
    renderAt('/')
    const scene = document.getElementById('journal')!
    expect(within(scene).getAllByText('원인').length).toBeGreaterThan(0)
    expect(within(scene).getAllByText('해결').length).toBeGreaterThan(0)
    expect(scene.querySelector('time')).toHaveAttribute('datetime', '2026-11-04')
    // 시행착오는 6개씩 화면 한 칸에 담는다.
    expect(scene.querySelectorAll('li > dl').length).toBeLessThanOrEqual(6)
  })
})

describe('쪽 이동', () => {
  it('상세본에서 단축본 링크를 누르면 본문(main)에 초점이 간다', async () => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
    renderAt('/')
    await userEvent.click(screen.getByRole('link', { name: /PDF 단축본/ }))
    await screen.findByRole('button', { name: 'PDF로 저장' })
    await vi.waitFor(() => expect(document.activeElement?.tagName).toBe('MAIN'))
  })

  it('바깥 링크는 새 탭에서 열린다고 보조 기술에 알린다', () => {
    renderAt('/')
    const link = screen.getByRole('link', { name: /GitHub/ })
    expect(link).toHaveAccessibleName(/새 탭에서 열림/)
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('화면 그리기에 실패하면 안내와 새로고침 단추를 보인다', async () => {
    const { ErrorBoundary } = await import('../app/ErrorBoundary')
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    function Boom(): never {
      throw new Error('시험용 오류')
    }
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('heading', { name: '화면을 불러오지 못했습니다' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '새로고침' })).toBeInTheDocument()
    spy.mockRestore()
  })
})

describe('제목 순서', () => {
  it('상세본의 제목이 단계를 건너뛰지 않는다', () => {
    renderAt('/')
    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName.slice(1)))
    expect(levels[0]).toBe(1)
    for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1)
  })
})

describe('제목 중복', () => {
  it('같은 장면 안에 같은 문구의 제목이 둘 나오지 않는다', () => {
    renderAt('/')
    for (const section of document.querySelectorAll('section.scene')) {
      const texts = [...section.querySelectorAll('h1,h2,h3,h4')].map((h) => h.textContent?.trim())
      expect(new Set(texts).size, `${section.id}: ${texts.join(' | ')}`).toBe(texts.length)
    }
  })

  it('프로젝트 장면의 제목에 어느 프로젝트인지 드러난다', () => {
    renderAt('/')
    for (const p of portfolio.projects) {
      const h2 = document.getElementById(`project-${p.id}`)!.querySelector('h2')
      expect(h2?.textContent).toBe(p.name)
    }
  })
})

describe('벤토 그리드', () => {
  it('기술 이름 칩이 mono 글꼴 class 안에 렌더된다', () => {
    renderAt('/')
    for (const p of portfolio.projects) {
      for (const name of p.coreStack) {
        const nodes = screen.getAllByText(name, { selector: '.chip' })
        expect(nodes.length).toBeGreaterThan(0)
        for (const node of nodes) expect(node.closest('.font-mono')).not.toBeNull()
      }
    }
    // 기술 장면의 기술 이름도 mono 글꼴이다.
    for (const g of portfolio.skillGroups) {
      for (const s of g.skills) {
        const dt = [...document.querySelectorAll('dt')].find((d) => d.textContent === s.name)!
        expect(dt, s.name).toBeDefined()
        // 한글이 섞인 이름은 영문 부분만 mono 이고, 영문 이름은 dt 전체가 mono 이다.
        expect(dt.classList.contains('font-mono') || dt.querySelector('.font-mono') !== null, s.name).toBe(true)
      }
    }
  })

  it('장면마다 강조 타일이 1개 이하이고 style 속성이 없다', () => {
    const { container } = renderAt('/')
    const scenes = container.querySelectorAll('section.scene')
    expect(scenes.length).toBeGreaterThanOrEqual(8)
    for (const scene of scenes) {
      expect(scene.querySelectorAll('.tile-strong').length, scene.id).toBeLessThanOrEqual(1)
    }
    expect(container.querySelector('[style]')).toBeNull()
  })

  it('CI 단계가 .github/workflows/ci.yml 의 실제 run 명령과 같다', () => {
    const yml = readFileSync(resolve(process.cwd(), '.github/workflows/ci.yml'), 'utf8')
    const runs = [...yml.matchAll(/^\s*- run: (.+)$/gm)].map((m) => m[1])
    expect(portfolio.howBuilt.ciSteps).toEqual(runs)
  })
})

describe('장면 압축', () => {
  it('프로젝트는 장면 1개씩이다', () => {
    renderAt('/')
    for (const p of portfolio.projects) {
      expect(document.getElementById(`project-${p.id}`)).not.toBeNull()
      expect(document.getElementById(`project-${p.id}-2`)).toBeNull()
    }
  })

  it('연락처는 마지막 장면이고 시행착오와 섞이지 않는다', () => {
    const { container } = renderAt('/')
    const scenes = [...container.querySelectorAll('section.scene')]
    const last = scenes[scenes.length - 1]!
    expect(last.id).toBe('contact')
    expect(within(last as HTMLElement).getByRole('link', { name: 'hello@example.com' })).toBeInTheDocument()
    for (const scene of scenes.filter((s) => s.id.startsWith('journal'))) {
      expect(scene.querySelector('a')).toBeNull()
    }
  })

  it('시행착오는 6개씩 나뉜다', () => {
    const { container } = renderAt('/')
    const pages = [...container.querySelectorAll('section.scene')].filter((s) => s.id.startsWith('journal'))
    expect(pages).toHaveLength(Math.ceil(portfolio.journal.length / 6))
    for (const page of pages) expect(page.querySelectorAll('li > dl').length).toBeLessThanOrEqual(6)
  })

  it('소개와 이력 장면에 경력, 학력, 교육 이력, 자격증이 있고 연락처 링크는 없다', () => {
    renderAt('/')
    const intro = document.getElementById('intro')!
    for (const label of ['경력', '학력과 교육 이력', '자격증']) {
      expect(within(intro).getByRole('heading', { name: label })).toBeInTheDocument()
    }
    expect(intro.querySelector('a')).toBeNull()
  })

  it('프로젝트 목록 타일마다 대표 결과 숫자 1개가 있다', () => {
    renderAt('/')
    const list = document.getElementById('projects')!
    expect(list.querySelectorAll('.project-result-value')).toHaveLength(portfolio.projects.length)
    portfolio.projects.forEach((p, i) => {
      expect(list.querySelectorAll('.project-result-value')[i]?.textContent).toBe(p.results[0]!.value)
    })
  })

  it('기술 장면에 프로젝트 목록이 섞이지 않는다', () => {
    renderAt('/')
    expect(document.getElementById('skills')!.querySelector('.project-card')).toBeNull()
  })

  it('한글 문장은 mono 글꼴 영역에 넣지 않는다(영문 기술 이름만 mono)', () => {
    renderAt('/')
    const hangul = /[가-힣]/
    for (const el of document.querySelectorAll('.font-mono')) {
      if (el.closest('.chip')) continue
      expect(hangul.test(el.textContent ?? ''), el.outerHTML.slice(0, 80)).toBe(false)
    }
  })
})
