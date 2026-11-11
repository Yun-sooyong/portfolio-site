import { useState } from 'react'
import { applyTheme, currentTheme, storeTheme, type Theme } from '../../ui/theme'

/** 다크 모드 단추. 누르면 <html data-theme> 를 바꾸고 선택을 저장한다. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)
  const dark = theme === 'dark'

  const toggle = () => {
    const next: Theme = dark ? 'light' : 'dark'
    applyTheme(next)
    storeTheme(next)
    setTheme(next)
  }

  return (
    <button type="button" className="theme-toggle" aria-pressed={dark} onClick={toggle}>
      <span className="theme-icon" aria-hidden="true" />
      <span className="theme-label">다크 모드</span>
    </button>
  )
}
