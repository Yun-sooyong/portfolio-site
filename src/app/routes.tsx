import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { DetailPage } from './pages'
import { ErrorBoundary } from './ErrorBoundary'
import { RouteEffects } from './RouteEffects'

// 상세본이 첫 화면이므로 바로 불러온다. 단축본과 없는 주소 화면은 쪽을 열 때 불러온다.
const PrintPage = lazy(() => import('./PrintPage').then((m) => ({ default: m.PrintPage })))
const NotFoundPage = lazy(() => import('./NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

export function AppRoutes() {
  return (
    <ErrorBoundary>
      <RouteEffects />
      <Suspense fallback={<p className="route-loading" role="status">불러오는 중…</p>}>
        <Routes>
          <Route path="/" element={<DetailPage />} />
          <Route path="/print" element={<PrintPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
