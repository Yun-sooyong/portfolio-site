import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../app/routes'
import { RECENT_JOURNAL_COUNT, recentJournal } from '../domain/journal'
import { SECTIONS } from '../domain/sections'
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
  it('/ 는 상세본이다. 첫 화면과 구역 6개가 한 페이지에 이어진다', () => {
    const { container } = renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('의료 AI 모델을 서비스로 잇는 백엔드를 만듭니다.')
    expect(document.getElementById('top')).not.toBeNull()
    const ids = [...container.querySelectorAll('main > section')].map((s) => s.id)
    expect(ids).toEqual(['top', ...SECTIONS.map((s) => s.id)])
    expect(screen.queryByText(/예시 내용/)).toBeNull()
    // 한 칸씩 넘기는 장면과 점 내비게이션은 없다.
    expect(container.querySelector('.scene, .scene-nav')).toBeNull()
    expect(document.documentElement.classList.contains('snap')).toBe(false)
  })

  it('헤더에 구역 링크 6개와 다크 모드 단추가 있다', () => {
    renderAt('/')
    const nav = screen.getByRole('navigation', { name: '구역 이동' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((a) => a.textContent)).toEqual(['소개', '기술', '프로젝트', '이력', '기록', '연락처'])
    links.forEach((a, i) => expect(a).toHaveAttribute('href', `#${SECTIONS[i]!.id}`))
    expect(screen.getByRole('button', { name: '다크 모드' })).toBeInTheDocument()
  })

  it('작은 화면의 메뉴 단추가 aria-expanded 로 열림 상태를 알린다', async () => {
    renderAt('/')
    const menu = screen.getByRole('button', { name: '메뉴' })
    expect(menu).toHaveAttribute('aria-expanded', 'false')
    expect(menu).toHaveAttribute('aria-controls', 'site-nav-list')
    await userEvent.click(menu)
    expect(menu).toHaveAttribute('aria-expanded', 'true')
    expect(document.getElementById('site-nav-list')).not.toBeNull()
  })

  it('큰 번호는 SECTIONS 표를 따르고 보조 기술에서 숨겨진다', () => {
    renderAt('/')
    const nums = [...document.querySelectorAll('.section-num')]
    expect(nums.map((n) => n.textContent)).toEqual(SECTIONS.map((s) => s.no))
    for (const n of nums) expect(n).toHaveAttribute('aria-hidden', 'true')
    for (const s of SECTIONS) {
      expect(within(document.getElementById(s.id)!).getByRole('heading', { level: 2 })).toBeInTheDocument()
    }
  })

  it('/print 는 단축본이다. PDF로 저장 단추가 print를 부르고 noindex 이다', async () => {
    const print = vi.fn()
    window.print = print
    renderAt('/print')
    await userEvent.click(await screen.findByRole('button', { name: 'PDF로 저장' }))
    expect(print).toHaveBeenCalledTimes(1)
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
    // 프로젝트는 상위 4개까지 보인다.
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeLessThanOrEqual(4)
  })

  it('/print 는 프로젝트마다 GitHub·노션 주소를 글자로 보이고, 없는 링크는 보이지 않는다', async () => {
    window.print = vi.fn()
    const { container } = renderAt('/print')
    await screen.findByRole('button', { name: 'PDF로 저장' })
    const sheet = container.querySelector('.sheet')!
    const text = sheet.textContent ?? ''
    for (const p of portfolio.projects.slice(0, 4)) {
      if (p.githubUrl) expect(text).toContain(p.githubUrl.replace('https://', ''))
      if (p.notionUrl) expect(text).toContain(p.notionUrl.replace('https://', ''))
      if (p.demoUrl) expect(text).toContain(p.demoUrl.replace('https://', ''))
    }
    // "데모 " 는 데모가 있는 프로젝트 수만큼만 나온다(지금은 0개).
    const demoCount = portfolio.projects.slice(0, 4).filter((p) => p.demoUrl).length
    expect(text.match(/데모 /g) ?? []).toHaveLength(demoCount)
    // 구성도, 문제 해결은 단축본에서도 뺀다.
    expect(text).not.toContain('문제 해결')
    // 교육 이력의 배운 기술, 스터디, 자격증 진행 상태
    const t = portfolio.background.trainings[0]!
    expect(text).toContain(t.stack.join(', '))
    if (t.study) expect(text).toContain(t.study)
    expect(text).not.toContain('홍길동')
  })

  it('/print 에는 헤더와 구역이 없다', async () => {
    const { container } = renderAt('/print')
    await screen.findByRole('button', { name: 'PDF로 저장' })
    expect(container.querySelector('.site-header, .section, .hero')).toBeNull()
    expect(screen.queryByRole('navigation', { name: '구역 이동' })).toBeNull()
  })

  it('없는 주소는 안내 화면과 상세본 링크를 보인다', async () => {
    renderAt('/nothing-here')
    expect(await screen.findByRole('heading', { name: '페이지가 없습니다' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '상세본으로 가기' })).toHaveAttribute('href', '/')
  })
})

