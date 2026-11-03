import { useReducedMotion } from './useReducedMotion'

interface SceneNavProps {
  scenes: readonly { id: string; title: string }[]
  activeId: string
}

/** 오른쪽 장면 위치 표시. 점을 누르면 해당 장면으로 간다. */
export function SceneNav({ scenes, activeId }: SceneNavProps) {
  const reduced = useReducedMotion()

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <nav aria-label="장면 위치" className="scene-nav">
      <ul>
        {scenes.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => go(s.id)}
              aria-label={s.title}
              aria-current={s.id === activeId ? 'true' : undefined}
              className="scene-dot"
            >
              <span className="scene-dot-label">{s.title}</span>
              <span className="scene-dot-mark" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
