import { techIcons } from './techIcons'

/** 기술 아이콘. 장식이므로 보조 기술에서 숨기고, 색은 둘러싼 글자 색을 따른다. 키가 없으면 아무것도 그리지 않는다. */
export function TechIcon({ name }: { name: string }) {
  const icon = techIcons[name]
  if (!icon) return null
  return (
    <svg className="tech-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  )
}

/** 아이콘 키 1개 또는 여러 개를 한 줄로 그린다. */
export function TechIcons({ icon }: { icon?: string | string[] }) {
  if (!icon) return null
  const keys = Array.isArray(icon) ? icon : [icon]
  return (
    <span className="tech-icons" aria-hidden="true">
      {keys.map((k) => (
        <TechIcon key={k} name={k} />
      ))}
    </span>
  )
}
