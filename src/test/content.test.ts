import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { portfolio } from '../content'
import { JOURNAL_PAGE_SIZE, MAX_FLAT_DOTS, buildScenePlan, flattenSceneIds, journalPageCount } from '../domain/scenes'

const { profile, projects, contact, journal } = portfolio

describe('내용 형식', () => {
  it('프로젝트가 3개 이상이고 id가 서로 다르다', () => {
    expect(projects.length).toBeGreaterThanOrEqual(3)
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
    expect(p.features.length).toBeGreaterThan(0)
    expect(p.architecture.length).toBeGreaterThan(0)
    expect(p.problems.length).toBeGreaterThan(0)
    expect(p.deploy.trim()).not.toBe('')
  })

  it('모든 링크가 https이다', () => {
    const urls = [...projects.flatMap((p) => p.links.map((l) => l.url)), contact.github, contact.blog]
    expect(urls.length).toBeGreaterThan(0)
    for (const url of urls) expect(url).toMatch(/^https:\/\//)
  })

  it('소개는 4~5줄이고 강점은 2~3개이며 강점마다 근거가 있다', () => {
    expect(profile.intro.length).toBeGreaterThanOrEqual(4)
    expect(profile.intro.length).toBeLessThanOrEqual(5)
    expect(profile.strengths.length).toBeGreaterThanOrEqual(2)
    expect(profile.strengths.length).toBeLessThanOrEqual(3)
    for (const s of profile.strengths) expect(s.evidence.trim()).not.toBe('')
  })

  it('기술은 점수와 막대 대신 문장으로 쓴다', () => {
    for (const g of portfolio.skillGroups) {
      for (const s of g.skills) {
        expect(s.can.trim()).not.toBe('')
        expect(s.lacks.trim()).not.toBe('')
      }
    }
  })

  it('전화번호와 상세 주소 형태가 없다', () => {
    const all = JSON.stringify(portfolio)
    expect(all).not.toMatch(/0\d{1,2}-\d{3,4}-\d{4}/)
    expect(all).not.toMatch(/(로|길)\s?\d+(-\d+)?\s?번?길?/)
  })

  it('큰 장면 7개, 장면 10개이고 하위 장면 id가 겹치지 않는다', () => {
    const plan = buildScenePlan(portfolio)
    expect(plan.map((g) => g.id)).toEqual(['intro', 'skills', 'projects', 'project-detail', 'how-built', 'journal', 'contact'])
    const ids = flattenSceneIds(plan)
    expect(ids).toHaveLength(6 + projects.length + journalPageCount(journal.length) - 1 + 0)
    expect(new Set(ids).size).toBe(ids.length)
    for (const g of plan) expect(g.scenes.length).toBeGreaterThan(0)
  })

  it('프로젝트마다 장면 1개, 시행착오는 6개씩 한 장면이다', () => {
    const plan = buildScenePlan(portfolio)
    const detail = plan.find((g) => g.id === 'project-detail')!
    expect(detail.scenes).toHaveLength(projects.length)
    const j = plan.find((g) => g.id === 'journal')!
    expect(j.scenes).toHaveLength(Math.max(1, Math.ceil(journal.length / 6)))
    expect(JOURNAL_PAGE_SIZE).toBe(6)
    expect(MAX_FLAT_DOTS).toBe(12)
  })

  it('프로젝트 수와 기록 수가 달라지면 장면 수가 규칙대로 바뀐다', () => {
    const p = projects[0]!
    const mk = (nProjects: number, nJournal: number) =>
      flattenSceneIds(
        buildScenePlan({
          projects: Array.from({ length: nProjects }, (_, i) => ({ ...p, id: `p${i}` })),
          journal: Array.from({ length: nJournal }, () => journal[0]!),
        }),
      ).length
    // 소개와 이력 + 기술 + 프로젝트 목록 + 프로젝트 N + 만든 방식 + 시행착오 쪽 수 + 연락처
    expect(mk(3, 0)).toBe(3 + 3 + 1 + 1 + 1)
    expect(mk(3, 6)).toBe(3 + 3 + 1 + 1 + 1)
    expect(mk(3, 7)).toBe(3 + 3 + 1 + 2 + 1)
    expect(mk(5, 12)).toBe(3 + 5 + 1 + 2 + 1)
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
