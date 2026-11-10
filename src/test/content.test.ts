import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { portfolio } from '../content'
import { projectLinkItems } from '../domain/links'
import { MAX_FLAT_DOTS, RECENT_JOURNAL_COUNT, buildScenePlan, flattenSceneIds, recentJournal } from '../domain/scenes'

const { profile, projects, contact, journal, howBuilt, background } = portfolio

describe('내용 형식', () => {
  it('프로젝트가 4개 이상이고 id가 서로 다르다', () => {
    expect(projects.length).toBeGreaterThanOrEqual(4)
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length)
  })

  it.each(projects.map((p) => [p.name, p] as const))('%s: 역할과 결과가 있다', (_name, p) => {
    expect(p.role.trim()).not.toBe('')
    expect(p.results.length).toBeGreaterThan(0)
    for (const r of p.results) {
      expect(r.label.trim()).not.toBe('')
      // 결과는 숫자를 포함한다.
      expect(r.value).toMatch(/\d/)
    }
  })

  it.each(projects.map((p) => [p.name, p] as const))('%s: 필수 항목이 비어 있지 않다', (_name, p) => {
    expect(['개인', '팀']).toContain(p.kind)
    expect(p.coreStack.length).toBeGreaterThanOrEqual(1)
    expect(p.coreStack.length).toBeLessThanOrEqual(2)
    expect(p.summary.trim()).not.toBe('')
    expect(p.overview.trim()).not.toBe('')
  })

  it('프로젝트 장면에 쓰지 않는 자세한 필드(구성도, 문제와 해결 등)를 내용에 두지 않는다', () => {
    for (const p of projects) {
      for (const key of ['features', 'architecture', 'problems', 'deploy', 'links']) expect(p, key).not.toHaveProperty(key)
    }
  })

  it('프로젝트의 githubUrl, demoUrl, notionUrl 은 선택이고, 있으면 https이다', () => {
    for (const p of projects) {
      for (const url of [p.githubUrl, p.demoUrl, p.notionUrl]) {
        if (url !== undefined) expect(url, p.name).toMatch(/^https:\/\/[^\s]+$/)
      }
    }
    // 노션은 아직 비공개라 notionUrl 이 없다. 모든 프로젝트에 GitHub 주소가 있다.
    expect(projects.every((p) => p.githubUrl !== undefined)).toBe(true)
  })

  it('프로젝트 링크 목록은 GitHub, 데모, 노션 순서이고 값이 없는 링크는 넣지 않는다', () => {
    expect(projectLinkItems({ githubUrl: 'https://g', demoUrl: 'https://d', notionUrl: 'https://n' }).map((l) => l.label)).toEqual([
      'GitHub',
      '데모',
      '노션에서 자세히',
    ])
    expect(projectLinkItems({ notionUrl: 'https://n' }).map((l) => l.kind)).toEqual(['notion'])
    expect(projectLinkItems({ githubUrl: 'https://g', demoUrl: undefined })).toHaveLength(1)
    expect(projectLinkItems({})).toEqual([])
  })

  it('모든 링크가 https이다', () => {
    const urls = [
      ...projects.flatMap((p) => [p.githubUrl, p.demoUrl, p.notionUrl]),
      contact.github,
      contact.blog,
      howBuilt.readmeUrl,
      howBuilt.notionUrl,
    ].filter((u): u is string => u !== undefined)
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) expect(url).toMatch(/^https:\/\//)
  })

  it('교육 이력마다 배운 기술 5~6개와 한 줄 설명이 있고 스터디는 선택이다', () => {
    expect(background.trainings.length).toBeGreaterThan(0)
    for (const t of background.trainings) {
      expect(t.stack.length, t.name).toBeGreaterThanOrEqual(5)
      expect(t.stack.length, t.name).toBeLessThanOrEqual(6)
      for (const item of t.stack) expect(item.trim()).not.toBe('')
      expect(t.summary.trim(), t.name).not.toBe('')
      if (t.study !== undefined) expect(t.study.trim()).not.toBe('')
    }
  })

  it('자격증 status 는 선택이고, 있으면 비어 있지 않다', () => {
    for (const c of background.certificates) {
      if (c.status !== undefined) expect(c.status.trim()).not.toBe('')
    }
    expect(background.certificates.map((c) => c.name)).toEqual(['정보처리기사', '유통관리사 2급'])
  })

  it('"이 사이트와 기록"의 구조·보안 요점은 3~4개이고 항목마다 제목과 본문이 있다', () => {
    expect(howBuilt.points.length).toBeGreaterThanOrEqual(3)
    expect(howBuilt.points.length).toBeLessThanOrEqual(4)
    for (const pt of howBuilt.points) {
      expect(pt.title.trim()).not.toBe('')
      expect(pt.body.trim()).not.toBe('')
    }
    expect(howBuilt.readmeUrl).toBe('https://github.com/Yun-sooyong/portfolio-site#readme')
  })

  it('소개는 3~5줄이고 강점은 2~3개이며 강점마다 근거가 있다', () => {
    expect(profile.intro.length).toBeGreaterThanOrEqual(3)
    expect(profile.intro.length).toBeLessThanOrEqual(5)
    expect(profile.strengths.length).toBeGreaterThanOrEqual(2)
    expect(profile.strengths.length).toBeLessThanOrEqual(3)
    for (const s of profile.strengths) expect(s.evidence.trim()).not.toBe('')
  })

  it('기술은 점수와 막대 대신 문장으로 쓴다', () => {
    for (const g of portfolio.skillGroups) {
      for (const s of g.skills) {
        expect(s.can.trim()).not.toBe('')
        if (s.lacks !== undefined) expect(s.lacks.trim()).not.toBe('')
      }
    }
  })

  it('전화번호와 상세 주소 형태가 없다', () => {
    const all = JSON.stringify(portfolio)
    expect(all).not.toMatch(/0\d{1,2}-\d{3,4}-\d{4}/)
    expect(all).not.toMatch(/(로|길)\s?\d+(-\d+)?\s?번?길?/)
  })

  it('내용에 생년월일, 나이, 지역, 사진 주소, 예시 표시가 없다', () => {
    const all = JSON.stringify({ ...portfolio, howBuilt: {}, journal: [] })
    expect(all).not.toMatch(/(19|20)\d{2}[.\-/]\d{1,2}[.\-/]\d{1,2}\s*생/)
    expect(all).not.toMatch(/생년월일|만\s?\d+세|\d+세\b|거주|주소/)
    expect(all).not.toMatch(/홍길동|예시|가상|example\.com/)
    expect(profile).not.toHaveProperty('region')
  })

  // 빌드 뒤에만 확인한다. dist가 없으면 건너뛴다.
  it.skipIf(!existsSync(resolve(process.cwd(), 'dist/index.html')))('빌드 산출물에 전화번호 형태와 이메일 전체 문자열이 없다', () => {
    const files = readdirSync(resolve(process.cwd(), 'dist'), { recursive: true, encoding: 'utf8' }).filter((f) => /\.(html|js|css)$/.test(f))
    expect(files.length).toBeGreaterThan(0)
    for (const f of files) {
      const text = readFileSync(resolve(process.cwd(), 'dist', f), 'utf8')
      expect(text, f).not.toMatch(/\b01[016789]-?\d{3,4}-?\d{4}\b/)
      expect(text, f).not.toContain('ysyg22@gmail.com')
    }
  })

  it('큰 장면 6개이고 하위 장면 id가 겹치지 않는다. 시행착오는 따로 장면을 만들지 않는다', () => {
    const plan = buildScenePlan(portfolio)
    expect(plan.map((g) => g.id)).toEqual(['intro', 'skills', 'projects', 'project-detail', 'site', 'contact'])
    expect(plan.find((g) => g.id === 'site')?.title).toBe('이 사이트와 기록')
    const ids = flattenSceneIds(plan)
    expect(ids).toHaveLength(5 + projects.length)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.some((id) => id.startsWith('journal'))).toBe(false)
    for (const g of plan) expect(g.scenes.length).toBeGreaterThan(0)
  })

  it('프로젝트마다 장면 1개이고, 장면 순서는 소개, 기술, 목록, 프로젝트들, 사이트와 기록, 연락처이다', () => {
    const plan = buildScenePlan(portfolio)
    const detail = plan.find((g) => g.id === 'project-detail')!
    expect(detail.scenes.map((s) => s.id)).toEqual(projects.map((p) => `project-${p.id}`))
    expect(flattenSceneIds(plan)).toEqual([
      'intro',
      'skills',
      'projects',
      ...projects.map((p) => `project-${p.id}`),
      'site',
      'contact',
    ])
    expect(MAX_FLAT_DOTS).toBe(12)
  })

  it('프로젝트 수만 장면 수를 바꾼다. 시행착오 수는 영향이 없다', () => {
    const p = projects[0]!
    const mk = (nProjects: number) =>
      flattenSceneIds(buildScenePlan({ projects: Array.from({ length: nProjects }, (_, i) => ({ ...p, id: `p${i}` })) })).length
    // 소개와 이력 + 기술 + 프로젝트 목록 + 프로젝트 N + 이 사이트와 기록 + 연락처
    expect(mk(3)).toBe(5 + 3)
    expect(mk(5)).toBe(5 + 5)
    // 프로젝트가 없으면 빈 상태 장면 1개가 남는다.
    expect(mk(0)).toBe(5 + 1)
  })
})

