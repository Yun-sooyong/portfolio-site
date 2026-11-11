import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { portfolio } from '../content'
import { projectLinkItems } from '../domain/links'
import { SECTIONS, SECTION_IDS } from '../domain/sections'
import { buildCareerPath } from '../domain/career'

const { profile, projects, contact, background } = portfolio

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

  it('소개는 3~5줄이고 강점은 2~3개이며 강점마다 근거가 있다', () => {
    expect(profile.intro.length).toBeGreaterThanOrEqual(3)
    expect(profile.intro.length).toBeLessThanOrEqual(5)
    expect(profile.strengths.length).toBeGreaterThanOrEqual(2)
    expect(profile.strengths.length).toBeLessThanOrEqual(3)
    for (const s of profile.strengths) expect(s.evidence.trim()).not.toBe('')
  })

  it('AI 프로젝트는 새 필드가 각각 1개 이상이고 단축본용 projects 에 섞이지 않는다', () => {
    expect(portfolio.aiProjects.length).toBeGreaterThan(0)
    for (const p of portfolio.aiProjects) {
      for (const key of ['aiAreas', 'tools', 'impact', 'design', 'cases', 'quality'] as const) {
        expect(p[key].length, `${p.id}.${key}`).toBeGreaterThanOrEqual(1)
      }
      expect(projects.map((x) => x.id)).not.toContain(p.id)
    }
  })

  it('AI 프로젝트의 workflowUrl 은 저장소의 작업 흐름 문서를 가리키고 문서와 다이어그램이 실제로 있다', () => {
    const base = 'https://github.com/Yun-sooyong/portfolio-site/blob/main/docs/ai-workflow/'
    for (const p of portfolio.aiProjects) {
      expect(p.workflowUrl.startsWith(base), p.id).toBe(true)
      expect(p.workflowUrl).toBe(`${base}${p.id}.md`)
      expect(existsSync(resolve(process.cwd(), `docs/ai-workflow/${p.id}.md`)), `${p.id}.md`).toBe(true)
      expect(existsSync(resolve(process.cwd(), `docs/ai-workflow/${p.id}.svg`)), `${p.id}.svg`).toBe(true)
    }
  })

  it('작업 흐름 SVG 는 스크립트가 없고 다크 모드와 움직임 줄이기를 따른다', () => {
    for (const p of portfolio.aiProjects) {
      const svg = readFileSync(resolve(process.cwd(), `docs/ai-workflow/${p.id}.svg`), 'utf8')
      expect(svg, p.id).not.toMatch(/<script/i)
      expect(svg, p.id).not.toMatch(/https?:\/\/(?!www\.w3\.org)/)
      expect(svg, p.id).toContain('prefers-color-scheme')
      expect(svg, p.id).toContain('prefers-reduced-motion')
      expect(svg, p.id).toMatch(/<title[^>]*>[^<]+<\/title>/)
    }
  })

  it('기술은 점수와 막대 대신 문장으로 쓴다', () => {
    for (const g of portfolio.skillGroups) {
      for (const s of g.skills) {
        expect(s.techs.length).toBeGreaterThan(0)
        for (const t of s.techs) {
          expect(t.name.trim()).not.toBe('')
          expect(typeof t.icon === 'string' || t.icon === undefined).toBe(true)
        }
        expect(s.can.trim()).not.toBe('')
        if (s.lacks !== undefined) expect(s.lacks.trim()).not.toBe('')
      }
    }
  })

  it('포트폴리오 사이트의 품질 관리 문구에 적은 CI 단계가 ci.yml 의 실제 run 명령과 같다', () => {
    const ci = readFileSync(resolve(process.cwd(), '.github/workflows/ci.yml'), 'utf8')
    const runs = [...ci.matchAll(/^\s*-\s*run:\s*(.+)$/gm)].map((m) => (m[1] ?? "").trim())
    expect(runs).toEqual(['npm ci', 'npm run lint', 'npm run typecheck', 'npm test', 'npm run build', 'npm audit --audit-level=high'])
    const site = portfolio.aiProjects.find((p) => p.id === 'portfolio-site')
    expect(site?.quality[0]).toContain('npm ci, lint, 타입 검사, 테스트, 빌드, npm audit(high 이상)')
  })

  it('전화번호와 상세 주소 형태가 없다', () => {
    const all = JSON.stringify(portfolio)
    expect(all).not.toMatch(/0\d{1,2}-\d{3,4}-\d{4}/)
    expect(all).not.toMatch(/(로|길)\s?\d+(-\d+)?\s?번?길?/)
  })

  it('내용에 생년월일, 나이, 지역, 사진 주소, 예시 표시가 없다', () => {
    // AI 프로젝트의 결과 문구에 "전화번호와 주소가 없는지 검사"라는 설명이 있어 따로 검사한다.
    const all = JSON.stringify({ ...portfolio, aiProjects: [] })
    expect(JSON.stringify(portfolio.aiProjects)).not.toMatch(/생년월일|만\s?\d+세|거주/)
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

  it('구역은 6개이고 id가 겹치지 않으며 연락처만 번호가 없다', () => {
    expect(SECTION_IDS).toEqual(['about', 'skills', 'projects', 'ai-projects', 'career', 'contact'])
    expect(SECTIONS.map((s) => s.no)).toEqual(['01', '02', '03', '04', '05', undefined])
    expect(SECTIONS.map((s) => s.label)).toEqual(['소개', '기술', '프로젝트', 'AI 프로젝트', '이력', '연락처'])
    expect(new Set(SECTION_IDS).size).toBe(SECTION_IDS.length)
  })

  it('성과 숫자는 6개이고 강조 칸과 최근 결과 칸이 1개씩이다', () => {
    const { highlights } = portfolio
    expect(highlights).toHaveLength(6)
    expect(new Set(highlights.map((h) => h.id)).size).toBe(6)
    expect(highlights.filter((h) => h.accent)).toHaveLength(1)
    expect(highlights.filter((h) => h.award)).toHaveLength(1)
  })

  it('성과 숫자의 출처가 있고, 프로젝트가 출처이면 그 숫자가 프로젝트 results 에도 있다', () => {
    for (const h of portfolio.highlights) {
      if (h.source === 'profile') {
        expect(profile.intro.join(' ')).toContain(h.value)
        continue
      }
      const p = projects.find((x) => x.id === h.source)
      expect(p, `${h.id} 의 출처 ${h.source}`).toBeDefined()
      const resultText = p!.results.map((r) => `${r.value} ${r.label}`).join(' ') + ' ' + p!.role
      for (const num of h.value.match(/\d[\d,.]*/g) ?? []) expect(resultText, `${h.id}: ${num}`).toContain(num)
    }
  })

  it('첫 화면 문구는 큰 제목 3줄이고 띠 3칸의 출처가 있다', () => {
    expect(portfolio.home.headline).toHaveLength(3)
    expect(portfolio.home.band).toHaveLength(3)
    for (const b of portfolio.home.band) expect(projects.some((p) => p.id === b.source)).toBe(true)
  })

  it('경력 경로는 시기 순서이고 마지막 단계만 current 이다', () => {
    const path = buildCareerPath(background)
    const starts = path.map((s) => s.start)
    expect(starts).toEqual([...starts].sort((a, b) => a - b))
    expect(path.filter((s) => s.current)).toHaveLength(1)
    expect(path.at(-1)?.current).toBe(true)
  })
})

describe('기술 아이콘', () => {
  it('내용의 모든 icon 키가 techIcons.ts 에 있다', async () => {
    const { techIcons } = await import('../ui/techIcons')
    const keys = [
      ...portfolio.skillGroups.flatMap((g) => g.skills.flatMap((s) => s.techs.flatMap((t) => (t.icon === undefined ? [] : [t.icon])))),
      ...[...projects, ...portfolio.aiProjects].flatMap((p) => Object.values(p.coreStackIcons ?? {})),
    ]
    expect(keys.length).toBeGreaterThan(0)
    for (const k of keys) expect(techIcons[k], k).toBeDefined()
  })

  it('coreStackIcons 의 이름이 coreStack 에 있다', () => {
    for (const p of [...projects, ...portfolio.aiProjects]) {
      for (const name of Object.keys(p.coreStackIcons ?? {})) expect(p.coreStack).toContain(name)
    }
  })
})
