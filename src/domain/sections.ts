// 한 페이지의 구역 계획. 헤더 링크, 구역 번호, 구역 id가 같은 표를 읽는다.

export interface SectionInfo {
  id: string
  /** 큰 번호. 두 자리 글자 */
  no: string
  /** 헤더 링크와 구역 라벨에 쓰는 이름 */
  label: string
}

export const SECTIONS: readonly SectionInfo[] = [
  { id: 'about', no: '01', label: '소개' },
  { id: 'skills', no: '02', label: '기술' },
  { id: 'projects', no: '03', label: '프로젝트' },
  { id: 'career', no: '04', label: '이력' },
  { id: 'record', no: '05', label: '기록' },
  { id: 'contact', no: '06', label: '연락처' },
]

export const SECTION_IDS: readonly string[] = SECTIONS.map((s) => s.id)

export function sectionInfo(id: string): SectionInfo {
  const found = SECTIONS.find((s) => s.id === id)
  if (!found) throw new Error(`알 수 없는 구역: ${id}`)
  return found
}
