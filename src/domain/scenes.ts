import type { Portfolio } from './portfolio'

// 상세본 장면 계획. 큰 장면(그룹) 8개가 있고, 화면 높이를 넘을 장면은 하위 장면으로 나눈다.
// 한 하위 장면이 화면 한 칸(100svh)이다.

/** 한 칸짜리 장면 */
export interface SceneUnit {
  id: string
  /** 위치 표시와 접근성 이름에 쓰는 이름 */
  label: string
}

/** 큰 장면 단위 */
export interface SceneGroup {
  id: string
  title: string
  scenes: SceneUnit[]
}

/** 시행착오 장면 하나에 보이는 최대 항목 수 */
export const JOURNAL_PAGE_SIZE = 4

/** 장면 위치 점을 전부 따로 보이는 최대 개수. 넘으면 큰 장면 단위로 묶는다. */
export const MAX_FLAT_DOTS = 12

export function journalPageCount(entryCount: number): number {
  return Math.max(1, Math.ceil(entryCount / JOURNAL_PAGE_SIZE))
}

export function journalSceneId(page: number): string {
  return page === 0 ? 'journal' : `journal-${page + 1}`
}

export function projectSceneIds(projectId: string): [string, string] {
  return [`project-${projectId}`, `project-${projectId}-2`]
}

/** 내용에서 장면 계획을 만든다. 프로젝트와 시행착오 개수에 따라 장면 수가 달라진다. */
export function buildScenePlan(data: Pick<Portfolio, 'projects' | 'journal'>): SceneGroup[] {
  const projectScenes: SceneUnit[] =
    data.projects.length === 0
      ? [{ id: 'project-detail', label: '프로젝트 상세' }]
      : data.projects.flatMap((p) => {
          const [a, b] = projectSceneIds(p.id)
          return [
            { id: a, label: `${p.name}: 개요와 구성` },
            { id: b, label: `${p.name}: 문제와 해결` },
          ]
        })

  const pages = journalPageCount(data.journal.length)
  const journalScenes: SceneUnit[] = Array.from({ length: pages }, (_, i) => ({
    id: journalSceneId(i),
    label: pages === 1 ? '시행착오' : `시행착오 ${i + 1}/${pages}`,
  }))

  return [
    { id: 'intro', title: '소개', scenes: [{ id: 'intro', label: '소개' }] },
    { id: 'background', title: '경력과 학력', scenes: [{ id: 'background', label: '경력과 학력' }] },
    { id: 'skills', title: '기술', scenes: [{ id: 'skills', label: '기술' }] },
    { id: 'projects', title: '프로젝트 목록', scenes: [{ id: 'projects', label: '프로젝트 목록' }] },
    { id: 'project-detail', title: '프로젝트 상세', scenes: projectScenes },
    {
      id: 'how-built',
      title: '이 사이트를 만든 방식',
      scenes: [
        { id: 'how-built', label: '폴더와 의존 방향' },
        { id: 'how-built-2', label: '구조, 확장성, 보안' },
      ],
    },
    { id: 'journal', title: '시행착오', scenes: journalScenes },
    { id: 'contact', title: '연락처', scenes: [{ id: 'contact', label: '연락처' }] },
  ]
}

/** 계획의 모든 하위 장면 id를 위에서 아래 순서로 돌려준다. */
export function flattenSceneIds(plan: SceneGroup[]): string[] {
  return plan.flatMap((g) => g.scenes.map((s) => s.id))
}
