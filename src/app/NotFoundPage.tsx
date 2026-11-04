import { NotFound } from '../features/notfound/NotFound'
import { useDocumentTitle, useNoindex } from './pageHooks'

export function NotFoundPage() {
  useDocumentTitle('페이지가 없습니다')
  useNoindex()
  return <NotFound />
}
