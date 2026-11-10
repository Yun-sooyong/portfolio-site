import type { Portfolio } from './portfolio'

// 상세본 장면 계획. 큰 장면(그룹) 6개가 있고, 프로젝트가 늘면 하위 장면이 늘어난다.
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

/** "이 사이트와 기록" 장면에 보이는 최근 시행착오 개수 */
export const RECENT_JOURNAL_COUNT = 3

/** 장면 위치 점을 전부 따로 보이는 최대 개수. 넘으면 큰 장면 단위로 묶는다. */
export const MAX_FLAT_DOTS = 12

/** "이 사이트와 기록" 장면 id */
export const SITE_SCENE_ID = 'site'

/** 날짜가 늦은 순서로 최근 기록 count개를 돌려준다. 날짜가 같으면 배열에서 뒤에 있는 것이 더 최근이다. */
export function recentJournal<T extends { date: string }>(entries: readonly T[], count: number = RECENT_JOURNAL_COUNT): T[] {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => (a.entry.date === b.entry.date ? b.index - a.index : a.entry.date < b.entry.date ? 1 : -1))
    .slice(0, count)
    .map((x) => x.entry)
}

/** 프로젝트 1개는 장면 1개다. */
export function projectSceneId(projectId: string): string {
  return `project-${projectId}`
}

/**
 * 내용에서 장면 계획을 만든다. 큰 장면 6개, 프로젝트가 4개이면 장면 9개다.
 * 소개와 이력 / 기술 / 프로젝트 목록 / 프로젝트마다 1개 / 이 사이트와 기록 / 연락처.
 */
export function buildScenePlan(data: Pick<Portfolio, 'projects'>): SceneGroup[] {
  const projectScenes: SceneUnit[] =
    data.projects.length === 0
      ? [{ id: 'project-detail', label: '프로젝트 상세' }]
      : data.projects.map((p) => ({ id: projectSceneId(p.id), label: p.name }))

  return [
    { id: 'intro', title: '소개와 이력', scenes: [{ id: 'intro', label: '소개와 이력' }] },
    { id: 'skills', title: '기술', scenes: [{ id: 'skills', label: '기술' }] },
    { id: 'projects', title: '프로젝트 목록', scenes: [{ id: 'projects', label: '프로젝트 목록' }] },
    { id: 'project-detail', title: '프로젝트 상세', scenes: projectScenes },
    { id: SITE_SCENE_ID, title: '이 사이트와 기록', scenes: [{ id: SITE_SCENE_ID, label: '이 사이트와 기록' }] },
    { id: 'contact', title: '연락처', scenes: [{ id: 'contact', label: '연락처' }] },
  ]
}

/** 계획의 모든 하위 장면 id를 위에서 아래 순서로 돌려준다. */
export function flattenSceneIds(plan: SceneGroup[]): string[] {
  return plan.flatMap((g) => g.scenes.map((s) => s.id))
}
