import type { ElementType, ReactNode } from 'react'
import { TechIcons } from './TechIcon'

/** 12열 격자에서 차지하는 열 수 */
export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
/** 차지하는 행 수 */
export type RowSpan = 1 | 2 | 3 | 4 | 5 | 6

interface BentoProps {
  /** 목록이면 'ul'. 기본은 'div' */
  as?: ElementType
  className?: string
  children: ReactNode
}

/**
 * 벤토 그리드. 1024px 이상 12열, 768~1023px 2열, 768px 미만 1열이다.
 * 열·행 차지 칸 수는 Tile의 class(tile-c*, tile-r*)가 정한다. style 속성은 쓰지 않는다.
 */
export function Bento({ as: Tag = 'div', className = '', children }: BentoProps) {
  return <Tag className={`bento ${className}`.trim()}>{children}</Tag>
}

interface TileProps {
  /** 목록 안이면 'li'. 기본은 'div' */
  as?: ElementType
  /** 1024px 이상에서 차지하는 열 수. 기본 12 */
  cols?: ColSpan
  /** 1024px 이상에서 차지하는 행 수. 기본 1 */
  rows?: RowSpan
  /** 장면에서 가장 중요한 타일이면 true. 장면마다 1개까지만 쓴다 */
  strong?: boolean
  /** 안쪽 여백 없이 안의 링크가 칸 전체를 채우면 true */
  link?: boolean
  className?: string
  children: ReactNode
}

/** 벤토 그리드의 칸 1개. 내용 덩어리 1개를 담는다. */
export function Tile({ as: Tag = 'div', cols = 12, rows = 1, strong = false, link = false, className = '', children }: TileProps) {
  const classes = ['tile', `tile-c${cols}`, `tile-r${rows}`, strong ? 'tile-strong' : '', link ? 'tile-link' : '', className]
    .filter(Boolean)
    .join(' ')
  return <Tag className={classes}>{children}</Tag>
}

/** 기술 이름 칩. 기술 글자(JetBrains Mono)로 쓴다. */
export function Chip({ children, icon }: { children: ReactNode; icon?: string | string[] }) {
  return (
    <span className="chip font-mono">
      <TechIcons icon={icon} />
      {children}
    </span>
  )
}
