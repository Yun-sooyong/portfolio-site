export interface NavGroup {
  id: string
  title: string
  scenes: { id: string; label: string }[]
}

interface SceneNavProps {
  groups: readonly NavGroup[]
  activeId: string
  /** 점을 전부 따로 보이는 최대 개수. 넘으면 큰 장면 단위로 묶는다. */
  maxFlatDots: number
}

function go(id: string) {
  // 한 칸씩 탁탁 넘어가는 느낌을 위해 부드러운 이동을 쓰지 않는다.
  document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

/**
 * 오른쪽 장면 위치 표시.
 * 하위 장면 수가 maxFlatDots 이하면 모두 큰 점으로 보인다.
 * 넘으면 큰 장면마다 큰 점 하나를 보이고, 지금 장면이 속한 묶음의 하위 장면을 작은 점으로 펼친다.
 */
export function SceneNav({ groups, activeId, maxFlatDots }: SceneNavProps) {
  const total = groups.reduce((n, g) => n + g.scenes.length, 0)
  const flat = total <= maxFlatDots

  return (
    <nav aria-label="장면 위치" className="scene-nav">
      <ul>
        {flat
          ? groups.flatMap((g) =>
              g.scenes.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    aria-label={s.label}
                    aria-current={s.id === activeId ? 'true' : undefined}
                    className="scene-dot"
                  >
                    <span className="scene-dot-label">{s.label}</span>
                    <span className="scene-dot-mark" aria-hidden="true" />
                  </button>
                </li>
              )),
            )
          : groups.map((g) => {
              const first = g.scenes[0]
              if (!first) return null
              const open = g.scenes.some((s) => s.id === activeId)
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => go(first.id)}
                    aria-label={g.title}
                    aria-current={open ? 'true' : undefined}
                    className="scene-dot"
                  >
                    <span className="scene-dot-label">{g.title}</span>
                    <span className="scene-dot-mark" aria-hidden="true" />
                  </button>
                  {open && g.scenes.length > 1 ? (
                    <ul className="scene-subdots" aria-label={`${g.title} 하위 장면`}>
                      {g.scenes.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => go(s.id)}
                            aria-label={s.label}
                            aria-current={s.id === activeId ? 'true' : undefined}
                            className="scene-subdot"
                          >
                            <span className="scene-dot-label">{s.label}</span>
                            <span className="scene-subdot-mark" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
      </ul>
    </nav>
  )
}
