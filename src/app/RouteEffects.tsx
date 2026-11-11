import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 쪽을 옮기면 맨 위로 가고 본문(main)에 초점을 둔다. 첫 로딩에는 초점을 옮기지 않는다.
 * 주소에 #구역id 가 있으면 그 구역으로 간다.
 */
export function RouteEffects() {
  const { pathname, hash } = useLocation()
  const first = useRef(true)

  useEffect(() => {
    const isFirst = first.current
    first.current = false
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) {
      target.scrollIntoView({ block: 'start' })
      return
    }
    if (isFirst) return
    window.scrollTo(0, 0)
    document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}
