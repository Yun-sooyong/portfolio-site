import { useState } from 'react'
import { SECTIONS } from '../../domain/sections'
import { ThemeToggle } from './ThemeToggle'

/** 고정 헤더. 왼쪽 이름, 오른쪽 구역 링크와 다크 모드 단추. 768px 미만에서는 메뉴 단추로 접는다. */
export function Header({ name, activeId }: { name: string; activeId: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a className="brand" href="#top" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true" />
          {name}
        </a>
        <nav className={`site-nav${open ? ' is-open' : ''}`} aria-label="구역 이동">
          <ul id="site-nav-list" className="nav-list">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={activeId === s.id ? 'location' : undefined} onClick={() => setOpen(false)}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
        <button type="button" className="menu-button" aria-expanded={open} aria-controls="site-nav-list" onClick={() => setOpen((v) => !v)}>
          메뉴
        </button>
      </div>
    </header>
  )
}
