import type { ProjectShot as Shot } from '../../domain/portfolio'

/** 프로젝트 화면 이미지 1장과 설명. 이미지는 public/shots/ 경로로만 참조한다. shot 이 없으면 아무것도 그리지 않는다. */
export function ProjectShot({ shot }: { shot?: Shot }) {
  if (!shot) return null
  return (
    <figure className="project-shot">
      <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading="lazy" decoding="async" />
      <figcaption>{shot.caption}</figcaption>
    </figure>
  )
}
