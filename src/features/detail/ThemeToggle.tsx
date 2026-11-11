import { useState } from 'react'
import { applyTheme, currentTheme, storeTheme, type Theme } from '../../ui/theme'

/** 테마 단추. 글자는 누르면 바뀔 테마를 보인다. 누르면 <html data-theme> 를 바꾸고 선택을 저장한다. */
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
    <button type="button" className="theme-toggle" onClick={toggle}>
      <span className="theme-icon" aria-hidden="true" />
      <span className="theme-label">{dark ? '밝은 모드' : '다크 모드'}</span>
    </button>
  )
}