describe('최근 시행착오 고르기', () => {
  const e = (date: string, problem: string) => ({ date, problem })

  it(`날짜가 늦은 ${RECENT_JOURNAL_COUNT}개를 돌려준다`, () => {
    const list = [e('2026-11-01', 'a'), e('2026-11-09', 'b'), e('2026-11-03', 'c'), e('2026-11-07', 'd')]
    expect(recentJournal(list).map((x) => x.problem)).toEqual(['b', 'd', 'c'])
  })

  it('날짜가 같으면 배열에서 뒤에 있는 기록이 더 최근이다', () => {
    const list = [e('2026-11-05', 'a'), e('2026-11-05', 'b'), e('2026-11-05', 'c'), e('2026-11-05', 'd')]
    expect(recentJournal(list).map((x) => x.problem)).toEqual(['d', 'c', 'b'])
  })

  it('기록이 3개보다 적으면 있는 만큼, 없으면 빈 배열이다', () => {
    expect(recentJournal([e('2026-11-01', 'a')])).toHaveLength(1)
    expect(recentJournal([])).toEqual([])
    expect(RECENT_JOURNAL_COUNT).toBe(3)
  })

  it('원본 배열을 바꾸지 않는다', () => {
    const list = [e('2026-11-01', 'a'), e('2026-11-09', 'b')]
    recentJournal(list)
    expect(list.map((x) => x.problem)).toEqual(['a', 'b'])
  })
})

