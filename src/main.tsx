import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app/App'
import { applyTheme, resolveTheme } from './ui/theme'

// 첫 그림 전에 테마를 정한다. 인라인 script를 쓰지 않으므로 번들 안에서 처리한다.
applyTheme(resolveTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
