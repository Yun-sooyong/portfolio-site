import type { Project } from './portfolio'

/** 프로젝트 링크 1개. 화면과 단축본이 같은 이름표와 순서를 쓴다. */
export interface ProjectLinkItem {
  kind: 'github' | 'demo' | 'notion'
  label: string
  url: string
}

/** 프로젝트에 값이 있는 링크만 GitHub, 노션, 데모 순서로 돌려준다. 값이 없는 링크는 넣지 않는다. */
export function projectLinkItems(p: Pick<Project, 'githubUrl' | 'demoUrl' | 'notionUrl'>): ProjectLinkItem[] {
  const items: ProjectLinkItem[] = []
  if (p.githubUrl) items.push({ kind: 'github', label: 'GitHub', url: p.githubUrl })
  if (p.notionUrl) items.push({ kind: 'notion', label: '프로젝트 자세히 보기', url: p.notionUrl })
  if (p.demoUrl) items.push({ kind: 'demo', label: '데모', url: p.demoUrl })
  return items
}