describe('시행착오 기록', () => {
  const md = readFileSync(resolve(process.cwd(), 'docs/journal.md'), 'utf8')

  it('내용 파일의 항목이 docs/journal.md 에 모두 있다', () => {
    for (const e of journal) {
      expect(md).toContain(e.date)
      expect(md).toContain(e.problem)
      expect(md).toContain(e.cause)
      expect(md).toContain(e.fix)
    }
  })

  it('날짜 형식이 YYYY-MM-DD 이다', () => {
    for (const e of journal) expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('기술 아이콘', () => {
  it('내용의 모든 icon 키가 techIcons.ts 에 있다', async () => {
    const { techIcons } = await import('../ui/techIcons')
    const keys = [
      ...portfolio.skillGroups.flatMap((g) => g.skills.flatMap((s) => (s.icon === undefined ? [] : [s.icon].flat()))),
      ...projects.flatMap((p) => Object.values(p.coreStackIcons ?? {})),
    ]
    expect(keys.length).toBeGreaterThan(0)
    for (const k of keys) expect(techIcons[k], k).toBeDefined()
  })

  it('coreStackIcons 의 이름이 coreStack 에 있다', () => {
    for (const p of projects) {
      for (const name of Object.keys(p.coreStackIcons ?? {})) expect(p.coreStack).toContain(name)
    }
  })
})
