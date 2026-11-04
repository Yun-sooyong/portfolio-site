import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface SceneProps {
  id: string
  title: string
  children: ReactNode
  /** 첫 장면처럼 로딩 직후 바로 보여야 하면 true. 나타나는 효과를 쓰지 않는다. */
  instant?: boolean
  /** true이면 h2를 그리지 않는다. 장면 안의 h1이 제목 역할을 한다. */
  hideTitle?: boolean
  /** 제목 오른쪽에 놓는 보조 문구 */
  aside?: ReactNode
}

/**
 * 장면 한 칸. 큰 화면에서는 높이가 정확히 100svh이고 한 칸씩 맞춰 넘어간다(CSS snap).
 * 처음 보일 때 투명도만 짧게 바뀐다. 움직임 줄이기를 켜면 전환 클래스를 붙이지 않는다.
 */
export function Scene({ id, title, children, instant = false, hideTitle = false, aside }: SceneProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  // IntersectionObserver가 없는 환경에서는 처음부터 보이는 것으로 본다.
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setSeen(true)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const classes = ['scene', reduced || instant ? '' : 'scene-motion'].filter(Boolean).join(' ')

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={hideTitle ? undefined : `${id}-title`}
      aria-label={hideTitle ? title : undefined}
      className={classes}
      data-seen={seen ? '' : undefined}
    >
      <div className="scene-inner reveal">
        {hideTitle ? null : (
          <div className="scene-head">
            <h2 id={`${id}-title`} className="scene-title">
              {title}
            </h2>
            {aside ? <p className="scene-aside">{aside}</p> : null}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
