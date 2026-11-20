import { portfolio } from '../content'
import { DocSheet } from '../features/doc/DocSheet'
import { useDocumentTitle, useNoindex } from './pageHooks'

export function DocPage() {
  useDocumentTitle(`${portfolio.profile.name} 포트폴리오`)
  useNoindex()
  return <DocSheet data={portfolio} />
}
