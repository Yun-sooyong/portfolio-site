import { useEffect, useState } from 'react'

/**
 * 화면 가운데 선을 지나는 장면을 지금 장면으로 정한다.
 * 지금 장면 id를 <html data-scene> 에 쓴다. 배경 색조는 CSS가 바꾼다.
 */
export function useActiveScene(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const root = document.documentElement
    root.dataset.scene = ids[0] ?? ''
    if (typeof IntersectionObserver === 'undefined') {
      return () => {
        delete root.dataset.scene
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id)
            root.dataset.scene = e.target.id
          }
        }
      },
      { rootMargin: '-50% 0px -49% 0px' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => {
      io.disconnect()
      delete root.dataset.scene
    }
  }, [ids])

  return active
}
