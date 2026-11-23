import { sectionInfo } from '../../domain/sections'

/**
 * 구역 머리. 큰 번호, 작은 라벨, 구역 제목(h2). 번호는 장식이므로 보조 기술에서 숨긴다.
 * 번호가 있는 구역은 구역 이름(소개, 기술 등)을 h2 로 크게 쓰고, title 을 작은 라벨로 쓴다.
 * 번호가 없는 구역(연락처)은 번호와 작은 라벨을 그리지 않고 title 만 h2 로 쓴다.
 */
export function SectionHead({ id, title, large = false }: { id: string; title: string; large?: boolean }) {
  const info = sectionInfo(id)
  return (
    <div className={`section-head${info.no ? '' : ' section-head-plain'}`}>
      {info.no ? (
        <span className="section-num" aria-hidden="true">
          {info.no}
        </span>
      ) : null}
      <div className="section-head-text">
        {info.no ? <p className="section-label label-mono">{title}</p> : null}
        <h2 id={`${id}-title`} className={`section-title${large ? ' section-title-lg' : ''}`}>
          {info.no ? info.label : title}
        </h2>
      </div>
    </div>
  )
}
