import type { ReactNode } from 'react'
import { TechIcons } from './TechIcon'

/** 기술 이름 칩. 기술 글자(JetBrains Mono)로 쓴다. */
export function Chip({ children, icon }: { children: ReactNode; icon?: string | string[] }) {
  return (
    <span className="chip font-mono">
      <TechIcons icon={icon} />
      {children}
    </span>
  )
}
