import { Route, Routes } from 'react-router-dom'
import { DetailPage, NotFoundPage, PrintPage } from './pages'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DetailPage />} />
      <Route path="/print" element={<PrintPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
