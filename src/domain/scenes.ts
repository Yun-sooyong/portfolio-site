import type { Portfolio } from './portfolio'

// 상세본 장면 계획. 큰 장면(그룹) 5개가 있고, 프로젝트와 시행착오가 늘면 하위 장면이 늘어난다.
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
export const JOURNAL_PAGE_SIZE = 6

/** 장면 위치 점을 전부 따로 보이는 최대 개수. 넘으면 큰 장면 단위로 묶는다. */
export const MAX_FLAT_DOTS = 12

export function journalPageCount(entryCount: number): number {
  return Math.max(1, Math.ceil(entryCount / JOURNAL_PAGE_SIZE))
}

export function journalSceneId(page: number): string {
  return page === 0 ? 'journal' : `journal-${page + 1}`
}

/** 프로젝트 1개는 장면 1개다. */
export function projectSceneId(projectId: string): string {
  return `project-${projectId}`
}

/**
 * 내용에서 장면 계획을 만든다. 예시 내용 기준 장면 10개다.
 * 소개와 이력 / 기술 / 프로젝트 목록 / 프로젝트마다 1개 / 만든 방식 / 시행착오(6개씩) / 연락처.
 */
export function buildScenePlan(data: Pick<Portfolio, 'projects' | 'journal'>): SceneGroup[] {
  const projectScenes: SceneUnit[] =
    data.projects.length === 0
      ? [{ id: 'project-detail', label: '프로젝트 상세' }]
      : data.projects.map((p) => ({ id: projectSceneId(p.id), label: p.name }))

  const pages = journalPageCount(data.journal.length)
  const journalScenes: SceneUnit[] = Array.from({ length: pages }, (_, i) => ({
    id: journalSceneId(i),
    label: pages === 1 ? '시행착오' : `시행착오 ${i + 1}/${pages}`,
  }))

  return [
    { id: 'intro', title: '소개와 이력', scenes: [{ id: 'intro', label: '소개와 이력' }] },
    { id: 'skills', title: '기술', scenes: [{ id: 'skills', label: '기술' }] },
    { id: 'projects', title: '프로젝트 목록', scenes: [{ id: 'projects', label: '프로젝트 목록' }] },
    { id: 'project-detail', title: '프로젝트 상세', scenes: projectScenes },
    { id: 'how-built', title: '이 사이트를 만든 방식', scenes: [{ id: 'how-built', label: '이 사이트를 만든 방식' }] },
    { id: 'journal', title: '시행착오', scenes: journalScenes },
    { id: 'contact', title: '연락처', scenes: [{ id: 'contact', label: '연락처' }] },
  ]
}

/** 계획의 모든 하위 장면 id를 위에서 아래 순서로 돌려준다. */
export function flattenSceneIds(plan: SceneGroup[]): string[] {
  return plan.flatMap((g) => g.scenes.map((s) => s.id))
}
