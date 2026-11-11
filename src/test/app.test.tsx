import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from 'react-dom/server'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../app/routes'
import { MAX_FLAT_DOTS, RECENT_JOURNAL_COUNT, buildScenePlan, flattenSceneIds, recentJournal } from '../domain/scenes'
import { SceneNav } from '../ui/SceneNav'
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
    expect(screen.getByRole('heading', { level: 1, name: '윤수용' })).toBeInTheDocument()
    expect(screen.queryByText(/예시 내용/)).toBeNull()
  })

  it('상세본에 "이 사이트와 기록" 장면이 있고, 따로 시행착오·만든 방식 장면은 없다', () => {
    renderAt('/')
    const site = document.getElementById('site')!
    expect(within(site).getByRole('heading', { level: 2, name: '이 사이트와 기록' })).toBeInTheDocument()
    expect(within(site).getByRole('heading', { name: 'CI 단계' })).toBeInTheDocument()
    expect(within(site).getByRole('heading', { name: '최근 시행착오' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '연락처' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: /^시행착오/ })).toBeNull()
    expect(screen.queryByRole('heading', { level: 2, name: '이 사이트를 만든 방식' })).toBeNull()
    expect(document.querySelector('[id^="journal"]')).toBeNull()
    expect(document.getElementById('how-built')).toBeNull()
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

describe('장면 위치 표시', () => {
  const p = portfolio.projects[0]!
  const manyProjects = Array.from({ length: 12 }, (_, i) => ({ ...p, id: `x${i}`, name: `프로젝트 ${i}` }))

  it('하위 장면이 12개 이하이면 전부 따로 점으로 보인다', () => {
    const plan = buildScenePlan(portfolio)
    render(<SceneNav groups={plan} activeId="intro" maxFlatDots={MAX_FLAT_DOTS} />)
    const nav = screen.getByRole('navigation', { name: '장면 위치' })
    expect(within(nav).getAllByRole('button')).toHaveLength(flattenSceneIds(plan).length)
    expect(within(nav).getByRole('button', { name: '이 사이트와 기록' })).toBeInTheDocument()
    expect(within(nav).queryByRole('button', { name: '시행착오' })).toBeNull()
  })

  it('하위 장면이 12개를 넘으면 큰 장면 6개 점이고, 지금 큰 장면의 하위 점만 펼친다', () => {
    const plan = buildScenePlan({ projects: manyProjects })
    expect(flattenSceneIds(plan).length).toBeGreaterThan(MAX_FLAT_DOTS)
    const { rerender } = render(<SceneNav groups={plan} activeId="intro" maxFlatDots={MAX_FLAT_DOTS} />)
    const nav = screen.getByRole('navigation', { name: '장면 위치' })
    expect(within(nav).getAllByRole('button')).toHaveLength(6)
    expect(within(nav).getByRole('button', { name: '이 사이트와 기록' })).toBeInTheDocument()
    rerender(<SceneNav groups={plan} activeId="project-x3" maxFlatDots={MAX_FLAT_DOTS} />)
    expect(within(nav).getAllByRole('button')).toHaveLength(6 + manyProjects.length)
    expect(within(nav).getByRole('button', { name: '프로젝트 3' })).toHaveAttribute('aria-current', 'true')
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

describe('이 사이트와 기록 장면', () => {
  it('기록이 없으면 빈 상태 문구를 보인다', async () => {
    const { SiteScene } = await import('../features/detail/TailScenes')
    render(
      <MemoryRouter>
        <SiteScene data={portfolio.howBuilt} journal={[]} id="site" title="이 사이트와 기록" />
      </MemoryRouter>,
    )
    expect(screen.getByText(/아직 기록한 시행착오가 없습니다/)).toBeInTheDocument()
  })

  it('최근 시행착오 3개를 날짜, 문제, 해결로 보인다(원인은 보이지 않는다)', () => {
    renderAt('/')
    const scene = document.getElementById('site')!
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
    const scene = document.getElementById('site')!
    for (const pt of portfolio.howBuilt.points) expect(within(scene).getByText(pt.title)).toBeInTheDocument()
    expect(scene.querySelector('table')).toBeNull()
    expect(scene.querySelectorAll('ol.terminal > li')).toHaveLength(portfolio.howBuilt.ciSteps.length)
  })

  it('"전체 기록: GitHub README" 링크가 있고 주소가 맞다. 노션 주소가 없으면 노션 링크는 없다', () => {
    renderAt('/')
    const scene = document.getElementById('site')!
    const readme = within(scene).getByRole('link', { name: /전체 기록: GitHub README/ })
    expect(readme).toHaveAttribute('href', 'https://github.com/Yun-sooyong/portfolio-site#readme')
    const notion = within(scene).queryByRole('link', { name: /노션 기록/ })
    if (portfolio.howBuilt.notionUrl) expect(notion).toHaveAttribute('href', portfolio.howBuilt.notionUrl)
    else expect(notion).toBeNull()
  })

  it('이 장면에는 연락처 링크(mailto)가 섞이지 않는다', () => {
    renderAt('/')
    expect(document.getElementById('site')!.querySelector('a[href^="mailto:"]')).toBeNull()
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
    const links = within(document.getElementById('contact')!).getAllByRole('link', { name: /GitHub/ })
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAccessibleName(/새 탭에서 열림/)
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer')
    // 프로젝트 링크도 모두 같은 규칙이다.
    for (const a of document.querySelectorAll('.project-links a')) {
      expect(a).toHaveAttribute('target', '_blank')
      expect(a).toHaveAttribute('rel', 'noopener noreferrer')
      expect(a.getAttribute('href')).toMatch(/^https:\/\//)
    }
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

  it('장면 순서는 소개, 기술, 프로젝트 목록, 프로젝트들, 이 사이트와 기록, 연락처이고 연락처가 마지막이다', () => {
    const { container } = renderAt('/')
    const ids = [...container.querySelectorAll('section.scene')].map((s) => s.id)
    expect(ids).toEqual(['intro', 'skills', 'projects', ...portfolio.projects.map((p) => `project-${p.id}`), 'site', 'contact'])
    const last = document.getElementById('contact')!
    expect(within(last).getByRole('link', { name: 'ysyg22@gmail.com' })).toBeInTheDocument()
  })

  it('프로젝트 장면은 요약만 보인다: 소개, 링크, 맡은 역할, 성과가 있고 구성도, 문제와 해결은 없다', () => {
    renderAt('/')
    for (const p of portfolio.projects) {
      const scene = document.getElementById(`project-${p.id}`)!
      const headings = [...scene.querySelectorAll('h3')].map((h) => h.textContent)
      expect(headings).toEqual(expect.arrayContaining(['소개', '맡은 역할', '성과']))
      for (const gone of ['구성도', '문제와 해결', '배포 방식', '주요 기능']) expect(headings).not.toContain(gone)
      expect(scene.textContent).toContain(p.summary)
      expect(scene.textContent).toContain(p.overview)
      expect(scene.textContent).toContain(p.role)
      for (const r of p.results) expect(scene.textContent).toContain(r.value)
      for (const name of p.coreStack) expect(within(scene).getAllByText(name, { selector: '.chip' }).length).toBeGreaterThan(0)
    }
  })

  it('프로젝트 장면과 목록에 GitHub, 데모, 노션에서 자세히 링크가 값이 있을 때만 보인다', () => {
    renderAt('/')
    const list = document.getElementById('projects')!
    for (const p of portfolio.projects) {
      for (const root of [document.getElementById(`project-${p.id}`)!, list.querySelector(`a[href="#project-${p.id}"]`)!.closest('li')!]) {
        const github = within(root as HTMLElement).queryByRole('link', { name: /^GitHub/ })
        const demo = within(root as HTMLElement).queryByRole('link', { name: /^데모/ })
        const notion = within(root as HTMLElement).queryByRole('link', { name: /^노션에서 자세히/ })
        expect(github === null, `${p.id} github`).toBe(p.githubUrl === undefined)
        expect(demo === null, `${p.id} demo`).toBe(p.demoUrl === undefined)
        expect(notion === null, `${p.id} notion`).toBe(p.notionUrl === undefined)
        if (github) expect(github).toHaveAttribute('href', p.githubUrl)
        if (demo) expect(demo).toHaveAttribute('href', p.demoUrl)
        if (notion) expect(notion).toHaveAttribute('href', p.notionUrl)
      }
    }
  })

  it('링크가 하나도 없는 프로젝트는 링크 타일을 그리지 않는다', async () => {
    const { ProjectDetailScenes } = await import('../features/detail/ProjectScenes')
    const bare = { ...portfolio.projects[0]!, githubUrl: undefined, demoUrl: undefined, notionUrl: undefined }
    render(<ProjectDetailScenes projects={[bare]} id="project-detail" title="프로젝트 상세" />)
    expect(screen.queryByRole('heading', { name: '링크' })).toBeNull()
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('프로젝트 목록 카드에 링크 안의 링크(중첩 a)가 없고, 이름 링크는 장면으로 이동한다', () => {
    renderAt('/')
    const list = document.getElementById('projects')!
    expect(list.querySelectorAll('a a')).toHaveLength(0)
    for (const p of portfolio.projects) {
      expect(within(list).getByRole('link', { name: p.name })).toHaveAttribute('href', `#project-${p.id}`)
    }
  })

  it('소개와 이력 장면에 경력, 학력, 교육 이력, 자격증이 있고 연락처 링크는 없다', () => {
    renderAt('/')
    const intro = document.getElementById('intro')!
    for (const label of ['경력', '학력과 교육 이력', '자격증']) {
      expect(within(intro).getByRole('heading', { name: label })).toBeInTheDocument()
    }
    expect(intro.querySelector('a')).toBeNull()
  })

  it('소개와 이력 장면에 교육 이력의 배운 기술, 한 줄 설명, 스터디와 자격증 진행 상태가 보인다', () => {
    renderAt('/')
    const intro = document.getElementById('intro')!
    for (const t of portfolio.background.trainings) {
      expect(intro.textContent).toContain(t.summary)
      expect(intro.textContent).toContain(t.stack.join(', '))
      if (t.study) expect(intro.textContent).toContain(t.study)
    }
    // 배운 기술 목록은 영문 기술 이름만 mono 글꼴이다.
    expect(within(intro).getAllByText('Django', { selector: '.font-mono' }).length).toBeGreaterThan(0)
    for (const c of portfolio.background.certificates) {
      if (c.status) expect(within(intro).getByText(c.status)).toBeInTheDocument()
    }
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
