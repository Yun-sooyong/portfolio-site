// 밝은 화면이 기본이다. 저장된 선택이 없으면 시스템 설정을 따른다.
// 저장소 접근은 막힐 수 있으므로 모든 읽기와 쓰기를 try/catch로 감싼다.

export type Theme = 'light' | 'dark'

const KEY = 'portfolio-theme'

export function readStoredTheme(): Theme | null {
  try {
    const v = window.localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

export function storeTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(KEY, theme)
  } catch {
    // 저장이 막혀 있어도 이번 방문에서는 선택이 적용된다.
  }
}

export function systemTheme(): Theme {
  try {
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? systemTheme()
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

/** 지금 <html> 에 적용된 테마. 아직 없으면 저장값과 시스템 설정으로 정한다. */
export function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme
  return t === 'dark' || t === 'light' ? t : resolveTheme()
}
