// 상세본 장면 8개의 순서와 이름. 화면 부품과 위치 표시가 함께 쓴다.

export const SCENES = [
  { id: 'intro', title: '소개' },
  { id: 'background', title: '경력과 학력' },
  { id: 'skills', title: '기술' },
  { id: 'projects', title: '프로젝트 목록' },
  { id: 'project-detail', title: '프로젝트 상세' },
  { id: 'how-built', title: '이 사이트를 만든 방식' },
  { id: 'journal', title: '시행착오' },
  { id: 'contact', title: '연락처' },
] as const

export type SceneId = (typeof SCENES)[number]['id']
