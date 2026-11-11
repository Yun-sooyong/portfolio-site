import { sectionInfo } from '../../domain/sections'

/** 구역 머리. 아주 큰 번호, 작은 라벨, 구역 제목(h2). 번호는 장식이므로 보조 기술에서 숨긴다. */
export function SectionHead({ id, title, large = false }: { id: string; title: string; large?: boolean }) {
  const info = sectionInfo(id)
  return (
    <div className="section-head">
      <span className="section-num" aria-hidden="true">
        {info.no}
      </span>
      <div className="section-head-text">
        <p className="section-label label-mono">{info.label}</p>
        <h2 id={`${id}-title`} className={`section-title${large ? ' section-title-lg' : ''}`}>{title}</h2>
      </div>
    </div>
  )
}
