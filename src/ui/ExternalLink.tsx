import type { ReactNode } from 'react'

/** 새 탭에서 열리는 바깥 링크. 보조 기술에는 새 탭에서 열린다고 알린다. */
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (새 탭에서 열림)</span>
    </a>
  )
}
