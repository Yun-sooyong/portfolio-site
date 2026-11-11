import { portfolio } from '../content'
import { DetailView } from '../features/detail/DetailView'
import { useDocumentTitle } from './pageHooks'

export function DetailPage() {
  useDocumentTitle(`${portfolio.profile.name} 포트폴리오`)
  return <DetailView data={portfolio} />
}