describe('다크 모드', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme
    vi.restoreAllMocks()
    try {
      window.localStorage.clear()
    } catch {
      // 무시한다.
    }
  })

  it('단추를 누르면 data-theme 와 단추 글자가 바뀌고 선택이 저장된다', async () => {
    document.documentElement.dataset.theme = 'light'
    renderAt('/')
    const btn = screen.getByRole('button', { name: '다크 모드' })
    await userEvent.click(btn)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(btn).toHaveAccessibleName('밝은 모드')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('dark')
    await userEvent.click(btn)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(btn).toHaveAccessibleName('다크 모드')
    expect(window.localStorage.getItem('portfolio-theme')).toBe('light')
  })

  it('저장소가 막혀 있어도 오류 없이 바뀐다', async () => {
    document.documentElement.dataset.theme = 'light'
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('막힘')
    })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('막힘')
    })
    renderAt('/')
    await userEvent.click(screen.getByRole('button', { name: '다크 모드' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('저장된 선택이 없으면 시스템 설정을 따르고, 저장된 선택이 먼저다', async () => {
    const { resolveTheme } = await import('../ui/theme')
    mockMatchMedia(false)
    window.matchMedia = ((q: string) => ({ matches: q.includes('prefers-color-scheme: dark'), media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia
    expect(resolveTheme()).toBe('dark')
    window.localStorage.setItem('portfolio-theme', 'light')
    expect(resolveTheme()).toBe('light')
  })
})

describe('프로젝트 펼침', () => {
  it('첫 프로젝트만 펼친 채로 시작한다', () => {
    renderAt('/')
    const buttons = within(document.getElementById('projects')!).getAllByRole('button')
    expect(buttons).toHaveLength(portfolio.projects.length)
    buttons.forEach((b, i) => expect(b).toHaveAttribute('aria-expanded', i === 0 ? 'true' : 'false'))
  })

  it('단추를 누르면 aria-expanded 가 바뀌고 aria-controls 가 펼침 영역을 가리킨다', async () => {
    renderAt('/')
    const second = portfolio.projects[1]!
    const btn = screen.getByRole('button', { name: new RegExp(second.name.slice(0, 6)) })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    const panel = document.getElementById(btn.getAttribute('aria-controls')!)!
    expect(panel).not.toBeNull()
    expect(panel).toHaveAttribute('inert')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('inert')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('펼침 내용에 개요, 맡은 일, 결과가 있고 구성도, 문제와 해결은 없다', () => {
    renderAt('/')
    for (const p of portfolio.projects) {
      const item = document.getElementById(`project-${p.id}`)!
      const labels = [...item.querySelectorAll('.col-label')].map((l) => l.textContent)
      expect(labels).toEqual(['개요', '맡은 일', '결과'])
      expect(item.textContent).toContain(p.summary)
      expect(item.textContent).toContain(p.overview)
      expect(item.querySelectorAll('.dash-list li').length).toBeGreaterThan(0)
      for (const r of p.results) expect(item.textContent).toContain(r.value)
      for (const name of p.coreStack) expect(within(item).getAllByText(name, { selector: '.chip' }).length).toBeGreaterThan(0)
      for (const gone of ['구성도', '문제와 해결', '배포 방식', '주요 기능']) expect(item.textContent).not.toContain(gone)
    }
  })

  it('GitHub, 데모, 노션에서 자세히 링크가 값이 있을 때만 보인다', () => {
    renderAt('/')
    for (const p of portfolio.projects) {
      const root = document.getElementById(`project-${p.id}`)!
      const github = within(root).queryByRole('link', { name: /^GitHub/ })
      const demo = within(root).queryByRole('link', { name: /^데모/ })
      const notion = within(root).queryByRole('link', { name: /^노션에서 자세히/ })
      expect(github === null, `${p.id} github`).toBe(p.githubUrl === undefined)
      expect(demo === null, `${p.id} demo`).toBe(p.demoUrl === undefined)
      expect(notion === null, `${p.id} notion`).toBe(p.notionUrl === undefined)
      if (github) expect(github).toHaveAttribute('href', p.githubUrl)
      if (notion) expect(notion).toHaveAttribute('href', p.notionUrl)
    }
  })

  it('링크가 하나도 없는 프로젝트는 링크 목록을 그리지 않는다', async () => {
    const { ProjectsSection } = await import('../features/detail/ProjectsSection')
    const bare = { ...portfolio.projects[0]!, githubUrl: undefined, demoUrl: undefined, notionUrl: undefined }
    render(<ProjectsSection projects={[bare]} />)
    expect(screen.queryByRole('link')).toBeNull()
  })
})

describe('성과 숫자 격자', () => {
  it('화면의 숫자가 content/highlights.ts 에서 온다', () => {
    renderAt('/')
    const cells = [...document.querySelectorAll('#about .stat')]
    expect(cells).toHaveLength(portfolio.highlights.length)
    portfolio.highlights.forEach((h, i) => {
      const cell = cells[i] as HTMLElement
      expect(cell.querySelector('.stat-value')?.textContent).toBe(`${h.value}${h.unit ?? ''}`)
      expect(cell.textContent).toContain(h.caption)
      expect(cell.classList.contains('stat-accent')).toBe(Boolean(h.accent))
    })
    expect(document.querySelectorAll('#about .stat-accent')).toHaveLength(1)
  })

  it('첫 화면 카드의 최근 결과도 content 에서 온다', () => {
    renderAt('/')
    const award = portfolio.highlights.find((h) => h.award)!
    expect(within(document.querySelector('.hero-card') as HTMLElement).getByText(award.caption)).toBeInTheDocument()
  })
})

describe('이메일', () => {
  const email = 'ysyg22@gmail.com'

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

describe('빌드 입력', () => {
  it('index.html 에 인라인 script 와 style 속성이 없다', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
    const scripts = html.match(/<script\b[^>]*>/g) ?? []
    for (const s of scripts) expect(s).toContain('src=')
    expect(html).not.toMatch(/\sstyle=/)
  })
})

describe('기록 구역', () => {
  it('기록이 없으면 빈 상태 문구를 보인다', async () => {
    const { RecordSection } = await import('../features/detail/RecordSection')
    render(<RecordSection data={portfolio.howBuilt} journal={[]} />)
    expect(screen.getByText(/아직 기록한 시행착오가 없습니다/)).toBeInTheDocument()
  })

  it('최근 시행착오 3개를 날짜, 문제, 해결로 보인다(원인은 보이지 않는다)', () => {
    renderAt('/')
    const scene = document.getElementById('record')!
    const items = scene.querySelectorAll('.recent-journal > li')
    expect(items).toHaveLength(RECENT_JOURNAL_COUNT)
    const expected = recentJournal(portfolio.journal)
    expected.forEach((e, i) => {
      const li = items[i] as HTMLElement
      expect(li.querySelector('time')).toHaveAttribute('datetime', e.date)
      expect(within(li).getByText('문제')).toBeInTheDocument()
      expect(within(li).getByText('해결')).toBeInTheDocument()
      expect(li.textContent).toContain(e.problem)
      expect(li.textContent).toContain(e.fix)
      expect(li.textContent).not.toContain(e.cause)
    })
    expect(within(scene).queryByText('원인')).toBeNull()
  })

  it('구조·보안 요점과 CI 단계를 보이고 폴더 표는 없다', () => {
    renderAt('/')
    const scene = document.getElementById('record')!
    for (const pt of portfolio.howBuilt.points) expect(within(scene).getByText(pt.title)).toBeInTheDocument()
    expect(scene.querySelector('table')).toBeNull()
    expect(scene.querySelectorAll('ol.terminal > li')).toHaveLength(portfolio.howBuilt.ciSteps.length)
  })

  it('"전체 기록: GitHub README" 링크가 있고 주소가 맞다. 노션 주소가 없으면 노션 링크는 없다', () => {
    renderAt('/')
    const scene = document.getElementById('record')!
    const readme = within(scene).getByRole('link', { name: /전체 기록: GitHub README/ })
    expect(readme).toHaveAttribute('href', 'https://github.com/Yun-sooyong/portfolio-site#readme')
    const notion = within(scene).queryByRole('link', { name: /노션 기록/ })
    if (portfolio.howBuilt.notionUrl) expect(notion).toHaveAttribute('href', portfolio.howBuilt.notionUrl)
    else expect(notion).toBeNull()
  })

  it('이 구역에는 연락처 링크(mailto)가 섞이지 않는다', () => {
    renderAt('/')
    expect(document.getElementById('record')!.querySelector('a[href^="mailto:"]')).toBeNull()
  })

  it('CI 단계가 .github/workflows/ci.yml 의 실제 run 명령과 같다', () => {
    const yml = readFileSync(resolve(process.cwd(), '.github/workflows/ci.yml'), 'utf8')
    const runs = [...yml.matchAll(/^\s*- run: (.+)$/gm)].map((m) => m[1])
    expect(portfolio.howBuilt.ciSteps).toEqual(runs)
  })
})

describe('이력 구역', () => {
  it('경력 경로 막대는 시기 순서이고 마지막 단계만 강조한다', () => {
    renderAt('/')
    const steps = [...document.querySelectorAll('#career .path-step')]
    expect(steps.map((s) => s.querySelector('.path-name')?.textContent)).toEqual(['건양대학교', '정보처리기사', '탄동농업협동조합', '바이오메디컬 AI 과정'])
    expect(steps.map((s) => s.querySelector('.path-when')?.textContent)).toEqual(['2014–2021', '2019', '2024–2026', '2026.03–10'])
    expect(steps.map((s) => s.classList.contains('is-current'))).toEqual([false, false, false, true])
  })

  it('경력, 학력, 교육, 자격증 목록과 교육 이력의 배운 기술, 스터디, 자격증 진행 상태가 보인다', () => {
    renderAt('/')
    const career = document.getElementById('career')!
    for (const label of ['경력', '학력', '교육', '자격증']) {
      expect(within(career).getByRole('heading', { level: 3, name: label })).toBeInTheDocument()
    }
    for (const t of portfolio.background.trainings) {
      expect(career.textContent).toContain(t.summary)
      expect(career.textContent).toContain(t.stack.join(', '))
      if (t.study) expect(career.textContent).toContain(t.study)
    }
    for (const c of portfolio.background.certificates) {
      expect(career.textContent).toContain(c.name)
      if (c.status) expect(within(career).getByText(c.status)).toBeInTheDocument()
    }
    expect(career.querySelector('a')).toBeNull()
  })
})

describe('쪽 이동', () => {
  it('상세본에서 단축본 링크를 누르면 본문(main)에 초점이 간다', async () => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
    renderAt('/')
    await userEvent.click(screen.getAllByRole('link', { name: /단축본 PDF/ })[0]!)
    await screen.findByRole('button', { name: 'PDF로 저장' })
    await vi.waitFor(() => expect(document.activeElement?.tagName).toBe('MAIN'))
  })

  it('첫 화면 버튼은 프로젝트 구역과 단축본으로 간다', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: '프로젝트 보기' })).toHaveAttribute('href', '#projects')
    expect(screen.getAllByRole('link', { name: /단축본 PDF/ }).every((a) => a.getAttribute('href') === '/print')).toBe(true)
  })

  it('바깥 링크는 새 탭에서 열린다고 보조 기술에 알린다', () => {
    renderAt('/')
    const links = within(document.getElementById('contact')!).getAllByRole('link', { name: /GitHub/ })
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAccessibleName(/새 탭에서 열림/)
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer')
    for (const a of document.querySelectorAll('.project-links a')) {
      expect(a).toHaveAttribute('target', '_blank')
      expect(a).toHaveAttribute('rel', 'noopener noreferrer')
      expect(a.getAttribute('href')).toMatch(/^https:\/\//)
    }
  })

  it('연락처 구역에 이메일, GitHub, 단축본 링크가 있다', () => {
    renderAt('/')
    const contact = document.getElementById('contact')!
    expect(within(contact).getByRole('link', { name: 'ysyg22@gmail.com' })).toBeInTheDocument()
    expect(within(contact).getByRole('link', { name: /단축본 PDF/ })).toHaveAttribute('href', '/print')
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

describe('제목', () => {
  it('상세본의 제목이 단계를 건너뛰지 않는다', () => {
    renderAt('/')
    const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName.slice(1)))
    expect(levels[0]).toBe(1)
    expect(levels.filter((l) => l === 1)).toHaveLength(1)
    for (let i = 1; i < levels.length; i++) expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1)
  })

  it('같은 구역 안에 같은 문구의 제목이 둘 나오지 않는다', () => {
    renderAt('/')
    for (const section of document.querySelectorAll('main > section')) {
      const texts = [...section.querySelectorAll('h1,h2,h3,h4')].map((h) => h.textContent?.trim())
      expect(new Set(texts).size, `${section.id}: ${texts.join(' | ')}`).toBe(texts.length)
    }
  })

  it('프로젝트 제목에 어느 프로젝트인지 드러난다', () => {
    renderAt('/')
    for (const p of portfolio.projects) {
      const h3 = document.getElementById(`project-${p.id}`)!.querySelector('h3')
      expect(h3?.textContent).toContain(p.name)
    }
  })
})

describe('글꼴과 스타일', () => {
  it('기술 이름 칩이 mono 글꼴 class 안에 렌더된다', () => {
    renderAt('/')
    for (const p of portfolio.projects) {
      for (const name of p.coreStack) {
        const nodes = screen.getAllByText(name, { selector: '.chip' })
        expect(nodes.length).toBeGreaterThan(0)
        for (const node of nodes) expect(node.closest('.font-mono')).not.toBeNull()
      }
    }
    for (const g of portfolio.skillGroups) {
      for (const s of g.skills) {
        const dt = [...document.querySelectorAll('#skills dt')].find((d) => d.textContent === s.name)
        expect(dt, s.name).toBeDefined()
        expect(dt!.classList.contains('font-mono'), s.name).toBe(true)
      }
    }
  })

  it('기술 구역은 영역마다 카드 1개이고 할 수 있는 일 문장이 있다', () => {
    renderAt('/')
    const cards = document.querySelectorAll('#skills .skill-card')
    expect(cards).toHaveLength(portfolio.skillGroups.length)
    for (const g of portfolio.skillGroups) {
      for (const s of g.skills) expect(document.getElementById('skills')!.textContent).toContain(s.can)
    }
    expect(document.getElementById('skills')!.querySelector('.project-item')).toBeNull()
  })

  it('한글 문장은 mono 글꼴 영역에 넣지 않는다(영문 기술 이름만 mono)', () => {
    renderAt('/')
    const hangul = /[가-힣]/
    for (const el of document.querySelectorAll('.font-mono')) {
      if (el.closest('.chip')) continue
      expect(hangul.test(el.textContent ?? ''), el.outerHTML.slice(0, 80)).toBe(false)
    }
  })

  it('style 속성이 없다', () => {
    const { container } = renderAt('/')
    expect(container.querySelector('[style]')).toBeNull()
  })

  it('전화번호, 주소, 지역, 생년월일 글자가 화면에 없다', () => {
    renderAt('/')
    const text = document.body.textContent ?? ''
    expect(text).not.toMatch(/\b01[016789]-?\d{3,4}-?\d{4}\b/)
    expect(text).not.toMatch(/생년월일|거주/)
  })
})
